import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '@app/core/layout/alert/alert.service';
import { SourceService } from '@app/core/services/source.service';
import { TransactionInstanceService } from '@app/core/services/transactionInstance.service';
import { TranslateService } from '@ngx-translate/core';
import { TransactionHistoryService } from '@app/core/services/transactionHistory.service';
import { RowSizes } from '@app/core/models/rowSize.model';
import { Variables } from '@app/core/models/variables.model';
import { Source } from '@app/core/models/source.model';
import { UploadSource } from '@app/core/models/uploadSource.model';
import { Task } from '@app/core/models/task.model';
import { mergeMap, catchError, map } from 'rxjs/operators';
import { Location } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormTemplateBaseComponent } from '../baseForm/form-template-base.component';
import { combineLatest } from 'rxjs';
import { saveAs } from 'file-saver';
import { FormVariables } from '@app/workstation/baseForm/formVariables.model';
import * as _ from 'lodash';
import { LazyLoadEvent } from 'primeng/api';
import { ProcessService } from '@app/core/services/process.service';
import { ProcessInstance } from '@app/core/models/processInstance.model';
import { TaskService } from '@app/core/services/task.service';
import { Console } from 'console';


@Component({
  selector: 'app-sources',
  templateUrl: 'sources.component.html'
})

export class SourcesComponent extends FormTemplateBaseComponent implements OnInit {
  @Input() task: Task;
  @Output() saved = new EventEmitter<{ val: string[], variable: Variables }>();
  @Output() canceled = new EventEmitter<boolean>();
  @Input() formVariables: FormVariables = new FormVariables({});
  @Input() showBaUnitSourcesDetail: Boolean = false;
  @Input() displayingHistory = false;

  sourcesUrl: boolean;
  sources: Source[];
  sourcesToShow: Source[];
  sourceIDs: string[];
  accessedByRouter: boolean;
  rowSizes: any = RowSizes;
  selectedDocument: UploadSource;
  source: Source = new Source();
  sourceBackup: Source[];
  baUnitId: string;
  label: string;
  cols: any[];
  displaySource: Boolean = false;
  totalRecords: number;

  constructor(
    protected location: Location,
    private router: Router,
    private alertService: AlertService,
    protected sourceService: SourceService,
    protected route: ActivatedRoute,
    private translateService: TranslateService,
    private transactionInstanceService: TransactionInstanceService,
    private transactionInstanceHistoryService: TransactionHistoryService,
    private taskService: TaskService
  ) {
    super();
  }

  ngOnInit(): void {
    this.sourcesUrl = (this.router.url === '/sources');
    if ((this.formVariables.baUnit !== null) && (this.formVariables.baUnitId !== null)) {
      this.baUnitId = (this.formVariables.baUnit.uid !== this.formVariables.baUnitId)
        ? this.formVariables.baUnit.uid : this.formVariables.baUnitId;
    } else if (this.formVariables.baUnit !== null && this.formVariables.baUnit.uid !== null) {
      this.baUnitId = this.formVariables.baUnit.uid;
    } else if (this.formVariables.baUnitId !== null) {
      this.baUnitId = this.formVariables.baUnitId;
    }

    this.sourceIDs = this.formVariables.sources ? this.formVariables.sources : [];
    combineLatest([this.route.params, this.route.queryParams, this.route.url])
      .pipe(map(results => ({ params: results[0], queryParams: results[1], urlPath: results[2] })))
      .subscribe(route => {
        if (route.urlPath.find(p => p.path === 'sources')) {
          this.accessedByRouter = true;
        }
      });
  }

  // check for transactionInstance Id and using it,to get all sources.
  getSources(args: any = {}) {
    if (this.task && this.task.processInstanceId) {

      this.transactionInstanceHistoryService.getRootProcessInstanceId(this.task.processInstanceId,
        this.formVariables.isFastTrackProcess).then(id => {
          this.transactionInstanceService
            .getTransactionInstancesByWorkflowId(id)
            .subscribe(transactionInstance => {
              this.findSources({ transactionInstanceId: transactionInstance.id });
            });
        }).catch(err => this.alertService.apiError(err));

    } else if (this.baUnitId) {
      this.findSources({ baUnitId: this.baUnitId });
    } else {
      this.findSources(args);
    }
  }

  findSources(args: any = {}) {
    this.sourceService
      .getSources(args)
      .subscribe(result => {
        this.sources = result.content;
        this.sourcesToShow = this.sources;
        this.totalRecords = result.totalElements;

        if (this.showBaUnitSourcesDetail) {
          this.cols = [
            { field: 'mainType.description', header: this.translateService.instant('SOURCE.MAIN_TYPE') },
            { field: 'sourceType', header: this.translateService.instant('SOURCE.SOURCE_TYPE') },
            { field: 'submissionDate', header: this.translateService.instant('SOURCE.SUBMISSION_DATE') },
            { field: 'extArchive.fileName', header: this.translateService.instant('SOURCE.FILE_NAME') },
            {
              field: 'transactionInstance.transaction.name',
              header: this.translateService.instant('TRANSACTION_INSTANCE.TRANSACTION_NAME')
            }
          ];
        } else {

          this.cols = [
            { field: 'mainType.description', header: this.translateService.instant('SOURCE.MAIN_TYPE') },
            { field: 'sourceType', header: this.translateService.instant('SOURCE.SOURCE_TYPE') },
            { field: 'submissionDate', header: this.translateService.instant('SOURCE.SUBMISSION_DATE') },
            { field: 'extArchive.fileName', header: this.translateService.instant('SOURCE.FILE_NAME') }
          ];
        }
      }, err => this.alertService.apiError(err));
  }

  loadSourcesByPage(event: LazyLoadEvent) {
    if (this.task && this.task.processInstanceId) {
      this.transactionInstanceHistoryService.getRootProcessInstanceId(this.task.processInstanceId,
        this.formVariables.isFastTrackProcess).then(id => {
          this.transactionInstanceService
            .getTransactionInstancesByWorkflowId(id)
            .subscribe(transactionInstance => {
              this.findSources({
                transactionInstanceId: transactionInstance.id, page: (event.first / event.rows),
                perPage: event.rows, orderBy: event.sortField, direction: event.sortOrder
              });
            });
        }).catch(err => this.alertService.apiError(err));
    } else if (this.displayingHistory && this.formVariables.baUnit.complementaryInfo.transactionInstance.id) {
      this.findSources({
        transactionInstanceId: this.formVariables.baUnit.complementaryInfo.transactionInstance.id,
        page: (event.first / event.rows), perPage: event.rows, orderBy: event.sortField, direction: event.sortOrder
      });
    } else if (this.baUnitId) {
      this.findSources({
        baUnitId: this.baUnitId, page: (event.first / event.rows), perPage: event.rows,
        orderBy: event.sortField, direction: event.sortOrder
      });
    } else {
      this.findSources({
        page: event.first / event.rows, perPage: event.rows, orderBy: event.sortField,
        direction: event.sortOrder
      });
    }
  }

  saveSource(source: Source = null): void {
    this.displaySource = false;
    this.selectedDocument = new UploadSource();
    this.selectedDocument.source = source ? _.cloneDeep(source) : new Source();
  }

  onSaveDocument(document: UploadSource) {
    if (!document.file && document.source.id) {

      document.source.addBAUnit(this.formVariables.baUnit);
      const updateObs = this.sourceService.updateSource(document.source);
      return updateObs.subscribe(
        s => {
          this.sourceSaved(s);
        },
        err => this.alertService.apiError(err));

    } else {
      const saveObs = this.sourceService.saveSourceFile(document);
      return saveObs
        .pipe(
          mergeMap(result => {
            document.source.addBAUnit(this.formVariables.baUnit);
            return this.sourceService.createSource(result, document.source).pipe(
              catchError(error => {
                this.alertService.apiError(error);
                return error;
              }));
          }))
        .subscribe(
          s => {
            this.sourceSaved(s);
          },
          err => this.alertService.apiError(err));
    }
  }

  downloadDocument(source: Source): void {
    const fileName = source.extArchive.fileName;
    this.sourceService.getDocumentById(source).subscribe(val => {
      return saveAs(val, fileName);
    });
  }

  signPdfDocument(source: Source): void {
    const baUnitId = this.baUnitId;
    const electronicSignatureRole = this.formVariables.electronicSignatureRole;
    this.taskService.getTaskVariables(this.task).subscribe(resp => {
      if (resp['parameters']?.value) {
        this.sourceService.signPdfDocument(source, electronicSignatureRole, baUnitId, JSON.parse(resp['parameters']?.value))
        .subscribe(val => {
          const index = _.findIndex(this.sourcesToShow, { id: val.id });
          this.sourcesToShow.splice(index, 1, val);
        }, err => this.alertService.apiError(err));
      } else {
        this.sourceService.signPdfDocument(source, electronicSignatureRole, baUnitId, '').subscribe(val => {
          const index = _.findIndex(this.sourcesToShow, { id: val.id });
          this.sourcesToShow.splice(index, 1, val);
        }, err => this.alertService.apiError(err));
      }
    });
  }

  viewSource(source) {
    this.selectedDocument = null;
    this.displaySource = null;
    setTimeout(() => {
      this.selectedDocument = source;
      this.displaySource = true;
    }, 200);
  }

  scrollToViewer(event, documentView) {
    if (event === true) {
      setTimeout(() => {
        documentView.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
    }
  }

  goBack(): void {
    this.location.back();
  }

  goToList(): void {
    this.router.navigate(['sources']);
  }

  sourceSaved(s: any) {
    this.alertService.success('API_MESSAGES.SAVE_SUCCESSFUL');
    this.source = new Source(s);
    this.selectedDocument = null;
    this.sourceIDs.push(this.source.id);
    this.saved.emit({
      val: this.formVariables.sources, variable: {
        sources:
          { value: JSON.stringify(this.sourceIDs).replace('"/g', '\\"'), type: 'Json' }
      }
    });
    this.getSources();
  }

  handleCancelButton() {
    this.canceled.emit(true);
  }

  subTypeSaved() {
    this.saved.emit(null);
  }
}
