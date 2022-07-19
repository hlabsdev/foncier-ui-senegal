import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertService } from '@app/core/layout/alert/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { UtilService } from '@app/core/utils/util.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Table } from 'primeng';
import { LazyLoadEvent, SelectItem } from 'primeng/api';
import { DataService } from '@app/data/data.service';
import { PreregistrationFormality } from './preregistrationFormality.model';
import { PreregistrationFormalityService } from './preregistrationFormality.service';


@Component({
  selector: 'app-preregistration-formalities',
  templateUrl: 'preregistrationFormalities.component.html'
})
export class PreregistrationFormalitiesComponent implements OnInit {
  preregistrationFormalies: PreregistrationFormality[];
  cols: any[];
  searchFields: SelectItem[];
  searchField: String;
  searchText: String = '';

  cForm: any;
  totalRecords: number;
  rows: number;

  @ViewChild('rfp') table: Table;

  // preloader message
  preloaderMessage = '... loading ...';

  constructor(
    private preregistrationFormalityService: PreregistrationFormalityService,
    private translateService: TranslateService,
    private alertService: AlertService,
    private utilService: UtilService,
    private dataService: DataService,
    private ngxLoader: NgxUiLoaderService
  ) { }

  ngOnInit() {
    this.loadRFP();
    this.dataService.getFormByName('RFP_FORM').subscribe(prfs => {
      return this.cForm = JSON.parse(prfs.body);
    });

    this.cols = [
      { field: 'id', header: 'PREREGISTRATION_FORMALITY.ID' },
      { field: 'date', header: 'PREREGISTRATION_FORMALITY.DATE' },
      { field: 'applicant', header: 'PREREGISTRATION_FORMALITY.APPLICANT' },
      { field: 'owner', header: 'PREREGISTRATION_FORMALITY.OWNER' }
    ];

    this.searchFields = [
      this.utilService.getSelectPlaceholder(),
      {
        value: 'id',
        label: this.translateService.instant('PREREGISTRATION_FORMALITY.ID')
      },
      {
        value: 'applicant',
        label: this.translateService.instant(
          'PREREGISTRATION_FORMALITY.APPLICANT'
        )
      }
    ];
  }

  searchRFP() {
    if (this.searchField !== undefined) {
      if (this.table) {
        this.table.reset();
      }

      this.loadRFP();
    }
  }

  loadRFP(event: LazyLoadEvent = {}) {
    const args = {
      page: event.first / event.rows,
      perPage: event.rows ? event.rows : null,
      orderBy: event.sortField,
      direction: event.sortOrder,
      searchText: this.searchText.trim(),
      searchField: this.searchField
    };

    this.preregistrationFormalityService
      .getAllPreregistrationFormalities(args)
      .subscribe(
        result => {
          if (result.content.length) {
            // preloading init
            this.ngxLoader.start();

            this.preregistrationFormalies = result.content;
            this.totalRecords = result.totalElements;
            this.rows = result.size;

            // setting the preloader message
            this.preloaderMessage = this.getPreloaderMessage();

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
  getPreloaderMessage() {
    if (this.preregistrationFormalies.length === 0) {
      return '...';
    } else if (this.preregistrationFormalies.length === 1) {
      return (this.translateService.instant('PRELOADER.ONE_MOMENT')
        + ', ' + this.preregistrationFormalies.length + ' ' + this.translateService.instant('PRELOADER.REGISTRE_FORMALITY')
        + ' ' + this.translateService.instant('PRELOADER.IS_LOADING') + '.');
    } else {
      return (this.translateService.instant('PRELOADER.ONE_MOMENT')
        + ', ' + this.preregistrationFormalies.length + ' ' + this.translateService.instant('PRELOADER.REGISTRE_FORMALITIES')
        + ' ' + this.translateService.instant('PRELOADER.ARE_LOADING') + '.');
    }
  }
}
