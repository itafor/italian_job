import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { TaskManagerService } from 'src/app/taskmanager/taskmanager.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AlertService } from 'src/app/components/alert/alert.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';

interface ProjectResponse {
  projectData: any[];
}

interface GoalsResponse {
  goal: any[];
}

interface GoalResponse {
  goal;
  taskList: any[];
  columnList: any[];
}



@Component({
  selector: 'app-goals',
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.scss']
})
export class GoalsComponent implements OnInit {

  constructor(private taskmanagerService: TaskManagerService,
    private route: ActivatedRoute, public toastr: ToastrManager,
    private fb: FormBuilder,
    private alertService: AlertService) { }

  public form: FormGroup;
  public checkForUpdates = [
    'name',
    'description',
    'startDate',
    'stopDate'

  ];
  openTabs: any[] = [];
  projectInfo;
  projectID;
  rows = [];
  count = 0;
  offset = 0;
  limit = 50;
  goalList: any[];
  loading = false;
  startDate;
  stopDate;
  goalInfo;
  taskList = [];
  columnList: any[];
  goalData;
  goalAddedTask;
  emptyTasks;
  unassigned;
  newAssignedTaskList;

  @ViewChild('goalsTabSet') refNgbTabset: NgbTabset;

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.projectID = params['id'];
    });
    this.fetchProjectInfo();
    this.fetchgoals();
  }

  newTabHandler(): void {
    if (this.createGoalsNewTab()) {
      this.addToTabs();
      this.focusOnCreatedTab();
    } else {
      this.toastr.warningToastr('Tab already open', null);
    }
    return;
  }

  createGoalsNewTab(): boolean {
    const newTabsOpen = this.openTabs.filter(tabsOpen => tabsOpen.type === 'CREATE_GOALS');
    if (newTabsOpen.length > 0) {
      return false;
    }
    return true;
  }


  goalsSuccessHandler(goalCreated, tabIndex: number, idToClose?: string): void {
    this.closeTab(null, tabIndex, idToClose);
    this.fetchgoals();
  }
  get latestTabId(): string {
    return `tab-id-${this.openTabs.length - 1}`;
  }

  tabIdForIndex(index: number): string {
    return `tab-id-${index}`;
  }

  addToTabs(title?: string, tabContent?: any, type?: string, id?: string): void {
    let newTab;
    if (!title) {
      newTab = { title: 'New Goal', type: 'CREATE_GOALS' };
    }
    else if (type === 'VIEW_GOALS') {
      newTab = { title, content: tabContent, type: 'VIEW_GOALS', id };
    }
    else if (type === 'UPDATE_GOALS') {
      newTab = { title, content: tabContent, type: 'UPDATE_GOALS', id };
    }

    this.openTabs.push(newTab);
  }

  closeTab(event?: MouseEvent, index?: number, id?: string): void {
    let indexes: number[] = [];
    if (index || typeof index === 'number') {
      indexes.push(index);
    }
    if (event) {
      event.preventDefault();
    }
    if (id) {
      // get index from ID
      const indexFromID = this.openTabs.findIndex(tab => tab.id === id);
      if (indexFromID > -1) {
        indexes.push(indexFromID);
      }
    }
    this.removeFromTab(indexes);
    this.focusOnCreatedTab();
  }

  removeFromTab(indexes: number[]): void {

    indexes.forEach(i => {
      this.openTabs.splice(i, 1);
    });

  }
  focusOnCreatedTab() {
    setTimeout(() => { this.refNgbTabset.select(this.latestTabId); }, 50);
  }


  fetchProjectInfo() {
    this.taskmanagerService.fetchTaskboardColumns(this.projectID).subscribe((projectData: ProjectResponse) => {
      if (projectData) {
        this.projectInfo = projectData;
      }
    });
  }

  fetchgoals() {
    this.taskmanagerService.fetchGoals(this.projectID).subscribe((data: GoalsResponse) => {
      if (data) {
        this.goalList = data.goal;
      }
      this.onPage(data);
      this.page(this.offset, this.limit);
    });
  }

  page(offset, limit) {
    this.count = this.goalList.length;
    const start = offset * limit;
    const end = start + limit;
    const rows = [...this.rows];

    for (let i = start; i < end; i++) {
      rows[i] = this.goalList[i];
    }

    this.rows = rows;

  }


  onPage(goal) {
    this.page(goal.offset, goal.limit);
  }

  refreshTable(tabChangeEvent) {
    if (tabChangeEvent['nextId'] === 'goals') {
      this.fetchgoals();
    }
  }


  isBtnDisabled() {
    return this.form.invalid || this.loading;
  }

  updateGoalHandler(content) {
    this.addToTabs(`Updating ${content.goalSecret.name}`, content, 'UPDATE_GOALS');
    this.goalData = content;
    this.form = this.fb.group({
      name: [content.goalSecret.name, Validators.compose([Validators.required])],
      description: [content.goalSecret.description, Validators.compose([Validators.required])],
      startDate: [content.goalSecret.startDate, Validators.compose([Validators.required])],
      stopDate: [content.goalSecret.stopDate, Validators.compose([Validators.required])],
    });
    this.focusOnCreatedTab();
  }


  viewGoalHandler(content) {
    this.addToTabs(`${content.goalSecret.name}`, content, 'VIEW_GOALS', content.id);
    this.focusOnCreatedTab();
  }

  closeUpdateGoalHandler(content) {
    this.closeTab(null, content);
  }


  get f() {
    return this.form.controls;
  }

  onUpdate(evt: Event) {
    evt.preventDefault();
    this.loading = true;

    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    const name = this.f.name.value;
    const description = this.f.description.value;
    const startDate = new Date(this.f.startDate.value);
    const stopDate = new Date(this.f.stopDate.value);
    const updatedFields: string[] = this.checkForUpdates;
    this.taskmanagerService.updateGoal(this.projectID, this.goalData.id, name, description, startDate, stopDate, updatedFields)
      .pipe()
      .subscribe(
        successRes => {
          this.fetchgoals();
          this.toastr.successToastr('Goal Updated Successfully', null, { maxShown: 1 });
          this.closeUpdateGoalHandler(this.goalData.id);
          this.form.reset();
        },
        error => {
          this.loading = false;
          this.alertService.error(error, true);
        },
        () => {
          this.loading = false;
        }

      );
  }


}
