import { AfterViewInit, ChangeDetectorRef, Component, Input } from '@angular/core';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sog-panel',
  styleUrls: ['./sog-panel.component.scss'],
  templateUrl: './sog-panel.component.html'
})
export class SogPanelComponent implements AfterViewInit {
  @Input() header: string;

  constructor(private changeDetector: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.changeDetector.detectChanges();
  }
}
