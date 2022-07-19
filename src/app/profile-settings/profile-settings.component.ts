import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AccessRights } from '@app/core/models/accessRight';
import { ApplicationPreferences } from '@app/core/models/branding/application-preferences.model';
import { HslaBrand } from '@app/core/models/branding/hsla-brand';
import { User } from '@app/core/models/user.model';
import { ApplicationPreferencesService } from '@app/core/services/application-preferences.service';
import { AppAuthGuard } from '@app/core/utils/keycloak/app-auth-guard';
import { UtilService } from '@app/core/utils/util.service';
import { ValidationService } from '@app/core/utils/validation.service';
import { QuicklinksGroup } from '@features/quicklink/models/quicklink.model';
import { TranslateService } from '@ngx-translate/core';
import { environment as config } from 'environments/environment';
import { ColorPickerService } from 'ngx-color-picker';
import { SelectItem } from 'primeng/api';
import { Observable, Subscription } from 'rxjs';
import { AlertService } from '../core/layout/alert/alert.service';
import { UserPreferences } from '../core/models/userPreferences.model';
import { UserService } from '../core/services/user.service';
import brandingVariables from '../style-branding/variables/branding_variables.scss';
import { fileToBase64Url } from '@app/core/utils/file.util';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html'
})
export class ProfileSettingsComponent implements OnInit {
  user: User;
  hasSystemAdministratorAccess: boolean;
  displayedLang: string;
  initialLang: string;
  langs: SelectItem[];
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
  selectedSettingIndex: number;

  // Applicatiomn preferences
  applicationPreferences: ApplicationPreferences;
  @Output() refresh = new EventEmitter();

  presetColorValues: string[] = [];
  cpPresetLabel: string;
  cpAddColorButtonText: string;

  // button claims main color
  appClaimsButtonColorName = '';

  // button claims main color
  appAllTasksButtonColorName = '';

  // Quicklinks
  translateLinks: Subscription;

  // error handling
  errorMessage: string;

  // Generic chromatic settings
  elandGenericColors = [
    {
      key: 1,
      value: 'hsla(' +
        brandingVariables['elandColdBlue_h'] + ',' +
        brandingVariables['elandColdBlue_s'] + ',' +
        brandingVariables['elandColdBlue_l'] +
        ')',
      name: 'Eland Cold Blue'
    },
    {
      key: 2,
      value: 'hsla(' +
        brandingVariables['elandButtonCpm1_h'] + ',' +
        brandingVariables['elandButtonCpm1_s'] + ',' +
        brandingVariables['elandButtonCpm1_l'] +
        ')',
      name: 'Eland My Tasks Button '
    },
    {
      key: 3,
      value: 'hsla(' +
        brandingVariables['elandButtonCpm2_h'] + ',' +
        brandingVariables['elandButtonCpm2_s'] + ',' +
        brandingVariables['elandButtonCpm2_l'] +
        ')',
      name: 'Eland Claims Button '
    },
    {
      key: 4,
      value: 'hsla(' +
        brandingVariables['elandButtonCpm3_h'] + ',' +
        brandingVariables['elandButtonCpm3_s'] + ',' +
        brandingVariables['elandButtonCpm3_l'] +
        ')',
      name: 'Eland All Tasks Button '
    },
  ];

  mySubscription: any;

  constructor(
    private applicationPreferencesService: ApplicationPreferencesService,
    private alertService: AlertService,
    private router: Router,
    private translate: TranslateService,
    private userService: UserService,
    private utilService: UtilService,
    public appAuthGuard: AppAuthGuard,
    public _domSanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private colorPickerService: ColorPickerService,
    private translateService: TranslateService,
    public validationService: ValidationService,
  ) {
    // languages
    translate.addLangs(config.availableLanguages);
    this.user = this.userService.getCurrentUser();

    // presets
    this.presetColorValues = this.getPresetColorValues();
  }

  ngOnInit(): void {
    // set default preferences
    this.applicationPreferencesInits();

    // init quicklinks
    this.initQLs();

    // init langs
    this.getLangsList();

    // set user role for access to preferences
    this.hasSystemAdministratorAccess = this.user.hasPermission(AccessRights.SYSTEM_ADMINISTRATOR);

    // set language
    const lang = this.utilService.loadLanguagePreferencesFromLocalStorage(this.user.username);
    if (lang) {
      this.translate.use(lang);
      this.initialLang = lang;
      this.nominalLang(this.initialLang);
    }
    // set routes for tabs
    this.route.queryParams.subscribe((settings: { setting: string }) => {
      for (let i = 0; i < this.settings.length; i++) {
        const setting = this.settings[i];
        if (setting.name === settings.setting) {
          this.selectedSettingIndex = i;
        }
      }
    });
  }

  applicationPreferencesInits() {
    this.applicationPreferences = new ApplicationPreferences();
    this.sharingAppPrefs();

    this.applicationPreferences = {
      ... this.applicationPreferences,
      saveQuicklinksValue: true,
      orgMainColor: this.chromaticInits('elandColdBlue_h', 'elandColdBlue_s', 'elandColdBlue_l', 'elandColdBlue_a'),
      appMyTasksButtonColor: this.chromaticInits('elandColdBlue_h', 'elandColdBlue_s', 'elandColdBlue_l', 'elandColdBlue_a'),
      appClaimsButtonColor: this.chromaticInits('elandButtonCpm2_h', 'elandButtonCpm2_s', 'elandButtonCpm2_l', 'elandButtonCpm2_a'),
      appAllTasksButtonColor: this.chromaticInits('elandButtonCpm3_h', 'elandButtonCpm3_s', 'elandButtonCpm3_l', 'elandButtonCpm3_a'),
    };
    this.applicationPreferencesService.setPreferencesToload(this.applicationPreferences);
  }

  sharingAppPrefs() {
    this.applicationPreferencesService.applicationPreferences_sharing.subscribe(
      appPrefs => (this.applicationPreferences = appPrefs));
  }

  // set default  chromatic preferences
  chromaticInits(_h: string, _s: string, _l: string, _a: string): HslaBrand {
    return {
      h: brandingVariables[_h],
      s: brandingVariables[_s],
      l: brandingVariables[_l],
      a: brandingVariables[_a],
    };
  }

  changeLanguage(lang: string): void {
    this.translate.use(lang);
    this.nominalLang(lang);
    const userPreferences: UserPreferences = { username: this.user.username, language: lang };
    this.utilService.saveLanguagePreferencesToLocalStorage(userPreferences);
    this.parametricRoutedReLoad();
  }

  parametricRoutedReLoad() {
    const currentUrl = this.router.url;
    const currentRoute = '/profile-settings';
    const setting = 'session_preferences';

    this.router.navigate([currentUrl]).then(() => {
      setTimeout(() => {
        this.router.navigate([currentRoute], {
          queryParams: { setting },
        });
      }, 1000);
    });
  }

  nominalLang(lang) {
    switch (lang) {
      case 'en':
        this.displayedLang = 'English';
        break;
      case 'fr-SN':
        this.displayedLang = 'Français';
        break;
    }
  }

  getLangsList() {
    this.langs = this.translate.getLangs().map(o => this.toSelectItem(o));
  }
  toSelectItem(_o: string): SelectItem {
    return {
      label: _o,
      value: _o
    };
  }

  getCurrentLang() {
    return this.translate.currentLang;
  }

  // Profile and settings tabs
  handleChange(e: any) {
    const setting = this.settings[e.index].name;
    if (setting) {
      this.router.navigate(['/profile-settings'], { queryParams: { setting } });
    }
    this.selectedSettingIndex = e.index;
  }

  // Main Visual Identity preferences
  visualCoBrandChange(e, field: string) {
    const file = e.srcElement.files[0];
    fileToBase64Url(file).subscribe(base64Url => {
      switch (field) {
        case 'visual_identity':
          this.applicationPreferences.orgVisualIdentity = base64Url;
          break;
        case 'home_page_visual_1':
          this.applicationPreferences.appSliderVisual_1 = base64Url;
          break;
        case 'home_page_visual_2':
          this.applicationPreferences.appSliderVisual_2 = base64Url;
          break;
        case 'home_page_visual_3':
          this.applicationPreferences.appSliderVisual_3 = base64Url;
          break;
      }
      this.applicationPreferencesService.updateApplicationPreferences(this.applicationPreferences);
    });
  }

  //  hsla, Hsva and string conversions

  onChangeColorHsla(e: any, field: string) {
    const hsva = this.colorPickerService.stringToHsva(e, true);
    const hsvaToHsla = this.colorPickerService.hsva2hsla(hsva);
    if (hsvaToHsla) {
      switch (field) {
        case 'main_color':
          this.applicationPreferences.orgMainColor = this.reconstructHsla(hsvaToHsla);
          break;
        case 'my_tasks_button_color':
          this.applicationPreferences.appMyTasksButtonColor = this.reconstructHsla(hsvaToHsla);
          break;
        case 'claim_tasks_button_color':
          this.applicationPreferences.appClaimsButtonColor = this.reconstructHsla(hsvaToHsla);
          break;
        case 'all_tasks_button_color':
          this.applicationPreferences.appAllTasksButtonColor = this.reconstructHsla(hsvaToHsla);
          break;
      }
      this.setPreferences(
        this.applicationPreferences.orgMainColor,
        this.applicationPreferences.appMyTasksButtonColor,
        this.applicationPreferences.appClaimsButtonColor,
        this.applicationPreferences.appAllTasksButtonColor
      );
    }
  }

  reconstructHsla(color: any): HslaBrand {
    return {
      h: (color.h * 366).toString(),
      s: (color.s * 100).toString() + '%',
      l: (color.l * 100).toString() + '%',
      a: (color.a * 100).toString() + '%'
    };
  }

  getPresetColorValues() {
    return this.elandGenericColors.map(color => color.value);
  }

  // translate inits
  initQLs() {
    this.translateLinks = this.translateService
      .stream(['USER_SETTINGS'])
      .subscribe(values => {
        this.cpPresetLabel = values.USER_SETTINGS.APPLICATION_PREFERENCES_TAB.COLORPICKER_ELAND_GENERIC_COLORS;
        this.cpAddColorButtonText = values.USER_SETTINGS.APPLICATION_PREFERENCES_TAB.COLORPICKER_ELAND_ADD_COLOR;
      });
  }

  quicklinksGroupsHandler(qlgs: Observable<QuicklinksGroup[]>) {
    qlgs.subscribe(_qlgs => {
      this.applicationPreferences.quicklinksGroups = _qlgs;
    });
  }

  setSaveQuicklinksValue(value: boolean) {
    this.applicationPreferences.saveQuicklinksValue = value;
  }

  setPreferences(orgMainColor: HslaBrand,
    buttonMyTasksColor: HslaBrand,
    buttonClaimsColor: HslaBrand,
    buttonAllTasksColor: HslaBrand) {
    document.documentElement.style.setProperty('--eland-cold-blue_h', orgMainColor.h);
    document.documentElement.style.setProperty('--eland-cold-blue_s', orgMainColor.s);
    document.documentElement.style.setProperty('--eland-cold-blue_l', orgMainColor.l);
    document.documentElement.style.setProperty('--eland-cold-blue_a', orgMainColor.a);

    document.documentElement.style.setProperty('--eland-button-cpm1_h', buttonMyTasksColor.h);
    document.documentElement.style.setProperty('--eland-button-cpm1_s', buttonMyTasksColor.s);
    document.documentElement.style.setProperty('--eland-button-cpm1_l', buttonMyTasksColor.l);
    document.documentElement.style.setProperty('--eland-button-cpm1_a', buttonMyTasksColor.a);

    document.documentElement.style.setProperty('--eland-button-cpm2_h', buttonClaimsColor.h);
    document.documentElement.style.setProperty('--eland-button-cpm2_s', buttonClaimsColor.s);
    document.documentElement.style.setProperty('--eland-button-cpm2_l', buttonClaimsColor.l);
    document.documentElement.style.setProperty('--eland-button-cpm2_a', buttonClaimsColor.a);

    document.documentElement.style.setProperty('--eland-button-cpm3_h', buttonAllTasksColor.h);
    document.documentElement.style.setProperty('--eland-button-cpm3_s', buttonAllTasksColor.s);
    document.documentElement.style.setProperty('--eland-button-cpm3_l', buttonAllTasksColor.l);
    document.documentElement.style.setProperty('--eland-button-cpm3_a', buttonAllTasksColor.a);
  }

  saveAppPrefs(applicationPreferences: ApplicationPreferences, form: NgForm) {

    // sharing preferences data
    this.applicationPreferencesService.setPreferencesToload(applicationPreferences);

    if (form.invalid) {
      const errorResult = this.validationService.validateForm(form);
      this.errorMessage = errorResult.toMessage();
      return this.alertService.error(errorResult.message);
    }

    // saving preferences data
    const saveAppPrefsObs = applicationPreferences.appPrefsId ?
      this.applicationPreferencesService.updateApplicationPreferences(applicationPreferences)
      : this.applicationPreferencesService.createApplicationPreferences(applicationPreferences);

    saveAppPrefsObs.subscribe(
      newApplicationPref => {
        this.alertService.success('API_MESSAGES.SAVE_SUCCESSFUL');
        this.refresh.emit(true);
      },
      err => this.alertService.apiError(err));
  }

}
