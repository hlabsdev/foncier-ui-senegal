import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CasePresentedCcod } from '@app/core/models/case-presented-ccod.model';
import { RowSizes } from '@app/core/models/rowSize.model';
import { CasePresentedCcodService } from '@app/core/services/case-presented-ccod.service';
import { UtilService } from '@app/core/utils/util.service';
import { TranslateService } from '@ngx-translate/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { LazyLoadEvent, Table } from 'primeng';

@Component({
  selector: 'app-case-presented-ccod',
  templateUrl: './case-presented-ccod.component.html'
})
export class CasePresentedCcodComponent implements OnInit, AfterViewInit {

  casePresentedCcodList: CasePresentedCcod[];
  casePresentedCcod: CasePresentedCcod = null;
  cols: any;
  rowSizes: any = RowSizes;
  totalRecords: number;
  searchApplicationNumber: String = '';
  searchReferenceNumber: String = '';
  searchApplicationPurpose: String = '';
  searchDisplayFullName: String = '';
  searchDepositDate: String = '';
  locale: any;
  today: Date;
  yearRange: string;
  @ViewChild('dataTableCasePresentedCcod') table: Table;

  // preloader message
  preloaderMessage = '... loading ...';

  constructor(
    private translateService: TranslateService,
    private changeDetector: ChangeDetectorRef,
    protected utilService: UtilService,
    private ngxLoader: NgxUiLoaderService,
    private casePresentedCcodService: CasePresentedCcodService
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.table.reset();
    this.changeDetector.detectChanges();
  }

  loadCasePresentedCcodList(event: LazyLoadEvent = {}) {
    const args = {
      page: event.first / event.rows,
      perPage: event.rows ? event.rows : this.rowSizes.SMALL,
      orderBy: event.sortField,
      direction: event.sortOrder
    };

    this.casePresentedCcodService.getCasePresentedCcodList(args).subscribe(
      result => {

        // preloading init
        this.ngxLoader.start();

        this.casePresentedCcodList = result.content;

        // setting the preloader message
        this.preloaderMessage = this.getPreloaderMessage();

        // stopping the preloading
        this.ngxLoader.stop();

        this.totalRecords = result.totalElements;
        this.cols = [
          { field: 'depositDate', header: this.translateService.instant('CASE_PRESENTED_CCOD.DEPOSIT_DATE') },
          { field: 'application.applicationNumber', header: this.translateService.instant('CASE_PRESENTED_CCOD.NUMBER') },
          { field: 'application.referenceNumber', header: this.translateService.instant('CASE_PRESENTED_CCOD.REFERENCE_NUMBER') },
          { field: 'application.applicant.displayName', header: this.translateService.instant('CASE_PRESENTED_CCOD.REQUEST_NAME') },
          { field: 'application.applicationPurpose', header: this.translateService.instant('CASE_PRESENTED_CCOD.PURPOSE') },
          { field: 'application.applicant.type', header: this.translateService.instant('CASE_PRESENTED_CCOD.REQUESTER_TYPE') }
        ];
      });
  }
  getPreloaderMessage() {
    if (this.casePresentedCcodList.length === 0) {
      return '...';
    } else if (this.casePresentedCcodList.length === 1) {
      return (this.translateService.instant('PRELOADER.ONE_MOMENT')
        + ', ' + this.casePresentedCcodList.length + ' ' + this.translateService.instant('PRELOADER.APPLICATION')
        + ' ' + this.translateService.instant('PRELOADER.IS_LOADING') + '.');
    } else {
      return (this.translateService.instant('PRELOADER.ONE_MOMENT')
        + ', ' + this.casePresentedCcodList.length + ' ' + this.translateService.instant('PRELOADER.APPLICATIONS')
        + ' ' + this.translateService.instant('PRELOADER.ARE_LOADING') + '.');
    }
  }

  showCasePresentedDialogue(casePresentedCCod: CasePresentedCcod): void {
  }
}
