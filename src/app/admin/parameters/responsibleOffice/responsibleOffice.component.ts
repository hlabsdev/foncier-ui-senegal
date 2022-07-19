import { Component, OnInit } from '@angular/core';
import { Registry } from '@app/core/models/registry.model';
import { ResponsibleOffice } from '@app/core/models/responsibleOffice.model';
import { PreloaderService } from '@app/core/services/preloader.service';
import { CodeListService } from '@app/core/services/codeList.service';
import { UtilService } from '@app/core/utils/util.service';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { SelectItem } from 'primeng';
import { forkJoin } from 'rxjs';
import { AlertService } from '@app/core/layout/alert/alert.service';
import { RowSizes } from '@app/core/models/rowSize.model';
import { DataService } from '@app/data/data.service';
import { ParametersService } from '@app/admin/parameters/parameters.service';

@Component({
  selector: 'app-params-responsible-office',
  templateUrl: './responsibleOffice.component.html'
})
export class ResponsibleOfficeComponent implements OnInit {
  rowSizes: any = RowSizes;
  cols: any[];
  currentResponsibleOffice: ResponsibleOffice;
  currentResponsibleOfficeSelected: ResponsibleOffice;
  responsibleOffices: ResponsibleOffice[];
  registries: Registry[];
  roles: SelectItem[];
  taxCenters: SelectItem[];
  modalTitle: string;
  modalErrors: any;
  titleTypes: SelectItem[];

  constructor(
    private translateService: TranslateService,
    private alertService: AlertService,
    private parametersService: ParametersService,
    private dataService: DataService,
    private codeListService: CodeListService,
    private utilService: UtilService,
    private preloaderService: PreloaderService
  ) { }

  ngOnInit() {
    this.loadData();
    this.translateService.get([
      'PARAMETERS.TERRITORY.COMMON.CODE', 'PARAMETERS.TERRITORY.COMMON.NAME',
      'PARAMETERS.RESPONSIBLE_OFFICE.TAX_CENTER_ID', 'PARAMETERS.RESPONSIBLE_OFFICE.REGISTRY_CODES'])
      .subscribe(translate => {
        this.cols = [
          { field: 'code', header: translate['PARAMETERS.TERRITORY.COMMON.CODE'], width: '10%' },
          { field: 'code', header: translate['PARAMETERS.TERRITORY.COMMON.NAME'], width: '10%' },
          // {
          //   field: 'correspondingRole', header: this.translateService.instant['PARAMETERS.RESPONSIBLE_OFFICE.CORRESPONDING_ROLE'),
          //   width: '20%'
          // },
          { field: 'taxCenterId', header: translate['PARAMETERS.RESPONSIBLE_OFFICE.TAX_CENTER_ID'], width: '20%' },
          { field: 'registryCodes', header: translate['PARAMETERS.RESPONSIBLE_OFFICE.REGISTRY_CODES'], width: '50%' },
        ];
      });
  }

  showElementDialogue(responsibleOffice?: ResponsibleOffice) {
    this.currentResponsibleOfficeSelected = responsibleOffice;
    if (responsibleOffice) {
      this.modalTitle = this.translateService.instant('PARAMETERS.RESPONSIBLE_OFFICE.EDIT');
      this.currentResponsibleOffice = _.clone(responsibleOffice);
    } else {
      this.modalTitle = this.translateService.instant('PARAMETERS.RESPONSIBLE_OFFICE.ADD');
      this.currentResponsibleOffice = new ResponsibleOffice({});
    }
  }

  saved(responsibleOffice: ResponsibleOffice) {
    responsibleOffice.correspondingRole = responsibleOffice.code;
    if (!responsibleOffice.taxCenterId) {
      this.modalErrors = { type: 'error', text: 'MESSAGES.TERRITORY.ERRORS.MISSING_CODE' };
    } else if (!responsibleOffice.correspondingRole) {
      this.modalErrors = { type: 'error', text: 'MESSAGES.TERRITORY.ERRORS.MISSING_NAME' };
    } else {
      this.parametersService.saveResponsibleOffice(responsibleOffice).subscribe(nResponsibleOffice => {
        if (responsibleOffice.id) {
          this.responsibleOffices.splice(this.responsibleOffices.indexOf(this.currentResponsibleOfficeSelected), 1, nResponsibleOffice);
          this.currentResponsibleOfficeSelected = null;
        } else {
          this.responsibleOffices.push(nResponsibleOffice);
        }
        this.currentResponsibleOffice = null;
        this.alertService.success('MESSAGES.FORMS.SAVE_FORM_SUCCESS');
      });
    }
  }

  canceled() {
    this.currentResponsibleOffice = null;
  }

  loadData() {
    forkJoin([
      this.parametersService.getAllResponsibleOffices(),
      this.parametersService.getAllRegistries(false),
      // this.parametersService.getAllKeycloakRoles(),
      this.parametersService.getAllTaxCentersFromSigtas()])
      .subscribe(([responsibleOffices, registries/*, roles*/, taxCenters]) => {
        this.registries = registries;
        this.taxCenters = taxCenters.map(taxCenter => taxCenter.toSelectItem());
        this.taxCenters.unshift({ label: this.translateService.instant('COMMON.ACTION.SELECT'), value: null });
        // this.roles = roles.map(role => role.toSelectItem());
        // this.roles.unshift({ label: this.translateService.instant('PARAMETERS.RESPONSIBLE_OFFICE.SELECT_ROLE'), value: null});
        this.responsibleOffices = responsibleOffices;
        this.responsibleOffices.forEach(responsibleOffice => {
          responsibleOffice.registryNames = responsibleOffice.registries.map(registry => registry.code).join(', ');
        });

        // data to preload
        this.preloaderService.setResponsibleOfficesToPreload(this.responsibleOffices);
      });
  }
}
