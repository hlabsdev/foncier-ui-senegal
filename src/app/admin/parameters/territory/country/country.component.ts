import { Component, OnInit } from '@angular/core';
import { PreloaderService } from '@app/core/services/preloader.service';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { AlertService } from '@app/core/layout/alert/alert.service';
import { RowSizes } from '@app/core/models/rowSize.model';
import { Country } from '@app/core/models/territory/country.model';
import { Region } from '@app/core/models/territory/region.model';
import { TerritorySection } from '@app/core/models/territory/territorySection.model';
import { DataService } from '@app/data/data.service';
import { ParametersService } from '@app/admin/parameters/parameters.service';

@Component({
  selector: 'app-params-territory-country',
  templateUrl: './country.component.html'
})
export class CountryComponent implements OnInit {
  rowSizes: any = RowSizes;
  cols: any[];
  currentCountry: Country;
  currentCountrySelected: Country;
  countries: Country[];
  modalTitle: string;
  modalErrors: any;
  constructor(
    private translateService: TranslateService,
    private alertService: AlertService,
    private parametersService: ParametersService,
    private dataService: DataService,
    private preloaderService: PreloaderService
  ) { }

  ngOnInit() {
    this.loadCountries();
    this.translateService.get([
      'PARAMETERS.TERRITORY.COMMON.CODE', 'PARAMETERS.TERRITORY.COMMON.NAME',
      'PARAMETERS.TERRITORY.COMMON.DESCRIPTION'])
      .subscribe(translate => {
        this.cols = [
          { field: 'code', header: translate['PARAMETERS.TERRITORY.COMMON.CODE'], width: '20%' },
          { field: 'name', header: translate['PARAMETERS.TERRITORY.COMMON.NAME'], width: '20%' },
          { field: 'description', header: translate['PARAMETERS.TERRITORY.COMMON.DESCRIPTION'], width: '60%' },
        ];
      });
  }

  showCountryElementDialogue(country?: Country) {
    this.currentCountrySelected = country;
    if (country) {
      this.modalTitle = this.translateService.instant('PARAMETERS.TERRITORY.COUNTRY.EDIT');
      this.currentCountry = _.clone(country);
    } else {
      this.modalTitle = this.translateService.instant('PARAMETERS.TERRITORY.COUNTRY.ADD');
      this.currentCountry = new Region({});
    }
  }

  removeRegion(country: Country) {
    // put an endDate on the region
  }

  saved(country: Country) {
    if (!country.code) {
      this.modalErrors = { type: 'error', text: 'MESSAGES.TERRITORY.ERRORS.MISSING_CODE' };
    } else if (!country.name) {
      this.modalErrors = { type: 'error', text: 'MESSAGES.TERRITORY.ERRORS.MISSING_NAME' };
    } else if (!country.sigtasId) {
      this.modalErrors = { type: 'error', text: 'MESSAGES.TERRITORY.ERRORS.MISSING_SIGTAS_ID' };
    } else {
      this.parametersService.saveCountry(country).subscribe(nCountry => {
        if (country.id) {
          this.countries.splice(this.countries.indexOf(this.currentCountrySelected), 1, nCountry);
          this.currentCountrySelected = null;
        } else {
          this.countries.push(nCountry);
        }
        this.currentCountry = null;
        this.alertService.success('MESSAGES.FORMS.SAVE_FORM_SUCCESS');
      });
    }
  }

  canceled() {
    this.currentCountry = null;
  }

  loadCountries() {
    this.parametersService.getAllTerritoryBySection(TerritorySection.COUNTRY, true)
      .subscribe(countries => {
        this.countries = <Country[]>countries;
        // data to preload
        this.preloaderService.setCountriesToPreload(this.countries);
      });
  }
}
