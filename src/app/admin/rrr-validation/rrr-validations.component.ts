import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '@app/core/layout/alert/alert.service';
import { LocaleDatePipe } from '@app/core/utils/localeDate.pipe';
import { SpecificTimezone } from '@app/core/utils/specificTimezone.pipe';
import { TranslateService } from '@ngx-translate/core';
import { UtilService } from '@app/core/utils/util.service';
import { RowSizes } from '@app/core/models/rowSize.model';
import { Variables } from '@app/core/models/variables.model';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormTemplateBaseComponent } from '@app/workstation/baseForm/form-template-base.component';
import { FormVariables } from '@app/workstation/baseForm/formVariables.model';
import { BAUnit } from '@app/workstation/baUnit/baUnit.model';
import { RRRTypes } from '@app/workstation/rrr/rrrType.model';
import { RRRValidation } from './model/rrr-validation.model';
import { RRRValidationService } from './service/rrr-validation.service';
import { RRRValidationTransaction } from './model/rrr-validation-transaction.model';

@Component({
  selector: 'app-rrr-validations',
  templateUrl: 'rrr-validations.component.html',
  providers: [LocaleDatePipe, SpecificTimezone]
})

export class RRRValidationsComponent extends FormTemplateBaseComponent implements OnInit, OnChanges {

  @Output() add = new EventEmitter<RRRValidation>();
  @Output() saved = new EventEmitter<{ val: BAUnit, variable: Variables }>();

  @Output() selectedRRRValidation = new EventEmitter<{
    rrrValidation: RRRValidation, checked: boolean,
    requiredRRR: boolean
  }>();

  @Input() formVariables: FormVariables = new FormVariables({});
  @Input() options;
  @Input() selectedOptions: RRRValidationTransaction[];

  _options = {
    add: true,
    delete: true
  };

  rrrValidationsUrl: boolean;
  rrrValidations: RRRValidation[];
  rrrValidation: RRRValidation;
  search: string;
  rowSizes: any = RowSizes;
  cols: any[];
  baUnit: BAUnit = null;
  persistToDb: boolean;

  // preloader message
  preloaderMessage = '... loading ...';

  constructor(
    private rrrValidationService: RRRValidationService,
    public utilService: UtilService,
    protected router: Router,
    public translateService: TranslateService,
    private alertService: AlertService,
    private ngxLoader: NgxUiLoaderService
  ) {
    super();
  }

  ngOnInit(): void {
    this.rrrValidationsUrl = (this.router.url === '/rrr-validations');

    if (this.formVariables.baUnit) {
      this.baUnit = new BAUnit(this.formVariables.baUnit);
    } else { this.persistToDb = true; }

    this.cols = [
      { field: 'label', header: this.translateService.instant('RRR_VALIDATION.LABEL') },
      { field: 'rrrType', header: this.translateService.instant('RRR_VALIDATION.RRR_TYPE') },
      { field: 'subType', header: this.translateService.instant('RRR_VALIDATION.TYPE') },
      { field: 'type', header: this.translateService.instant('RRR_VALIDATION.CLASSIFICATION') }
    ];

    this.loadRRRValidations();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.options) {
      const keys = Object.keys(this.options);
      for (const key of keys) {
        this._options[key] = this.options[key] || (this.options[key] === false ? false : this._options[key]);
      }
    }
  }

  loadRRRValidations(search: string = '') {
    const args = {
      search: search
    };

    // preloading init
    this.ngxLoader.start();

    this.rrrValidationService.getRRRValidations(args).subscribe(results => {


      this.rrrValidations = results;

      // setting the preloader message
      this.preloaderMessage = this.getPreloaderMessage();

      // stopping the preloading
      this.ngxLoader.stop();

      this.rrrValidations.forEach(rrrValidation => {

        if (rrrValidation.rrrType === RRRTypes.RIGHT) {
          rrrValidation['subType'] = this.translateService.instant(`RRR.RIGHT_TYPES.${rrrValidation.rightType}`);
        } else if (rrrValidation.rrrType === RRRTypes.RESTRICTION) {
          rrrValidation['subType'] = this.translateService.instant(`RRR.RESTRICTION_TYPES.${rrrValidation.restrictionType}`);
        } else {
          rrrValidation['subType'] = this.translateService.instant(`RRR.RESPONSIBILITY_TYPES.${rrrValidation.responsibilityType}`);
        }
        rrrValidation['haveAssociatedTransactions'] = rrrValidation.rrrValidationTransactions.length > 0;
        rrrValidation['checked'] = !!(this.selectedOptions && this.selectedOptions
          .find(item => item.rrrValidation.id === rrrValidation.id));
        rrrValidation['requiredRRR'] = !!(this.selectedOptions && this.selectedOptions
          .find(item => item.rrrValidation.id === rrrValidation.id && item.requiredRRR));
      });
    });
  }

  getPreloaderMessage() {
    if (this.rrrValidations.length === 0) {
      return '...';
    } else if (this.rrrValidations.length === 1) {
      return (this.translateService.instant('PRELOADER.ONE_MOMENT')
        + ', ' + this.rrrValidations.length + ' ' + this.translateService.instant('PRELOADER.RRR_VALIDATION')
        + ' ' + this.translateService.instant('PRELOADER.IS_LOADING') + '.');
    } else {
      return (this.translateService.instant('PRELOADER.ONE_MOMENT')
        + ', ' + this.rrrValidations.length + ' ' + this.translateService.instant('PRELOADER.RRR_VALIDATIONS')
        + ' ' + this.translateService.instant('PRELOADER.ARE_LOADING') + '.');
    }
  }

  showRRRValidationDialogue(rrrValidation = null): void {
    this.rrrValidation = rrrValidation ? rrrValidation : new RRRValidation();
  }

  saveRRRValidation(rrrValidation) {
    if (rrrValidation.id) {
      // update

      this.rrrValidationService.updateRRRValidation(rrrValidation)
        .subscribe((response: RRRValidation) => {
          this.cancelRRRValidation();
          this.loadRRRValidations();
        },
          err => this.alertService.error('RRR_VALIDATION.MESSAGES.UPDATE_ERROR')
        );
    } else {
      // create

      this.rrrValidationService.createRRRValidation(rrrValidation)
        .subscribe((response: RRRValidation) => {
          this.cancelRRRValidation();
          this.loadRRRValidations();
        },
          err => this.alertService.error('RRR_VALIDATION.MESSAGES.CREATE_ERROR')
        );
    }
  }

  removeRRRValidation(rrrValidation) {
    this.utilService.displayConfirmationDialog('MESSAGES.CONFIRM_DELETE', () => {

      this.rrrValidationService.deleteRRRValidation(rrrValidation).subscribe(() => {
        this.loadRRRValidations();
      });

    });
  }

  cancelRRRValidation() {
    this.rrrValidation = null;
  }

  selectRRRValidation(rrrValidation) {

    rrrValidation.requiredRRR = rrrValidation.checked && rrrValidation.requiredRRR;

    this.selectedRRRValidation.emit({
      rrrValidation: rrrValidation, checked: rrrValidation.checked, requiredRRR: rrrValidation.requiredRRR
    });
  }

}
