import { Component, OnInit } from '@angular/core';
import { Registry } from '@app/core/models/registry.model';
import { PreloaderService } from '@app/core/services/preloader.service';
import { CodeListService } from '@app/core/services/codeList.service';
import { UtilService } from '@app/core/utils/util.service';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { SelectItem } from 'primeng';
import { forkJoin } from 'rxjs';
import { AlertService } from '@app/core/layout/alert/alert.service';
import { CodeListTypes } from '@app/core/models/codeListType.model';
import { RowSizes } from '@app/core/models/rowSize.model';
import { DataService } from '@app/data/data.service';
import { ParametersService } from '@app/admin/parameters/parameters.service';

@Component({
  selector: 'app-params-registry',
  templateUrl: './registry.component.html'
})
export class RegistryComponent implements OnInit {
  rowSizes: any = RowSizes;
  cols: any[];
  currentRegistry: Registry;
  currentRegistrySelected: Registry;
  registries: Registry[];
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
    this.loadRegistries();
    this.translateService.get([
      'PARAMETERS.TERRITORY.COMMON.CODE', 'PARAMETERS.TERRITORY.COMMON.NAME',
      'PARAMETERS.REGISTRY.TITLE_TYPE', 'PARAMETERS.TERRITORY.COMMON.DESCRIPTION'])
      .subscribe(translate => {
        this.cols = [
          { field: 'code', header: translate['PARAMETERS.TERRITORY.COMMON.CODE'], width: '10%' },
          { field: 'name', header: translate['PARAMETERS.TERRITORY.COMMON.NAME'], width: '20%' },
          { field: 'name', header: translate['PARAMETERS.REGISTRY.TITLE_TYPE'], width: '20%' },
          { field: 'description', header: translate['PARAMETERS.TERRITORY.COMMON.DESCRIPTION'], width: '50%' },
        ];
      });
  }

  showRegisreyBookElementDialogue(registry?: Registry) {
    this.currentRegistrySelected = registry;
    if (registry) {
      this.modalTitle = this.translateService.instant('PARAMETERS.REGISTRY.EDIT');
      this.currentRegistry = _.clone(registry);
    } else {
      this.modalTitle = this.translateService.instant('PARAMETERS.REGISTRY.ADD');
      this.currentRegistry = new Registry({});
    }
  }

  saved(registry: Registry) {
    if (!registry.code) {
      this.modalErrors = { type: 'error', text: 'MESSAGES.TERRITORY.ERRORS.MISSING_CODE' };
    } else if (!registry.name) {
      this.modalErrors = { type: 'error', text: 'MESSAGES.TERRITORY.ERRORS.MISSING_NAME' };
    } else {
      this.parametersService.saveRegistry(registry).subscribe(nRegistry => {
        if (registry.id) {
          this.registries.splice(this.registries.indexOf(this.currentRegistrySelected), 1, nRegistry);
          this.currentRegistrySelected = null;
        } else {
          this.registries.push(nRegistry);
        }
        this.currentRegistry = null;
        this.alertService.success('MESSAGES.FORMS.SAVE_FORM_SUCCESS');
      });
    }
  }

  canceled() {
    this.currentRegistry = null;
  }

  loadRegistries() {
    forkJoin([
      this.utilService.mapToSelectItems(this.codeListService.getCodeLists({ type: CodeListTypes.BA_UNIT_TYPE })),
      this.parametersService.getAllRegistries(false)])
      .subscribe(([titleTypes, registries]) => {
        this.registries = registries;
        this.titleTypes = titleTypes.map(titleType => {
          titleType.label = titleType.value ? this.translateService.instant('CODELIST.VALUES.' + titleType.label) : titleType.label;
          return titleType;
        });
        // data to preload
        this.preloaderService.setRegistriesToPreload(this.registries);
      });
  }
}
