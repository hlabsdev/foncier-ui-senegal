import { Component, OnInit } from '@angular/core';
import { LazyLoadEvent, SelectItem } from 'primeng/api';
import { LandSituationTableService } from '@app/core/services/land-situation-table.service';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from '@app/core/layout/alert/alert.service';
import { UtilService } from '@app/core/utils/util.service';
import { DataService } from '@app/data/data.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { LandSituationTable } from '@app/core/models/landSituationTable.model';
import { RowSizes } from '@app/core/models/rowSize.model';

@Component({
    selector: 'app-land-situation-table',
    templateUrl: './land-situation-table.component.html'
})
export class LandSituationTableComponent implements OnInit {

    landSituationTables: LandSituationTable[];
    cols: any[];
    searchFields: SelectItem[];
    searchField: String;
    searchText: String = '';

    cForm: any;
    totalRecords: number;
    rows: number;
    rowSizes: any = RowSizes;

    // preloader message
    preloaderMessage = '... loading ...';

    constructor(
        private landSituationTableService: LandSituationTableService,
        private translateService: TranslateService,
        private alertService: AlertService,
        private utilService: UtilService,
        private dataService: DataService,
        private ngxLoader: NgxUiLoaderService
    ) {
    }

    ngOnInit(): void {
        this.loadLandSituationTable();
    }

    loadLandSituationTable(event: LazyLoadEvent = {}) {
        this.landSituationTableService
            .getLandSituationTable()
            .subscribe(
                result => {
                  if (result.content.length) {
                    // preloading init
                    this.ngxLoader.start();

                    this.landSituationTables = result.content;
                    this.totalRecords = result.totalElements;
                    this.rows = result.size;
                    // stopping the preloading
                    this.ngxLoader.stop();
                  } else {
                    this.alertService.error('API_MESSAGES.NO_DATA_FOUND');
                  }
                },
                err => {
                  // stopping the preloading
                  this.ngxLoader.stop();
                  this.alertService.apiError(err);
                }
            );
      }

}
