import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '@app/core/layout/alert/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { RowSizes } from '@app/core/models/rowSize.model';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { LazyLoadEvent, SelectItem } from 'primeng/api';
import { BAUnit } from './baUnit.model';
import { BAUnitService } from './baUnit.service';
import { Table } from 'primeng';
import { UtilService } from '@app/core/utils/util.service';
import { SpatialUnitService } from '../spatialUnit/spatialUnit.service';
import { of } from 'rxjs';
import { SpatialUnit } from '../spatialUnit/spatialUnit.model';
import { values } from 'lodash';
import { Index } from 'typeorm';

@Component({
  selector: 'app-ba-units',
  templateUrl: 'baUnits.component.html'
})

export class BAUnitsComponent implements OnInit {
  baUnits: BAUnit[];
  rowSizes: any = RowSizes;
  // default is to see only registered BaUnits.
  cols: any[];
  showOnlyRegistered: Boolean = true;
  totalRecords: number;
  searchText: String = '';
  registeredUrl: boolean;
  searchFields: SelectItem[];
  searchField: String;
  spatialUnits: SpatialUnit[];
  mapSpatialUnits = {};





  @ViewChild('dataTableBAUnits') table: Table;

  // preloader message
  preloaderMessage = '... loading ...';

  constructor(
    private BAUnitservice: BAUnitService,
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private translateService: TranslateService,
    private ngxLoader: NgxUiLoaderService
  ) { }

  ngOnInit(): void {
    this.preloaderMessage = '... loading ...';
    this.registeredUrl = this.router.url === '/ba-units/registered';
    this.route.queryParams.subscribe(params => {
      this.showOnlyRegistered = !(params && params.all);
    });
    this.loadBAUnits();
  }

  searchBaUnits() {
    this.table.reset();
    this.loadBAUnits();
  }

  loadBAUnits(event: LazyLoadEvent = {}) {
    const args = {
      page: event.first / event.rows,
      perPage: this.rowSizes.SMALL,
      orderBy: event.sortField,
      direction: event.sortOrder,
      search: this.searchText
    };

    // preloading init
    this.ngxLoader.start();
    const getBaUnits = this.showOnlyRegistered ? this.BAUnitservice.getRegisteredBAUnits(args) : this.BAUnitservice.getBAUnits(args);

    getBaUnits.subscribe(result => {

      this.baUnits = result.content;
      // setting the preloader message
      this.preloaderMessage = this.getPreloaderMessage();
      for (const baUnit of this.baUnits) {
        for (const spatialUnit of <SpatialUnit[]>baUnit.spatialUnits) { this.mapSpatialUnits[spatialUnit.id] = spatialUnit; }
        baUnit.spatialUnits = this.mapSpatialUnits[baUnit.suid];
      }
      this.cols = [
        { field: 'titleName', header: this.translateService.instant('BA_UNIT.ID'), width: '15%' },
        { field: 'registryRecord.volume', header: this.translateService.instant('BA_UNIT.REGISTRY.VOLUME'), width: '10%' },
        { field: 'spatialUnits.parcelNumber', header: this.translateService.instant('BA_UNIT.NICAD'), width: '15%' },
        { field: 'type.description', header: this.translateService.instant('BA_UNIT.TYPE'), width: '15%' },
        { field: 'owner', header: this.translateService.instant('BA_UNIT.OWNER'), width: '35%' }
      ];
      this.totalRecords = result.totalElements;

      // stopping the preloading
      this.ngxLoader.stop();
    }, err => {
      // stopping the preloading
      this.ngxLoader.stop();
      this.alertService.apiError(err);
    });
  }

  getPreloaderMessage() {
    if (this.baUnits.length === 0) {
      return this.translateService.instant('PRELOADER.ONE_MOMENT');
    } else if (this.baUnits.length === 1) {
      return (this.translateService.instant('PRELOADER.ONE_MOMENT')
        + ', ' + this.baUnits.length + ' ' + this.translateService.instant('PRELOADER.BA_UNIT')
        + ' ' + this.translateService.instant('PRELOADER.IS_LOADING') + '.');
    } else {
      return (this.translateService.instant('PRELOADER.ONE_MOMENT')
        + ', ' + this.baUnits.length + ' ' + this.translateService.instant('PRELOADER.BA_UNITS')
        + ' ' + this.translateService.instant('PRELOADER.ARE_LOADING') + '.');
    }
  }

  editBAUnit(baUnit: BAUnit): void {
    const params = { queryParams: { registered: this.showOnlyRegistered } };
    this.router.navigate(['ba-unit', baUnit.uid], params);
  }

  addBAUnit(): void {
    this.router.navigate(['ba-unit']);
  }

}
