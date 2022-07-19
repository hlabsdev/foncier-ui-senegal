import { ApplicantService } from '@app/core/services/applicant.service';
import { DynamicFormComponent } from '@app/core/layout/elements/dynamic-form/dynamic-form.component';
import { ValidationService } from '@app/core/utils/validation.service';
import { CodeListService } from '@app/core/services/codeList.service';
import { Applicant } from '@app/core/models/applicant.model';
import { FieldConfig } from '@app/core/models/field.model';
import {
  AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EtatCession } from '@app/core/models/etatCession.model';
import { EtatCessionService } from '@app/core/services/etatCession.service';

@Component({
  selector: 'app-etat-cession-form',
  template: `<dynamic-form
   [fields]="config" [title]="title" [showCalculButton]="true" [readOnly]="readOnly" (submit)="submit($event)" (calcul)="calcul($event)" [fieldValues]="fieldValues"
   (cancelButtonClicked)="cancel()" [saveToLadm]="true"></dynamic-form>`
})
export class EtatCessionFormComponent implements AfterViewInit, OnChanges {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  @Input() etatCession: EtatCession = new EtatCession();
  @Input() readOnly: boolean;
  @Input() config: FieldConfig[];
  @Output() calculButtonClicked = new EventEmitter<EtatCession>();
  @Output() saveButtonClicked = new EventEmitter<EtatCession>();
  @Output() cancelButtonClicked = new EventEmitter<boolean>();

  title: String;
  fieldValues: any;

  constructor(
    protected etatCessionService: EtatCessionService,
    protected route: ActivatedRoute,
    public validationService: ValidationService,
    public codeListService: CodeListService,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngAfterViewInit(): void {
    this.title = 'ETAT_DE_CESSION.TITLE_ADD';
    this.fieldValues = this.etatCession;
    this.changeDetector.detectChanges();
  }
  ngOnChanges() {
    this.title = 'ETAT_DE_CESSION.TITLE_ADD';
    this.fieldValues = this.etatCession;
    this.changeDetector.detectChanges();
  }
  updateValue(values) {
    this.form.updateValues(values);
  }
  submit(etatCession: EtatCession) {
    Object.keys(etatCession).forEach(
      key => (this.etatCession[key] = etatCession[key])
    );
    this.saveButtonClicked.emit(this.etatCession);
  }
  calcul(etatCession: EtatCession) {
    Object.keys(etatCession).forEach(
      key => (this.etatCession[key] = etatCession[key])
    );
    this.calculButtonClicked.emit(this.etatCession);
  }

  cancel() {
    this.cancelButtonClicked.emit(true);
  }
}
