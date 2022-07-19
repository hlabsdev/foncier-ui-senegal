import { RouterModule, Routes } from '@angular/router';
import { ParametersComponent } from '@app/admin/parameters/parameters.component';
import { AccessRights } from '@app/core/models/accessRight';
import { AppAuthGuard } from '@app/core/utils/keycloak/app-auth-guard';
import { CodeListComponent } from './codeList/codeList.component';
import { CodeListsComponent } from './codeList/codeLists.component';
import { RRRValidationsComponent } from './rrr-validation/rrr-validations.component';
import { TransactionInstancesComponent } from './transactionInstance/transactionInstances.component';

const ADMIN_ROUTES: Routes = [
  {
    path: 'code-lists', component: CodeListsComponent, canActivate: [AppAuthGuard],
    data: [AccessRights.SYSTEM_ADMINISTRATOR]
  },
  {
    path: 'code-list', component: CodeListComponent, canActivate: [AppAuthGuard],
    data: [AccessRights.SYSTEM_ADMINISTRATOR]
  },
  {
    path: 'code-list/:codeListId', component: CodeListComponent, canActivate: [AppAuthGuard],
    data: [AccessRights.SYSTEM_ADMINISTRATOR]
  },
  {
    path: 'parameters', component: ParametersComponent, canActivate: [AppAuthGuard],
    data: [AccessRights.SYSTEM_ADMINISTRATOR]
  },
  {
    path: 'parameters?param=territory', component: ParametersComponent, canActivate: [AppAuthGuard],
    data: [AccessRights.SYSTEM_ADMINISTRATOR]
  },
  {
    path: 'parameters?param=registry', component: ParametersComponent, canActivate: [AppAuthGuard],
    data: [AccessRights.SYSTEM_ADMINISTRATOR]
  },
  {
    path: 'parameters?param=responsibleOffice', component: ParametersComponent, canActivate: [AppAuthGuard],
    data: [AccessRights.SYSTEM_ADMINISTRATOR]
  },
  {
    path: 'transaction-instances', component: TransactionInstancesComponent, canActivate: [AppAuthGuard],
    data: { accessData: [AccessRights.SEE_TRANSACTION_INSTANCES, AccessRights.SYSTEM_ADMINISTRATOR] }
  },
  {
    path: 'rrr-validations', component: RRRValidationsComponent, canActivate: [AppAuthGuard],
    data: [AccessRights.SYSTEM_ADMINISTRATOR]
  },
  {
    path: 'rrr-validations/:id', component: RRRValidationsComponent, canActivate: [AppAuthGuard],
    data: [AccessRights.SYSTEM_ADMINISTRATOR]
  }
];

export const RoutingModule = RouterModule.forChild(ADMIN_ROUTES);
