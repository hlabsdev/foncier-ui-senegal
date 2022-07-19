import { Component } from '@angular/core';
import { Section } from '@app/core/models/section.model';
import { TranslationService } from '@app/translation/translation.service';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss']
})
export class SideMenuComponent {
  showAddSection = false;
  currentEditSection: Section;
  sections: Section[];

  constructor(private translationService: TranslationService) {
    this.translationService.currentSections$.subscribe(sections => {
      this.sections = sections;
    });
  }
}
