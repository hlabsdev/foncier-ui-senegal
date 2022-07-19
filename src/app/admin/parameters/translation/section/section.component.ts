import { Component, Input } from '@angular/core';
import { RowSizes } from '@app/core/models/rowSize.model';
import { Section } from '@app/core/models/section.model';
import { TranslationService } from '@app/translation/translation.service';
import { SectionsService } from '@app/admin/parameters/translation/sections.service';
import { TranslationRepository } from '@app/translation/translation.repository';
import * as _ from 'lodash';

@Component({
  selector: 'app-translation-section',
  templateUrl: './section.component.html'
})

export class SectionComponent {
  rowSizes: any = RowSizes;
  errors: any;
  @Input() sections: Section[];

  modalVisible = false;
  currentSection: Section;
  currentAdd: Section;
  parent: Section;

  constructor(private translationService: TranslationService,
              private sectionsService: SectionsService, private translationRepo: TranslationRepository) {
    this.sectionsService.selectedSection$.subscribe(currentSection => this.currentSection = currentSection);
    this.sectionsService.currentAdd$.subscribe(section => {
      this.currentAdd = section;
      this.modalVisible = !!this.currentAdd;
    });
  }

  editSection = () => this.modalVisible = true;

  cancelModal = () => this.sectionsService.addSection(null);

  hideModal = () => this.modalVisible = false;

  saveModal() {
    this.translationRepo.section.setOne(this.currentAdd.simplify())
      .subscribe(newSection => {
        this.currentAdd.update(newSection);
        this.sectionsService.selectSection(this.currentAdd);
        this.modalVisible = false;
    });
  }

  onSectionSelect = (item: Section) => this.sectionsService.selectSection(item);

  onSectionEdit = (item: Section) => { };

  /**
   *
   * the section is not set correctly in the popup panel this is why we have an issue here
   */
}
