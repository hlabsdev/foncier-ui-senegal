import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuicklinkModule } from '@features/quicklink/quicklink.module';
import { CoreModule } from '@app/core/core.module';
import { ColorPickerModule } from 'ngx-color-picker';
import { AppAuthGuard } from '../core/utils/keycloak/app-auth-guard';
import { ProfileSettingsComponent } from './profile-settings.component';

const PROFILE_SETTING_ROUTES: Routes = [
  { path: 'profile-settings', component: ProfileSettingsComponent, canActivate: [AppAuthGuard] },
  { path: 'profile-settings?setting=user_profile', component: ProfileSettingsComponent, canActivate: [AppAuthGuard] },
  { path: 'profile-settings?setting=session_preferences', component: ProfileSettingsComponent, canActivate: [AppAuthGuard] },
  { path: 'profile-settings?setting=application_preferences', component: ProfileSettingsComponent, canActivate: [AppAuthGuard] }
];

@NgModule({
  imports: [CoreModule, RouterModule.forChild(PROFILE_SETTING_ROUTES), QuicklinkModule, ColorPickerModule],
  declarations: [
    ProfileSettingsComponent,
  ],
  exports: [ProfileSettingsComponent],
  providers: []
})
export class ProfileSettingsModule { }
