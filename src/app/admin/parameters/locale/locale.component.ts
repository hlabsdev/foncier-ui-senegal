import { Component, OnInit } from '@angular/core';
import { RowSizes } from '@app/core/models/rowSize.model';
import { Locale } from '@app/core/models/locale.model';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { AlertService } from '@app/core/layout/alert/alert.service';
import { TranslationService } from '@app/translation/translation.service';
import { TranslationRepository } from '@app/translation/translation.repository';

@Component({
  selector: 'app-params-locale',
  templateUrl: './locale.component.html'
})
export class LocaleComponent implements OnInit {
  rowSizes: any = RowSizes;
  cols: any[];
  locales: Locale[];
  currentLocale: Locale;
  currentLocaleSelected: Locale;
  modalTitle: string;
  modalErrors: any;


  constructor(
    private translationService: TranslationService,
    private translateService: TranslateService,
    private translationRepo: TranslationRepository,
    private alertService: AlertService
  ) {
  }

  ngOnInit() {
    this.loadData();
    this.translateService.get(['PARAMETERS.TERRITORY.COMMON.CODE', 'PARAMETERS.TERRITORY.COMMON.NAME'])
      .subscribe(translate => {
        this.cols = [
          { field: 'name', header: translate['PARAMETERS.TERRITORY.COMMON.NAME'], width: '50%' },
          { field: 'code', header: translate['PARAMETERS.TERRITORY.COMMON.CODE'], width: '50%' }
        ];
      });
  }

  showDialog(locale?: Locale) {
    this.currentLocaleSelected = locale;
    if (locale) {
      this.modalTitle = this.translateService.instant('PARAMETERS.LANGUAGE.EDIT');
      this.currentLocale = _.clone(locale);
    } else {
      this.modalTitle = this.translateService.instant('PARAMETERS.LANGUAGE.ADD');
      this.currentLocale = new Locale({});
    }
  }

  saved(locale: Locale) {
    if (!locale.code) {
      this.modalErrors = { type: 'error', text: 'MESSAGES.TERRITORY.ERRORS.MISSING_CODE' };
    } else if (!locale.name) {
      this.modalErrors = { type: 'error', text: 'MESSAGES.TERRITORY.ERRORS.MISSING_NAME' };
    } else {
      this.translationRepo.locale.setOne(locale).subscribe(nLocale => {
        if (locale.id) {
          this.locales.splice(this.locales.indexOf(this.currentLocaleSelected), 1, nLocale);
          this.currentLocaleSelected = null;
        } else {
          this.locales.push(nLocale);
        }
        this.currentLocale = null;
        this.alertService.success('MESSAGES.LANGUAGE.SAVE_FORM_SUCCESS');
      });
    }
  }

  canceled() {
    this.currentLocale = null;
  }

  loadData() {
    this.translationService.currentLocales$.subscribe(locales => this.locales = locales);
  }
}
