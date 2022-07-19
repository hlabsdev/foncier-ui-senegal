import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CasePresentedCcod } from '@app/core/models/case-presented-ccod.model';
import { RowSizes } from '@app/core/models/rowSize.model';
import { UtilService } from '@app/core/utils/util.service';
import { TranslateService } from '@ngx-translate/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { LazyLoadEvent, Table } from 'primeng';
import { Task } from '@app/core/models/task.model';
import { Variables } from '@app/core/models/variables.model';
import { FormVariables } from '@app/workstation/baseForm/formVariables.model';
import { UploadSource } from '@app/core/models/uploadSource.model';
import { Source } from '@app/core/models/source.model';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-case-group-presented-view-ccod',
    templateUrl: './case-group-presented-view-ccod.component.html'
})
export class CaseGroupPresentedViewCcodComponent implements OnInit, AfterViewInit {

    @Input() task: Task;
    @Output() saved = new EventEmitter<{ val: string[], variable: Variables }>();
    @Output() canceled = new EventEmitter<boolean>();
    @Input() formVariables: FormVariables = new FormVariables({});
    @Input() showBaUnitSourcesDetail: Boolean = false;
    @Input() displayingHistory = false;
    @Input() editModal: boolean;
    @Output() modalVisible = new EventEmitter<boolean>();
    selectedDocument: UploadSource;
    displaySource: Boolean = false;
    sources: Source[];
    casePresentedCcodViewList: CasePresentedCcod[];
    casePresentedCcod: CasePresentedCcod = null;
    selectedCase: CasePresentedCcod[];
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
        private httpClient: HttpClient,
        private translateService: TranslateService,
        private changeDetector: ChangeDetectorRef,
        protected utilService: UtilService,
        private ngxLoader: NgxUiLoaderService
    ) {
    }

    ngOnInit(): void {
        this.httpClient.get<any>('assets/cases/cases.json').subscribe((data) =>
            this.casePresentedCcodViewList = data.cases);
    }

    ngAfterViewInit(): void {
        this.table.reset();
        this.changeDetector.detectChanges();
    }

    loadCasePresentedCcodList(event: LazyLoadEvent = {}) {
        this.totalRecords = this.casePresentedCcodViewList.length;
        this.cols = [
            { field: 'depositDate', header: this.translateService.instant('CASE_PRESENTED_CCOD.DEPOSIT_DATE') },
            { field: 'application.applicationNumber', header: this.translateService.instant('CASE_PRESENTED_CCOD.NUMBER') },
            { field: 'application.referenceNumber', header: this.translateService.instant('CASE_PRESENTED_CCOD.REFERENCE_NUMBER') },
            { field: 'application.applicant.displayName', header: this.translateService.instant('CASE_PRESENTED_CCOD.REQUEST_NAME') },
            { field: 'application.applicationPurpose', header: this.translateService.instant('CASE_PRESENTED_CCOD.PURPOSE') },
            { field: 'application.applicant.type', header: this.translateService.instant('CASE_PRESENTED_CCOD.REQUESTER_TYPE') }
        ];
    }

    getPreloaderMessage() {
        if (this.casePresentedCcodViewList.length === 0) {
            return '...';
        } else if (this.casePresentedCcodViewList.length === 1) {
            return (this.translateService.instant('PRELOADER.ONE_MOMENT')
                + ', ' + this.casePresentedCcodViewList.length + ' ' + this.translateService.instant('PRELOADER.APPLICATION')
                + ' ' + this.translateService.instant('PRELOADER.IS_LOADING') + '.');
        } else {
            return (this.translateService.instant('PRELOADER.ONE_MOMENT')
                + ', ' + this.casePresentedCcodViewList.length + ' ' + this.translateService.instant('PRELOADER.APPLICATIONS')
                + ' ' + this.translateService.instant('PRELOADER.ARE_LOADING') + '.');
        }
    }

    showCasePresentedDialogue(casePresentedCCod: CasePresentedCcod): void {
        this.modalVisible.emit(true);
    }

    save(): void {
        this.modalVisible.emit(false);
    }

    cancel(): void {
        this.modalVisible.emit(false);
    }

    onRowSelect(event) {
        this.selectedCase = this.casePresentedCcodViewList.filter((casePresentedCcod) => casePresentedCcod.id === event.data.id);
    }

    onRowUnselect(event) {

    }

}
