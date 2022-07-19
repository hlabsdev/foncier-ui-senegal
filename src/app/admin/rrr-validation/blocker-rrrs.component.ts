import { TranslateService } from '@ngx-translate/core';
import { AlertService } from '@app/core/layout/alert/alert.service';
import { UtilService } from '@app/core/utils/util.service';
import { RowSizes } from '@app/core/models/rowSize.model';
import { Component, Input, OnInit } from '@angular/core';
import { BlockerRRR } from './model/blocker-rrr.model';
import Utils from '@app/core/utils/utils';
import * as _ from 'lodash';
import { RRRValidation } from '@app/admin/rrr-validation/model/rrr-validation.model';

@Component({
  selector: 'app-blocker-rrrs',
  templateUrl: './blocker-rrrs.component.html'
})
export class BlockerRRRsComponent implements OnInit {

  @Input() rrrValidation: RRRValidation;
  @Input() readOnly: Boolean;

  rowSizes: any = RowSizes;
  blockerRRRs: BlockerRRR[];
  blockerRRR: any = null;
  cols: any[];
  errorMessage: string;

  constructor(
    private translateService: TranslateService,
    private utilService: UtilService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.blockerRRRs = [];
    this.loadBlockerRRRs();

    this.cols = [
      // { field: 'rrrValidationId',        header: this.translateService.instant('RRR_VALIDATION.BLOCKER_RRR.rrrvalidationid') },
      { field: 'blockerRRRValidationId', header: this.translateService.instant('RRR_VALIDATION.BLOCKER_RRR.ROLE') },
      { field: 'requireConfirmation', header: this.translateService.instant('RRR_VALIDATION.BLOCKER_RRR.REQUIRE') },
    ];

  }

  loadBlockerRRRs() {
    // TODO:  commented for te future use of blocker rrrs
  }

  showBlockerRRRElementDialogue(blockerRRR: BlockerRRR = new BlockerRRR({})): void {
    this.blockerRRR = blockerRRR;
  }

  saveBlockerRRR(blockerRRR) {

    if (!blockerRRR.id) {
      blockerRRR.id = Utils.uuidv4();
      this.rrrValidation.blockerRRRs.push(blockerRRR);
    } else {
      _.remove(this.rrrValidation.blockerRRRs, br => br.id === blockerRRR.id);
      this.rrrValidation.blockerRRRs.push(blockerRRR);
    }

    this.alertService.success('RRR_VALIDATION.MESSAGES.SAVE_SUCCESS');
    this.loadBlockerRRRs();
    this.blockerRRR = null;
  }

  canceled() {
    this.loadBlockerRRRs();
    this.blockerRRR = null;
  }

  removeBlockerRRR(blockerRRR) {
    this.utilService.displayConfirmationDialogWithMessageParameters(
      'RRR_VALIDATION.MESSAGES.CONFIRM_DELETE',
      { blockerRRR: blockerRRR.blockerRRRValidationId }, () => {
        _.remove(this.rrrValidation.blockerRRRs, br => br.id === blockerRRR.id);
        this.alertService.success('RRR_VALIDATION.MESSAGES.DELETE_SUCCESS');
      }, () => { });
  }

}
