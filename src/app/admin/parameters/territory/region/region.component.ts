import { Component, OnInit } from '@angular/core';
import { PreloaderService } from '@app/core/services/preloader.service';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { forkJoin } from 'rxjs';
import { AlertService } from '@app/core/layout/alert/alert.service';
import { RowSizes } from '@app/core/models/rowSize.model';
import { Country } from '@app/core/models/territory/country.model';
import { Region } from '@app/core/models/territory/region.model';
import { TerritorySection } from '@app/core/models/territory/territorySection.model';
import { DataService } from '@app/data/data.service';
import { ParametersService } from '@app/admin/parameters/parameters.service';

@Component({
  selector: 'app-params-territory-region',
  templateUrl: './region.component.html'
})
export class RegionComponent implements OnInit {
  rowSizes: any = RowSizes;
  cols: any[];
  currentRegion: Region;
  currentRegionSelected: Region;
  regions: Region[];
  mapCountries = {};
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
    this.loadRegions();
    this.translateService.get([
      'PARAMETERS.TERRITORY.COMMON.CODE', 'PARAMETERS.TERRITORY.COMMON.NAME',
      'PARAMETERS.TERRITORY.REGION.COUNTRY-NAME', 'PARAMETERS.TERRITORY.COMMON.DESCRIPTION'])
      .subscribe(translate => {
        this.cols = [
          { field: 'code', header: translate['PARAMETERS.TERRITORY.COMMON.CODE'], width: '15%' },
          { field: 'name', header: translate['PARAMETERS.TERRITORY.COMMON.NAME'], width: '20%' },
          { field: 'circle.name', header: translate['PARAMETERS.TERRITORY.REGION.COUNTRY-NAME'], width: '20%' },
          { field: 'description', header: translate['PARAMETERS.TERRITORY.COMMON.DESCRIPTION'], width: '45%' },
        ];
      });
  }

  showRegionElementDialogue(region?: Region) {
    this.currentRegionSelected = region;
    if (region) {
      this.modalTitle = this.translateService.instant('PARAMETERS.TERRITORY.REGION.EDIT');
      this.currentRegion = _.clone(region);
    } else {
      this.modalTitle = this.translateService.instant('PARAMETERS.TERRITORY.REGION.ADD');
      this.currentRegion = new Region({});
    }
  }

  removeRegion(region: Region) {
    // put an endDate on the region
  }

  saved(region: Region) {
    if (!region.code) {
      this.modalErrors = { type: 'error', text: 'MESSAGES.TERRITORY.ERRORS.MISSING_CODE' };
    } else if (!region.name) {
      this.modalErrors = { type: 'error', text: 'MESSAGES.TERRITORY.ERRORS.MISSING_NAME' };
    } else if (!region.country) {
      this.modalErrors = { type: 'error', text: 'MESSAGES.TERRITORY.ERRORS.MISSING_COUNTRY' };
    } else if (!region.sigtasId) {
      this.modalErrors = { type: 'error', text: 'MESSAGES.TERRITORY.ERRORS.MISSING_SIGTAS_ID' };
    } else {
      region.countryId = region.country.id;
      this.parametersService.saveRegion(region, true).subscribe(nRegion => {
        nRegion.country = this.mapCountries[nRegion.countryId];
        if (region.id) {
          this.regions.splice(this.regions.indexOf(this.currentRegionSelected), 1, nRegion);
          this.currentRegionSelected = null;
        } else {
          this.regions.push(nRegion);
        }
        this.currentRegion = null;
        this.alertService.success('MESSAGES.FORMS.SAVE_FORM_SUCCESS');
      });
    }
  }

  canceled() {
    this.currentRegion = null;
  }

  loadRegions() {
    forkJoin([this.parametersService.getAllTerritoryBySection(TerritorySection.REGION, true),
    this.parametersService.getAllTerritoryBySection(TerritorySection.COUNTRY, true)])
      .subscribe(([regions, countries]) => {
        this.mapCountries = {};
        this.countries = <Country[]>countries;
        for (const country of <Country[]>countries) { this.mapCountries[country.id] = country; }
        for (const region of <Region[]>regions) { region.country = this.mapCountries[region.countryId]; }
        this.regions = <Region[]>regions;

        // data to preload
        this.preloaderService.setRegionsToPreload(this.regions);
      });
  }
}
