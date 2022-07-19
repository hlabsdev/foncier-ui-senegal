import {
  AfterViewInit,
  ChangeDetectorRef, Component, EventEmitter, Input,
  OnChanges, OnDestroy, OnInit, Output,
  SimpleChange, SimpleChanges, ViewChild
} from '@angular/core';
import { DynamicFormComponent } from '@app/core/layout/elements/dynamic-form/dynamic-form.component';
import { ComplementaryInfo } from '@app/core/models/complementaryInfo.model';
import { FieldConfig } from '@app/core/models/field.model';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { FormVariables } from '@app/workstation/baseForm/formVariables.model';
import { BAUnit } from '@app/workstation/baUnit/baUnit.model';

@Component({
  selector: 'app-document-complementary-form',
  template: `<dynamic-form [title]="title" [fields]="config" [errorMessage]="errorMessage"
       [readOnly]="formVariables.isReadOnly" [hideSaveButton]="formVariables.isReadOnly"
        (submit)="submit($event)" [fieldValues]="fieldValues" (cancelButtonClicked)="cancel()"
        [saveToLadm]="true">
      </dynamic-form>`
})

export class DocumentComplementaryInfoFormComponent implements AfterViewInit, OnInit, OnChanges, OnDestroy {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;
  @Input() documentComplementary: any;
  @Input() config: FieldConfig[];
  @Input() showAllLabel: boolean;
  @Input() errorMessage: string;
  @Input() readOnly: Boolean = false;
  @Input() formVariables: FormVariables = new FormVariables({});
  @Output() saveButtonClicked = new EventEmitter<any>();
  @Output() cancelButtonClicked = new EventEmitter<boolean>();

  baUnit: BAUnit;
  title: String;
  fieldValues: any;

  valueChanges: Subscription;

  constructor(protected translateService: TranslateService,
    private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.translateService.get(`DOCUMENT_COMPLEMENTARY.${this.formVariables.documentComplementarySection}`)
      .subscribe(val => this.title = val);
  }

  ngOnChanges(changes: SimpleChanges) {
    const error: SimpleChange = changes.errorMessage;
    if (error && error.currentValue) {
      this.errorMessage = error.currentValue;
    }
  }

  ngAfterViewInit() {
    this.fieldValues = this.documentComplementary;
    this.setConfigs(this.formVariables.documentComplementarySection);
    this.changeDetector.detectChanges();
  }

  ngOnDestroy(): void {
    if (this.valueChanges) {
      this.valueChanges.unsubscribe();
    }
  }

  setConfigs(section) {
    this.config = this.config.map(item => {
      item.isEnabled([section]);
      return item;
    });
  }

  submit(documentComplementary: any) {
    Object.keys(documentComplementary).forEach(
      key => (this.documentComplementary[key] = documentComplementary[key])
    );
    this.saveButtonClicked.emit(this.documentComplementary);
  }

  cancel() {
    this.form.form.reset();
    this.fieldValues = this.documentComplementary;
    this.setConfigs(this.formVariables.documentComplementarySection);
    this.cancelButtonClicked.emit(true);
    this.errorMessage = null;
  }

}
