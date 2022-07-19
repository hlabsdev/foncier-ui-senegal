import {
    ChangeDetectorRef,
    Component,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import { CaseGroupPresentedCcod } from '@app/core/models/case-group-presented-ccod.model';
import { Router } from '@angular/router';
import { RowSizes } from '@app/core/models/rowSize.model';
import { UtilService } from '@app/core/utils/util.service';
import { TranslateService } from '@ngx-translate/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { LazyLoadEvent, Table } from 'primeng';
import { FormTemplateBaseComponent } from '@app/workstation/baseForm/form-template-base.component';

import { BAUnit } from '@app/workstation/baUnit/baUnit.model';
import { FormVariables } from '@app/workstation/baseForm/formVariables.model';
import { AlertService } from '@app/core/layout/alert/alert.service';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-case-group-presented-ccod',
    templateUrl: './case-group-presented-ccod.component.html'
})
export class CaseGroupPresentedCcodComponent extends FormTemplateBaseComponent implements OnInit, OnChanges {

    @Input() formVariables: FormVariables = new FormVariables({});
    @Input() options;

    _options = {
        add: true,
        delete: true
    };

    cases: any[];
    caseGroupPresentedCcodList: CaseGroupPresentedCcod[];
    caseGroupPresentedCcod: CaseGroupPresentedCcod;
    modalVisible: boolean;
    editModal: boolean;
    fileCheckedUrl: boolean;
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
    search: string;
    baUnit: BAUnit = null;
    persistToDB: boolean;
    @ViewChild('dataTableCaseGroupPresentedCcod') table: Table;

    // preloader message
    preloaderMessage = '... loading ...';

    constructor(
        private httpClient: HttpClient,
        private translateService: TranslateService,
        private changeDetector: ChangeDetectorRef,
        protected router: Router,
        protected utilService: UtilService,
        private ngxLoader: NgxUiLoaderService,
        private alertService: AlertService,
    ) {
        super();
    }

    ngOnInit(): void {
        this.httpClient.get<any>('assets/cases/affaires.json').subscribe((data) =>
            this.caseGroupPresentedCcodList = data.caseGroupPresentedCcodList);
        this.fileCheckedUrl = (this.router.url === '/case-group-presented-ccod');
        if (this.formVariables.baUnit) {
            this.baUnit = new BAUnit(this.formVariables.baUnit);
        } else { this.persistToDB = true; }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.options) {
            const keys = Object.keys(this.options);
            for (const key of keys) {
                this._options[key] = this.options[key] || (this.options[key] === false ? false : this._options[key]);
            }
        }
    }

    loadCaseGroupPresentedCcodList(event: LazyLoadEvent = {}) {
        // preloading init
        this.ngxLoader.start();

        // stopping the preloading
        this.ngxLoader.stop();

        this.totalRecords = this.caseGroupPresentedCcodList.length;
        this.cols = [
            { field: 'caseNumber', header: this.translateService.instant('CASE_GROUP_PRESENTED_CCOD.REFERENCE_NUMBER') },
            { field: 'reference', header: this.translateService.instant('CASE_GROUP_PRESENTED_CCOD.REFERENCE') },
            { field: 'designation', header: this.translateService.instant('CASE_GROUP_PRESENTED_CCOD.DESIGNATION') },
            { field: 'caseType', header: this.translateService.instant('CASE_GROUP_PRESENTED_CCOD.TYPE') },
            { field: 'category', header: this.translateService.instant('CASE_GROUP_PRESENTED_CCOD.CATEGORY') },
            { field: 'csf', header: this.translateService.instant('CASE_GROUP_PRESENTED_CCOD.CSF') },
            { field: 'createdDate', header: this.translateService.instant('CASE_GROUP_PRESENTED_CCOD.CREATED_DATE') },
            { field: 'status', header: this.translateService.instant('CASE_GROUP_PRESENTED_CCOD.STATUS') }
        ];
    }
    showBlockerRRRElementDialogue(modalebooll: boolean = true, edit: boolean = true ): void {
        this.modalVisible = modalebooll;
        this.editModal = edit;
    }
}
