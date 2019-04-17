import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskManagerService } from 'src/app/taskmanager/taskmanager.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AlertService } from 'src/app/components/alert/alert.service';
import { Goal, Columns, TaskInterface } from '../../../../interfaces';
import { PriorityColors, Priority } from '../../../../enums';
import { Router } from '@angular/router';


interface ProjectResponse {
  projectData: any[];
}


interface GoalResponse {
  goal: Goal;
  taskList: TaskInterface[];
  columnList: Columns[];
}

@Component({
  selector: 'app-view-goals',
  templateUrl: './view-goals.component.html',
  styleUrls: ['./view-goals.component.scss']
})
export class ViewGoalsComponent implements OnInit {
  goalInfo;
  projectInfo;
  projectID;
  newAssignedTaskList: TaskInterface[] = [];
  emptyTasks;
  taskList;
  taskpageUrl = '/taskmanager/project/';

  @Input() goalData: any;
  constructor(private taskmanagerService: TaskManagerService,
    private route: ActivatedRoute, public toastr: ToastrManager,
    private alertService: AlertService, private router: Router,) { }


  ngOnInit() {
    this.route.params.subscribe(params => {
      this.projectID = params['id'];
    });
    this.fetchProjectInfo();
    this.fetchSingleGoal();
  }


  fetchProjectInfo() {
    this.taskmanagerService.fetchTaskboardColumns(this.projectID).subscribe((projectData: ProjectResponse) => {
      if (projectData) {
        this.projectInfo = projectData;
      }
    });
  }

  fetchSingleGoal() {
    this.taskmanagerService.fetchGoal(this.projectID, this.goalData.id).subscribe((data: GoalResponse) => {
      if (data) {
        this.goalInfo = data.goal;
        this.taskList = data.taskList;
      }
      this.getAssignedTaskList();
      this.taskList;

    });
  }

  getAssignedTaskList() {
    if (this.taskList) {
      this.newAssignedTaskList = this.taskList;
      if (this.newAssignedTaskList.length === 0) {
        this.emptyTasks = false;
      }
      else {
        this.emptyTasks = true;
        this.newAssignedTaskList;
      }
    }
  }

  statusForTask(task: TaskInterface): string {
    if (this.projectInfo) {
      const columnTaskBelongsTo = (this.projectInfo['columnList'] as Columns[]).filter(column => column.id === task.columnId)[0];
      return (columnTaskBelongsTo ? columnTaskBelongsTo.columnSecret.name : 'Unknown');
    }
    return 'Unknown';
  }

  styleForPriority(priority): string {
    if (priority) {
      return `color: ${PriorityColors[priority]}`;
    }
  }
  
  navigateToTaskPage(row) {
    this.router.navigate([`${this.taskpageUrl + this.projectID}/${row.id}`]);
  }

}
