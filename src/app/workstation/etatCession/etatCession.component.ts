import * as _ from 'lodash';
import { map } from 'rxjs/operators';

import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DataService } from '@app/data/data.service';

import { FormVariables } from '@app/workstation/baseForm/formVariables.model';
import { FieldConfig } from '@app/core/models/field.model';
import { Variables, VariableValue } from '@app/core/models/variables.model';
import { FormService } from '@app/core/services/form.service';
import { AlertService } from '@app/core/layout/alert/alert.service';
import { UtilService } from '@app/core/utils/util.service';
import { ValidationService } from '@app/core/utils/validation.service';
import { EtatCession } from '@app/core/models/etatCession.model';
import { EtatCessionService } from '@app/core/services/etatCession.service';
import { FormTemplateBaseComponent } from '../baseForm/form-template-base.component';
import { ProcessService } from '@app/core/services/process.service';
import { ProcessInstance } from '@app/core/models/processInstance.model';
import { EtatCessionFormComponent } from './etatCession.form.component';

const temporary = '_TEMPORARY';
const final = '_FINAL';
const current = '_CURRENT';
@Component({
  selector: 'app-etat-cession',
  templateUrl: 'etatCession.component.html'
})
export class EtatCessionComponent extends FormTemplateBaseComponent implements OnInit {
  @ViewChild(EtatCessionFormComponent) etatCessionFormComponent: EtatCessionFormComponent;
  @Input() formVariables: FormVariables = new FormVariables({});
  @Output() saved = new EventEmitter<{ val: EtatCession, variable: Variables }>();
  @Output() canceled = new EventEmitter<EtatCession>();

  etatCession: EtatCession;
  accessedByRouter: boolean;
  formConfig: FieldConfig[];
  formJsonName: string;
  formCustomizedName: string;
  tmpSomme: number;

  constructor(
    protected router: Router,
    protected etatCessionService: EtatCessionService,
    protected route: ActivatedRoute,
    protected alertService: AlertService,
    protected validationService: ValidationService,
    protected utilService: UtilService,
    protected formService: FormService,
    private dataService: DataService,
    private processService: ProcessService
  ) {
    super();
  }

  ngOnInit(): void {
    this.etatCession = new EtatCession();
    this.formCustomizedName = current;
    this.loadData();
    if (this.formVariables.formName === 'APP-ETAT-DE-CESSION'
    || this.formVariables.formName === 'APP-ETAT-DE-CESSION-FINAL') {
      this.formJsonName = 'ETAT_DE_CESSION_FORM_FULL';
    } else if (this.formVariables.formName === 'APP-ETAT-DE-CESSION-EXTRAIT-DE-PLAN') {
      this.formJsonName = 'ETAT_DE_CESSION_FORM';
    }
    if (this.formVariables.formName === 'APP-ETAT-DE-CESSION') {
      this.formCustomizedName = temporary;
    }
    if (this.formVariables.formName === 'APP-ETAT-DE-CESSION-FINAL') {
      this.formCustomizedName = final;
    }
    this.dataService
      .getFormByName(this.formJsonName)
      .pipe(map(form => this.utilService.getFormFieldConfig(form)))
      .subscribe(config => {
        this.formConfig = config;
      });
  }

  loadData() {
    const processInstance = new ProcessInstance();
    processInstance.id = this.task.processInstanceId;
    this.processService.getInstanceVariables(processInstance).subscribe(resp => {
      if (resp[this.formJsonName + this.formCustomizedName]?.value) {
        this.etatCession = JSON.parse(resp[this.formJsonName + this.formCustomizedName]?.value);
      } else if (resp[this.formJsonName + temporary]?.value) {
        this.etatCession = JSON.parse(resp[this.formJsonName + temporary]?.value);
      }
    });
  }
  save() {
    this.processService.deleteVariableFromInstance(this.task.processInstanceId, this.formJsonName
      + this.formCustomizedName).subscribe(resp => {
      this.saveRequest(this.etatCession, false);
    }, err => {
      this.saveRequest(this.etatCession, false);
    });
    this.processService.deleteVariableFromInstance(this.task.processInstanceId, this.formJsonName + '_JASPERMAP').subscribe(resp => {
      this.saveRequest(this.etatCession, true);
    }, err => {
      this.saveRequest(this.etatCession, true);
    });
  }

  calculTotal(etatCession: EtatCession) {
    this.etatCession = etatCession;
    let tmptotal = 0;
    etatCession = this.formatFormKeyValues(etatCession);
    Object.keys(etatCession).forEach( key => {
      if (key.substring(0, 7) === 'MONTANT') {
        tmptotal += +etatCession[key];
      }
      if (key.substring(0, 8) === 'CHECKBOX') {
        if (this.etatCession[key] === true) {
          if (+etatCession[key.slice(9)] >= 1) {
            tmptotal += +etatCession[key.slice(9)];
          } else {
            tmptotal += +this.tmpSomme * (+etatCession[key.slice(9)]);
          }
        }
      }
      if (key.substring(0 , 9) === 'PRIX_UNIT') {
        tmptotal +=  +etatCession[key] *  +etatCession['QUANTITE' + key.slice(9)];
      }
    });

    if ( this.formVariables.formName === 'APP-ETAT-DE-CESSION'
    || this.formVariables.formName === 'APP-ETAT-DE-CESSION-FINAL') {
      this.etatCession.TOTALFULL = tmptotal;
    } else {
      this.etatCession.TOTALSIMPLE = tmptotal;
    }

    this.etatCessionFormComponent.updateValue(this.etatCession);
  }

  cancel() {
  }
  formatFormKeyValues(etatCession: EtatCession) {
    const localEtatCession = new EtatCession();
    this.tmpSomme = etatCession['QUANTITE_SELECT_TARIF_URBAIN_ET_SURURBAIN'];
    Object.keys(etatCession).forEach(
      key => {
        if (key.substring(0, 12) === 'ELAND_SELECT') {
          let label, value;
          label = etatCession[key][0];
          value = etatCession[key][1];
          if (value !== 0) {
            localEtatCession['PRIX_UNIT_' + label] = value;
            localEtatCession['QUANTITE_' + label] = etatCession['QUANTITE_SELECT' + key.slice(12)];
            delete localEtatCession[key];
            delete localEtatCession['QUANTITE_SELECT' + key.slice(12)];
          } else {
            localEtatCession['MONTANT_' + label] = etatCession['QUANTITE_SELECT' + key.slice(12)];
            delete localEtatCession[key];
          }
        } else  if (key.substring(0, 15) !== 'QUANTITE_SELECT' ) {
          localEtatCession[key] = etatCession[key];
        }
      }
    );
    return localEtatCession;
  }
  saveRequest(etatCession: EtatCession, saveForJasper: boolean) {
    const cessionForm = new VariableValue();
    cessionForm.type = 'Json';
    cessionForm.value = JSON.stringify(etatCession);
    if (!saveForJasper) {
      this.processService.putInstanceVariable(this.task.processInstanceId, this.formJsonName
        + this.formCustomizedName, cessionForm).subscribe(resp => {
        this.alertService.success('API_MESSAGES.SAVE_SUCCESSFUL');
      });
    } else {
      cessionForm.value = JSON.stringify(this.formatFormKeyValues(etatCession));
      this.processService.putInstanceVariable(this.task.processInstanceId, this.formJsonName + this.formCustomizedName
        + '_JASPERMAP', cessionForm).subscribe(resp => {
      });
    }
  }
}
