import { SourceComponent } from '../source.component';
import { Component, Input, OnInit } from '@angular/core';
import { Cheque } from '@app/core/models/cheque.model';

@Component({
  selector: 'app-cheque',
  templateUrl: './cheque.component.html',
  providers: [
    { provide: SourceComponent, useExisting: ChequeComponent }
  ]
})
export class ChequeComponent extends SourceComponent implements OnInit {

  @Input() cheque: Cheque;
  ngOnInit(): void {
  }

}
