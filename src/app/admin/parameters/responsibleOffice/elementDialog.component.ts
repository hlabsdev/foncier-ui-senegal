import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SelectItem } from 'primeng';
import { ParametersService } from '../parameters.service';

@Component({
  selector: 'app-params-territory-element-dialog-responsible-office',
  templateUrl: './elementDialog.component.html'
})
export class ElementDialogResponsibleOfficeComponent implements OnChanges {
  @Input() errors: any;
  @Input() item: any;
  @Input() col: any[];
  @Input() selectTxt: string;
  @Input() subItemModel: string;
  @Input() subItemLabel: string;
  @Input() itemMultiple: boolean;
  @Input() title: string;
  @Input() roles: SelectItem[];
  @Input() taxCenters: SelectItem[];
  @Input() convertToSelectItem = true;
  form: any;
  @Output() saved: EventEmitter<any> = new EventEmitter<any>();
  @Output() canceled = new EventEmitter();
  selectableCol: SelectItem[];
  selectableCol2: SelectItem[];
  constructor(private parametersService: ParametersService, private translate: TranslateService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.col) {
      this.selectableCol = this.convertToSelectItem ?
        this.parametersService.getSelectables(this.col, this.translate.instant(this.selectTxt)) :
        this.col;
    }
  }

  cancel() {
    this.canceled.emit();
  }

  save() {
    this.saved.emit(this.item);
  }

}
