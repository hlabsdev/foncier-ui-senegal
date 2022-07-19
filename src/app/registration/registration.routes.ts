import { Routes, RouterModule } from '@angular/router';
import { TasksComponent } from './task/tasks.component';
import { TasksMainComponent } from './task/tasks.main.component';
import { DeploymentsComponent } from './deployment/deployments.component';
import { ProcessesComponent } from './process/processes.component';
import { TaskFormComponent } from './task/taskForm.component';

import { AppAuthGuard } from '../core/utils/keycloak/app-auth-guard';

const TRANSACTION_ROUTES: Routes = [
  { path: 'tasks', component: TasksComponent, canActivate: [AppAuthGuard] },
  { path: 'tasks/:groupId', component: TasksComponent, canActivate: [AppAuthGuard] },
  { path: 'task/:taskId', component: TaskFormComponent, canActivate: [AppAuthGuard] },

  { path: 'deployments', component: DeploymentsComponent, canActivate: [AppAuthGuard] },
  { path: 'processes', component: ProcessesComponent, canActivate: [AppAuthGuard] },

  { path: 'tasks-list/:taskId', component: TasksMainComponent, canActivate: [AppAuthGuard] },
  { path: 'tasks-list', component: TasksMainComponent, canActivate: [AppAuthGuard] },
];

export const RoutingModule = RouterModule.forChild(TRANSACTION_ROUTES);
