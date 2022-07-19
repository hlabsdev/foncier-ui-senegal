import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '@app/core/layout/alert/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { DeploymentService } from '@app/core/services/deployment.service';
import { Deployment } from '@app/core/models/deployment.model';

@Component({
  templateUrl: './deployments.component.html',
})
export class DeploymentsComponent implements OnInit {
  deployments: Deployment[];
  cols: any[];

  constructor(
    private translateService: TranslateService,
    private deploymentService: DeploymentService,
    private alertService: AlertService,
    private router: Router) { }

  ngOnInit(): void {
    this.loadDeployments();
  }

  loadDeployments() {
    this.deploymentService.getDeployments().subscribe(deployments => {
      this.deployments = deployments;
      this.cols = [
        { field: 'id', header: this.translateService.instant('DEPLOYMENT.ID') },
        { field: 'name', header: this.translateService.instant('DEPLOYMENT.NAME') }
      ];
    },
      err => this.alertService.camundaError(err));
  }

  refresh() {
    this.loadDeployments();
    this.alertService.success('MESSAGES.CONTENT_REFRESHED');
  }
}
