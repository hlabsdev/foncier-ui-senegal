import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '@app/core/layout/alert/alert.service';
import { RowSizes } from '@app/core/models/rowSize.model';
import { Variables } from '@app/core/models/variables.model';
import { PartyService } from '@app/core/services/party.service';
import { LocaleDatePipe } from '@app/core/utils/localeDate.pipe';
import { SpecificTimezone } from '@app/core/utils/specificTimezone.pipe';
import { UtilService } from '@app/core/utils/util.service';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { of } from 'rxjs';
import { FormTemplateBaseComponent } from '@app/workstation/baseForm/form-template-base.component';
import { FormVariables } from '@app/workstation/baseForm/formVariables.model';
import { BAUnit } from '@app/workstation/baUnit/baUnit.model';
import { RRR } from './rrr.model';
import { RRRService } from './rrr.service';
import { isNull } from 'lodash';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  templateUrl: 'rrrs.component.html',
  selector: 'app-rrrs',
  providers: [LocaleDatePipe, SpecificTimezone]
})

export class RRRsComponent extends FormTemplateBaseComponent implements OnInit, OnChanges {
  @Output() add = new EventEmitter<RRR>();
  @Output() saved = new EventEmitter<{ val: BAUnit, variable: Variables }>();
  @Input() formVariables: FormVariables = new FormVariables({});
  @Input() options;
  @Input() isAdmin = false;
  _options = {
    add: true,
    delete: true
  };

  rrrsUrl: boolean;
  sameEndPointRoute: boolean;
  rrrs: RRR[];
  rrr: RRR;
  search: string;
  rowSizes: any = RowSizes;
  cols: any[];
  baUnit: BAUnit = null;
  persistToDb: boolean;
  hideDeleteButton: boolean;

  constructor(
    private rrrservice: RRRService,
    public utilService: UtilService,
    protected partyService: PartyService,
    protected router: Router,
    public translateService: TranslateService,
    private alertService: AlertService,
    private datePipe: LocaleDatePipe,
    private specificTimezone: SpecificTimezone,
    private ngxloader: NgxUiLoaderService,
  ) { super(); }

  ngOnInit(): void {
    this.rrrsUrl = ((this.router.url === '/rrrs') || this.router.url.includes('ba-unit'));
    this.sameEndPointRoute = this.router.url.includes('/rrrs');
    if (this.formVariables.baUnit) {
      this.baUnit = new BAUnit(this.formVariables.baUnit);
    } else { this.persistToDb = true; }

    this.loadRRRs();
    this.hideDeleteButton = (this.formVariables.isReadOnly || this.rrrsUrl || !this._options.delete);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.options) {
      const keys = Object.keys(this.options);
      for (const key of keys) {
        this._options[key] = this.options[key] || (this.options[key] === false ? false : this._options[key]);
      }
    }
  }

  loadRRRs(search: string = '') {
    const args = {
      search: search
    };

    this.ngxloader.start();
    const rrrObs = this.sameEndPointRoute ? this.rrrservice.getRRRs(args) : of(this.baUnit.rrrs);
    rrrObs.subscribe(result => {
      const rrrs = result;
      this.rrrs = [];

      for (const rrr of rrrs) {
        rrr['rightTypeDescription'] = this.translateService.instant('CODELIST.VALUES.' + rrr['type']['value']);
        rrr['spatialUnitNumber'] = (rrr.getSpatialUnitType() !== 'undefined') ? rrr.spatialUnit.spatialUnitNumber : '';

        rrr['idParties'] = [];
        rrr['nameParties'] = [];
        rrr['rolParties'] = [];
        const parties = isNull(rrr.radiationDate) && (rrr.type.value === 'RIGHT_TYPE_OWNERSHIP' || rrr.type.value === 'RIGHT_TYPE_LEASE_CONCESSION')
          ? rrr.parties.filter(p => isNull(p.radiationDate)) : rrr.parties;

        for (const party of parties) {
          const partyName = party.getName();
          if (partyName) {
            rrr['nameParties'].push(party.getName());
            rrr['idParties'].push(party.extPID);
            rrr['rolParties'].push(this.translateService.instant('CODELIST.VALUES.' + party.partyRoleType.value));
          }
        }

        rrr['inscriptionSlip'] = rrr['inscriptionTransactionId'];
        rrr['inscriptionDate'] = this.datePipe.transform(this.specificTimezone.transform(rrr.inscriptionDate), 'shortDate');
        rrr['radiationSlip'] = rrr['radiationTransactionId'];
        rrr['radiationDate'] = this.datePipe.transform(this.specificTimezone.transform(rrr.radiationDate), 'shortDate');
        rrr['modDate'] = this.datePipe.transform(this.specificTimezone.transform(rrr.modDate), 'shortDate');

        this.rrrs.push(rrr);
      }

      this.rrrs = _.orderBy(this.rrrs, ['rightTypeDescription', 'inscriptionSlip'], ['asc', 'asc']);

      this.cols = [
        { field: 'rightTypeDescription', header: this.translateService.instant('RRR.RRR_TYPE'), width: '8%' },
        { field: 'spatialUnitNumber', header: this.translateService.instant('RRR.SPATIAL_UNITS'), width: '8%' },
        { field: 'idParties', header: this.translateService.instant('RRR.PARTY_ID'), width: '9%' },
        { field: 'nameParties', header: this.translateService.instant('RRR.PARTY_NAME'), width: '10%' },
        { field: 'rolParties', header: this.translateService.instant('RRR.PARTY_ROLE'), width: '10%' },
        { field: 'radiationDate', header: this.translateService.instant('RRR.RADIATION_DATE'), width: '10%' },
        { field: 'radiationSlip', header: this.translateService.instant('RRR.RADIATION_NUMBER'), width: '8%' },
        { field: 'inscriptionDate', header: this.translateService.instant('RRR.INSCRIPTION_DATE'), width: '10%' },
        { field: 'inscriptionSlip', header: this.translateService.instant('RRR.INSCRIPTION_NUMBER'), width: '8%' },
        { field: 'modDate', header: this.translateService.instant('RRR.MODIFICATION_DATE'), width: '10%' }
      ];

      this.stopLoader();
    }, err => {
      this.stopLoader();
      this.alertService.apiError(err);
    });
  }

  stopLoader() {
    this.ngxloader.stop();
  }

  showRRRDialogue(rrr = null): void {
    this.ngxloader.start();
    this.rrr = rrr ? rrr : new RRR();
  }

  saveRRR(rrr) {
    if (this.baUnit) {
      const index = _.findIndex(this.baUnit.rrrs, this.rrr);
      if (index > -1) {
        this.baUnit.rrrs[index] = rrr;
      } else {
        this.baUnit.rrrs.push(rrr);
      }
      this.saveToContext();
    }
    this.cancelRRR();
    this.loadRRRs();
  }

  removeRRR(rrr) {
    this.utilService.displayConfirmationDialog('MESSAGES.CONFIRM_DELETE', () => {
      this.removeRRRAction(rrr);
    });
  }

  removeRRRAction(rrr: RRR) {
    const index = _.findIndex(this.baUnit.rrrs, rrr);
    if (index > -1) {
      this.baUnit.rrrs.splice(index, 1);
      this.saveToContext();
    }
  }

  saveToContext() {
    if (this.formVariables.baUnit) {
      this.saved.emit({
        val: this.baUnit,
        variable: {
          baUnit:
            { value: JSON.stringify(this.baUnit).replace('"/g', '\\"'), type: 'Json' }
        }
      });
    }
  }

  cancelRRR() {
    this.rrr = null;
  }

}
