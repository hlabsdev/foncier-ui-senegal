import { TranslateService } from '@ngx-translate/core';
import { FormService } from '@app/core/services/form.service';
import { UtilService } from '@app/core/utils/util.service';
import { AlertService } from '@app/core/layout/alert/alert.service';
import { Component, OnInit } from '@angular/core';
import { RowSizes } from '@app/core/models/rowSize.model';
import { Form } from '@app/core/models/form.model';
import { FormType } from '@app/core/models/form-type.model';

@Component({
  selector: 'app-params-forms',
  templateUrl: './forms.component.html'
})
export class FormsComponent implements OnInit {
  rowSizes: any = RowSizes;
  forms: Form[];
  currentForm: any = null;
  cols: any[];
  errorMessage: string;
  modalTitle: string;


  constructor(
    private translateService: TranslateService,
    private formService: FormService,
    private utilService: UtilService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.loadListForms();
    this.cols = [
      { field: 'name', header: this.translateService.instant('FORMS_GROUP.NAME'), width: '40%' },
      { field: 'description', header: this.translateService.instant('FORMS_GROUP.DESCRIPTION'), width: '60%' },
    ];
  }

  loadListForms() {
    this.formService.getFormsByType(FormType.FORM)
      .subscribe((forms: Form[]) => (this.forms = forms), err => this.alertService.error('MESSAGES.FORMS.LOAD_FORMS_ERROR'));
  }

  showFormsElementDialogue(modalTitle: string , form: Form = new Form({})): void {

      this.modalTitle = this.translateService.instant(modalTitle);
      this.currentForm = form;
  }

  saved() {
    this.alertService.success('MESSAGES.FORMS.SAVE_FORM_SUCCESS');
    this.loadListForms();
    this.currentForm = null;
  }

  canceled() {
    this.loadListForms();
    this.currentForm = null;
  }

  removeForm(form) {
    this.utilService.displayConfirmationDialogWithMessageParameters(
      'MESSAGES.FORMS_GROUPS.CONFIRM_DELETE_FORM', { formName: form.name }, () => {
        this.formService.deleteForm(form).subscribe(result => {
          this.loadListForms();
          this.alertService.success('MESSAGES.FORMS_GROUPS.DELETE_FORM_SUCCESS');
        }, err => this.alertService.error('MESSAGES.FORMS_GROUPS.DELETE_FORM_ERROR'));
      }, () => { });
  }
}
