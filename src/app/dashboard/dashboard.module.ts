import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksBoardComponent } from './tasks-board/tasks-board.component';
import { DashboardRoute } from './dashboard.route';
import { CoreModule } from '@app/core/core.module';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { FieldsetModule } from 'primeng/fieldset';
import { PanelModule } from 'primeng/panel';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ProcessesBoardComponent } from './processes-board/processes-board.component';
import { ProcessDefinitionComponent } from './processes-board/process-definition.component';

@NgModule({
  declarations: [TasksBoardComponent, ProcessesBoardComponent, ProcessDefinitionComponent],
  imports: [
    CommonModule, DashboardRoute, CoreModule, AutoCompleteModule, DynamicDialogModule, FieldsetModule, PanelModule
  ]
})
export class DashboardModule { }
