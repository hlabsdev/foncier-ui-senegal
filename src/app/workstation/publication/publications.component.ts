import { FormTemplateBaseComponent } from '@app/workstation/baseForm/form-template-base.component';
import { PublicationService } from '@app/core/services/publication.service';
import { Publication } from '@app/core/models/publication.model';
import { Router } from '@angular/router';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AlertService } from '@app/core/layout/alert/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { ErrorResult } from '@app/core/utils/models/errorResult.model';
import { LocaleDatePipe } from '@app/core/utils/localeDate.pipe';
import { UtilService } from '@app/core/utils/util.service';
import { RowSizes } from '@app/core/models/rowSize.model';
import * as _ from 'lodash';
import { FormVariables } from '@app/workstation/baseForm/formVariables.model';

@Component({
  templateUrl: 'publications.component.html',
  selector: 'app-publications',
  providers: [LocaleDatePipe]
})

export class PublicationsComponent extends FormTemplateBaseComponent implements OnInit {

  @Input() formVariables: FormVariables = new FormVariables({});
  @Input() picker = false;
  @Input() publication: Publication;
  @Input() publications: Publication[];

  @Output() add = new EventEmitter<Publication>();
  @Output() publicationPickerSave = new EventEmitter<any>();
  @Output() publicationPickerDelete = new EventEmitter<any>();

  publicationUrl: boolean;
  sameEndPointRoute: boolean;
  rowSizes: any = RowSizes;
  cols: any[];
  persistToDb: boolean;
  errorMessage: string;

  constructor(
    private publicationService: PublicationService,
    public translateService: TranslateService,
    protected router: Router,
    private alertService: AlertService,
    private datePipe: LocaleDatePipe,
    private utilService: UtilService
  ) { super(); }

  ngOnInit(): void {
    this.publicationUrl = (this.router.url === '/publications');
    this.sameEndPointRoute = this.router.url.includes('/publications');

    if (!this.formVariables.baUnit.uid && !this.sameEndPointRoute) {
      this.errorMessage = new ErrorResult('MESSAGES.BA_UNIT_REQUIRED').toMessage();
      return;
    }

    this.getPublications();
  }

  getPublications(search: string = '') {
    const args = {
      baUnitId: this.formVariables.baUnit.uid,
      baUnitIdVersion: this.formVariables.baUnit.version
    };

    const getPubs$ = this.sameEndPointRoute ? this.publicationService.getPublications()
      : this.publicationService.getPublicationsByBaUnit(args);

    getPubs$.subscribe(result => {
      this.publications = [];

      for (const publication of result) {
        publication['dateFormatted'] = this.datePipe.transform(publication.date, 'shortDate');
        this.publications.push(publication);
      }

      this.cols = [
        { field: 'target.description', header: this.translateService.instant('PUBLICATION.TARGET') },
        { field: 'name.description', header: this.translateService.instant('PUBLICATION.NAME') },
        { field: 'number', header: this.translateService.instant('PUBLICATION.NUMBER') },
        { field: 'dateFormatted', header: this.translateService.instant('PUBLICATION.DATE') }
      ];

      if (this.sameEndPointRoute) {
        this.cols.splice(0, 0, { field: 'titleNumber', header: this.translateService.instant('PUBLICATION.TITLE_NUMBER') }
          , { field: 'applicationNumber', header: this.translateService.instant('PUBLICATION.APPLICATION_NUMBER') });
      }
    }, err => this.alertService.apiError(err));
  }

  showPublicationDialog(publication = null): void {
    this.publication = publication ? publication : new Publication();
  }

  savePublication(publication) {
    const index = _.findIndex(this.publications, this.publication);
    if (index > -1) {
      this.publications[index] = publication.val;
    } else {
      this.publications.push(publication.val);
    }
    this.cancelPublication();
    this.getPublications();
  }

  removePublication(publication: Publication) {
    this.utilService.displayConfirmationDialog('MESSAGES.CONFIRM_DELETE', () => {
      this.removePublicationAction(publication);
    });
  }

  removePublicationAction(publication: Publication) {
    const index = _.findIndex(this.publications, publication);
    if (index > -1) {
      this.publications.splice(index, 1);
    }
    this.publicationService.deletePublication(publication.id);
  }

  cancelPublication() {
    this.publication = null;
  }

}
