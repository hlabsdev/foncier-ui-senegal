import { AlertService } from '@app/core/layout/alert/alert.service';
import { ValidationService } from '@app/core/utils/validation.service';
import { UtilService } from '@app/core/utils/util.service';
import { SourceService } from '@app/core/services/source.service';
import { WarningResult } from '@app/core/utils/models/warningResult.model';
import { CodeListService } from '@app/core/services/codeList.service';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '@app/core/services/user.service';
import { Party } from '@app/core/models/party.model';
import { UploadSource } from '@app/core/models/uploadSource.model';
import { CodeListTypes } from '@app/core/models/codeListType.model';
import { ExtArchive } from '@app/core/models/extArchive.model';
import { RoleChange } from '@app/core/models/roleChange.model';
import { User } from '@app/core/models/user.model';
import { CodeList } from '@app/core/models/codeList.model';
import {
  Component, OnInit, Input, Output, EventEmitter, ViewChildren, QueryList, ViewChild, OnDestroy, OnChanges
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { SelectItem } from 'primeng';
import * as _ from 'lodash';
import { BAUnit } from './baUnit.model';
import { BAUnitService } from './baUnit.service';
import Utils from '@app/core/utils/utils';
import { NgForm } from '@angular/forms';
import { FormVariables } from '@app/workstation/baseForm/formVariables.model';
import { TaskStateManagerService } from '@app/registration/task/taskManager.service';
import { forkJoin, Observable, of, Subscription } from 'rxjs';
import { SpatialUnit } from '@app/workstation/spatialUnit/spatialUnit.model';
import { SpatialUnitService } from '@app/workstation/spatialUnit/spatialUnit.service';
import { FoncierApiHttpErrorResponse } from '@app/core/models/foncierApiHttpErrorResponse.model';
import { getlocaleConstants } from '@app/core/utils/locale.constants';
import { ParametersService } from '@app/admin/parameters/parameters.service';
import { RegistryService } from '@app/core/services/registry.service';
import { Registry } from '@app/core/models/registry.model';
import { ResponsibleOffice } from '@app/core/models/responsibleOffice.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-ba-unit-form',
  templateUrl: 'baUnit.form.component.html'
})
export class BAUnitFormComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('form', { read: NgForm }) form: any;
  @Input() baUnit: BAUnit = new BAUnit();
  @Input() formVariables: FormVariables;
  @Input() displayingHistory: boolean;
  @Input() nextSlipNumber: number;
  @Input() currentSurface: string;

  @Output() saveButtonClicked = new EventEmitter<BAUnit>();
  @Output() cancelButtonClicked = new EventEmitter<boolean>();
  @Output() suggestedTitleIdButtonClicked = new EventEmitter<BAUnit>();
  @ViewChildren('childComponent') childComponents: QueryList<any>;
  titleRegExp: RegExp = /^\d+$/;
  responsibleOfficesForCurrentUser: SelectItem[];
  responsibleOffices: SelectItem[];
  spatialUnitBackup: SpatialUnit;
  baUnitTypes: SelectItem[];
  allBaUnitTypes: {};
  displayDialog: boolean;
  spatialUnit: SpatialUnit = new SpatialUnit();
  spatialUnitType: string;
  registries: Registry[];
  registriesItems: SelectItem[];
  baUnitRegistries: SelectItem[];
  allBaUnitRegistries: {};
  hasRoleChangeErrors: boolean;
  displayRoleChangesDialog = false;

  partyBackup: Party;
  partyDialog: boolean;
  party: Party = new Party();
  partyId: string;
  displayObj: any = null;
  baUnitUrl = false;
  caveatWarningMessage: string;
  activeIndex: number;
  taskManagerSubscription: Subscription;
  roleChanges: RoleChange[];

  creationModes: SelectItem[];
  disableFutureDates: Date;
  disableFutureYears: String;
  locale: any;
  isReferenceTitle: boolean;
  isAdministrator = false;

  // local data loaded
  dResponsibleOfficesCurrentUser: ResponsibleOffice[];
  dBaUnitTypes: any[];
  dBaUnitCreationModes: any[];
  dRegistries: any[];
  user: User;
  onChangeStatusRequiredChanging = false;
  onResponsibleOfficeChangeChanging = false;

  REGISTRY_RECORD_TITLEID_MAXLENGTH = 6;

  constructor(
    protected router: Router,
    protected location: Location,
    protected baUnitService: BAUnitService,
    protected codeListService: CodeListService,
    protected spatialUnitService: SpatialUnitService,
    private utilService: UtilService,
    protected route: ActivatedRoute,
    protected alertService: AlertService,
    protected validationService: ValidationService,
    protected registryService: RegistryService,
    protected sourceService: SourceService,
    private taskManagerService: TaskStateManagerService,
    private translateService: TranslateService,
    private parametersService: ParametersService,
    private userService: UserService
  ) {
    this.user = this.userService.getCurrentUser();
  }
  disabledSelect: SelectItem = {
    label: this.translateService.instant('COMMON.ACTIONS.SELECT'),
    value: undefined
  };

  ngOnChanges(): void {
    this.setupData();
  }


  ngOnInit(): void {
    this.isReferenceTitle = false;
    this.setupData();

    const { localeSettings } = getlocaleConstants(this.translateService.currentLang);
    this.locale = localeSettings;
    this.disableFutureYears = `1900:2999`;

    if (this.baUnit && this.baUnit.registryRecord) {
      this.validateTitleNumber();
    }

    this.baUnitUrl = this.router.url.includes('ba-unit');
    this.caveatWarningMessage = new WarningResult('MESSAGES.BA_UNIT_HAS_CAVEATS_WARNING').toMessage();

    if (!this.baUnitUrl) {
      this.taskManagerSubscription = this.taskManagerService.baUnitSelectedTabIndexChange$
        .subscribe(i => this.activeIndex = i);
    }
    this.isAdministrator = this.user.hasPermission('SYSTEM_ADMINISTRATOR');
    this.disableFutureDates = new Date();

  }



  loadData(): Observable<any> {
    return forkJoin([
      this.dResponsibleOfficesCurrentUser && this.dResponsibleOfficesCurrentUser.length > 0 ?
        of(this.dResponsibleOfficesCurrentUser) :
        this.parametersService.getAllResponsibleOffices(true),
      this.dBaUnitCreationModes && this.dBaUnitCreationModes.length > 0 ?
        of(this.dBaUnitCreationModes) :
        this.codeListService.getCodeLists({ type: CodeListTypes.BA_UNIT_CREATION_MODE })
          .pipe(map(creationModes => this.dBaUnitCreationModes = creationModes)),
      this.dBaUnitTypes && this.dBaUnitTypes.length > 0 ?
        of(this.dBaUnitTypes) :
        this.codeListService.getCodeLists({ type: CodeListTypes.BA_UNIT_TYPE })
          .pipe(map(baUnitTypes => this.dBaUnitTypes = baUnitTypes)),
      this.dRegistries && this.dRegistries.length > 0 ?
        of(this.dRegistries) :
        this.registryService.getRegistries().pipe(map(registries => this.dRegistries = registries))]);
  }

  setupData(): void {
    this.loadData()
      .subscribe(([responsibleOffices, creationModes, baUnitTypes, registries]) => {
        const options: {
          responsibleOffices: ResponsibleOffice[], creationModes: CodeList[],
          baUnitTypes: CodeList[], registries: Registry[]
        } = { responsibleOffices, creationModes, baUnitTypes, registries };

        const setuptTitleTypes = (filter?: { id?: string, ids?: string[] }) => {
          options.baUnitTypes = filter ? _.filter(baUnitTypes, baUnitType => filter.id ?
            baUnitType.codeListID === filter.id : filter.ids ?
              filter.ids.includes(baUnitType.codeListID) : true) :
            baUnitTypes;
        };
        const setupRegistries = (filter?: { ids?: string[], titleTypesIds?: string[] }) => {
          options.registries = filter && (filter.ids || filter.titleTypesIds) ?
            _.uniq(_.filter(registries, (registry: Registry) =>
              (!filter.ids || filter.ids && filter.ids.includes(registry.id)) &&
              (!filter.titleTypesIds || filter.titleTypesIds && filter.titleTypesIds.includes(registry.titleType.codeListID)))) :
            registries;
        };
        const getCurrentRegistriesIds = (): string[] => {
          return this.baUnit.responsibleOffice.registries.map(registry => registry.id);
        };
        const getTitleTypeIds = (): string[] => {
          return _.uniq(this.baUnit.responsibleOffice.registries.map(registry => registry.titleType.codeListID));
        };
        const getMapToSelectItems = (items: any[], autoSet?: string, translate?: { prefix: string, valuePath: string }): any[] => {
          const tmp = items ?
            (translate ? this.utilService.getTranslatedToSelectItem(items, translate.valuePath, translate.prefix) :
              items.map(item => item.toSelectItem())) : [];
          if (!translate) {
            tmp.unshift(this.disabledSelect);
          } else if (autoSet && tmp.length > 0 && (this.baUnit && !this.baUnit[autoSet])) {
            this.baUnit[autoSet] = tmp[0].value;
          }
          return tmp;
        };

        if (this.baUnit && this.baUnit.responsibleOffice && this.baUnit.responsibleOffice.id) {
          setuptTitleTypes({ ids: getTitleTypeIds() });
          if (this.baUnit.type) {
            this.isReferenceTitle = this.baUnit.type.value === 'BA_UNIT_RESIDENTIAL_CONCESSION' ||
              this.baUnit.type.value === 'BA_UNIT_RURAL_CONCESSION';
            setupRegistries({
              ids: getCurrentRegistriesIds(),
              titleTypesIds: options.baUnitTypes.map(baUnitType => baUnitType.codeListID)
            });
          }
        }
        const translateCodeList = { prefix: 'CODELIST.VALUES', valuePath: 'value.value' };
        this.responsibleOfficesForCurrentUser = getMapToSelectItems(options.responsibleOffices, 'responsibleOffice');
        this.baUnitTypes = getMapToSelectItems(options.baUnitTypes, 'type', translateCodeList);
        this.registriesItems = getMapToSelectItems(options.registries);
        this.creationModes = getMapToSelectItems(options.creationModes, null, translateCodeList);
      });
  }

  ngOnDestroy(): void {
    if (this.taskManagerSubscription) {
      this.taskManagerSubscription.unsubscribe();
    }
  }

  isIssueDateValid(issueDate: Date): boolean {
    const issuedDateTime = issueDate.getTime();
    const creationDate = _.get(this.baUnit, 'creationDate', null);
    if (!_.isNull(creationDate)) {
      const creationDateTime = creationDate.getTime();
      if (issuedDateTime < creationDateTime) {
        this.alertService.error('MESSAGES.CREATED_ISSUED_DATES_ERROR');
        return false;
      }
    } else {
      this.alertService.error('MESSAGES.CREATED_ISSUED_DATES_ERROR');
      return false;
    }
    return true;
  }

  save(baUnit: BAUnit, form: NgForm | any = {}): void {
    // if not saving to ladm no need to validate
    if (this.formVariables.saveToLadm && form.invalid) {
      const errorResult = this.validationService.validateForm(form);
      return this.alertService.error(errorResult.message);
    }
    if (baUnit.issueDate) {
      if (this.isIssueDateValid(baUnit.issueDate)) {
        this.saveButtonClicked.emit(baUnit);
        return;
      } else {
        return this.alertService.error('MESSAGES.CREATED_ISSUED_DATES_ERROR');
      }
    }

    this.saveButtonClicked.emit(baUnit);
  }

  updateRRRs(context: any): void {
    this.baUnit.rrrs = new BAUnit(context.val).rrrs;
    this.baUnit.isAdministrator = this.isAdministrator;
    this.save(this.baUnit, this.form);
  }

  updateParties(context: any): void {
    this.baUnit.parties = new BAUnit(context.val).parties;
    this.baUnit.isAdministrator = this.isAdministrator;
    this.save(this.baUnit, this.form);
  }

  updateSpatialUnits(context: any): void {
    this.baUnit.spatialUnits = new BAUnit(context.val).spatialUnits;
    this.baUnit.isAdministrator = this.isAdministrator;
    this.save(this.baUnit, this.form);
  }

  cancel(): void {
    this.cancelButtonClicked.emit(true);
  }

  getSuggestedRegistryNumber(): void {
    if (this.formVariables.baUnitFormFieldsRequired) {
      this.suggestedTitleIdButtonClicked.emit(this.baUnit);
    }
  }

  getTitle(): void {
    this.sourceService.getTitleSource(this.baUnit.uid).subscribe(val => {
      if (val) {
        const document = new UploadSource();
        document.source = val;
        this.sourceService.getDocumentById(document.source).subscribe(doc => {
          const extArchive = new ExtArchive(document.source.extArchive);
          this.displayObj = {};
          this.displayObj.file = URL.createObjectURL(doc);
          this.displayObj.rawContent = doc;
          this.displayObj.fileName = extArchive.fileName;
          this.displayObj.sourceId = document.source.id;
          this.displayObj.viewerProp = Utils.getFileMimeType(extArchive.fileName);

          if (!this.displayObj.viewerProp.type) {
            this.cancel();
            this.alertService.warning('MESSAGES.FILE_VIEWER_ERROR');
          }
        }, err => {
          this.alertService.apiError(err);
          this.cancel();
        });
      } else {
        this.alertService.warning('MESSAGES.FILE_NOT_FOUND');
      }
    }, err => {
      this.alertService.apiError(err);
      this.cancel();
    });
  }

  validateTitleNumber(): void {
    if (this.baUnit.registryRecord.titleId) {
      _.delay(() => {
        if (this.baUnit.registryRecord.titleId.length < this.REGISTRY_RECORD_TITLEID_MAXLENGTH) {
          this.baUnit.registryRecord.titleId = this.baUnit.registryRecord.titleId.padStart(this.REGISTRY_RECORD_TITLEID_MAXLENGTH, '0');
        }
      }, 200);
    }
    if (this.baUnit.registryRecord.oldTitleId) {
      _.delay(() => {
        if (this.baUnit.registryRecord.oldTitleId.length < this.REGISTRY_RECORD_TITLEID_MAXLENGTH) {
          this.baUnit.registryRecord.oldTitleId =
            this.baUnit.registryRecord.oldTitleId.padStart(this.REGISTRY_RECORD_TITLEID_MAXLENGTH, '0');
        }
      }, 200);
    }
  }

  handleChange(event): void {
    if (!this.baUnitUrl) {
      this.taskManagerService.changeBaUnitSelectedTabIndex(event.index);
    }
  }


  getRoleChanges() {
    this.baUnitService.getRoleChanges(this.baUnit).subscribe(changes => {
      this.roleChanges = changes;
      this.displayRoleChangesDialog = true;
      const err = _.flatten(this.roleChanges.map(change => change.validationResults.filter(vr => vr.result === 'ERROR')));
      this.hasRoleChangeErrors = !_.isEmpty(err);
    });
  }

  updateRoleChanges() {
    this.baUnitService.updateRoleChanges(this.baUnit).subscribe((baUnit) => {
      this.saveButtonClicked.emit(baUnit);
    },
      (err: FoncierApiHttpErrorResponse) => {
        this.alertService.apiError(err);
      });
  }

}
