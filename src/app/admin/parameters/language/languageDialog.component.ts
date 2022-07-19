import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { SelectItem } from 'primeng';
import { Language } from '@app/core/models/language.model';

@Component({
  selector: 'app-params-language-dialog',
  templateUrl: './languageDialog.component.html'
})
export class LanguageDialogComponent implements OnChanges {
  @Input() errors: any;
  @Input() item: Language;
  @Input() title: string;
  @Input() locales: SelectItem[];
  form: any;
  @Output() saved: EventEmitter<any> = new EventEmitter<any>();
  @Output() canceled = new EventEmitter();

  ngOnChanges(changes: SimpleChanges) {
  }

  cancel = () => this.canceled.emit();

  save = () => this.saved.emit(this.item);

}
