import { Component, Input } from '@angular/core';
import { FormVariables } from '../baseForm/formVariables.model';

@Component({
  selector: 'app-rrr-picker-form',
  template: `<app-rrrs [options]="{add:false}"></app-rrrs>`
})
export class RrrsFormComponent {
  @Input() formVariables: FormVariables = new FormVariables({});

}
