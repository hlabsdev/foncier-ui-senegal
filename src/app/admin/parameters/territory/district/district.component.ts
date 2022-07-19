import { Component, OnInit } from '@angular/core';
import { PreloaderService } from '@app/core/services/preloader.service';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { forkJoin } from 'rxjs';
import { AlertService } from '@app/core/layout/alert/alert.service';
import { RowSizes } from '@app/core/models/rowSize.model';
import { District } from '@app/core/models/territory/district.model';
import { Division } from '@app/core/models/territory/division.model';
import { Region } from '@app/core/models/territory/region.model';
import { TerritorySection } from '@app/core/models/territory/territorySection.model';
import { DataService } from '@app/data/data.service';
import { ParametersService } from '@app/admin/parameters/parameters.service';

@Component({
  selector: 'app-params-territory-district',
  templateUrl: './district.component.html'
})
export class DistrictComponent implements OnInit {
  rowSizes: any = RowSizes;
  cols: any[];
  currentDistrict: District;
  currentDistrictSelected: District;
  districts: District[];
  mapDivisons = {};
  divisions: Division[];
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
    this.loadDistricts();
    this.translateService.get([
      'PARAMETERS.TERRITORY.COMMON.CODE', 'PARAMETERS.TERRITORY.COMMON.NAME',
      'PARAMETERS.TERRITORY.DISTRICT.DIVISION_NAME', 'PARAMETERS.TERRITORY.COMMON.DESCRIPTION'])
      .subscribe(translate => {
        this.cols = [
          { field: 'code', header: translate['PARAMETERS.TERRITORY.COMMON.CODE'], width: '15%' },
          { field: 'name', header: translate['PARAMETERS.TERRITORY.COMMON.NAME'], width: '20%' },
          { field: 'division.name', header: translate['PARAMETERS.TERRITORY.DISTRICT.DIVISION_NAME'], width: '20%' },
          { field: 'description', header: translate['PARAMETERS.TERRITORY.COMMON.DESCRIPTION'], width: '45%' },
        ];
      });
  }

  showDistrictElementDialogue(district?: District) {
    this.currentDistrictSelected = district;
    if (district) {
      this.modalTitle = this.translateService.instant('PARAMETERS.TERRITORY.DISTRICT.EDIT');
      this.currentDistrict = _.clone(district);
    } else {
      this.modalTitle = this.translateService.instant('PARAMETERS.TERRITORY.DISTRICT.ADD');
      this.currentDistrict = new District({});
    }
  }

  removeRegion(region: Region) {
    // put an endDate on the region
  }

  saved(district: District) {
    if (!district.code) {
      this.modalErrors = { type: 'error', text: 'MESSAGES.TERRITORY.ERRORS.MISSING_CODE' };
    } else if (!district.name) {
      this.modalErrors = { type: 'error', text: 'MESSAGES.TERRITORY.ERRORS.MISSING_NAME' };
    } else if (!district.division) {
      this.modalErrors = { type: 'error', text: 'MESSAGES.TERRITORY.ERRORS.MISSING_DIVISION' };
    } else if (!district.sigtasId) {
      this.modalErrors = { type: 'error', text: 'MESSAGES.TERRITORY.ERRORS.MISSING_SIGTAS_ID' };
    } else {
      district.divisionId = district.division.id;
      this.parametersService.saveDistrict(district, true).subscribe(nDistrict => {
        nDistrict.division = this.mapDivisons[nDistrict.divisionId];
        if (district.id) {
          this.districts.splice(this.districts.indexOf(this.currentDistrictSelected), 1, nDistrict);
          this.currentDistrictSelected = null;
        } else {
          this.districts.push(nDistrict);
        }
        this.currentDistrict = null;
        this.alertService.success('MESSAGES.FORMS.SAVE_FORM_SUCCESS');
      });
    }
  }

  canceled() {
    this.currentDistrict = null;
  }

  loadDistricts() {
    forkJoin([this.parametersService.getAllTerritoryBySection(TerritorySection.DISTRICT, true),
    this.parametersService.getAllTerritoryBySection(TerritorySection.DIVISION, true)])
      .subscribe(([districts, divisions]) => {
        this.mapDivisons = {};
        this.divisions = <Division[]>divisions;
        for (const division of <Division[]>divisions) { this.mapDivisons[division.id] = division; }
        for (const district of <District[]>districts) { district.division = this.mapDivisons[district.divisionId]; }
        this.districts = <District[]>districts;
        // data to preload
        this.preloaderService.setDistrictsToPreload(this.districts);
      });
  }
}
