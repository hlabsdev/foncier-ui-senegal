import { registerLocaleData } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import localeFrSnExtra from '@angular/common/locales/extra/fr-SN';
import localeFrSn from '@angular/common/locales/fr-SN';
import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ngxUiLoaderConfig, noBackgroundPreloading } from '@app/core/app-config/preloader.config';
import { defaultLocale } from '@app/core/utils/locale.constants';
import { DataModule } from '@app/data/data.module';
import { TasksMainComponent } from '@app/registration/task/tasks.main.component';
import { QuicklinkModule } from '@features/quicklink/quicklink.module';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AngularSplitModule } from 'angular-split';
import { DragulaModule } from 'ng2-dragula';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { NgxUiLoaderHttpModule, NgxUiLoaderModule, NgxUiLoaderRouterModule } from 'ngx-ui-loader';
import { environment } from '../environments/environment';
import { AdminModule } from './admin/admin.module';
import { AppComponent } from './app.component';
import { RoutingModule } from './app.routes';
import { ConfigService } from './core/app-config/config.service';
import { CoreModule } from './core/core.module';
import { AppFooterComponent } from './core/layout/theme/footer/app.footer.component';
import { AppHeaderComponent } from './core/layout/theme/header/app.header.component';
import { AppAuthGuard } from './core/utils/keycloak/app-auth-guard';
import { KeyCloakInitService } from './core/utils/keycloak/app-init';
import { DashboardModule } from './dashboard/dashboard.module';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { HomeComponent } from './home/home.component';
import { ProfileSettingsModule } from './profile-settings/profile-settings.module';
import { rootReducers } from './reducers/index';
import { RegistrationModule } from './registration/registration.module';
import { TaskStateManagerService } from './registration/task/taskManager.service';
import { WorkstationModule } from './workstation/workstation.module';
import { TranslationModule } from '@app/translation/translation.module';
import { FormsRepository } from '@app/forms.repository';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

registerLocaleData(localeFrSn, localeFrSnExtra);

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, `./assets/translations/`, '.json');
}

export function configFactory(
  configService: ConfigService,
  keyCloakInitService: KeyCloakInitService
): Function {
  return () =>
    configService
      .getPublicConfig()
      .then(() => keyCloakInitService.initialize())
      .then(() => {
        if ( keyCloakInitService.isAuthenticated()) {
          configService.getCamundaEngine();
        }
      })
      .catch(() => {
        window.location.href = `${window.location.origin}/50x.html`;
      });
}

@NgModule({
  imports: [
    RoutingModule,
    BrowserModule,
    CoreModule,
    ReactiveFormsModule,
    HttpClientModule,
    RegistrationModule,
    DragulaModule,
    WorkstationModule,
    BrowserAnimationsModule,
    DashboardModule,
    AdminModule,
    TranslationModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    NgxUiLoaderRouterModule.forRoot({ exclude: noBackgroundPreloading }),
    NgxUiLoaderHttpModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    StoreModule.forRoot(rootReducers, {
      runtimeChecks: {
        strictStateImmutability: true,
        strictStateSerializability: true,
        strictActionImmutability: false,
        strictActionSerializability: false,
        strictActionWithinNgZone: false
      }
    }),
    !environment.production
      ? StoreDevtoolsModule.instrument({
        maxAge: 25
        // logOnly: environment.production // Restricting state management to log-only mode
      })
      : [],

    //// Keep permanentaly in code : to be connected later to RouterModule when lazy-loading is implemented
    // StoreRouterConnectingModule.forRoot({
    // 	stateKey: 'router'
    // }),
    EffectsModule.forRoot([]),
    SwiperModule,
    AngularSplitModule.forRoot(),
    QuicklinkModule,
    ProfileSettingsModule,
    DataModule
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    AppHeaderComponent,
    AppFooterComponent,
    TasksMainComponent,

    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
  ],
  providers: [
    ConfigService,
    KeyCloakInitService,
    TaskStateManagerService,
    {
      provide: APP_INITIALIZER,
      useFactory: configFactory,
      deps: [ConfigService, KeyCloakInitService],
      multi: true
    },
    { provide: LOCALE_ID, useValue: defaultLocale },
    AppAuthGuard,
    FormsRepository,
  ],
  entryComponents: [],
  bootstrap: [AppComponent],
  exports: [RouterModule]
})
export class AppModule {
}
