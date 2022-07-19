import { Variables } from '@app/core/models/variables.model';
import { FormTemplateBaseComponent } from '@app/workstation/baseForm/form-template-base.component';
import { BAUnitService } from './baUnit.service';
import { BAUnit } from './baUnit.model';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AlertService } from '@app/core/layout/alert/alert.service';
import { UtilService } from '@app/core/utils/util.service';
import { TransactionService } from '@app/core/services/transaction.service';
import { ValidationService } from '@app/core/utils/validation.service';
import { Transaction } from '@app/core/models/transaction.model';
import * as _ from 'lodash';
import { SelectItem } from 'primeng/api';
import { Dialog } from 'primeng';
import { FormVariables } from '@app/workstation/baseForm/formVariables.model';

@Component({
  selector: 'app-ba-unit-init-transactions',
  templateUrl: 'baUnitSetBatchTransactions.component.html'
})

export class BAUnitSetBatchTransactionsComponent extends FormTemplateBaseComponent implements OnInit {
  @Input() formVariables: FormVariables;
  @Output() saved = new EventEmitter<{ baUnit: BAUnit, variable: Variables }>();
  @Output() canceled = new EventEmitter<BAUnit>();
  baUnit: BAUnit = new BAUnit();
  numberOfProcesses: number;
  transaction: Transaction;
  showDialog: boolean;
  regBaUnits: BAUnit[];
  transactionTypes: SelectItem[];

  constructor(
    private baUnitService: BAUnitService,
    private utilService: UtilService,
    private alertService: AlertService,
    private transactionService: TransactionService,
    private validationService: ValidationService
  ) { super(); }

  ngOnInit(): void {
    this.loadTransactions();
    this.numberOfProcesses = this.formVariables.numberOfProcesses ? this.formVariables.numberOfProcesses : 1;
  }

  loadTransactions() {
    const transactionId = this.formVariables.transaction ? this.formVariables.transaction : null;
    this.utilService.mapToSelectItems(this.transactionService.getTransactions(), '', 'value.value')
      .subscribe((transactionTypes: SelectItem[]) => {
        this.transactionTypes = transactionTypes;
        transactionTypes.forEach(transaction => {
          if (transaction.value && transaction.value.id === transactionId) {
            this.transaction = transaction.value;
          }
        });
      },
        err => this.alertService.apiError(err));
  }

  reCenterDialog(dialog: Dialog) {
    // TODO :: CHECK IF WE STILL NEED THIS
    // dialog.center();
  }

  showBAUnitDialog() {
    this.showDialog = true;
  }

  hideBAUnitDialog() {
    this.showDialog = false;
  }

  updateBaUnit($event: {baUnit: BAUnit, variable: Variables}) {
    this.baUnit = $event.baUnit;

    // This i'm not sure it's the best way to solve it but for now it works
    const inputEntities = [this.baUnit];
    this.saved.emit({
      baUnit: this.baUnit,
      variable: {
        baUnit: { value: JSON.stringify(this.baUnit), type: 'Json' },
        inputEntities: { value: JSON.stringify(inputEntities), type: 'Json' },
        numberOfProcesses: { value: this.numberOfProcesses, type: 'String' },
        transactionId: { value: this.transaction.id, type: 'String' }
      }
    });
    this.alertService.success('API_MESSAGES.SAVE_SUCCESSFUL');
    this.hideBAUnitDialog();
  }

  save(form) {
    if (form.invalid) {
      const errorResult = this.validationService.validateForm(form);
      return this.alertService.error(errorResult.message);
    }

    const inputEntities = [this.baUnit];

    this.saved.emit({
      baUnit: this.baUnit,
      variable: {
        baUnit: { value: JSON.stringify(this.baUnit), type: 'Json' },
        inputEntities: { value: JSON.stringify(inputEntities), type: 'Json' },
        numberOfProcesses: { value: this.numberOfProcesses, type: 'String' },
        transactionId: { value: this.transaction.id, type: 'String' }
      }
    });
    this.alertService.success('API_MESSAGES.SAVE_SUCCESSFUL');

  }

  cancel() {
    this.canceled.emit(this.baUnit);
  }
}
