import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CodeListService } from '@app/core/services/codeList.service';
import { getlocaleConstants } from '@app/core/utils/locale.constants';
import { TranslateService } from '@ngx-translate/core';
import { UtilService } from '@app/core/utils/util.service';
import { Application } from '@app/core/models/application.model';
import { RowSizes } from '@app/core/models/rowSize.model';
import { ApplicationService } from '@app/core/services/application.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Dialog, LazyLoadEvent, SelectItem, Table } from 'primeng';


@Component({
  selector: 'app-applications',
  templateUrl: 'applications.component.html'
})

export class ApplicationsComponent implements OnInit, AfterViewInit {
  applications: Application[];
  cols: any;
  rowSizes: any = RowSizes;
  application: Application = null;
  totalRecords: number;
  searchApplicationNumber: String = '';
  searchReferenceNumber: String = '';
  searchApplicationPurpose: String = '';
  searchDisplayFullName: String = '';
  searchApplicationDate: String = '';
  searchstatusFormat: String = '';
  searchStatusCodeList: String = '';
  locale: any;
  today: Date;
  yearRange: string;
  date1: Date;
  mainTypes: SelectItem[];

  @ViewChild('dataTableApplications') table: Table;

  // preloader message
  preloaderMessage = '... loading ...';

  constructor(
    public codeListService: CodeListService,
    private applicationService: ApplicationService,
    private translateService: TranslateService,
    private changeDetector: ChangeDetectorRef,
    protected utilService: UtilService,
    private ngxLoader: NgxUiLoaderService
  ) { }

  ngOnInit() {
    this.getTypes();
    const { localeSettings } = getlocaleConstants(this.translateService.currentLang);
    this.locale = localeSettings;
    this.today = new Date();
    this.yearRange = `1900:${new Date().getFullYear().toString()}`;
  }


  cancelApplication() {
    this.application = null;
  }

  showApplicantDialogue(application = null): void {
    this.application = application;
  }

  loadApplications(event: LazyLoadEvent = {}) {
    const args = {
      page: event.first / event.rows,
      perPage: event.rows ? event.rows : this.rowSizes.SMALL,
      orderBy: event.sortField,
      direction: event.sortOrder,
      searchAppNum: this.searchApplicationNumber,
      searchRefNum: this.searchReferenceNumber,
      searchAppPurpose: this.searchApplicationPurpose,
      searchFullName: this.searchDisplayFullName,
      searchAppDate: this.searchApplicationDate ? this.searchApplicationDate : '',
      searchStatus: this.searchStatusCodeList ? this.searchStatusCodeList : ''
    };

    // preloading init
    this.ngxLoader.start();

    this.applicationService.getApplications(args).subscribe(
      result => {
        this.applications = result.content;

        // setting the preloader message
        this.preloaderMessage = this.getPreloaderMessage();
        // stopping the preloading
        this.ngxLoader.stop();

        this.totalRecords = result.totalElements;
        this.cols = [
          { field: 'applicationNumber', header: this.translateService.instant('APPLICATION.NUMBER') },
          { field: 'referenceNumber', header: this.translateService.instant('APPLICATION.REFERENCE_NUMBER') },
          { field: 'applicant.displayName', header: this.translateService.instant('APPLICATION.REQUEST_NAME') },
          { field: 'applicationDate', header: this.translateService.instant('APPLICATION.DATE') },
          { field: 'applicationPurpose', header: this.translateService.instant('APPLICATION.PURPOSE') },
          { field: 'status', header: this.translateService.instant('APPLICATION.REQUEST_STATUS') },
          { field: 'applicant.type', header: this.translateService.instant('APPLICATION.REQUESTER_TYPE') }
        ];
      });
  }

  getPreloaderMessage() {
    if (this.applications.length === 0) {
      return '...';
    } else if (this.applications.length === 1) {
      return (this.translateService.instant('PRELOADER.ONE_MOMENT')
        + ', ' + this.applications.length + ' ' + this.translateService.instant('PRELOADER.APPLICATION')
        + ' ' + this.translateService.instant('PRELOADER.IS_LOADING') + '.');
    } else {
      return (this.translateService.instant('PRELOADER.ONE_MOMENT')
        + ', ' + this.applications.length + ' ' + this.translateService.instant('PRELOADER.APPLICATIONS')
        + ' ' + this.translateService.instant('PRELOADER.ARE_LOADING') + '.');
    }
  }

  reCenterDialog(dialog: Dialog) {
    // setTimeout(() => dialog.center(), 300);
  }

  ngAfterViewInit(): void {
    this.table.reset();
    this.changeDetector.detectChanges();
  }

  getTypes(): void {
    this.utilService
      .mapToSelectItems(this.applicationService.getApplicationStatus(), 'APPLICATION.STATUS', 'value', 'COMMON.ACTIONS.STATUS')
      .subscribe((mainTypes: SelectItem[]) => {
        this.mainTypes = mainTypes;
      });
  }
}
