import { OnInit, Component, Input, Output, EventEmitter } from '@angular/core';
import { DataService } from '@app/data/data.service';
import { FormVariables } from '@app/workstation/baseForm/formVariables.model';
import { BAUnit } from '@app/workstation/baUnit/baUnit.model';
import { BAUnitService } from '@app/workstation/baUnit/baUnit.service';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';
import { Observable, of } from 'rxjs';
import { FieldConfig } from '@app/core/models/field.model';
import { GenericDocument } from '@app/core/models/genericDocument.model';
import { Task } from '@app/core/models/task.model';
import { TransactionInstance } from '@app/core/models/transactionInstance.model';
import { Variables, VariableValue } from '@app/core/models/variables.model';
import { AlertService } from '@app/core/layout/alert/alert.service';
import { UtilService } from '@app/core/utils/util.service';
import { ContentService } from '@app/core/services/content.service';
import { FormService } from '@app/core/services/form.service';
import { TransactionHistoryService } from '@app/core/services/transactionHistory.service';
import { TransactionInstanceService } from '@app/core/services/transactionInstance.service';
import { TaskService } from '@app/core/services/task.service';
import { ProcessService } from '@app/core/services/process.service';
import { Form } from '@app/core/models/form.model';
import { FormType } from '@app/core/models/form-type.model';
import { Any } from 'typeorm';
import { ProcessInstance } from '@app/core/models/processInstance.model';

@Component({
  selector: 'app-document-complementary',
  template: `<app-document-complementary-form *ngIf="documentComplementary && formConfig"
  [readOnly]="readOnly" [formVariables]="formVariables"
  [documentComplementary]="documentComplementary"  [config]="formConfig"
  (cancelButtonClicked)="cancel()" (saveButtonClicked)="save($event)" [errorMessage]="errorMessage">
  </app-document-complementary-form>`
})
export class DocumentComplementaryInfoComponent implements OnInit {

  @Input() readOnly: Boolean = false;
  @Input() formVariables: FormVariables = new FormVariables({});
  @Input() task: Task;
  @Output() saved = new EventEmitter<{ documentComplementary: any, variable: Variables }>();
  @Output() canceled = new EventEmitter<any>();

  title: string;
  fieldValues: any;
  documentComplementary: any = {};
  formConfig: FieldConfig[];
  errorMessage: string;
  transactionInstance: TransactionInstance;
  form: Form = {
    prepareChildForms: function (): Form {
      throw new Error('Function not implemented.');
    }
  };
  processId: string;
  processInstanceId: string;
  valSection: string;



  constructor(
    protected alertService: AlertService,
    protected utilService: UtilService,
    protected formService: FormService,
    protected contentService: ContentService,
    private processService: ProcessService,
    protected baUnitService: BAUnitService,
  ) { }

  ngOnInit(): void {

    this.processInstanceId = this.task.processInstanceId;
    this.getFormFields();
  }
  save(documentComplementary: any) {
    const val = new VariableValue();
    val.type = 'Json';
    val.value = JSON.stringify(documentComplementary);
    this.putVariables(this.formVariables.documentComplementarySection, val);
  }

  getFormFields() {
    this.processService.getInstanceVariablesByProcessInstanceId(this.processInstanceId).pipe(map((val: any) => {
      this.form.name = 'DOCUMENT_COMPLEMENTARY_FORM';
      this.form.body = val.DOCUMENT_COMPLEMENTARY_FORM.value;
      this.form.type = FormType.LIST_FORM;
      const formField = this.utilService.getFormFieldConfig(this.form);
      this.formConfig = formField;

      if (val[this.formVariables.documentComplementarySection]?.value) {

        this.documentComplementary = JSON.parse(val[this.formVariables.documentComplementarySection]?.value);

      }

    })).subscribe();
  }

  cancel() {
    this.canceled.emit(this.documentComplementary);
  }

  private putVariables = (varName: string, Value: VariableValue) =>
    this.processService.putInstanceVariable(this.processInstanceId, varName, Value)
      .subscribe(resp => {
        this.alertService.success();
        this.formVariables.documentComplementary = Value.value;
      })

}
