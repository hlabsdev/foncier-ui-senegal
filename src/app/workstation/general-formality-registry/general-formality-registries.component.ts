import { Component, OnInit } from '@angular/core';
import { RowSizes } from '@app/core/models/rowSize.model';
import { GeneralFormalityRegistryService } from '@app/core/services/generalFormalityRegistry.service';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { TranslateService } from '@ngx-translate/core';
import { BAUnitService } from '../baUnit/baUnit.service';
import { LazyLoadEvent } from 'primeng/api';
import { GeneralFormalityRegistry } from '@app/core/models/generalFormalityRegistry.model';

@Component({
  selector: 'app-general-formality-registries',
  templateUrl: './general-formality-registries.component.html',
})
export class GeneralFormalityRegistriesComponent implements OnInit {
  generalFormalityRegisterUrl: boolean;
  generalFormalityRegister: GeneralFormalityRegistry[];
  rowSizes: any = RowSizes;
  cols: any[];
  totalRecords: number;
  searchText: String = '';
  minSearchCharCount: number;
  // preloader message
  preloaderMessage = '... loading ...';
  constructor(
    private generalFormalityRegisterService: GeneralFormalityRegistryService,
    private router: Router,
    private ngxLoader: NgxUiLoaderService,
    protected translateService: TranslateService,
    protected baUnitService: BAUnitService
  ) { }

  ngOnInit(): void {
    this.generalFormalityRegisterUrl = (this.router.url === '/generalFormalityRegistries');
    this.minSearchCharCount = 3;
  }


  loadOppositionsRegistry(event: LazyLoadEvent = {}) {
    if (this.searchText.length > 0 && this.searchText.length < this.minSearchCharCount) {
      return;
    }

    const args = {
      page: event.first / event.rows,
      perPage: event.rows ? event.rows : this.rowSizes.SMALL,
      orderBy: event.sortField,
      direction: event.sortOrder,
      search: this.searchText
    };

    this.generalFormalityRegisterService.getGeneralFormalityRegistry(args).subscribe(result => {
      // preloading init
      this.ngxLoader.start();

      this.generalFormalityRegister = result.content;


      this.totalRecords = result.totalElements;

      // setting the preloader message
      this.preloaderMessage = this.getPreloaderMessage();

      // stopping the preloading
      this.ngxLoader.stop();
    });
  }

  getPreloaderMessage() {
    if (this.generalFormalityRegister.length === 0) {
      return '...';
    } else if (this.generalFormalityRegister.length === 1) {
      return (this.translateService.instant('PRELOADER.ONE_MOMENT')
        + ', ' + this.generalFormalityRegister.length + ' ' + this.translateService.instant('PRELOADER.RDAI')
        + ' ' + this.translateService.instant('PRELOADER.IS_LOADING') + '.');
    } else {
      return (this.translateService.instant('PRELOADER.ONE_MOMENT')
        + ', ' + this.generalFormalityRegister.length + ' ' + this.translateService.instant('PRELOADER.RDAIS')
        + ' ' + this.translateService.instant('PRELOADER.ARE_LOADING') + '.');
    }
  }

}


