import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationPreferences } from '@app/core/models/branding/application-preferences.model';
import { ApplicationPreferencesService } from '@app/core/services/application-preferences.service';
import { AppComponent } from '@app/app.component';
import { SigtasUtilService } from '@app/core/utils/sigtasUtil.service';
import { TaskStateManagerService } from '@app/registration/task/taskManager.service';
import { KeycloakService } from 'keycloak-angular';
import { Subscription } from 'rxjs';
import { ConfigService } from '@app/core/app-config/config.service';
import { SigtasLink } from '@app/core/models/sigtas.model';
import { User } from '@app/core/models/user.model';
import { AccessRights } from '@app/core/models/accessRight';
import { AppAuthGuard } from '@app/core/utils/keycloak/app-auth-guard';

@Component({
  selector: 'app-header',
  templateUrl: './app.header.component.html'
})
export class AppHeaderComponent implements OnInit, OnDestroy {
  user: User;
  formatWanted: String;
  showManagerTask: boolean;
  subscription: Subscription;
  sigtasLinks: SigtasLink[];
  userGuideUrl: string;
  workflowEngineDomain: string;
  hasSystemAdministratorAccess: boolean;
  hasDashboardAccess: boolean;
  hasWorkstationAccess: boolean;
  userInitialsUppercase = false;
  coBrandInMenu = true;
  hasSigtasAccess: boolean;
  hasTransactionAccess: boolean;
  hasAdminMenuAccess: boolean;
  hasWorkstationMenuAccess: boolean;
  hasArcGisAccess: boolean;

  // settings routing
  settings = [
    {
      name: 'user_profile'
    },
    {
      name: 'session_preferences'
    },
    {
      name: 'application_preferences'
    }
  ];

  // shared application preference
  applicationPreferences: ApplicationPreferences;


  constructor(
    private applicationPreferencesService: ApplicationPreferencesService,
    public router: Router,
    public app: AppComponent,
    public appAuthGuard: AppAuthGuard,
    private keycloakService: KeycloakService,
    private config: ConfigService,
    private taskManagerService: TaskStateManagerService,
    private sigtasUtilService: SigtasUtilService
  ) { }

  ngOnInit() {
    this.appAuthGuard.userChange.subscribe((user: User) => {

      this.user = user;

      this.hasSystemAdministratorAccess = this.user.hasPermission(AccessRights.SYSTEM_ADMINISTRATOR);

      this.hasTransactionAccess = this.user.hasSomePermissions([
        AccessRights.MANUALLY_START_TRANSACTION,
        AccessRights.SYSTEM_ADMINISTRATOR
      ]);

      this.hasDashboardAccess = this.user.hasSomePermissions([
        AccessRights.SYSTEM_ADMINISTRATOR,
        AccessRights.SEE_TRANSACTION_INSTANCES
      ]);

      this.hasWorkstationAccess = this.user.hasSomePermissions([
        AccessRights.SYSTEM_ADMINISTRATOR,
        AccessRights.SEE_WORKSTATION_MENU
      ]);

      this.hasSigtasAccess = this.user.hasSomePermissions([
        AccessRights.SYSTEM_ADMINISTRATOR,
        AccessRights.SIGTAS
      ]);

      this.hasArcGisAccess = this.user.hasSomePermissions([
        AccessRights.SYSTEM_ADMINISTRATOR,
        AccessRights.GIS_OFFICE
      ]);

      this.hasAdminMenuAccess = this.hasSystemAdministratorAccess || this.hasTransactionAccess || this.hasDashboardAccess;
      this.hasWorkstationMenuAccess = this.hasWorkstationAccess || this.hasSigtasAccess;

    });

    this.sigtasLinks = this.config.getDefaultConfig(
      'EXTERNAL_SERVICES.sigtas.links_url'
    );

    this.userGuideUrl = this.config.getDefaultConfig(
      'EXTERNAL_SERVICES.user_guide_url'
    );

    this.workflowEngineDomain = this.config.getDefaultConfig(
      'EXTERNAL_SERVICES.workflow-url'
    );

    this.subscription = this.taskManagerService.changeTaskListViewChange$.subscribe(
      value => {
        this.formatWanted = value;
      }
    );
    this.applicationPreferences = new ApplicationPreferences();
    this.sharingAppPrefs();
  }

  sharingAppPrefs() {
    this.applicationPreferencesService.applicationPreferences_sharing.subscribe(
      appPrefs => (this.applicationPreferences = appPrefs));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  doLogout() {
    // destroy the currentUser saved in the localStorage
    const parsedUrl = new URL(window.location.href);
    this.keycloakService.logout(parsedUrl.origin + '/login').then(() => {
      this.appAuthGuard.setUser(null);
    });
    localStorage.removeItem('token');
  }

  openDashboard() {
    const url = `${this.workflowEngineDomain}/camunda/app/cockpit/default/#/dashboard/`;
    window.open(url, '_blank');
  }

  openUserGuide() {
    window.open(this.userGuideUrl, '_blank');
  }

  openSigtasPath(path: string) {
    this.sigtasUtilService.openSigtasWindow(path);
  }

  handleSettingsRouting(setting: string) {
    this.router.navigate(['/profile-settings'], { queryParams: { setting } });
  }
}
