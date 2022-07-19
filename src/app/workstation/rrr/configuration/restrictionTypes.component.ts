import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { forkJoin } from 'rxjs';
import { CodeList } from '@app/core/models/codeList.model';
import { CodeListTypes } from '@app/core/models/codeListType.model';
import { RowSizes } from '@app/core/models/rowSize.model';
import { CodeListService } from '@app/core/services/codeList.service';
import { AlertService } from '@app/core/layout/alert/alert.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-restriction-types',
  templateUrl: 'restrictionTypes.component.html'
})

export class RestrictionTypesComponent implements OnInit {

  // tslint:disable-next-line:no-output-on-prefix
  @Output() onAdd = new EventEmitter(true);
  restrictionTypes: CodeList[];
  search: string;
  rowSizes: any = RowSizes;
  type = CodeListTypes.RESTRICTION_TYPE;
  codeList: CodeList;


  constructor(
    private codeListService: CodeListService,
    private alertService: AlertService,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.getRestrictionTypes();
  }

  getRestrictionTypes(search: string = '') {
    const args = {
      search: search,
      type: this.type
    };
    this.codeListService.getCodeLists(args)
      .subscribe(result => {
        return this.getRestrictionLabels(result);
      }, err => this.alertService.apiError(err));
  }

  editRestrictionType(restrictionType: CodeList): void {
    this.codeList = restrictionType;
    this.onAdd.emit(this.codeList);
  }

  addRestrictionType(): void {
    this.codeList = new CodeList();
    this.codeList.type = this.type;
    this.onAdd.emit(this.codeList);
  }

  getRestrictionLabels(values) {
    let restrictionsValues = [];

    restrictionsValues = values.map(cl => this.translateService.get(`CODELIST.VALUES.${cl.value}`));

    forkJoin(restrictionsValues).subscribe(args => {
      values.forEach((v, i) => {
        v.value = args[i];
      });
      this.restrictionTypes = values;

    }, err => this.alertService.apiError(err));
  }

}
