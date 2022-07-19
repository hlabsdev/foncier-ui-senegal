import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '@app/core/layout/alert/alert.service';
import { CodeListService } from '@app/core/services/codeList.service';
import { TranslateService } from '@ngx-translate/core';
import { UtilService } from '@app/core/utils/util.service';
import { RowSizes } from '@app/core/models/rowSize.model';
import { CodeListTypes } from '@app/core/models/codeListType.model';
import { CodeList } from '@app/core/models/codeList.model';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SelectItem } from 'primeng';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-code-lists',
  templateUrl: 'codeLists.component.html'
})

export class CodeListsComponent implements OnInit {
  @Output() added = new EventEmitter(true);
  codeLists: CodeList[];
  search: string;
  rowSizes: any = RowSizes;
  cols: any[];
  typeFilter: number;
  typeTimeout: any;
  codeListTypes: SelectItem[];
  receivedCodeList: CodeList;
  type = CodeListTypes.RIGHT_TYPE;

  // preloader message
  preloaderMessage = '... loading ...';

  constructor(
    private codelistservice: CodeListService,
    private router: Router,
    public utilService: UtilService,
    private alertService: AlertService,
    protected translateService: TranslateService,
    private route: ActivatedRoute,
    private ngxLoader: NgxUiLoaderService
  ) {
  }

  ngOnInit(): void {
    this.getCodeLists();
  }

  editCodeList(codeList: CodeList): void {
    this.receivedCodeList = codeList;
    this.added.emit(this.receivedCodeList);
  }

  addCodeList(): void {
    this.receivedCodeList = new CodeList();
    this.receivedCodeList.codeListID = ' ';
    this.added.emit(this.receivedCodeList);
  }

  closeDialog() {
    this.receivedCodeList = null;
    this.getCodeLists();
  }

  getCodeLists(search: string = '') {
    const args = {
      search: search
    };
    this.ngxLoader.start();
    this.getCodeList(args);
  }

  getCodeList(args = {}) {
    this.codelistservice.getCodeLists(args)
      .subscribe(value => {
        return this.getCodeListLabels(value);
      }, err => {
        this.ngxLoader.stop();
        this.alertService.apiError(err);
      });
  }

  refresh(event) {
    this.ngxLoader.start();
    this.getCodeList();
  }

  getCodeListLabels(values) {
    let labels = [];
    let codeListValues = [];

    labels = values.map(cl => this.translateService.get(`CODELIST.TYPES.${cl.type}`));

    forkJoin(labels).subscribe(args => {
        values.forEach((v, i) => {
          v.type = args[i];
        });

        this.codeLists = values;

        // setting the preloader message
        this.preloaderMessage = this.getPreloaderMessage();

        // stopping the preloading
        this.ngxLoader.stop();

      },
      err => {
        // stopping the preloading
        this.ngxLoader.stop();
        return this.alertService.apiError(err);
      }
    );

    codeListValues = values.map(cl => this.translateService.get(`CODELIST.VALUES.${cl.value}`));

    forkJoin(codeListValues).subscribe(args => {
      values.forEach((v, i) => {
        v.value = args[i];
      });
      this.codeLists = values;
    }, err => this.alertService.apiError(err));

    this.cols = [
      { field: 'value', header: this.translateService.instant('CODELIST.VALUE') },
      { field: 'description', header: this.translateService.instant('CODELIST.DESCRIPTION') },
      { field: 'type', header: this.translateService.instant('CODELIST.TYPE') }
    ];
  }

  getPreloaderMessage() {
    if (this.codeLists.length === 0) {
      return '...';
    } else if (this.codeLists.length === 1) {
      return (this.translateService.instant('PRELOADER.ONE_MOMENT')
        + ', ' + this.codeLists.length + ' ' + this.translateService.instant('PRELOADER.CODE')
        + ' ' + this.translateService.instant('PRELOADER.IS_LOADING') + '.');
    } else {
      return (this.translateService.instant('PRELOADER.ONE_MOMENT')
        + ', ' + this.codeLists.length + ' ' + this.translateService.instant('PRELOADER.CODES')
        + ' ' + this.translateService.instant('PRELOADER.ARE_LOADING') + '.');
    }
  }
}
