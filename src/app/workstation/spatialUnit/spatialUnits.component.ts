import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '@app/core/layout/alert/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { UtilService } from '@app/core/utils/util.service';
import { ProcessTypes } from '@app/core/models/process.model';
import { RowSizes } from '@app/core/models/rowSize.model';
import { Variables } from '@app/core/models/variables.model';
import { FormTemplateBaseComponent } from '@app/workstation/baseForm/form-template-base.component';
import { BAUnit } from '@app/workstation/baUnit/baUnit.model';
import { of } from 'rxjs';
import { FormVariables } from '@app/workstation/baseForm/formVariables.model';
import { SpatialUnitTypes } from '@app/workstation/spatialUnit/spatialUnitType.model';
import { SpatialUnit } from './spatialUnit.model';
import { Building } from './building/building.model';
import { SpatialUnitService } from './spatialUnit.service';
import { assign, cloneDeep, findIndex, isEmpty, orderBy } from 'lodash';

@Component({
  templateUrl: 'spatialUnits.component.html',
  selector: 'app-spatial-units'
})

export class SpatialUnitsComponent extends FormTemplateBaseComponent implements OnInit, OnChanges {

  @Input() formVariables: FormVariables = new FormVariables({});
  @Output() add = new EventEmitter<SpatialUnit>();
  @Output() saved = new EventEmitter<{ val: BAUnit, variable: Variables }>();
  @Output() spatialUnitPickerSave = new EventEmitter<any>();
  @Output() spatialUnitPickerDelete = new EventEmitter<any>();
  @Input() picker = false;
  @Input() showBuildingPicker = false;
  @Input() spatialUnitCopy: SpatialUnit;
  @Input() rrrSpatialUnit: SpatialUnit;
  @Input() rrrSpatialUnitsArray: SpatialUnit[];
  @Input() parcelBuildings: SpatialUnit[];
  @Input() listTitle = 'SPATIAL_UNIT.TITLE_LIST';
  @Input() isAdmin = false;

  spatialUnitUrl: boolean;
  sameEndPointRoute: boolean;
  rowSizes: any = RowSizes;
  cols: any[];
  spatialUnits: SpatialUnit[];
  spatialUnit: SpatialUnit;
  baUnit: BAUnit = null;
  persistToDb: boolean;
  hasMainParcel: boolean;
  showSpatialUnitPicker: boolean;

  parentSelectionPickerHeader: String = 'SPATIAL_UNIT.TITLE_PARENT_SELECTION';
  buildingSelectionPickerHeader: String = 'SPATIAL_UNIT.TITLE_BUILDING_SELECTION';
  isNewRegister: Boolean;
  totalRecords: number;
  displayDeleteButton = false;
  displayDeleteButtonCombo = false;
  deleteButtonHidden = true;
  displayViewEditButton = false;
  displayActionHeader = false;

  constructor(
    private spatialUnitservice: SpatialUnitService,
    public translateService: TranslateService,
    protected router: Router,
    private alertService: AlertService,
    private utilService: UtilService
  ) { super(); }

  ngOnInit(): void {
    this.spatialUnitUrl = ((this.router.url === '/spatial-units') || this.router.url.includes('ba-unit')
      || this.router.url === '/rrrs');
    this.sameEndPointRoute = this.router.url.includes('/spatial-units');
    if (this.formVariables.baUnit) {
      this.baUnit = new BAUnit(this.formVariables.baUnit);
    } else {
      this.persistToDb = true;
    }

    this.getSpatialUnits();
    this.hasMainParcel = this.checkhasMainParcel();
    this.displayDeleteButtonCombo = this.baUnit &&
      !this.picker && !this.showBuildingPicker;

    this.displayDeleteButton = this.isAdmin || this.displayDeleteButtonCombo;
    this.deleteButtonHidden = (this.formVariables.isReadOnly || this.spatialUnitUrl);
    this.displayViewEditButton = ((this.baUnit && !this.picker && !this.showBuildingPicker) ||
      ((this.picker || this.showBuildingPicker) && !this.formVariables.isReadOnly));
    this.displayActionHeader = (this.baUnit && !this.picker && !this.showBuildingPicker) ||
      ((this.picker || this.showBuildingPicker) && !this.formVariables.isReadOnly);

  }

  ngOnChanges(): void {
    this.displayDeleteButton = this.baUnit &&
      !this.picker && !this.showBuildingPicker &&
      this.mainParcelCanEdit(this.spatialUnit) && this.parentParcelCanEdit(this.spatialUnit, this.spatialUnits);
  }

  getSpatialUnits(search: string = ''): void {
    const args = {
      search: search
    };

    const spatialUnitsObs = this.sameEndPointRoute ? this.spatialUnitservice.getSpatialUnits(args) : of(this.baUnit.spatialUnits);

    spatialUnitsObs.subscribe(result => {
      this.spatialUnits = result;

      // gis integration split parcel
      if (this.formVariables.arcGIS !== undefined && this.formVariables.arcGIS.NICAD !== undefined) {

        if (this.formVariables.arcGIS.processType === ProcessTypes.registration) {
          if (this.spatialUnits.length === 0) {
            const nicadParcel = new SpatialUnit();
            nicadParcel.mainParcel = true;
            nicadParcel.spatialUnitType = SpatialUnitTypes.PARCEL;
            nicadParcel.parcelNumber = this.formVariables.arcGIS.NICAD;
            nicadParcel.spatialUnitNumber = this.formVariables.arcGIS.NICAD;
            this.spatialUnits.push(nicadParcel);
          }
        }
      }
      // gis integration split parcel



      if (this.picker) {
        this.spatialUnits.length = 0;
        this.spatialUnits = this.rrrSpatialUnitsArray;
      }

      if (this.showBuildingPicker) {
        this.spatialUnits = this.parcelBuildings;
      }

      this.spatialUnits.forEach(su => {
        su['type'] = this.translateService.instant('SPATIAL_UNIT.TYPES.' + su['spatialUnitType']);

        su['parcelType'] = su['spatialUnitType'] === SpatialUnitTypes.BUILDING
          ? this.translateService.instant('SPATIAL_UNIT.PARCEL.SUB_PARCEL.UNDEFINED')
          : this.translateService.instant('SPATIAL_UNIT.PARCEL.SUB_PARCEL.' + String(su['mainParcel']).toUpperCase());
        su['id'] = su['spatialUnitType'] === SpatialUnitTypes.BUILDING ? su['buildingNumber'] : su['parcelNumber'];
        su['parentParcel'] = su['spatialUnitType'] === SpatialUnitTypes.PARCEL ?
          (su.parent ? su.parent.parcelNumber : '') : su.buildingParcelNumbers;
      });

      this.spatialUnits = orderBy(this.spatialUnits, ['inscriptionDate', 'id'], ['asc', 'asc']);

      if (!this.showBuildingPicker) {
        this.cols = [
          { field: 'id', header: this.translateService.instant('SPATIAL_UNIT.ID'), width: '6%' },
          { field: 'type', header: this.translateService.instant('SPATIAL_UNIT.UNIT_TYPE'), width: '12%' },
          { field: 'parcelType', header: this.translateService.instant('SPATIAL_UNIT.REGISTERED'), width: '14%' },
          { field: 'parentParcel', header: this.translateService.instant('SPATIAL_UNIT.PARENT'), width: '11%' },
          { field: 'radiationDate', header: this.translateService.instant('SPATIAL_UNIT.RADIATION_DATE'), width: '11%' },
          { field: 'destinationTitle', header: this.translateService.instant('SPATIAL_UNIT.DESTINATION_TITLE'), width: '10%' },
          { field: 'inscriptionDate', header: this.translateService.instant('SPATIAL_UNIT.INSCRIPTION_DATE'), width: '11%' },
          { field: 'sourceTitle', header: this.translateService.instant('SPATIAL_UNIT.SOURCE_TITLE'), width: '10%' },
          { field: 'modDate', header: this.translateService.instant('SPATIAL_UNIT.MODIFICATION_DATE'), width: '11%' }
        ];
      } else {
        this.cols = [
          { field: 'id', header: this.translateService.instant('SPATIAL_UNIT.ID') },
          { field: 'type', header: this.translateService.instant('SPATIAL_UNIT.UNIT_TYPE') },
          { field: 'modDate', header: this.translateService.instant('SPATIAL_UNIT.MODIFICATION_DATE') }
        ];
      }
    }, err => this.alertService.apiError(err));
  }

  checkhasMainParcel(): boolean {
    if (!this.spatialUnits) {
      return false;
    }
    return (this.spatialUnits.find(item => item.mainParcel === true)) ? true : false;
  }

  showSpatialUnitPickerDialog(): void {
    this.showSpatialUnitPicker = true;
    this.spatialUnit = new SpatialUnit();
  }

  showSpatialUnitDialog(spatialUnit: SpatialUnit = null, isNewRegister: Boolean = true): void {
    this.showSpatialUnitPicker = false;
    this.spatialUnit = spatialUnit ? spatialUnit : new SpatialUnit();
    this.isNewRegister = isNewRegister;
  }

  saveSpatialUnit(spatialUnit): void {
    if (this.baUnit) {
      if (!spatialUnit.parcelIsRegistered) {
        spatialUnit.parcelIsRegistered = false;
      }

      const index = findIndex(this.baUnit.spatialUnits, this.spatialUnit);
      if (index > -1) {
        this.baUnit.spatialUnits[index] = spatialUnit;
      } else {
        this.baUnit.spatialUnits.push(spatialUnit);
      }
      this.saveToContext();
    }
    this.cancelSpatialUnit();
    this.getSpatialUnits();
    this.hasMainParcel = this.checkhasMainParcel();
  }

  deleteSpatialUnit(spatialUnit: SpatialUnit): void {
    this.utilService.displayConfirmationDialog('MESSAGES.CONFIRM_DELETE', () => {
      this.removeSpatialUnit(spatialUnit);
      this.hasMainParcel = this.checkhasMainParcel();
    });
  }

  removeSpatialUnit(spatialUnit: SpatialUnit): void {
    const index = findIndex(this.baUnit.spatialUnits, spatialUnit);

    if (index > -1) {
      this.baUnit.spatialUnits.splice(index, 1);
      this.saveToContext();
    }
  }

  saveToContext(): void {
    if (this.formVariables.baUnit) {
      this.saved.emit({
        val: this.baUnit,
        variable: {
          baUnit:
          {
            value: JSON.stringify(this.baUnit).replace('"/g', '\\"'),
            type: 'Json'
          }
        }
      });
    }
  }

  cancelSpatialUnit(): void {
    this.spatialUnit = null;
  }

  spatialUnitPickerUpdateSpatialUnit() {
    if (this.picker) {
      this.spatialUnits = this.rrrSpatialUnitsArray;
    }

    if (this.showBuildingPicker) {
      this.spatialUnits = this.parcelBuildings;
    }

  }

  spatialUnitPickerAddSpatialUnit($event): void {
    this.spatialUnitPickerUpdateSpatialUnit();
    this.spatialUnitPickerSave.emit($event);
    // To close spatialUnit picker
    this.spatialUnit = null;
  }

  spatialUnitPickerDeleteSpatialUnit($event): void {
    this.spatialUnitPickerUpdateSpatialUnit();
    this.utilService.displayConfirmationDialog('MESSAGES.CONFIRM_DELETE_SAVE_REQUIRED', () => {
      this.spatialUnitPickerDelete.emit($event);
    });
  }

  handleParentSelection(spatialUnit: SpatialUnit): void {
    this.spatialUnit = null;
    const deepClonedSpatialUnit = cloneDeep(spatialUnit);
    this.spatialUnitCopy = assign(deepClonedSpatialUnit,
      {
        suid: null, parcelIsRegistered: false, cardinalPoints: [],
        buildingOnParcel: false, buildingAsPartOfParcel: false, buildings: []
      });

    this.spatialUnitCopy.parent = spatialUnit;
    this.spatialUnitCopy.parent_parcelNumber = this.spatialUnitCopy.parent.parcelNumber;
    this.spatialUnitCopy.area.id = null;

    const cardinalPoints: String[] = [];
    spatialUnit.cardinalPoints.forEach(point => {
      cardinalPoints.push(point.point);
    });
    this.spatialUnitCopy.setCardinalPoints(cardinalPoints);

    this.spatialUnit = this.spatialUnitCopy;
    this.showSpatialUnitPicker = false;
    this.showSpatialUnitDialog(this.spatialUnit);
  }

  mainParcelCanEdit(spatialUnit: SpatialUnit): boolean {
    if (spatialUnit) {
      return (this.baUnit.version === 0) || ((this.baUnit.version !== 0) && !spatialUnit.parcelIsRegistered);
    } else {
      return false;
    }
  }

  parentParcelCanEdit(spatialUnit: SpatialUnit, spatialUnits: SpatialUnit[]): boolean {
    if (spatialUnit && spatialUnits.length) {
      return isEmpty(spatialUnits.find(su => su.parent && su.parent.suid === spatialUnit.suid));
    } else {
      return false;
    }
  }

}
