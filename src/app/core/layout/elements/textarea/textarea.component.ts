import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { FieldConfig } from '@app/core/models/field.model';

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html'
})
export class TextareaComponent implements OnInit {
  field: FieldConfig;
  group: FormGroup;
  readOnly: boolean;
  constructor() { }

  ngOnInit() {
  }

}
