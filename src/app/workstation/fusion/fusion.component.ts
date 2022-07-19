import * as _ from 'lodash';

import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DataService } from '@app/data/data.service';
import { FormVariables } from '@app/workstation/baseForm/formVariables.model';
import { Variables, VariableValue } from '@app/core/models/variables.model';
import { FormService } from '@app/core/services/form.service';
import { AlertService } from '@app/core/layout/alert/alert.service';
import { UtilService } from '@app/core/utils/util.service';
import { ValidationService } from '@app/core/utils/validation.service';
import { FormTemplateBaseComponent } from '../baseForm/form-template-base.component';
import { ProcessService } from '@app/core/services/process.service';
import { Fusion } from '../../core/models/fusion.model';
import { FusionService } from '@app/core/services/fusion.service';
import { RowSizes } from '@app/core/models/rowSize.model';
import { BAUnit } from '../baUnit/baUnit.model';
import { TranslateService } from '@ngx-translate/core';
import { CodeListService } from '@app/core/services/codeList.service';
import { ProcessInstance } from '@app/core/models/processInstance.model';

@Component({
  selector: 'app-fusion',
  templateUrl: 'fusion.component.html'
})

export class FusionComponent extends FormTemplateBaseComponent implements OnInit {
  @Input() formVariables: FormVariables = new FormVariables({});
  @Output() saved = new EventEmitter<{ val: Fusion, variable: Variables }>();
  @Output() canceled = new EventEmitter<Fusion>();

  fusion: Fusion;
  cols: any[] = [];
  totalRecords: number;
  rowSizes: any = RowSizes;
  showDialog: boolean;
  listFusionTypes: any[];
  fusionTypeSelected: any;
  constructor(
    protected router: Router,
    protected fusionService: FusionService,
    protected route: ActivatedRoute,
    protected alertService: AlertService,
    protected validationService: ValidationService,
    protected utilService: UtilService,
    protected formService: FormService,
    private translateService: TranslateService,
    private processService: ProcessService
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.fusion = new Fusion();
    this.cols = [
      { field: 'isReceptor', header: this.translateService.instant('BA_UNIT.RECEIVER')},
      { field: 'isCutted', header: this.translateService.instant('BA_UNIT.FRAGMENT')},
      { field: 'titleName', header: this.translateService.instant('BA_UNIT.ID')},
      { field: 'owner', header: this.translateService.instant('BA_UNIT.OWNER')}
    ];
    const processInstance = new ProcessInstance();
    processInstance.id = this.task.processInstanceId;
    this.processService.getInstanceVariables(processInstance).subscribe(resp => {
      if (JSON.parse(resp['FusionForm']?.value)) {
        this.fusion = JSON.parse(resp['FusionForm']?.value);
      } else {
        this.fusion.isTotalFusion = false;
        this.fusion.isNewTitleForFusion = false;
        this.fusion.landTitleList = [];
      }
      console.log(resp);
    });
  }
  addTitle(baunit) {
    if (this.fusion.landTitleList.filter(tf => tf.uid === baunit.baUnit.uid).length === 0 ) {
      this.fusion.landTitleList.push(baunit.baUnit);
    }
  }
  save() {
    if (this.isFormValid()) {
      let titleNamsForFusion = '';
      this.fusion.landTitleList.forEach(tf => {
        if (tf.isReceptor !== true) {
          titleNamsForFusion += tf.titleName + ';';
        } else {
          titleNamsForFusion = tf.titleName + ';' + titleNamsForFusion;
        }
      });
      this.fusion.titleNames = titleNamsForFusion;
      const fusionTitles = new VariableValue();
      fusionTitles.type = 'Json';
      fusionTitles.value = JSON.stringify( this.fusion );
      this.processService.deleteVariableFromInstance(this.task.processInstanceId, 'FusionForm').subscribe(resp => {
        this.saveRequest(fusionTitles);
      }, err => {
        this.saveRequest(fusionTitles);
      });
    }
  }
  saveRequest(fusionTitles) {
    this.processService.putInstanceVariable(this.task.processInstanceId, 'FusionForm',
    fusionTitles).subscribe(resp => {
      this.alertService.success('API_MESSAGES.SAVE_SUCCESSFUL');
    });
  }
  cancel() {
  }
  isFormValid() {
    if (this.fusion.landTitleList?.length <= 1) {
      this.alertService.warning('Veuillez selectionner plus d\'un titre svp');
      return false;
    }
    if (this.fusion.isNewTitleForFusion === false) {
      let haveReceptor = false;
      this.fusion.landTitleList.forEach(tf => {
        if (tf.isReceptor === true) {
          haveReceptor = true;
        }
      });
      if (haveReceptor === false) {
        this.alertService.warning('Veuillez choisir un titre reception pour la fusion sans nouveau titre.');
        return false;
      }
    }
    if (this.fusion.isTotalFusion === false) {
      let haveCuttedTf = false;
      this.fusion.landTitleList.forEach(tf => {
        if (tf.isCutted === true) {
          haveCuttedTf = true;
        }
      });
      if (haveCuttedTf === false) {
        this.alertService.warning('Veuillez choisir au moins un titre à morceller pour une fusion patielle.');
        return false;
      }
    }
    return true;
  }
  showBAUnitDialog() {
    this.showDialog = true;
  }

  hideBAUnitDialog() {
    this.showDialog = false;
  }
  updateReceptorCheck(baunit) {
    if (baunit.isReceptor === true) {
      this.fusion.landTitleList.forEach(tf => {
        if (tf.uid !== baunit.uid) {
          tf.isReceptor = false;
        }
      });
    } else if (baunit === false) {
      this.fusion.landTitleList.forEach(tf => {
          tf.isReceptor = false;
      });
    }
  }
  updateCuttedCheck(isChecked) {
    if (isChecked) {
      this.fusion.landTitleList.forEach(tf => {
        tf.isCutted = false;
    });
    }
  }
  clickReceptorsCheck() {
    this.updateReceptorCheck(false);
  }
  clickCuttedCheck() {
    this.updateCuttedCheck(this.fusion.isTotalFusion);
  }
  deleteTitleFromListe(baunit) {
    let index = -1;
    index = this.fusion.landTitleList.indexOf(baunit);
    if (index !== -1) {
      baunit.isReceptor = false;
      this.fusion.landTitleList.splice(index, 1);
    }
  }
}
