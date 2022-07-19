import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '@app/core/layout/alert/alert.service';
import { ProcessInstance } from '@app/core/models/processInstance.model';
import { RowSizes } from '@app/core/models/rowSize.model';
import { Transaction } from '@app/core/models/transaction.model';
import { TransactionInstance } from '@app/core/models/transactionInstance.model';
import { User } from '@app/core/models/user.model';
import { ProcessService } from '@app/core/services/process.service';
import { TaskService } from '@app/core/services/task.service';
import { TransactionInstanceService } from '@app/core/services/transactionInstance.service';
import { TransactionService } from '@app/core/services/transaction.service';
import { UserService } from '@app/core/services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { AccessRights } from '@app/core/models/accessRight';
import * as _ from 'lodash';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html'
})
export class TransactionsComponent implements OnInit {
  instance: ProcessInstance;
  transactions: Transaction[];
  rowSizes: any = RowSizes;
  cols: any[];
  displayUploader: boolean;
  task: any;
  user: User;
  hasSystemAdministratorAccess: boolean;
  hasManuallyStartTransactionAccess: boolean;

  // preloader message
  preloaderMessage = '... loading ...';

  constructor(
    private translateService: TranslateService,
    private transactionService: TransactionService,
    private transactionInstanceService: TransactionInstanceService,
    private processService: ProcessService,
    private alertService: AlertService,
    private router: Router,
    private userService: UserService,
    private taskService: TaskService,
    private ngxLoader: NgxUiLoaderService
  ) {
    this.user = this.userService.getCurrentUser();
    this.hasSystemAdministratorAccess = this.user.hasPermission(AccessRights.SYSTEM_ADMINISTRATOR);
    this.hasManuallyStartTransactionAccess = this.user.hasPermission(AccessRights.MANUALLY_START_TRANSACTION);
  }

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions() {
    // preloading init
    this.ngxLoader.start();
    this.transactionService.getTransactions().subscribe(transactions => {
      this.transactions = transactions;

      // setting the preloader message
      this.preloaderMessage = this.getPreloaderMessage();

      // stopping the preloading
      this.ngxLoader.stop();

      this.cols = [
        { field: 'name', header: this.translateService.instant('TRANSACTION.NAME') },
        { field: 'role', header: this.translateService.instant('TRANSACTION.LEVEL') }
      ];

      if (this.hasSystemAdministratorAccess && this.hasManuallyStartTransactionAccess) {

      } else {
        if (this.hasSystemAdministratorAccess) {
          this.transactions = this.transactions.filter(transaction => transaction.role === AccessRights.SYSTEM_ADMINISTRATOR);
        } else if (this.hasManuallyStartTransactionAccess) {
          this.transactions = this.transactions.filter(transaction => transaction.role === AccessRights.MANUALLY_START_TRANSACTION);
        }
        this.cols = [
          { field: 'name', header: this.translateService.instant('TRANSACTION.NAME') }
        ];
      }
    }, err => {
      // stopping the preloading
      this.ngxLoader.stop();
      this.alertService.apiError(err);
    });
  }

  getPreloaderMessage() {
    if (this.transactions.length === 0) {
      return '...';
    } else if (this.transactions.length === 1) {
      return (this.translateService.instant('PRELOADER.ONE_MOMENT')
        + ', ' + this.transactions.length + ' ' + this.translateService.instant('PRELOADER.TRANSACTION')
        + ' ' + this.translateService.instant('PRELOADER.IS_LOADING') + '.');
    } else {
      return (this.translateService.instant('PRELOADER.ONE_MOMENT')
        + ', ' + this.transactions.length + ' ' + this.translateService.instant('PRELOADER.TRANSACTIONS')
        + ' ' + this.translateService.instant('PRELOADER.ARE_LOADING') + '.');
    }
  }

  add(): void {
    this.router.navigate([`transaction`]);
  }

  edit(transaction: Transaction): void {
    this.router.navigate(['transaction', transaction.id]);
  }

  start(transaction: Transaction): void {
    this.instance = null;


    this.processService.getStartFormById(transaction.workflowProcessId)
      .subscribe(startForm => {
        if (startForm.key) {
          return this.alertService.warning('MESSAGES.START_PROCESS_NEEDS_FORM');
        }

        this.processService.startProcessById(transaction.workflowProcessId, transaction)
          .pipe(switchMap(instance => {
            if (!instance) {
              return of(this.alertService.error('MESSAGES.START_PROCESS_FAILED'));
            }
            this.instance = instance;
            this.transactionInstanceService.addTransactionInstance(
              new TransactionInstance({ transaction, workflowProcessInstanceId: instance.id }))
              .subscribe(() => {
                this.processService.putInstanceVariableAsString(instance.id, 'rootProcessInstanceId', instance.id)
                  .subscribe(() => {
                    this.processService.getInstanceVariable(instance, 'titleNumber').subscribe(resp => {
                      this.alertService.success('MESSAGES.START_PROCESS_SUCCESS');
                    }, err => {
                      this.processService.putInstanceVariableAsString(instance.id, 'titleNumber', '')
                      .subscribe(() => this.alertService.success('MESSAGES.START_PROCESS_SUCCESS'));
                    }
                    );
                  });
              },
                err => {
                  if (this.instance) {
                    this.deleteProcessInstance(this.instance);
                  }

                  this.alertService.apiError(err);
                });
            return this.taskService.getTasks({ processInstanceId: instance.id });
          }))
          .subscribe(task => {
            this.task = task[0];
            this.alertService.success('MESSAGES.START_PROCESS_SUCCESS');
            this.user = this.userService.getCurrentUser();

            // go to the task only if there is a task.
            if (this.task) {

              this.taskService.getTaskIdentityLink(this.task)
                .subscribe(identityLinks => {

                  // if user assigned to task.
                  if (this.user.username === this.task.assignee) {
                    return this.router.navigate([`tasks-list`, this.task.id]);
                  }

                  // check for user is belongs to candidate user or group of task.
                  const isCandidate = !_.isEmpty(identityLinks.filter(identityLink => {
                    const condition = identityLink.type === 'candidate' && _.includes(this.user.roles, identityLink.groupId)
                      || identityLink.userId === this.user.username && identityLink.type === 'candidate';
                    if (condition) {
                      return true;
                    } else {
                      return false;
                    }

                  }));

                  // if task is not assigned to given User.
                  const isClaimedByOtherUser = !_.isEmpty(identityLinks.filter(identityLink =>
                    (identityLink.type === 'assignee' && identityLink.userId !== this.user.username) ? true : false));

                  if (isClaimedByOtherUser && isCandidate) {
                    this.taskService.reclaim(this.task, this.user).subscribe(rt => this.router.navigate([`tasks-list`, this.task.id]));
                  } else if (isCandidate) {
                    this.taskService.claimTask(this.task, this.user).subscribe(rt => this.router.navigate([`tasks-list`, this.task.id]));
                  }
                });

            }

          });

      });

  }

  deleteProcessInstance(instance) {
    this.processService.deleteInstance(instance)
      .subscribe(() => {
      },
        err => this.alertService.camundaError(err));
  }
}
