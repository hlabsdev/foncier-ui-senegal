import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { RowSizes } from '@app/core/models/rowSize.model';
import { Table, LazyLoadEvent } from 'primeng';
import { TranslateService } from '@ngx-translate/core';
import { UtilService } from '@app/core/utils/util.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Delegation } from '@app/core/models/delegation.model';
import { DelegationService } from '@app/core/services/delegation.service';
import { getlocaleConstants } from '@app/core/utils/locale.constants';
import { TranslationService } from '@app/translation/translation.service';


@Component({
  selector: 'app-delegation',
  templateUrl: './delegation.component.html'
})
export class DelegationComponent implements OnInit, AfterViewInit {

  delegationList: Delegation[] = new Array<Delegation>();
  delegationMod: any = null;
  cols: any;
  rowSizes: any = RowSizes;
  totalRecords: number;
  searchDelegationId: number;
  locale: any;
  today: Date;
  yearRange: string;
  isDelegationhitted: boolean;
  @ViewChild('dataTableDelegation') table: Table;

  // preloader message
  preloaderMessage = '... loading ...';

  constructor(
    private translateService: TranslateService,
    private changeDetector: ChangeDetectorRef,
    protected utilService: UtilService,
    private ngxLoader: NgxUiLoaderService,
    private translationService: TranslationService,
    private delegationService: DelegationService,
  ) {
      this.initStaticDelegationList();
    }

  ngOnInit(): void {
    const { localeSettings } = getlocaleConstants(this.translateService.currentLang);
    this.locale = localeSettings;
    this.today = new Date();
    this.yearRange = `1900:${new Date().getFullYear().toString()}`;
  }

  ngAfterViewInit(): void {
    this.table.reset();
    this.changeDetector.detectChanges();
  }

  loadDelegationList(event: LazyLoadEvent = {}) {
    const args = {
      page: event.first / event.rows,
      perPage: event.rows ? event.rows : this.rowSizes.SMALL,
      orderBy: event.sortField,
      direction: event.sortOrder
    };
    this.cols = [
      { field: 'startDate', header: this.translateService.instant('DELEGATION.START_DATE') },
      { field: 'status', header: this.translateService.instant('DELEGATION.STATUS') },
      { field: 'motif', header: this.translateService.instant('DELEGATION.MOTIF') },
      { field: 'endDate', header: this.translateService.instant('DELEGATION.END_DATE') }
    ];

    // **** Service's call for delegation's dynamic list. ****

    /*this.delegationService.getDelegationList(args).subscribe(
      result => {

        // preloading init
        this.ngxLoader.start();

        this.delegationList = result.content;

        // setting the preloader message
        this.preloaderMessage = this.getPreloaderMessage();

        // stopping the preloading
        this.ngxLoader.stop();

        this.totalRecords = result.totalElements;
        this.cols = [
          { field: 'startDate', header: this.translateService.instant('DELEGATION.START_DATE') },
          { field: 'status', header: this.translateService.instant('DELEGATION.STATUS') },
          { field: 'motif', header: this.translateService.instant('DELEGATION.MOTIF') },
          { field: 'endDate', header: this.translateService.instant('DELEGATION.END_DATE') }
        ];
      });*/
  }
  initStaticDelegationList() {
    // preloading init
    this.ngxLoader.start();
    const delegation1 = new Delegation();
    delegation1.startDate = new Date();
    delegation1.endDate = new Date();
    delegation1.status = 'TERMINÉE';
    delegation1.motif = 'Abscence pour missions de deux mois';
    this.delegationList.push(delegation1);
    this.delegationList.push(delegation1);
    this.delegationList.push(delegation1);
    this.delegationList.push(delegation1);
    this.delegationList.push(delegation1);
    this.delegationList.push(delegation1);
    this.delegationList.push(delegation1);

    // setting the preloader message
    this.preloaderMessage = this.getPreloaderMessage();

    // stopping the preloading
    this.ngxLoader.stop();
    this.totalRecords = this.delegationList.length;
    this.preloaderMessage = this.getPreloaderMessage();
    console.log(delegation1);
  }
  getPreloaderMessage() {
    if (this.delegationList.length === 0) {
      return '...';
    } else if (this.delegationList.length === 1) {
      return (this.translateService.instant('PRELOADER.ONE_MOMENT')
        + ', ' + this.delegationList.length + ' ' + this.translateService.instant('PRELOADER.APPLICATION')
        + ' ' + this.translateService.instant('PRELOADER.IS_LOADING') + '.');
    } else {
      return (this.translateService.instant('PRELOADER.ONE_MOMENT')
        + ', ' + this.delegationList.length + ' ' + this.translateService.instant('PRELOADER.APPLICATIONS')
        + ' ' + this.translateService.instant('PRELOADER.ARE_LOADING') + '.');
    }
  }

  showDelegationDialogue(currentDelegation = null): void {
    this.isDelegationhitted = true;
  }
  stopDelegation(): any {
    this.delegationList[this.delegationList.length - 1].endDate = new Date();
    this.delegationList.forEach(del => { del.status = 'TERMINÉE'; });
  }
  saveDelegation() {
    this.isDelegationhitted = false;
    const delegation1 = new Delegation();
    delegation1.startDate = new Date();
    delegation1.endDate = null;
    delegation1.status = 'En cours';
    delegation1.motif = 'Abscence pour missions de deux mois';
    this.delegationList.push(delegation1);
  }
  cancelDelegation() {
    this.isDelegationhitted = false;
  }
}
