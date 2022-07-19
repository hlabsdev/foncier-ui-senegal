import { Component, OnInit } from '@angular/core';
import { OppositionRegistry } from '@app/core/models/oppositionRegistry.model';
import { RowSizes } from '@app/core/models/rowSize.model';
import { OppositionRegistryService } from '@app/core/services/oppositionRegistry.service';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { TranslateService } from '@ngx-translate/core';
import { BAUnitService } from '../baUnit/baUnit.service';
import { LazyLoadEvent } from 'primeng/api';

@Component({
  selector: 'app-oppositions-registry',
  templateUrl: './oppositions-registry.component.html'
})
export class OppositionsRegistryComponent implements OnInit {
  oppositionregistrysUrl: boolean;
  oppositionsregistry: OppositionRegistry[];
  rowSizes: any = RowSizes;
  cols: any[];
  totalRecords: number;
  searchText: String = '';
  minSearchCharCount: number;

  // preloader message
  preloaderMessage = '... loading ...';

  constructor(
    private oppositionRegistryService: OppositionRegistryService,
    private router: Router,
    private ngxLoader: NgxUiLoaderService,
    protected translateService: TranslateService,
    protected baUnitService: BAUnitService
  ) { }

  ngOnInit(): void {
    this.oppositionregistrysUrl = (this.router.url === '/oppositionsregistry');
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

    this.oppositionRegistryService.getOppositionsRegistry(args).subscribe(result => {
      // preloading init
      this.ngxLoader.start();

      this.oppositionsregistry = result.content;
      this.totalRecords = result.totalElements;

      // setting the preloader message
      this.preloaderMessage = this.getPreloaderMessage();

      // stopping the preloading
      this.ngxLoader.stop();
    });
  }

  getPreloaderMessage() {
    if (this.oppositionsregistry.length === 0) {
      return '...';
    } else if (this.oppositionsregistry.length === 1) {
      return (this.translateService.instant('PRELOADER.ONE_MOMENT')
        + ', ' + this.oppositionsregistry.length + ' ' + this.translateService.instant('PRELOADER.RDAI')
        + ' ' + this.translateService.instant('PRELOADER.IS_LOADING') + '.');
    } else {
      return (this.translateService.instant('PRELOADER.ONE_MOMENT')
        + ', ' + this.oppositionsregistry.length + ' ' + this.translateService.instant('PRELOADER.RDAIS')
        + ' ' + this.translateService.instant('PRELOADER.ARE_LOADING') + '.');
    }
  }

}
