import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AppAuthGuard } from './core/utils/keycloak/app-auth-guard';
import { HomeComponent } from './home/home.component';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
    canActivate: [AppAuthGuard]
  },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },

  { path: 'home', component: HomeComponent, canActivate: [AppAuthGuard] },
  { path: '**', redirectTo: '', canActivate: [AppAuthGuard] }
];

export const RoutingModule = RouterModule.forRoot(APP_ROUTES, { preloadingStrategy: PreloadAllModules });
