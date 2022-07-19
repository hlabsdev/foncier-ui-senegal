import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TaskService } from '@app/core/services/task.service';
import { CoreModule } from '@app/core/core.module';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { SelectButtonModule } from 'primeng/selectbutton';
import { AppAuthGuard } from '@app/core/utils/keycloak/app-auth-guard';
import { WorkstationModule } from '@app/workstation/workstation.module';
import { DeploymentsComponent } from '@app/registration/deployment/deployments.component';
import { ProcessesComponent } from '@app/registration/process/processes.component';
import { RoutingModule } from '@app/registration/registration.routes';
import { TaskFormComponent } from '@app/registration/task/taskForm.component';
import { TasksComponent } from '@app/registration/task/tasks.component';
import { StepsModule } from 'primeng/steps';
import { UserChoiceComponent } from '@app/registration/task/dialogs/user-choice/user-choice.component';
import { AddCommentComponent } from '@app/registration/task/dialogs/add-comment/add-comment.component';
import { CompleteComponent } from '@app/registration/task/dialogs/complete/complete.component';
import { MultiDialogsComponent } from '@app/registration/task/dialogs/multi-dialogs/multi-dialogs.component';
import { DynamicDialogDirective } from '@app/registration/task/dialogs/multi-dialogs/dynamic-dialog.directive';
import { ChoiceOptionsComponent } from '@app/registration/task/dialogs/choice-options/choice-options.component';
import { TaskDialogsComponent } from '@app/registration/task/dialogs/taskDialogs.component';
import { SteppersComponent } from '@app/registration/task/dialogs/multi-dialogs/steppers.component';
import { TaskDialogsService } from '@app/registration/task/dialogs/taskDialogs.service';
import { DateOptionsComponent } from '@app/registration/task/dialogs/date-options/date-options.component';
import { InputTextModule, TabViewModule } from 'primeng';

@NgModule({
  imports: [
    CoreModule, RoutingModule, WorkstationModule, SelectButtonModule, NgxUiLoaderModule, StepsModule, TabViewModule, InputTextModule
  ], declarations: [
    TasksComponent,
    DeploymentsComponent,
    ProcessesComponent,
    TaskFormComponent,
    UserChoiceComponent,
    AddCommentComponent,
    CompleteComponent,
    UserChoiceComponent,
    MultiDialogsComponent,
    DynamicDialogDirective,
    ChoiceOptionsComponent,
    TaskDialogsComponent,
    SteppersComponent,
    DateOptionsComponent
  ], exports: [
    TasksComponent,
    DeploymentsComponent,
    ProcessesComponent,
    TaskFormComponent,
    RouterModule,
    UserChoiceComponent,
    AddCommentComponent,
    CompleteComponent,
    UserChoiceComponent,
    MultiDialogsComponent,
    ChoiceOptionsComponent,
    SteppersComponent,
    DateOptionsComponent
  ], providers: [
    TaskService,
    AppAuthGuard,
    TaskDialogsService
  ],
  entryComponents: [
    DateOptionsComponent,
    UserChoiceComponent,
    AddCommentComponent,
    CompleteComponent,
    UserChoiceComponent,
    ChoiceOptionsComponent
  ]
})
export class RegistrationModule {
}
