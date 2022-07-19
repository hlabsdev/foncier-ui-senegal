import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '@app/core/layout/alert/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { CodeListService } from '@app/core/services/codeList.service';
import { RowSizes } from '@app/core/models/rowSize.model';
import { CodeListTypes } from '@app/core/models/codeListType.model';
import { CodeList } from '@app/core/models/codeList.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-right-types',
  templateUrl: 'rightTypes.component.html'
})

export class RightTypesComponent implements OnInit {

  // tslint:disable-next-line:no-output-on-prefix
  @Output() onAdd = new EventEmitter(true);
  codeList: CodeList;
  rightTypes: CodeList[];
  search: string;
  rowSizes: any = RowSizes;
  type = CodeListTypes.RIGHT_TYPE;

  constructor(
    private codeListService: CodeListService,
    private router: Router,
    private alertService: AlertService,
    private translateService: TranslateService,
  ) { }

  ngOnInit(): void {
    this.getRightTypes();
  }

  getRightTypes(search: string = null) {
    const args = {
      search: search,
      type: this.type
    };
    this.codeListService.getCodeLists(args)
      .subscribe(result => {
        return this.getRightLabels(result);
      }, err => this.alertService.apiError(err));
  }

  editRightType(rightType: CodeList): void {
    this.codeList = rightType;
    this.onAdd.emit(this.codeList);
  }

  addRightType(): void {
    this.codeList = new CodeList();
    this.codeList.type = this.type;
    this.onAdd.emit(this.codeList);
  }

  getRightLabels(values) {
    let rightsValues = [];

    rightsValues = values.map(cl => this.translateService.get(`CODELIST.VALUES.${cl.value}`));

    forkJoin(rightsValues).subscribe(args => {
      values.forEach((v, i) => {
        v.value = args[i];
      });
      this.rightTypes = values;

    }, err => this.alertService.apiError(err));
  }
}
