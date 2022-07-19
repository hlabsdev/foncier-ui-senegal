import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TabView } from 'primeng';
import { Location } from '@angular/common';
import { CodeList } from '@app/core/models/codeList.model';

@Component({
  templateUrl: './rrrTypesConfiguration.component.html',
})
export class RRRTypesConfigurationComponent {
  @ViewChild('tabView') childTabView: TabView;
  @ViewChildren('childComponent') childComponents: QueryList<any>;
  receivedCodeList: CodeList;

  constructor(private router: Router,
    private location: Location,
    private route: ActivatedRoute) { }

  handleAdd(codeList: CodeList) {
    this.receivedCodeList = codeList;
  }

  closeDialog() {
    this.receivedCodeList = null;
    this.goToRRR();
  }

  goToRRR(): void {
    this.router.navigate(['rrrs']);
  }
}
