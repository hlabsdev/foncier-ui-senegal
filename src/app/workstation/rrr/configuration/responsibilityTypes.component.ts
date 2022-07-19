import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CodeList } from '@app/core/models/codeList.model';
import { CodeListTypes } from '@app/core/models/codeListType.model';
import { RowSizes } from '@app/core/models/rowSize.model';
import { CodeListService } from '@app/core/services/codeList.service';
import { AlertService } from '@app/core/layout/alert/alert.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-responsibility-types',
  templateUrl: 'responsibilityTypes.component.html'
})

export class ResponsibilityTypesComponent implements OnInit {

  // tslint:disable-next-line:no-output-on-prefix
  @Output() onAdd = new EventEmitter(true);
  responsibilityTypes: CodeList[];
  search: string;
  rowSizes: any = RowSizes;
  pickerDisplay: boolean;
  type = CodeListTypes.RESPONSIBILITY_TYPE;
  codeList: CodeList;

  constructor(
    private router: Router,
    private codeListService: CodeListService,
    private alertService: AlertService,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.getResponsibilityTypes();
  }

  getResponsibilityTypes(search: string = '') {
    const args = {
      search: search,
      type: this.type
    };
    this.codeListService.getCodeLists(args)
      .subscribe(result => {
        return this.getResponsabilityLabels(result);
      }, err => this.alertService.apiError(err));
  }

  editResponsibilityType(responsibilityType: CodeList): void {
    this.codeList = responsibilityType;
    this.onAdd.emit(this.codeList);
  }

  addResponsibilityType(): void {
    this.codeList = new CodeList();
    this.codeList.type = this.type;
    this.onAdd.emit(this.codeList);
  }

  getResponsabilityLabels(values) {
    let restrictionsValues = [];

    restrictionsValues = values.map(cl => this.translateService.get(`CODELIST.VALUES.${cl.value}`));

    forkJoin(restrictionsValues).subscribe(args => {
      values.forEach((v, i) => {
        v.value = args[i];
      });
      this.responsibilityTypes = values;

    }, err => this.alertService.apiError(err));
  }
}
