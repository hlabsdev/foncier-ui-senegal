import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '@app/core/layout/alert/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { UtilService } from '@app/core/utils/util.service';
import { RowSizes } from '@app/core/models/rowSize.model';
import * as _ from 'lodash';
import { FormTemplateBaseComponent } from '@app/workstation/baseForm/form-template-base.component';
import { FormVariables } from '@app/workstation/baseForm/formVariables.model';
import { ResponsibleParty } from '@app/core/models/responsibleParty.model';
import { BAUnit } from '@app/workstation/baUnit/baUnit.model';

@Component({
  templateUrl: './responsibleParties.component.html',
  selector: 'app-responsible-parties'
})
export class ResponsiblePartiesComponent extends FormTemplateBaseComponent implements OnInit {

  @Input() formVariables: FormVariables = new FormVariables({});
  @Input() responsibleParties: ResponsibleParty[] = [];
  @Output() saved = new EventEmitter<ResponsibleParty[]>();

  rowSizes: any = RowSizes;
  cols: any[];
  responsibleParty: ResponsibleParty = null;
  baUnit: BAUnit = null;

  constructor(
    protected router: Router,
    protected alertService: AlertService,
    public translateService: TranslateService,
    private utilService: UtilService) { super(); }

  ngOnInit(): void {
    if (this.formVariables.baUnit) {
      this.baUnit = new BAUnit(this.formVariables.baUnit);
    }
    this.loadResponsibleParties();
  }

  loadResponsibleParties() {
    this.cols = [
      { field: 'id', header: this.translateService.instant('RESPONSIBLE_PARTY.ID') },
      { field: 'individualName', header: this.translateService.instant('RESPONSIBLE_PARTY.INDIVIDUAL_NAME') },
      { field: 'organizationName', header: this.translateService.instant('RESPONSIBLE_PARTY.ORGANIZATION_NAME') },
      { field: 'role', header: this.translateService.instant('RESPONSIBLE_PARTY.ROLE') }
    ];
  }

  showResponsiblePartyDialogue(responsibleParty = null): void {
    this.responsibleParty = responsibleParty ? responsibleParty : new ResponsibleParty();
  }

  saveResponsibleParty(responsibleParty: ResponsibleParty) {
    const index = _.findIndex(this.responsibleParties, this.responsibleParty);
    if (index > -1) {
      this.responsibleParties[index] = responsibleParty;
    } else {
      this.responsibleParties.push(responsibleParty);
    }
    this.cancelResponsibleParty();
    this.loadResponsibleParties();
  }

  removeResponsibleParty(responsibleParty: ResponsibleParty) {
    this.utilService.displayConfirmationDialog('MESSAGES.CONFIRM_DELETE_SAVE_REQUIRED',
      () => {
        this.removeResponsiblePartyAction(responsibleParty);
      });
  }

  removeResponsiblePartyAction(responsibleParty: ResponsibleParty) {
    const index = _.findIndex(this.responsibleParties, responsibleParty);
    if (index > -1) {
      this.responsibleParties.splice(index, 1);
    }
  }
  save() {
  }

  cancelResponsibleParty() {
    this.responsibleParty = null;
  }
}
