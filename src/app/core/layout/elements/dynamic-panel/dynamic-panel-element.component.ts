import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { getlocaleConstants } from '@app/core/utils/locale.constants';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dyn-panel-element',
  templateUrl: 'dynamic-panel-element.component.html',
  styleUrls: ['dynamic-panel-element.component.scss']
})
export class DynamicPanelElementComponent implements OnChanges, OnInit {
  @Input() field;
  @Input() readOnly;

  _data;
  @Output() dataChange = new EventEmitter();
  @Input()
  get data() {
    return this._data;
  }
  set data(newData) {
    this._data = newData;
    this.dataChange.emit(this.data);
  }


  locale;

  constructor(private translateService: TranslateService) { }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
    const { localeSettings } = getlocaleConstants(this.translateService.currentLang);
    this.locale = localeSettings;
  }
}
