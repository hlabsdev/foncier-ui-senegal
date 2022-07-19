import { Component, OnInit } from '@angular/core';
import { RowSizes } from '@app/core/models/rowSize.model';
import { Language } from '@app/core/models/language.model';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { SelectItem } from 'primeng';
import { AlertService } from '@app/core/layout/alert/alert.service';
import { TranslationService } from '@app/translation/translation.service';
import { TranslationRepository } from '@app/translation/translation.repository';

@Component({
  selector: 'app-params-language',
  templateUrl: './language.component.html'
})
export class LanguageComponent implements OnInit {
  rowSizes: any = RowSizes;
  cols: any[];
  languages: Language[];
  currentLanguage: Language;
  currentLanguageSelected: Language;
  modalTitle: string;
  modalErrors: any;
  locales: SelectItem[] = [];

  constructor(
    private translationService: TranslationService,
    private translationRepo: TranslationRepository,
    private translateService: TranslateService,
    private alertService: AlertService
  ) {
  }

  ngOnInit() {
    this.loadData();
    this.translateService.get(['PARAMETERS.TERRITORY.COMMON.CODE', 'PARAMETERS.TERRITORY.COMMON.NAME', 'PARAMETERS.TRANSLATE.ISRTL'])
      .subscribe(translate => {
        this.cols = [
          { field: 'name', header: translate['PARAMETERS.TERRITORY.COMMON.NAME'], width: '40%' },
          { field: 'locale', header: translate['PARAMETERS.TERRITORY.COMMON.CODE'], width: '30%' },
          { field: 'isRTL', header: translate['PARAMETERS.TRANSLATE.ISRTL'], width: '30%' },
        ];
      });
  }

  showDialog(language?: Language) {
    this.currentLanguageSelected = language;
    if (language) {
      this.modalTitle = this.translateService.instant('PARAMETERS.LANGUAGE.EDIT');
      this.currentLanguage = _.clone(language);
    } else {
      this.modalTitle = this.translateService.instant('PARAMETERS.LANGUAGE.ADD');
      this.currentLanguage = new Language({});
    }
  }

  saved(language: Language) {
    if (!language.locale) {
      this.modalErrors = { type: 'error', text: 'MESSAGES.TERRITORY.ERRORS.MISSING_LOCALE' };
    } else if (!language.name) {
      this.modalErrors = { type: 'error', text: 'MESSAGES.TERRITORY.ERRORS.MISSING_NAME' };
    } else {
      this.translationRepo.language.setOne(language).subscribe(nLanguage => {
        if (language.id) {
          this.languages.splice(this.languages.indexOf(this.currentLanguageSelected), 1, nLanguage);
          this.currentLanguageSelected = null;
        } else {
          this.languages.push(nLanguage);
        }
        this.currentLanguage = null;
        this.alertService.success('MESSAGES.LANGUAGE.SAVE_FORM_SUCCESS');
      });
    }


    /**
    TODO :: 1- update global locales to be use afterward
            2- update global languages to be use afterward
            3- create mew services for locale, language, translation seperatetly
     */
  }

  canceled = () => this.currentLanguage = null;

  loadData() {
    this.translationService.currentLanguages$.subscribe(languages => this.languages = languages || this.languages);
    this.translationService.currentLocales$.subscribe(locales => {
      this.locales = (locales && locales.map(locale => locale.toSelectItem())) || this.locales;
      this.locales.unshift({ label: this.translateService.instant('COMMON.ACTION.SELECT'), value: null });
    });
  }
}
