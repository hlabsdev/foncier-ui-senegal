import { ApplicantService } from '@app/core/services/applicant.service';
import { Applicant } from '@app/core/models/applicant.model';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '@app/core/layout/alert/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { RowSizes } from '@app/core/models/rowSize.model';

@Component({
  selector: 'app-applicants',
  templateUrl: 'applicants.component.html'
})

export class ApplicantsComponent implements OnInit {

  applicantsUrl: boolean;
  applicants: Applicant[];
  rowSizes: any = RowSizes;
  cols: any[];

  constructor(
    private applicantService: ApplicantService,
    private router: Router,
    private alertService: AlertService,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.applicantsUrl = (this.router.url === '/applicants');
    this.getApplicants();
  }

  getApplicants() {
    this.applicantService.getApplicants()
      .subscribe(result => {
        this.applicants = result;

        this.cols = [
          { field: 'firstName', header: this.translateService.instant('APPLICANT.FIRST_NAME') },
          { field: 'lastName', header: this.translateService.instant('APPLICANT.LAST_NAME') },
        ];
      }, err => this.alertService.apiError(err));
  }

  editApplicant(applicant: Applicant): void {
    this.router.navigate(['applicant', applicant.id]);
  }

  addApplicant(): void {
    this.router.navigate(['applicant']);
  }
}

