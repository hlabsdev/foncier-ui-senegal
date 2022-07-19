import { Component, OnInit } from '@angular/core';
import { PreloaderService } from '@app/core/services/preloader.service';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { forkJoin } from 'rxjs';
import { AlertService } from '@app/core/layout/alert/alert.service';
import { RowSizes } from '@app/core/models/rowSize.model';
import { Circle } from '@app/core/models/territory/circle.model';
import { Country } from '@app/core/models/territory/country.model';
import { Region } from '@app/core/models/territory/region.model';
import { TerritorySection } from '@app/core/models/territory/territorySection.model';
import { DataService } from '@app/data/data.service';
import { ParametersService } from '@app/admin/parameters/parameters.service';

@Component({
  selector: 'app-params-territory-circle',
  templateUrl: './circle.component.html'
})
export class CircleComponent implements OnInit {
  rowSizes: any = RowSizes;
  cols: any[];
  currentCircle: Circle;
  currentCircleSelected: Circle;
  circles: Circle[];
  mapRegions = {};
  regions: Country[];
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
    this.loadCircles();
    this.translateService.get([
      'PARAMETERS.TERRITORY.COMMON.CODE', 'PARAMETERS.TERRITORY.COMMON.NAME',
      'PARAMETERS.TERRITORY.CIRCLE.REGION_NAME', 'PARAMETERS.TERRITORY.COMMON.DESCRIPTION'])
      .subscribe(translate => {
        this.cols = [
          { field: 'code', header: translate['PARAMETERS.TERRITORY.COMMON.CODE'], width: '15%' },
          { field: 'name', header: translate['PARAMETERS.TERRITORY.COMMON.NAME'], width: '20%' },
          { field: 'circle.name', header: translate['PARAMETERS.TERRITORY.CIRCLE.REGION_NAME'], width: '20%' },
          { field: 'description', header: translate['PARAMETERS.TERRITORY.COMMON.DESCRIPTION'], width: '45%' },
        ];
      });
  }

  showRegionElementDialogue(circle?: Circle) {
    this.currentCircleSelected = circle;
    if (circle) {
      this.modalTitle = this.translateService.instant('PARAMETERS.TERRITORY.CIRCLE.EDIT');
      this.currentCircle = _.clone(circle);
    } else {
      this.modalTitle = this.translateService.instant('PARAMETERS.TERRITORY.CIRCLE.ADD');
      this.currentCircle = new Circle({});
    }
  }

  removeRegion(circle: Region) {
    // put an endDate on the circle
  }

  saved(circle: Circle) {
    if (!circle.code) {
      this.modalErrors = { type: 'error', text: 'MESSAGES.TERRITORY.ERRORS.MISSING_CODE' };
    } else if (!circle.name) {
      this.modalErrors = { type: 'error', text: 'MESSAGES.TERRITORY.ERRORS.MISSING_NAME' };
    } else if (!circle.region) {
      this.modalErrors = { type: 'error', text: 'MESSAGES.TERRITORY.ERRORS.MISSING_REGION' };
    } else {
      circle.regionId = circle.region.id;
      this.parametersService.saveCircle(circle, true).subscribe(nCircle => {
        nCircle.region = this.mapRegions[nCircle.regionId];
        if (circle.id) {
          this.circles.splice(this.circles.indexOf(this.currentCircleSelected), 1, nCircle);
          this.currentCircleSelected = null;
        } else {
          this.circles.push(nCircle);
        }
        this.currentCircle = null;
        this.alertService.success('MESSAGES.FORMS.SAVE_FORM_SUCCESS');
      });
    }
  }

  canceled() {
    this.currentCircle = null;
  }

  loadCircles() {
    forkJoin([this.parametersService.getAllTerritoryBySection(TerritorySection.CIRCLE, true),
    this.parametersService.getAllTerritoryBySection(TerritorySection.REGION, true)])
      .subscribe(([circles, regions]) => {
        this.mapRegions = {};
        this.regions = <Region[]>regions;
        for (const region of <Region[]>regions) { this.mapRegions[region.id] = region; }
        for (const circle of <Circle[]>circles) { circle.region = this.mapRegions[circle.regionId]; }
        this.circles = <Circle[]>circles;
        // data to preload
        this.preloaderService.setCirclesToPreload(this.circles);
      });
  }
}
