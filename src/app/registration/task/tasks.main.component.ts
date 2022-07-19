import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Task } from '@app/core/models/task.model';
import { Subscription } from 'rxjs';
import { TaskStateManagerService } from './taskManager.service';

@Component({
  templateUrl: './tasks.main.component.html'
})
export class TasksMainComponent implements OnInit, OnDestroy {
  sidebarFormat: string;
  taskId: string;
  changeTaskListViewSub: Subscription;
  taskSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    protected taskManagerService: TaskStateManagerService,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      if (params['taskId']) {
        this.taskManagerService.changeSelectedTask(
          new Task({ id: params['taskId'] })
        );
      }
    });

    this.changeTaskListViewSub = this.taskManagerService.changeTaskListViewChange$.subscribe(
      value => {
        this.sidebarFormat = value;
      }
    );

    this.taskSub = this.taskManagerService.selectedTaskChange$.subscribe(
      task => {
        this.taskId = task ? task.id : null;
      }
    );
  }

  changeTaskView(viewType: string) {
    this.taskManagerService.changeTaskListView(viewType);
  }

  ngOnDestroy(): void {
    this.changeTaskListViewSub.unsubscribe();
    this.taskSub.unsubscribe();
  }
}
