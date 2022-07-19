import { Component, OnInit } from '@angular/core';
import { AlertService } from '@app/core/layout/alert/alert.service';
import { RowSizes } from '@app/core/models/rowSize.model';
import { Registry } from '@app/core/models/registry.model';
import { Circle } from '@app/core/models/territory/circle.model';
import { Division } from '@app/core/models/territory/division.model';
import { PreloaderService } from '@app/core/services/preloader.service';
import { DataService } from '@app/data/data.service';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { forkJoin } from 'rxjs';
import { ParametersService } from '@app/admin/parameters/parameters.service';

@Component({
  selector: 'app-params-territory-division',
  templateUrl: './division.component.html'
})
export class DivisionComponent implements OnInit {
  rowSizes: any = RowSizes;
  cols: any[];
  currentDivision: Division;
  currentDivisionSelected: Division;
  divisions: Division[];
  circles: Circle[];
  registries: Registry[];
  modalTitle: string;
  modalErrors: any;
  constructor(
    private translateService: TranslateService,
    private alertService: AlertService,
    private parametersService: ParametersService,
    private dataService: DataService,
    private preloaderService: PreloaderService
  ) { }

  ngOnInit() {
    this.loadDivision();
    this.translateService.get([
      'PARAMETERS.TERRITORY.COMMON.CODE', 'PARAMETERS.TERRITORY.COMMON.NAME',
      'PARAMETERS.TERRITORY.DIVISION.REGISTRY_CODE_NAME', 'PARAMETERS.TERRITORY.DIVISION.CIRCLE_NAME',
      'PARAMETERS.TERRITORY.COMMON.DESCRIPTION'])
      .subscribe(translate => {
        this.cols = [
          { field: 'code', header: translate['PARAMETERS.TERRITORY.COMMON.CODE'], width: '15%' },
          { field: 'name', header: translate['PARAMETERS.TERRITORY.COMMON.NAME'], width: '20%' },
          {
            field: 'registryCodes',
            header: translate['PARAMETERS.TERRITORY.DIVISION.REGISTRY_CODE_NAME'],
            width: '20%'
          },
          { field: 'circle.name', header: translate['PARAMETERS.TERRITORY.DIVISION.CIRCLE_NAME'], width: '15%' },
          { field: 'description', header: translate['PARAMETERS.TERRITORY.COMMON.DESCRIPTION'], width: '30%' },
        ];
      });
  }

  showDivisionElementDialogue(division?: Division) {
    this.currentDivisionSelected = division;
    if (division) {
      this.modalTitle = this.translateService.instant('PARAMETERS.TERRITORY.DIVISION.EDIT');
      this.currentDivision = _.clone(division);
    } else {
      this.modalTitle = this.translateService.instant('PARAMETERS.TERRITORY.DIVISION.ADD');
      this.currentDivision = new Division({});
    }
  }

  removeRegion(division: Division) {
    // put an endDate on the region
  }

  saved(division: Division) {
    if (!division.code) {
      this.modalErrors = { type: 'error', text: 'MESSAGES.TERRITORY.ERRORS.MISSING_CODE' };
    } else if (!division.name) {
      this.modalErrors = { type: 'error', text: 'MESSAGES.TERRITORY.ERRORS.MISSING_NAME' };
    } else if (!division.circle) {
      this.modalErrors = { type: 'error', text: 'MESSAGES.TERRITORY.ERRORS.MISSING_CIRCLE' };
    } else if (!division.sigtasId) {
      this.modalErrors = { type: 'error', text: 'MESSAGES.TERRITORY.ERRORS.MISSING_SIGTAS_ID' };
    } else {
      this.parametersService.saveDivision(division).subscribe(nDivision => {
        if (division.id) {
          this.divisions.splice(this.divisions.indexOf(this.currentDivisionSelected), 1, nDivision);
          this.currentDivisionSelected = null;
        } else {
          this.divisions.push(nDivision);
        }

        this.currentDivision = null;
        this.alertService.success('MESSAGES.FORMS.SAVE_FORM_SUCCESS');
      });
    }
  }

  canceled() {
    this.currentDivision = null;
  }

  loadDivision() {
    forkJoin([this.parametersService.getAllDivision(),
    this.parametersService.getAllCircle(),
    this.parametersService.getAllRegistries(false)])
      .subscribe(([divisions, circles, registries]) => {
        this.registries = registries;
        this.circles = <Circle[]>circles;
        this.divisions = <Division[]>divisions.map(division => {
          division.registryNames = division.registries.map(registry => registry.code).join(', ');
          return division;
        });
        // data to preload
        this.preloaderService.setCommunesToPreload(this.divisions);
      });
  }
}
