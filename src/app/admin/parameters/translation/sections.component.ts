import { Component } from '@angular/core';
import { RowSizes } from '@app/core/models/rowSize.model';
import { Section } from '@app/core/models/section.model';
import { TranslationService } from '@app/translation/translation.service';

@Component({
  selector: 'app-params-translation',
  templateUrl: './sections.component.html',
  styleUrls: ['./sections.component.scss']
})

export class SectionsComponent {
  rowSizes: any = RowSizes;
  currentSections: Section[];

  constructor(private translationService: TranslationService) {
    this.translationService.currentSections$.subscribe(currentSections => {
      this.currentSections = currentSections;
    });
  }

  /**
   * TODO :: missing confirmation popup when adding section and sectionItem
   */
}
