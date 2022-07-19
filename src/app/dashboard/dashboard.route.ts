
import { Routes, RouterModule } from '@angular/router';
import { AppAuthGuard } from '../core/utils/keycloak/app-auth-guard';
import { TasksBoardComponent } from './tasks-board/tasks-board.component';
import { ProcessesBoardComponent } from './processes-board/processes-board.component';
import { ProcessDefinitionComponent } from './processes-board/process-definition.component';


const ROUTES: Routes = [
  { path: 'dashboard/tasks', component: TasksBoardComponent, canActivate: [AppAuthGuard] },
  { path: 'dashboard/processes', component: ProcessesBoardComponent, canActivate: [AppAuthGuard] },
  { path: 'dashboard/processes/:processId', component: ProcessDefinitionComponent, canActivate: [AppAuthGuard] },
];

export const DashboardRoute = RouterModule.forChild(ROUTES);
