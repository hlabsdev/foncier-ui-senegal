import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { TaskStateManagerService } from '../../registration/task/taskManager.service';

@Component({
  templateUrl: './list-form.component.html',
  selector: 'app-list-form',
  styleUrls: ['./list-form.component.scss']
})
export class ListFormComponent implements OnInit, OnChanges {
  @Input() legacy = true;
  @Input() forms: any[];
  @Input() task: any;
  @Input() formVariables: any;
  @Output() saved = new EventEmitter();
  @Output() cancelled = new EventEmitter();
  selectedForm: any;
  requiredForms: string[] = [];
  requiredErrorForms: string[] = [];
  _forms: any[];

  constructor(private taskManagerService: TaskStateManagerService) {}

  selectForm(event) {
    this.selectedForm = event && event.value;
    this.taskManagerService.changeSelectedFormKey({ form: this.selectedForm, task: this.task, formVariables: this.formVariables });
  }

  ngOnInit(): void {
    this.taskManagerService.selectedFormKeyChange$.subscribe(newFormKey => {
      this.selectedForm = newFormKey ? newFormKey.form : null;
    });

    this.taskManagerService.requiredFormsChange$.subscribe((reqForms: string[]) => {
      this.requiredForms = reqForms;
      this.setRequiredForms();
    });
    this.taskManagerService.requiredErrorFormsChange$.subscribe((reqErrorForms: string[]) => {
      this.requiredErrorForms = reqErrorForms;
      this.setRequiredForms();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.forms) {
      this._forms = this.forms;
      this.setRequiredForms();
    }
  }

  setRequiredForms() {
    for (const form of this._forms) {
      form.required = this.requiredForms.includes(form.value.split('.').slice(0, -1).join('.'));
      form.requiredErr = this.requiredErrorForms.includes(form.value.split('.').slice(0, -1).join('.'));
    }
  }
  save(e: any) {
    this.saved.emit(e);
  }
  cancel(e: any) {
    this.cancelled.emit(e);
  }
}
