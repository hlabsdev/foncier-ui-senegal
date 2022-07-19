import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '@app/core/layout/alert/alert.service';
import { Process } from '@app/core/models/process.model';
import { ProcessInstance } from '@app/core/models/processInstance.model';
import { RowSizes } from '@app/core/models/rowSize.model';
import { Transaction } from '@app/core/models/transaction.model';
import { TransactionInstance } from '@app/core/models/transactionInstance.model';
import { DeploymentService } from '@app/core/services/deployment.service';
import { ProcessService } from '@app/core/services/process.service';
import { TransactionInstanceService } from '@app/core/services/transactionInstance.service';
import { ErrorResult } from '@app/core/utils/models/errorResult.model';
import { LocaleDatePipe } from '@app/core/utils/localeDate.pipe';
import { UtilService } from '@app/core/utils/util.service';
import { ValidationService } from '@app/core/utils/validation.service';
import { TranslateService } from '@ngx-translate/core';
import WorkFlowUtils from '@app/core/utils/workflow.utils';
import BpmnModdle from 'bpmn-moddle';
import * as _ from 'lodash';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { forkJoin, from } from 'rxjs';
import { map, mergeMap, switchMap, tap, toArray } from 'rxjs/operators';

@Component({
  selector: 'app-processes',
  templateUrl: './processes.component.html',
  providers: [LocaleDatePipe]
})
export class ProcessesComponent implements OnInit {
  instance: ProcessInstance;
  processes: Process[];
  rowSizes: any = RowSizes;
  cols: any[];
  deployment: any;
  displayUploader: boolean;
  errorMessage: string;
  bpmModdle = new BpmnModdle();
  @ViewChild('form') form: NgForm;

  // preloader message
  preloaderMessage = '... loading ...';

  constructor(
    private translateService: TranslateService,
    private processService: ProcessService,
    private transactionInstanceService: TransactionInstanceService,
    private deploymentService: DeploymentService,
    private validationService: ValidationService,
    private alertService: AlertService,
    private datePipe: LocaleDatePipe,
    private utils: UtilService,
    private router: Router,
    private ngxLoader: NgxUiLoaderService
  ) {
  }

  ngOnInit(): void {
    this.setDefaultDeploymentName();
    this.loadProcesses();
  }

  setDefaultDeploymentName() {
    const deploymentName = this.translateService.instant('DEPLOYMENT.NEW');
    this.deployment = { name: `${deploymentName} ${this.datePipe.transform(new Date())}`, files: [] };
  }

  loadProcesses() {
    // preloading
    this.ngxLoader.start();
    this.processService.getProcesses({ latestVersion: true })
      .pipe(
        switchMap(processes => from(processes)),
        mergeMap((process: Process) => forkJoin([this.deploymentService.getDeploymentById(process.deploymentId)])
          .pipe(map(data => ({ process, deploymentId: data[0] })))
        ))
      .pipe(tap((data: any) => data.process.deploymentName = data.deploymentId.name))
      .pipe(tap((data: any) => data.process.deploymentDate = data.deploymentId.deploymentTime))
      // need to insert a translation function to translate the date to the format we use
      .pipe(map((data: any) => data.process))
      .pipe(toArray())
      .subscribe(processes => {

          this.processes = processes;

          // setting the preloader message
          this.preloaderMessage = this.getPreloaderMessage();

          // stopping the preloading
          this.ngxLoader.stop();

          this.cols = [
            { field: 'name', header: this.translateService.instant('PROCESS.NAME') },
            { field: 'deploymentName', header: this.translateService.instant('DEPLOYMENT.NAME') },
            { field: 'key', header: this.translateService.instant('PROCESS.KEY') },
            { field: 'resource', header: this.translateService.instant('PROCESS.RESOURCE') },
            { field: 'version', header: this.translateService.instant('PROCESS.VERSION') },
            { field: 'deploymentDate', header: this.translateService.instant('DEPLOYMENT.DEPLOYMENT_DATE') }
          ];
        },
        err => {
          // stopping the preloading
          this.ngxLoader.stop();
          this.alertService.camundaError(err);
        }
      );
  }

  getPreloaderMessage() {
    if (this.processes.length === 0) {
      return '...';
    } else if (this.processes.length === 1) {
      return (this.translateService.instant('PRELOADER.ONE_MOMENT')
        + ', ' + this.processes.length + ' ' + this.translateService.instant('PRELOADER.PROCESS')
        + ' ' + this.translateService.instant('PRELOADER.IS_LOADING') + '.');
    } else {
      return (this.translateService.instant('PRELOADER.ONE_MOMENT')
        + ', ' + this.processes.length + ' ' + this.translateService.instant('PRELOADER.PROCESSES')
        + ' ' + this.translateService.instant('PRELOADER.ARE_LOADING') + '.');
    }
  }

  add(): void {
    this.router.navigate([`deployment`]);
  }

  start(process: Process): void {
    this.instance = null;

    this.processService.getStartForm(process).subscribe(startForm => {
        if (startForm.key) {
          return this.alertService.warning('MESSAGES.START_PROCESS_NEEDS_FORM');
        }

        this.processService.startProcess(process)
          .subscribe(instance => {
              if (!instance) {
                return this.alertService.error('MESSAGES.START_PROCESS_FAILED');
              }

              this.instance = new ProcessInstance(instance);

              const transactionInstance = new TransactionInstance();

              transactionInstance.transaction = new Transaction({
                id: '35e6173c-37bc-4800-bed1-2b236fd86bf7',
                name: 'grantOfFreehold',
                workflowProcessId: 'grantOfFreehold:14:68b9483a-8377-11e8-b8cb-0242ac110002',
                initialContext: '{}'
              });

              transactionInstance.workflowProcessInstanceId = instance.id;

              this.transactionInstanceService.addTransactionInstance(transactionInstance).subscribe(result => {
                  this.alertService.success('MESSAGES.START_PROCESS_SUCCESS');
                },
                err => {
                  if (this.instance) {
                    this.delete(this.instance);
                  }

                  this.alertService.camundaError(err);
                });
            },
            err => this.alertService.camundaError(err));

      },
      err => this.alertService.camundaError(err));
  }

  delete(instance) {
    this.processService.deleteInstance(instance)
      .subscribe(val => {
        },
        err => this.alertService.camundaError(err));
  }

  refresh() {
    this.loadProcesses();
    this.resetDeployment();
    this.alertService.success('MESSAGES.CONTENT_REFRESHED');
  }

  addFiles(event) {
    this.deployment.files = event.files;
  }

  save(form: NgForm) {
    this.errorMessage = null;

    if (form.invalid || _.isEmpty(this.deployment.files)) {
      if (_.isEmpty(this.deployment.files)) {
        return this.errorMessage = new ErrorResult('MESSAGES.FILE_UPLOAD_MANDATORY').toMessage();
      }
      const errorResult = this.validationService.validateForm(form);
      return this.errorMessage = errorResult.toMessage();
    }

    WorkFlowUtils
      .validateBpmnFiles(this.deployment.files)
      .subscribe(invalidForms => {
          if (!_.isEmpty(invalidForms)) {
            return this.errorMessage = new ErrorResult(`MESSAGES.FORM_KEY_ERROR`, { parameter: invalidForms }).toMessage();
          }

          this.deploymentService
            .createDeployment(this.deployment)
            .subscribe(() => {
                this.alertService.success('MESSAGES.PROCESS_DEPLOYED');
                this.refresh();
              },
              error => this.alertService.camundaError(error)
            );
        },
        error => {

          this.errorMessage = error.toMessage();

        }
      );
  }

  resetDeployment() {
    this.errorMessage = null;
    this.displayUploader = false;
    if (this.form) {
      this.form.reset();
    }
    this.setDefaultDeploymentName();
    this.displayUploader = false;
  }

  downloadBPNMFile(process: Process): void {
    const fileName = process.resource;
    this.processService.getProcessDiagram(process).subscribe(val => {
      return saveAs(val, fileName);
    });
  }
}
