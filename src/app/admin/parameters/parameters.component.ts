import { AfterContentInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Registry } from '@app/core/models/registry.model';
import { ResponsibleOffice } from '@app/core/models/responsibleOffice.model';
import { PreloaderService } from '@app/core/services/preloader.service';
import { TranslateService } from '@ngx-translate/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MenuItem } from 'primeng';

@Component({
  selector: 'app-params',
  templateUrl: 'parameters.component.html'
})
export class ParametersComponent implements OnInit, AfterContentInit {
  // https://alligator.io/angular/query-parameters/

  selectedParam: string;
  selectedParamIndex: number;

  params = [
    {
      name: 'territory'
    },
    {
      name: 'registry'
    },
    {
      name: 'responsibleOffice'
    },
    // {
    //   name: 'forms'
    // },
    // {
    //   name: 'formsGroup'
    // }
  ];

  // preloading
  preloaderMessage: string;
  paramTerritoryToPreload: MenuItem[];
  paramRegistryToPreload: Registry[];
  paramResponsibleOfficesToPreload: ResponsibleOffice[];

  constructor(private route: ActivatedRoute, private router: Router,
    private translateService: TranslateService,
    private ngxLoader: NgxUiLoaderService, private preloaderService: PreloaderService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: { param: string }) => {
      for (let i = 0; i < this.params.length; i++) {
        const param = this.params[i];
        if (param.name === params.param) {
          this.selectedParamIndex = i;
          this.selectedParam = params.param || undefined;
        }
      }
    });
  }

  ngAfterContentInit(): void {
    this.initialPreload();
  }

  initialPreload() {
    // initial preloading
    this.ngxLoader.start();
    this.preloaderMessage = this.getPreloaderMessage('territory');
    // stopping the initial preloading
    this.ngxLoader.stop();
  }

  handleChange(change: any) {
    const param = change && change.index && this.params[change.index] ? this.params[change.index].name : null;
    this.selectedParamIndex = 0;
    if (param) {
      // preloading init
      this.ngxLoader.start();
      this.preloaderMessage = this.getPreloaderMessage(param);
      // router
      this.router.navigate(['/parameters'], { queryParams: { param } });
      // stopping the preloading
      this.ngxLoader.stop();
    }
  }

  getPreloaderMessage(_paramToPreloadName: string) {
    if (_paramToPreloadName === 'territory') {
      this.preloaderService.currentTerritoriesToPreload.subscribe((_paramToPreload: MenuItem[]) => {
        this.paramTerritoryToPreload = _paramToPreload;
      });
      if (this.paramTerritoryToPreload.length === 0) {
        return '...';
      } else if (this.paramTerritoryToPreload.length === 1) {
        return (this.translateService.instant('PRELOADER.ONE_MOMENT')
          + ', ' + this.paramTerritoryToPreload.length + ' '
          + this.translateService.instant('PRELOADER.PARAMETERS.TERRITORY.TERRITORY')
          + ' ' + this.translateService.instant('PRELOADER.IS_LOADING') + '.');
      } else {
        return (this.translateService.instant('PRELOADER.ONE_MOMENT')
          + ', ' + this.paramTerritoryToPreload.length + ' ' + this.translateService.instant('PRELOADER.PARAMETERS.TERRITORY.TERRITORIES')
          + ' ' + this.translateService.instant('PRELOADER.ARE_LOADING') + '.');
      }
    } else if (_paramToPreloadName === 'registry') {
      this.preloaderService.currentRegistriesToPreload.subscribe((_paramToPreload: Registry[]) => {
        this.paramRegistryToPreload = _paramToPreload;
      });
      if (this.paramRegistryToPreload.length === 0) {
        return '...';
      } else if (this.paramRegistryToPreload.length === 1) {
        return (this.translateService.instant('PRELOADER.ONE_MOMENT')
          + ', ' + this.paramRegistryToPreload.length + ' ' + this.translateService.instant('PRELOADER.PARAMETERS.REGISTRY.REGISTRY')
          + ' ' + this.translateService.instant('PRELOADER.IS_LOADING') + '.');
      } else {
        return (this.translateService.instant('PRELOADER.ONE_MOMENT')
          + ', ' + this.paramRegistryToPreload.length + ' ' + this.translateService.instant('PRELOADER.PARAMETERS.REGISTRY.REGISTRIES')
          + ' ' + this.translateService.instant('PRELOADER.ARE_LOADING') + '.');
      }
    } else if (_paramToPreloadName === 'responsibleOffice') {
      this.preloaderService.currentResponsibleOfficesToPreload.subscribe((_paramToPreload: ResponsibleOffice[]) => {
        this.paramResponsibleOfficesToPreload = _paramToPreload;
      });
      if (this.paramResponsibleOfficesToPreload.length === 0) {
        return '...';
      } else if (this.paramResponsibleOfficesToPreload.length === 1) {
        return (this.translateService.instant('PRELOADER.ONE_MOMENT')
          + ', ' + this.paramResponsibleOfficesToPreload.length + ' '
          + this.translateService.instant('PRELOADER.PARAMETERS.RESPONSIBLE_OFFICE.RESPONSIBLE_OFFICE')
          + ' ' + this.translateService.instant('PRELOADER.IS_LOADING') + '.');
      } else {
        return (this.translateService.instant('PRELOADER.ONE_MOMENT')
          + ', ' + this.paramResponsibleOfficesToPreload.length + ' ' + this.translateService.instant('PRELOADER.PARAMETERS.RESPONSIBLE_OFFICE.RESPONSIBLE_OFFICES')
          + ' ' + this.translateService.instant('PRELOADER.ARE_LOADING') + '.');
      }
    }
  }
}

