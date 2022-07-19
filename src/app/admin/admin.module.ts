import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ParametersModule } from '@app/admin/parameters/parameters.module';
import { TranslateModule } from '@ngx-translate/core';
import { DragulaModule } from 'ng2-dragula';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { CheckboxModule, DropdownModule, InputTextareaModule, SelectButtonModule, SplitButtonModule, TabViewModule } from 'primeng';
import { CoreModule } from '@app/core/core.module';
import { TransactionHistoryService } from '@app/core/services/transactionHistory.service';
import { TransactionInstanceService } from '@app/core/services/transactionInstance.service';
import { AppAuthGuard } from '@app/core/utils/keycloak/app-auth-guard';
import { RoutingModule } from './admin.route';
import { CodeListComponent } from './codeList/codeList.component';
import { CodeListsComponent } from './codeList/codeLists.component';
import { BlockerRRRElementComponent } from './rrr-validation/blocker-rrr-element.component';
import { BlockerRRRsComponent } from './rrr-validation/blocker-rrrs.component';
import { RRRValidationPartyRoleElementComponent } from './rrr-validation/rrr-validation-party-role-element.component';
import { RRRValidationPartyRolesComponent } from './rrr-validation/rrr-validation-party-roles.component';
import { RRRValidationComponent } from './rrr-validation/rrr-validation.component';
import { RRRValidationFormComponent } from './rrr-validation/rrr-validation.form.component';
import { RRRValidationsComponent } from './rrr-validation/rrr-validations.component';
import { RRRValidationService } from './rrr-validation/service/rrr-validation.service';
import { TransactionInstancesComponent } from './transactionInstance/transactionInstances.component';


@NgModule({
  imports: [
    RoutingModule, CoreModule, TabViewModule, CheckboxModule, DropdownModule, ParametersModule,
    SelectButtonModule, SplitButtonModule, DragulaModule, TranslateModule, InputTextareaModule, NgxUiLoaderModule,
  ],
  declarations: [
    CodeListsComponent, CodeListComponent,
    TransactionInstancesComponent, RRRValidationsComponent, RRRValidationComponent,
    RRRValidationFormComponent, RRRValidationPartyRolesComponent, RRRValidationPartyRoleElementComponent,
    BlockerRRRsComponent, BlockerRRRElementComponent
  ],
  exports: [
    CodeListComponent, RouterModule, ParametersModule,
    RRRValidationsComponent, RRRValidationComponent, RRRValidationFormComponent,
    RRRValidationPartyRolesComponent, RRRValidationPartyRoleElementComponent,
    BlockerRRRsComponent, BlockerRRRElementComponent
  ],
  providers: [
    AppAuthGuard, TransactionInstanceService, TransactionHistoryService,
    RRRValidationService
  ],
})
export class AdminModule { }
