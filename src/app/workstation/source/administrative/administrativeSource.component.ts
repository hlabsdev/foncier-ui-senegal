import { SourceComponent } from '../source.component';
import { Component, Input, OnInit } from '@angular/core';
import { SelectItem } from 'primeng';
import { AdministrativeSource } from '@app/core/models/administrativeSource.model';
import { FormVariables } from '../../baseForm/formVariables.model';
@Component({
  selector: 'app-administrative-source',
  templateUrl: './administrativeSource.component.html',
  providers: [
    { provide: SourceComponent, useExisting: AdministrativeSourceComponent }
  ]
})
export class AdministrativeSourceComponent extends SourceComponent implements OnInit {

  @Input() administrativeSource: AdministrativeSource;
  @Input() formVariables: FormVariables;
  @Input() cTypes: SelectItem[];
  ngOnInit(): void {

  }

}
