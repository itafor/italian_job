import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DragulaService } from 'ng2-dragula';
import { TaskManagerService } from '../taskmanager.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { Subscription,  fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthenticationService } from '../../account/account.authentication';
import { CustomValidators as QuabblyValidators } from '../../core/forms/validators';
import { TaskManagerDataService } from '../data.service';
import { defaultApiLoadingOrErrorState, Columns, TaskInterface, CommentDetails, Goal, AttachmentDetails } from '../interfaces';
import { GenericUpdateFieldComponent, SubTaskComponent, AttachmentComponent,
  GenericDeleteConfirmationComponent, UpdateColumnVisibiltyComponent } from '../modals';
import { Priority, PriorityColors, PriorityBgColors } from '../enums';
import { ScrollHelperService } from '../scroll-helper.service';
import BaseTaskManagerClass from '../base-task';

interface TaskboardResponse {
  columnList: any[];
  taskList: TaskInterface[];
  project: any[];
  goalList: Goal[];
}

interface NewTask {
  title: string;
  description: string;
  class?: string;
}

interface Taskboard {
  title: string;
  tasks: NewTask[];
  key: string;
}

interface Coords {
  bottom: number;
  right: number;
  left: number;
  top: number;
  x: number;
  y: number;
  height: number;
  width: number;
}

const dragulaGroups: string[] = [];


@Component({
  selector: 'app-taskmanager-task',
  templateUrl: './taskmanager.component.html',
  styleUrls: ['./taskmanager.component.scss', '../task-description.css'],
  encapsulation: ViewEncapsulation.None,
})
export class TaskManagerTaskComponent extends BaseTaskManagerClass implements OnInit, OnDestroy {
  @ViewChild('qeditor') quillobj: ElementRef;
  @ViewChild('editor') refEditor: ElementRef;
  @ViewChild('refTaskboard') taskboardContainerRef: ElementRef;

  public model: any;
  editingState = {
    description: false,
    summary: false,
  };
  subs = new Subscription();


  public columnForm: FormGroup;
  public taskForm: FormGroup;
  public attachmentForm: FormData;
  editorContent: string;
  show = false;
  showMore = true;
  showTitle = true;
  outOfSync = false;
  taskDescSaveBtn = false;
  taskDescSaveLoading = false;
  showInput = false;
  realname = 'todo';
  quillHtml = '';
  inputText = '';
  closeResult: string;
  disbtn;
  column_name;
  task_name;
  defaultcomment = '';
  disableBtn = false;
  disBtn = false;
  submitting = false;
  loading = false;
  attachmentLoading = false;
  taskname;
  description;
  tasknameInputMaxErr = false;
  selectedBoardItemToEditKey: string = null;
  listProjectUrl = '/taskmanager/list-projects';
  currentTaskboardId;
  toastrTimer = 6000;
  toastrInfoTimer = 4000;
  taskboardColumnList: any[] = [];
  alltasks: any[] = [];
  selectedtasksummary;
  projectName;
  subtaskfield = false;
  selectedTaskId;
  selectedTaskLog: any[] = [];
  selectedTaskData;
  currenttaskdescription;
  newtaskdetails;
  savethistaskdescription;
  selectedTaskSubTasks: any[] = [];
  selectedTaskComments: any[] = [];
  tasksummaryenter;
  commentarea;
  tasksummaryabouttoedit;
  mobilescreen = false;
  attachmentFile;
  user;
  tasksloader = true;
  selectedTaskWatchers: any[] = [];
  allColumnData;
  selectedColumnData;
  selectedAttachments;
  uploadedattachments;
  selectedTaskAssignee;
  attachmentModal;
  viewwatchers = false;
  iamwatching = false;
  currentsubtasksummaryinput;
  allUsers;
  displayassignee;
  quillplaceholder;
  quillmodules;
  columnsWithCount: any;
  updatingAssignee = false;
  allTaskList;
  taskListGroupedByColumn;
  updatingStatus = false;
  watcherApiCallLoading = false;

  showRightScroller = false;
  showLeftScroller = true;

  apiCallState = {
    status: defaultApiLoadingOrErrorState,
    assignee: defaultApiLoadingOrErrorState,
    priority: defaultApiLoadingOrErrorState,
    goal: defaultApiLoadingOrErrorState,
    taskSummary: defaultApiLoadingOrErrorState,
    taskDescription: defaultApiLoadingOrErrorState,
    subTask: defaultApiLoadingOrErrorState,
    attachments: defaultApiLoadingOrErrorState,
  };

  statusesAvailableToUpdateTo: Columns[];


  newTask: NewTask = {
    title: '',
    description: ''
  };

  public coords = {
    body: null,
    taskboard: null
  };

  constructor(
    private modalService: NgbModal,
    private dragulaService: DragulaService,
    taskmanagerService: TaskManagerService,
    public toastr: ToastrManager,
    private actvroute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    auth: AuthenticationService,
    public dataService: TaskManagerDataService,
    private scrollHelper: ScrollHelperService,
    ) {
      super(auth, taskmanagerService, true);
    }


  ngOnInit() {
    if (this.actvroute.snapshot.params.id) {
      this.currentTaskboardId = this.actvroute.snapshot.params.id;
    } else {
      this.router.navigate([this.listProjectUrl]);
    }

    this.columnForm = this.fb.group({
      columnName: [null, Validators.compose([Validators.required, Validators.minLength(2)])]
    });

    this.taskForm = this.fb.group({
      summary: [null, Validators.compose([Validators.required, Validators.minLength(2)])]
    });

    this.fetchTaskboardColumns();
    this.dragtechnology();
    // this.getAllUser();

    if (window.screen.width === 360) { // 768px portrait
      this.mobilescreen = true;
    } else {
      this.mobilescreen = false;
    }

    this.user = JSON.parse(localStorage.getItem('currentUser'));

    // GET Fresh data regardless
    this.auth.populateEmailsOfPeopleInMyOrganization();
    this._taskService.populateDetailsOfMembersInProject(this.currentTaskboardId);
  }

  removeblur() {
    document.getElementById('renoveblur').blur();
  }

  tasksInColumns(taskList: any[]) {
    const columns = {};
    taskList.forEach(list => {
      if (columns[list['columnId']]) {
        columns[list['columnId']]++;
      } else {
        columns[list['columnId']] = 1;
      }
    });
    return columns;
  }

  fetchTaskboardColumns() {
    this._taskService.fetchTaskboardColumns(this.currentTaskboardId).subscribe(
      (data: TaskboardResponse) => {
      if (data) {
        this.updateprojectname(data);
        this.allColumnData = data;
        this.tasksloader = false;
        this.goals = data.goalList || [];
        if (data.taskList) {
          const thethis = this;
          const taskListData = data.taskList;
          this.allTaskList = data.taskList;
          this.dataService.setCachedColumns(data.columnList);
          const reversedTaskListData: any[] = [];
          let counttasklist = 1;
          taskListData.slice().reverse().forEach(function(eachtasklist) {
            reversedTaskListData.push(eachtasklist);
            if (counttasklist === taskListData.length) {
              thethis.alltasks = reversedTaskListData;
            }
            counttasklist++;
          });
          this.initVectorMath();
          this.columnsWithCount  = this.tasksInColumns(reversedTaskListData);
          this.taskListGroupedByColumn = this.groupArrayByKey(reversedTaskListData, 'columnId');
        }
        this.taskboardColumnList = data.columnList;
        this.bootstrapScrollHelpers();
      }
    },
    _ => {
      this.router.navigateByUrl('/taskmanager/projects');
    });
  }

  getTaskDataCount(taskList, type) {
    let count = 0;
    if (taskList && taskList.taskSecret && taskList.taskSecret[type]) {
      count = taskList.taskSecret[type].length;
    }
    return count;
  }

  groupArrayByKey(xs, key) {
    return xs.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }


  getAllUser() {
    this._taskService.getAllUser()
      .pipe(first())
      .subscribe(
        data => {
          this.allUsers = data.data;
        },
        error => {

        });
  }

  updateprojectname(data) {
    this.projectName = data.project.projectSecret.name;
  }

  handleResize(evt) {
    this.calculateDims();
  }

  calculateDims(): void {
    this.coords.body = document.getElementsByTagName('body')[0].getBoundingClientRect();
    this.coords.taskboard = this.taskboardContainerRef.nativeElement.getBoundingClientRect();
  }

  initVectorMath() {
    // get width of body
   this.calculateDims();
   const context = this;
    // add an event listener to resize - so its updated
    window.addEventListener('resize', function(evt) {
      context.handleResize(evt);
    });
    // doubt you can resize and drag at the same time
  }

  scrollContainer(pos: { dir: string }, scrollSize?: number ) {
    if (pos.dir === 'RIGHT') {
      this.taskboardContainerRef.nativeElement.scrollLeft += scrollSize || 50; // keep as constant
    } else if (pos.dir === 'LEFT') {
      this.taskboardContainerRef.nativeElement.scrollLeft -= scrollSize || 50;
    }
  }

  dragtechnology() {

    // this.subs.unsubscribe();
    // this.subs = new Subscription();
    // this.dragulaService.destroy("rearrangetaskcolumns");
    let dragStart;
    // listen to drag
    // so I can scroll when near an extermity
    const PADDINGALLOWANCE = 40;
    dragulaGroups.push('rearrangetask');
    this.subs.add(this.dragulaService.drag('rearrangetask')
      .subscribe(({ name, el, source }) => {
        dragStart = fromEvent(document, 'mousemove');

        dragStart.pipe(
          takeUntil(fromEvent(document, 'mouseup'))
        ).subscribe((mouseEvt: MouseEvent) => {
          if ((mouseEvt.pageX + PADDINGALLOWANCE) > (this.coords.taskboard.width + this.coords.taskboard.left))  {
            this.scrollContainer({dir: 'RIGHT' });
          } else if ( mouseEvt.pageX < (PADDINGALLOWANCE + this.coords.taskboard.left) ) {
            this.scrollContainer({ dir: 'LEFT' });
          }
        });
      }));

      // scroll backwards i.e. actual scrollleft do scrollLeft -= px
      // forward i.e. roght scrollLeft += px

    // To Listen for Task Rearrangement Only
    this.subs.add(this.dragulaService.drop('rearrangetask')
      .subscribe(({ name, el, target, source, sibling }) => {
        this.submitTaskRearrangement(el.getAttribute('data-taskid') || '',
        target.getAttribute('data-columnid') || '', source.getAttribute('data-columnid') || '');
      })
    );

    dragulaGroups.push('rearrangetaskcolumns');
    // To Restrict Move only when it is on an element with a class ---- "thecolumntomove"
    this.dragulaService.createGroup('rearrangetaskcolumns', {
      moves: (el, container, handle) => {
        if (handle.className === 'thecolumntomove') {
          return true;

        }
      },
      direction: 'horizontal',
    });

    this.subs.add(this.dragulaService.drag('rearrangetaskcolumns')
    .subscribe(() => {
      fromEvent(document, 'mousemove').pipe(
        takeUntil(fromEvent(document, 'mouseup'))
      ).subscribe( (mouseEvt: MouseEvent) => {
        if ((mouseEvt.pageX + PADDINGALLOWANCE) > (this.coords.taskboard.width + this.coords.taskboard.left))  {
          this.scrollContainer({dir: 'RIGHT' });
        } else if ( mouseEvt.pageX < (PADDINGALLOWANCE + this.coords.taskboard.left) ) {
          this.scrollContainer({ dir: 'LEFT' });
        }
      });
    }));

    function pluckIdFromDiv(div: HTMLDivElement | HTMLElement | Element): string {
      return div.getAttribute('data-column_id') || '';
    }

    // To Listen for Column Rearrangement
    this.subs.add(this.dragulaService.drop('rearrangetaskcolumns')
      .subscribe(({ name, el, target, source, sibling }) => {
        const allTWs = Array.from(target.querySelectorAll('.taskboard-wrapper'));
        let cids = [];
        cids = Array.from(target.querySelectorAll('.taskboard-wrapper')).map(c => pluckIdFromDiv(c));
        console.log(cids.length);
        // assert lengths here - just in case
        // and force reload
        // confirm column list changed
        this.rearrangetaskcolumnscall(cids);
      })
    );

  }

  submitTaskRearrangement(taskId: string, columnId: string, oldColumnId: string) {
    this._taskService.rearrangeTaskPosition(this.currentTaskboardId, taskId, columnId)
      .pipe(first())
      .subscribe(
        data => {
          if (oldColumnId) {
            this.updateTasksInColumnCount(oldColumnId, data['task'].columnId);
          }
        });
  }

  updateTasksInColumnCount(idOfColumnRemovedFrom: string, idOfColumnAddedTo: string): void {
    this.columnsWithCount = { ...this.columnsWithCount,
      [idOfColumnRemovedFrom]: this.columnsWithCount[idOfColumnRemovedFrom] - 1,
    [idOfColumnAddedTo]: this.columnsWithCount[idOfColumnAddedTo] ? this.columnsWithCount[idOfColumnAddedTo] + 1 : 1 };
  }

  // if you wanna use this
  // beware innerHTML
  getTaskVerticalPosition(taskId, target) {
    let position = 0; let taskverticalposition = 0;
    for (const taskelement of target.children) {
      for (const taskdata of taskelement.children) {
        if (taskdata.children[2].innerHTML === taskId) {
          taskverticalposition = position;
          this.submitTaskRearrangeVertically(taskId, position);
        }
        position++;
      }
    }
  }

  submitTaskRearrangeVertically(taskId, position) {
    this._taskService.rearrangeTaskPositionVertically(this.currentTaskboardId, taskId, position)
      .pipe(first())
      .subscribe(
        data => {
          this.fetchTaskboardColumns();
      });
  }


  rearrangetaskcolumnscall(columnarray) {
    this._taskService.repositionColumn(columnarray, this.currentTaskboardId)
      .pipe(first())
      .subscribe(
        (data: {status: string; columnList: Columns[]}) => {
          // set cached columns tho!!!
          // so on opening modal and clicking task page
          // the new order of columns is reflected
          this.dataService.setCachedColumns(this.sortItemsByPosition(data.columnList));
          // this.columnsWithCount  = this.tasksInColumns(reversedTaskListData);
        },
        error => {
          this.notifyOutOfSync();
        });
  }

  sortItemsByPosition(items: { position: number }[]): any[] {
    return items.sort((a, b) => (a.position > b.position) ? 1 : -1 );
  }

  submitForm() {

    // stop here if form is invalid
    if (this.columnForm.invalid) {
      return;
    }

    this.loading = true;
    this.disableBtn = true;

    const columnName = this.columnForm.controls.columnName.value;

    this.submitting = true;

    this._taskService.addColumnToTaskboard(columnName, this.currentTaskboardId)
      .pipe(first())
      .subscribe(
        data => {
          this.modalService.dismissAll();
          this.loading = false;
          this.toastr.successToastr('Successful', null, {toastTimeout: this.toastrTimer, maxShown: 1} );
          this.fetchTaskboardColumns();
          this.columnForm.reset();
          this.disableBtn = false;
        },
        error => {
          this.modalService.dismissAll();
          this.loading = false;
          this.toastr.errorToastr(error, null, {toastTimeout: this.toastrTimer, maxShown: 1} );
          this.fetchTaskboardColumns();
          this.disableBtn = false;
        });
  }

  initColumnName(event) {
    event.srcElement.style.display = 'none';
    event.srcElement.parentElement.children[1].style.display = 'block';
  }

  updateColumnName(event) {
    this.toastr.infoToastr('Updating Column Name', null, {toastTimeout: 1000, maxShown: 1});
    const name = event.srcElement.parentElement.parentElement.children[0].value;
    const columnId = event.srcElement.parentElement.parentElement.children[1].value;
    this._taskService.renameColumn(this.currentTaskboardId, name, columnId)
      .pipe(first())
      .subscribe(
        data => {
          this.toastr.successToastr('Successful', null, {toastTimeout: this.toastrTimer, maxShown: 1} );
          this.fetchTaskboardColumns();
        },
        error => {
          this.toastr.errorToastr(error, null, {toastTimeout: this.toastrTimer, maxShown: 1} );
          this.fetchTaskboardColumns();
        });
  }

  submitTaskForm() {

    // stop here if form is invalid
    if (this.taskForm.invalid) {
      return;
    }

    this.loading = true;
    this.disableBtn = true;

    const summary = this.taskForm.controls.summary.value;

    this.submitting = true;

    this._taskService.createTaskOnTaskboard(this.currentTaskboardId, summary)
      .pipe(first())
      .subscribe(
        data => {
          this.modalService.dismissAll();
          this.loading = false;
          this.toastr.successToastr('Successful', null, {toastTimeout: this.toastrTimer, maxShown: 1} );
          this.fetchTaskboardColumns();
          this.taskForm.reset();
          this.disableBtn = false;
        },
        error => {
          this.loading = false;
          this.toastr.errorToastr(error, null, {toastTimeout: this.toastrTimer, maxShown: 1} );
          this.fetchTaskboardColumns();
          this.disableBtn = false;
        });
  }

  inputCreateSubtask(summary: string) {
    if (!summary.trim().length) {
      return;
    }
    this.subtaskfield = false;
    this.doCreateSubTask(summary);
  }

  buttonCreateSubTask() {
    this.doCreateSubTask(this.currentsubtasksummaryinput);
  }

  doCreateSubTask(value) {
    this.updateSliceFromApiCallState('subTask', { loading: true, error: false, message: null });
    this._taskService.createSubTask(this.currentTaskboardId, value, this.selectedTaskId)
      .pipe(first())
      .subscribe(
        data => {
          this.hidesubtaskfield();
          this.updateSliceFromApiCallState('subTask', { loading: false, error: false, message: 'Created' });
          this.clearMessages('subTask');
          this.getTask(this.selectedTaskId);
        },
        error => {
          this.updateSliceFromApiCallState('subTask', { loading: false, error: true, message: 'An error occured' });
          this.clearMessages('subTask');
        });
  }

  initUpdateSubTaskSummary(event) {
    event.srcElement.parentElement.children[1].style.display = 'none';
    event.srcElement.parentElement.children[2].style.display = 'block';
    event.srcElement.parentElement.children[3].style.display = 'block';
  }

  disableUpdateSubTaskSummary(event) {
    event.srcElement.parentElement.parentElement.children[1].style.display = 'block';
    event.srcElement.parentElement.parentElement.children[2].style.display = 'none';
    event.srcElement.parentElement.parentElement.children[3].style.display = 'none';
  }

  updateSubTaskSummary(event) {
    const subtasksummary = event.srcElement.parentElement.parentElement.children[2].value;
    const subtaskuuid = event.srcElement.parentElement.parentElement.children[4].value;
    this._taskService.updateSubTask(this.currentTaskboardId, subtasksummary, subtaskuuid, this.selectedTaskId)
    .pipe(first())
    .subscribe(
      data => {
        this.disableUpdateSubTaskSummary(event);
        this.getTask(this.selectedTaskId);
      },
      error => {
        this.toastr.errorToastr(error, null, {toastTimeout: this.toastrTimer, maxShown: 1} );
      });
  }

  makeWatcherVisible() {
    this.viewwatchers = true;
  }

  hideWatchers() {
    this.viewwatchers = false;
  }

  toggleMeWatching() {
   if (this.selectedTaskWatchers && Array.isArray(this.selectedTaskWatchers)) {
    this.selectedTaskWatchers.filter(
      watcher => watcher.userEmail === this.auth.currentUserValue.username
      ).length ? this.iamwatching = true : this.iamwatching = false;
   } else {
    this.iamwatching = false;
   }
  }

  updateWatchStatus() {
    this.watcherApiCallLoading = true;
    const newAction = this.iamwatching ? false : true;
    this.actionTaskWatcher(newAction);
  }

  actionTaskWatcher(action) {
    this._taskService.actionTaskWatcher(this.currentTaskboardId, action, this.selectedTaskId)
    .pipe(first())
    .subscribe(
      data => {
        this.selectedTaskData = data.task;
        this.selectedTaskWatchers = data.task.taskSecret.watchers;
        this.toggleMeWatching();
        this.watcherApiCallLoading = false;
        this.fetchTaskboardColumns();
        // const message = action ? ' You are now watching this task ' : ' You are no longer watching this task';
        // this.toastr.successToastr(message, null, {toastTimeout: this.toastrTimer, maxShown: 1} );
      },
      error => {
        this.toastr.errorToastr(error, null, {toastTimeout: this.toastrTimer, maxShown: 1} );
      });
  }


  showAssignee() {
    this.displayassignee = true;
  }

  hideAssignee() {
    this.displayassignee = false;
  }

  actionAssignee(id, fullname, email, refForClearing) {
    this.updateSliceFromApiCallState('assignee', { loading: true, error: null, message: null });
    this._taskService.updateAssignee(this.currentTaskboardId, id, fullname, email, this.selectedTaskId)
    .pipe(first())
    .subscribe(
      (data: { task: TaskInterface }) => {
        this.updateSliceFromApiCallState('assignee', { loading: false, error: null, message: null });
        this.cancelAssigneeUpdate(refForClearing);
        this.fetchTaskboardColumns();
        (this.selectedTaskData as TaskInterface).taskSecret.assignee = data.task.taskSecret.assignee;
        this.displayassignee = false;
      },
      error => {
        this.updateSliceFromApiCallState('assignee', { loading: false, error: true, message: 'Couldnt assign' });
        this.cancelAssigneeUpdate(refForClearing);
        this.clearMessages('assignee');
      });
  }

  summarizeActivity(

    logEntry: {
    // action: {
    //   // createTask: string;
    //   // moveTask: string;
    //   // addCommentToTask: string;
    //   // uploadAttachment: string;
    //   // updateTaskDescription: string;
    //   // deleteSubTask: string;
    //   // updateTaskSummary: string;
    //   addcomment: "addCommentToTask";
    // };
    action?: string;
    commentBy?: string;
    date: string;
    addedDate: string;
    editedDate?: string;
    uploadedDate: string;
    commentDate: string;
    createdTime: string;
    taskName: string;
    projectName?: string;
    editedby?: string;
    createdBy?: string;
    uploadedBy?: string;
    oldColumnName: string;
    newColumnName: string;
    movedBy: string;
    editedBy?: string;
    addedBy?: string;
    subtaskSummary?: string;
    newtaskName?: string;
    assignedBy?: string;
    assignee?: string;
  }): string {
    let summary;
    if (logEntry.action === 'createTask') {
      summary =  `${logEntry.createdBy} created ${logEntry.taskName} project`;
    } else if (logEntry.action === 'addCommentToTask') {
      summary =  `${logEntry.commentBy} added a comment`;
    } else if (logEntry.action === 'addSubTask') {
      summary =  `${logEntry.addedBy} added a subtask`;
    } else if (logEntry.action === 'uploadAttachment') {
      summary =  `${logEntry.uploadedBy} uploaded an attachment`;
    } else if (logEntry.action === 'updateTaskDescription') {
      summary =  `${logEntry.editedBy} updated task description`;
    } else if (logEntry.action === 'updateTaskSummary') {
      summary =  `${logEntry.editedBy} updated task header`;
    } else if (logEntry.action === 'moveTask') {
      if (logEntry.oldColumnName === logEntry.newColumnName) {
        return summary;
      } else {
        summary =  `${logEntry.movedBy} moved "${logEntry.taskName}" from "${logEntry.oldColumnName}" to "${logEntry.newColumnName}"`;
      }
    } else if (logEntry.action === ' deleteSubTask ') {
      summary =  `${logEntry.createdBy} deleted a subtask`;
    } else if (logEntry.action === 'assignTask') {
      summary =  `${logEntry.assignedBy} assigned this task to  ${logEntry.assignee}`;
    } else if (logEntry.action === ' deleteSubTask ') {
      summary =  `${logEntry.createdBy} deleted a subtask`;
    } else {
      summary = 'updated';
    }
    return summary;
  }

  createTaskComment() {
    this.loading = true;
    this.disableBtn = true;
    if (!this.defaultcomment.trim()) {
      this.toastr.warningToastr('Please Enter A Comment', null, {toastTimeout: this.toastrTimer, maxShown: 1} );
      this.loading = false;
      this.disableBtn = false;
    } else {
      this._taskService.createTaskComment(this.currentTaskboardId, this.defaultcomment, this.selectedTaskId)
      .pipe(first())
      .subscribe(
        data => {
          this.hidesubtaskfield();
          this.getTask(this.selectedTaskId);
          this.defaultcomment = '';
          setTimeout(() => {
            document.getElementById('taskmanager-modal-refScrollComments').scrollIntoView();
          }, 500);
          this.loading = false;
          this.disableBtn = false;
        },
        error => {
          this.loading = false;
          this.disableBtn = false;
        });
    }
  }

  updateTaskDescription() {
    this.taskDescSaveBtn = true;
    this.taskDescSaveLoading = true;
    this._taskService.updateTaskDescription(this.currentTaskboardId, this.currenttaskdescription, this.selectedTaskId)
    .pipe(first())
    .subscribe(
      data => {
        this.hidesubtaskfield();
        this.getTask(this.selectedTaskId);
        this.fetchTaskboardColumns();
        this.toastr.successToastr('Successful', null, {toastTimeout: 1000, maxShown: 1});
        const newtaskdetails = this.currenttaskdescription.replace(/(<([^>]+)>)/ig, '');
        this.editorContent = this.currenttaskdescription;
        this.taskDescSaveBtn = false;
        this.taskDescSaveLoading = false;
      },
      error => {
        this.toastr.errorToastr(error, null, {toastTimeout: this.toastrTimer, maxShown: 1} );
        this.taskDescSaveBtn = false;
        this.taskDescSaveLoading = false;
      });
  }
  SaveTaskDescription(event) {
    if (event.target.value) {
      this.savethistaskdescription = event.target.value;
      this._taskService.updateTaskDescription(this.currentTaskboardId,  this.savethistaskdescription, this.selectedTaskId)
    .pipe(first())
    .subscribe(
      data => {
        this.hidesubtaskfield();
        this.getTask(this.selectedTaskId);
        this.fetchTaskboardColumns();
      },
      error => {
        this.toastr.errorToastr(error, null, {toastTimeout: this.toastrTimer, maxShown: 1} );
      });
    }
  }

  initUpdateTaskSummary(event) {
    if (event.key === 'Enter') {
      this.updateTaskSummary();
      document.getElementById('renoveblur').blur();
      // document.body.classList.add('user-is-tabbing');
      // this.deactivateTaskSummaryUpdate();
    }
  }

  updateComment(updatedComment: string, commentUuid: string, commentIndex: number, idOfInitiatingTask: string): void {
    this._taskService.updateTaskComment(this.currentTaskboardId, this.selectedTaskId, commentUuid, updatedComment)
      .subscribe(
        succRes => {
          this.fetchTaskboardColumns();
          if (this.selectedTaskId === idOfInitiatingTask) {
            this.selectedTaskComments[commentIndex] = succRes['comment'][commentIndex];
            this.selectedTaskComments[commentIndex]['error'] = null;
            (this.selectedTaskData as TaskInterface).taskSecret.comments = this.selectedTaskComments;
          }
        },
        errRes => {
          // pass same comment back and error string
          if (this.selectedTaskId === idOfInitiatingTask) {
            this.selectedTaskComments[commentIndex] = this.selectedTaskComments[commentIndex];
            this.selectedTaskComments[commentIndex]['error'] = 'Unable to update comment';
          }
        }
      );
  }

  updateTaskSummary(newSummary?: string) {
    if (!newSummary) {
      newSummary = (document.querySelector('input#removeblur') as HTMLInputElement).value;
    }
    this.finishEditingSummary();
    this.updateSliceFromApiCallState('taskSummary', { loading: true, error: false, message: null });
    this._taskService.updateTaskSummary(this.currentTaskboardId, newSummary, this.selectedTaskId)
    .pipe(first())
    .subscribe(
      data => {
        this.selectedtasksummary = data.task.taskSecret.summary;
        this.fetchTaskboardColumns();
        this.updateSliceFromApiCallState('taskSummary', { loading: false, error: false, message: 'Updated' });
        this.clearMessages('taskSummary');
      },
      error => {
        this.updateSliceFromApiCallState('taskSummary', { loading: false, error: true, message: 'An error occured' });
        this.clearMessages('taskSummary');
      });
  }

  getTask(taskId) {
    this._taskService.fetchTask(this.currentTaskboardId, taskId)
      .pipe(first())
      .subscribe(
        data => {
          this.selectedTaskData = data;
          this.initLoadSelectedTaskDetail(data); // Autorefresh open task modal
          this.fetchTaskboardColumns();
        },
        error => {
          this.toastr.errorToastr(error, null, {toastTimeout: this.toastrTimer, maxShown: 1} );
        });
  }

  initUploadAttachment(event) {
    this.attachmentFile = event.target.files;
  }

  processUploadAttachment() {
    this.attachmentLoading = true;
    const attachmentFormData = new FormData();
    let attachcount = 0;
    for (const file of this.attachmentFile) {
      const gotfile = <File>file;
      attachcount++;
      attachmentFormData.append('files', gotfile, gotfile.name);
      if (attachcount === this.attachmentFile.length) {
        this.uploadAttachment(attachmentFormData);
      }

    }
  }

  uploadAttachment(attachmentFormData) {
    this._taskService.uploadAttachment(attachmentFormData)
      .pipe(first())
      .subscribe(
        data => {
          if (data.data.token) {
            this.saveAttachment(data.data.token);
          }
        },
        error => {
          this.attachmentLoading = false;
          this.toastr.errorToastr(error, null, {toastTimeout: this.toastrTimer, maxShown: 1} );
        });
  }

  saveAttachment(token) {
    this.updateSliceFromApiCallState('attachments', { loading: true, error: false, message: null });
    this._taskService.saveAttachment(this.currentTaskboardId, token, this.selectedTaskData.id)
      .pipe(first())
      .subscribe(
        data => {
          this.attachmentLoading = false;
          this.loadSelectedTaskDetail(data.task);
          this.loadSelectedDetail(data.task);
          this.updateSliceFromApiCallState('attachments', { loading: false, error: false, message: 'Added' });
          this.clearMessages('attachments');
        },
        error => {
          this.attachmentLoading = false;
          this.updateSliceFromApiCallState('attachments', { loading: false, error: true, message: 'An Error occured' });
          this.clearMessages('attachments');
        });
  }

  loadSelectedColumnDetail(data) {
    this.selectedColumnData = data;
  }

  loadSelectedTaskDetail(data) {
    this.selectedTaskLog = data.taskSecret.taskLog;
    this.selectedTaskData = data;
    this.selectedTaskSubTasks = data.taskSecret.subTasks;
    this.selectedTaskComments = data.taskSecret.comments;
    this.selectedTaskWatchers = data.taskSecret.watchers;
    this.selectedAttachments = data.taskSecret.attachments;
    const emptyParagraph = `<p class="lead text-muted none__yet" style="margin-left: -7px !important">No description yet...</p>`;
    this.currenttaskdescription =  data.taskSecret.description;
    this.savethistaskdescription = data.taskSecret.description;
    this.tasksummaryenter = false;
    this.commentarea = false;
    this.toggleMeWatching();
  }
  loadSelectedDetail(data) {
    this.selectedTaskData = data;
    // this.selectedTaskSubTasks = data.taskSecret.subTasks;
    // this.selectedTaskComments = data.taskSecret.comments;
    // this.selectedTaskWatchers = data.taskSecret.watchers;
    this.uploadedattachments = data.taskSecret.attachments;
    // this.currenttaskdescription =  data.taskSecret.description;
    // this.tasksummaryenter = false;
    // this.toggleMeWatching();
  }

  // Quick turn around
  initLoadSelectedTaskDetail(data) {
    this.loadSelectedTaskDetail(data.task);
  }
  initloadSelectedDetail(data) {
    this.loadSelectedDetail(data.task);
  }

  getDeleteEndPointByAction(action: string, id: string): string {
    switch (action.toLowerCase()) {
      case 'column':
        return `/project/${this.currentTaskboardId}/column/${id}/delete`;
      case 'task':
        return `/project/${this.currentTaskboardId}/task/${id}/delete`;
      case 'subtask':
        return  `/project/${this.currentTaskboardId}/subtask/${id}/delete`;
      case 'comment':
        return  `/project/${this.currentTaskboardId}/comment/${id}/delete`;
      case 'attachment':
        return `/project/${this.currentTaskboardId}/attachment/${id}/delete`;
      default:
        return '';
    }
  }

  deleteData(action: string, id: string) {
    const endpoint = this.getDeleteEndPointByAction(action, id);
    this._taskService.deleteData(endpoint)
      .pipe(first())
      .subscribe(
        data => {
          if (action === 'task' || action === 'column') {
            this.modalService.dismissAll();
            location.reload(true);
          } else {
            this.getTask(this.selectedTaskId);
          }
          this.toastr.successToastr('Successful', null, {toastTimeout: this.toastrTimer, maxShown: 1} );
        },
        error => {
          this.toastr.errorToastr(error, null, {toastTimeout: this.toastrTimer, maxShown: 1} );
        });
  }

  getUserData(caller, uid) {
    this._taskService.getUserData(uid)
      .pipe(first())
      .subscribe(
        data => {
          // caller && caller == 'reporter' ?
        },
        error => {
          this.toastr.errorToastr(error, null, {toastTimeout: this.toastrTimer, maxShown: 1} );
        });
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.column_name = '';
  }
  openSubtaskModal(subtask: any, index: number) {

    const modalRef = this.modalService.open(SubTaskComponent,
      { centered: true, backdropClass: 'light-blue-backdrop' , windowClass: 'modal-holder' });
    modalRef.componentInstance.subtask = subtask;

    modalRef.componentInstance.newDetailsEvent
    // .pipe(takeUntil(onDestroy$))
    .subscribe(newData => {
      this.updateSubTaskInModal(newData, index, this.selectedTaskId);
    });
  }

  updateSubTaskInModal(updateEventDetails: {newSummary: string, subTaskUuid: string}, subtaskIndex: number, taskId: string): void {
    let { newSummary } = updateEventDetails;
    const { subTaskUuid } = updateEventDetails;
    if (!newSummary.trim().length) {
      return;
    }
    // show loading for subtasks
    newSummary = newSummary.trim();
    this.updateSliceFromApiCallState('subTask', { loading: true });
    // clear previous errors
    // call update subtask
    // why are we passing a diff taskid
    // in case for some reason taskid isnt same as current selectedTaskid
    this._taskService.updateSubTask(this.currentTaskboardId, newSummary, subTaskUuid, taskId)
      .subscribe(
        (succRes: {status: string; subTaskList: any[]}) => {
          // fetchcolumns so updates are in bg
          this.fetchTaskboardColumns();
          // check if when this returns we are still in tas that initiated
          if (this.selectedTaskId === taskId) {
            const replaceIndex = (this.selectedTaskData as TaskInterface).taskSecret.subTasks.findIndex(s => s.uuid === subTaskUuid);
            if (replaceIndex > -1) {
              // this is to update modal with curr changes
              (this.selectedTaskData as TaskInterface).taskSecret.subTasks[replaceIndex] = succRes.subTaskList[subtaskIndex];
              this.selectedTaskSubTasks[replaceIndex] = succRes.subTaskList[subtaskIndex];
            }
          }
          this.updateSliceFromApiCallState('subTask', { loading: false, error: false, message: 'Updated' });
          this.clearMessages('subTask');
        },
        errRes => {
          this.updateSliceFromApiCallState('subTask', { loading: false, error: true, message: 'An error occured' });
          this.clearMessages('subTask');
        }
      );
  }

  openworkflow(workflow) {
    this.modalService.open(workflow, { size: 'lg', ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  opentaskform(task) {
    this.modalService.open(task, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  opentaskdetail(taskdetail, taskData) {
    this.selectedTaskId = taskData.id;
    this.loadSelectedTaskDetail(taskData);
    // reset watvher api call status
    this.watcherApiCallLoading = false;
    this.modalService.open(taskdetail, {size: 'lg', ariaLabelledBy: 'task-modal' , windowClass: 'dark-modal'})
      .result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      this.finishAllEdits();
    });
    this.selectedtasksummary = taskData.taskSecret.summary;
  }

  openUp(task) {
    this.modalService.open(task, { size: 'lg' , ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.task_name.reset();
  }
  openattach(attach) {
    this.modalService.open(attach, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.attachmentModal = this.modalService;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openAttachmentModal() {
    super.openAttachmentModal(this.modalService);
  }

  toggleCreateSubTask(): void {
    this.subtaskfield = !this.subtaskfield;
  }

  showsubtaskfield() {
    this.subtaskfield = true;
  }

  hidesubtaskfield() {
    this.subtaskfield = false;
  }


  loadcurrenttaskdescription(event) {
    if (event.srcElement.value) {
      this.currenttaskdescription = event.srcElement.value;
    }
  }

  loadcurrenttaskImage(event) {
  }

  loadcurrenttasksummary(event) {
    if (event.srcElement.value) {
      this.selectedtasksummary = event.srcElement.value;
    }
  }

  focusSubTask(refToSubtasksContainer) {
    this.subtaskfield = true;
    refToSubtasksContainer.scrollIntoView();
  }

  deactivateTaskSummaryUpdate() {
    this.tasksummaryenter = false;
  }

  mouseEnterEvent() {
    this.tasksummaryabouttoedit = true;
  }

  mouseLeaveEvent() {
    this.tasksummaryabouttoedit = false;
  }

  private getDismissReason(reason: any): string {
    this.taskForm.reset();
    this.columnForm.reset();
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  isBtnDisabled() {
    this.disbtn = true;
    return !this.taskname || !this.taskname.length || this.taskname.length > 50 || this.submitting;
  }
  int(taskname) {
    if (taskname && taskname.length > 50) {
      this.tasknameInputMaxErr = true;
    } else {
      this.tasknameInputMaxErr = false;
    }
  }

  updateAssignee(): void {
    // change elem to input
    this.updatingAssignee = true;
    // NOTE - toggle when done witj request

    // chnage or flip displays?
  }

  cancelAssigneeUpdate(refToInput): void {
    refToInput.value = '';
    this.updatingAssignee = false;
  }


  handleAssigningFromTypeAhead($event, refToInput) {
    // Don't allow  an update if im reasiigning to currently assigned
    // change icon to spinner
    // err, null click event

    // for now, use ToastrNotifs

    const updatedAssigneeEmail = refToInput.value;
    const { assignee } = this.selectedTaskData.taskSecret;

    if (!QuabblyValidators.isEmail(updatedAssigneeEmail)) {
      this.availUserOfError('assignee', 'Invalid Email', refToInput);
      return;
    }

    if ( assignee &&  (updatedAssigneeEmail === assignee.userEmail)) {
      this.updatingAssignee = false;
      this.cancelAssigneeUpdate(refToInput);
      return;
      // notify user that he is assigning to currently assigned user
    }
     // show loading spinner or disable btn
    $event.target.setAttribute('class', 'fa fa-spinner input__searchable--icon');
    // remmber to call a reset on error.
    const foundUser = this.getDetailsFromEmailAddress(updatedAssigneeEmail);
    if (!foundUser) {
      this.availUserOfError('assignee', 'User not found', refToInput);
      return;
    } else {
      this.actionAssignee(foundUser.id, foundUser.fullname, foundUser.email, refToInput);
    }


    // hack this
    // change icon back in 100 ms
    setTimeout(() => {
      $event.target.setAttribute('class', 'fa fa-check input__searchable--icon');
      this.updatingAssignee = false;
    }, 100);
  }

  availUserOfError(sliceOfApiState: string, errMessage: string, refToInput): void {
    this.updateSliceFromApiCallState(sliceOfApiState, { loading: false, error: true, message: errMessage });
    this.clearMessages(sliceOfApiState);
    this.cancelAssigneeUpdate(refToInput);
  }

  handleUpdateAssignee(result: string, refForDestroyingInstance) {
    // move to enum
    // for now
    // close
    if (result === 'SUCCESS') {
      // show UPDATED with alert success
      (document.querySelector('span#showAlerts') as HTMLSpanElement).innerText = 'Updated';
      document.querySelector('span#showAlerts').setAttribute('class', 'indicate indicate--success');
    } else {
      (document.querySelector('span#showAlerts') as HTMLSpanElement).innerText = 'An Error Occured';
      document.querySelector('span#showAlerts').setAttribute('class', 'indicate indicate--error');
    }
    this.cancelAssigneeUpdate(refForDestroyingInstance);
  }


  stripTagsFromContent(contentWithHTML: string): string {
    if (contentWithHTML && contentWithHTML.length) {
      const p = document.createElement('p');
      p.innerHTML = contentWithHTML;
      return p.innerText;
    }
    return 'No Description...';
  }

  startEditingDescription(): void {
    this.updateEditingState('description', true);
  }

  startEditingSummary(): void {
    this.updateEditingState('summary', true);
  }

  finishEditingDescription(): void {
    this.updateEditingState('description', false);
  }

  finishEditingSummary(): void {
    this.updateEditingState('summary', false);
  }

  finishAllEdits() {
    this.editingState = {
      description: false,
      summary: false
    };
  }

  updateEditingState(slice: string, newStatus: boolean): void {
    this.editingState = {
      ...this.editingState,
      [slice]: newStatus
    };
  }

  updateDescription(newDescription: string) {
    this._taskService.updateTaskDescription(this.currentTaskboardId, newDescription, this.selectedTaskId)
    .pipe(first())
    .subscribe(
      data => {
        this.hidesubtaskfield();
        this.fetchTaskboardColumns();
        this.finishEditingDescription();
        this.updateSliceFromApiCallState('taskDescription', { loading: false, error: false, message: 'Updated' });
        this.clearMessages('taskDescription');
        this.currenttaskdescription = data.task.taskSecret.description;
      },
      error => {
        this.updateSliceFromApiCallState('taskDescription', { loading: false, error: true, message: 'An error occured' });
        this.finishEditingDescription();
        this.clearMessages('taskDescription');
      });
  }

  showTaskInFull($event, activeModal): void {
    $event.preventDefault();
    this.dataService.setCachedTask(this.selectedTaskData);
    this.dataService.setProjectName(this.projectName);
    activeModal.close('Navigation');
    this.router.navigate(['/', 'taskmanager',  'project', this.currentTaskboardId, this.selectedTaskId]);
  }

  get toolTip(): string {
    return this.iamwatching ? 'Unwatch Task' : 'Watch Task';
  }

  resizeTextArea(refToTextArea: HTMLTextAreaElement) {
    refToTextArea.style.height = 'inherit';
    const computedProps = window.getComputedStyle(refToTextArea);
    const maxHeight = parseInt(refToTextArea.style.maxHeight, 10);
    const newHeight = refToTextArea.scrollHeight +
    parseInt(computedProps['padding-top'], 10) + parseInt(computedProps['padding-bottom'], 10);
    const updatedHeight = newHeight > maxHeight ? maxHeight : newHeight;
    refToTextArea.style.height = `${updatedHeight}px`;
    return false;
  }

  toggleUpdatingStatus() {
    this.updatingStatus = !this.updatingStatus;
    this.statusesAvailableToUpdateTo = this.statusesExclusiveOfSelected();
  }

  statusesExclusiveOfSelected(): Columns[] {
    return this.dataService.getCachedColumns().filter(cols => cols.id !== this.selectedColumnData.id);
  }

  updateStatus(columnId: string) {
    this.updatingStatus = false;
    this.updateSliceFromApiCallState('status', { loading: true, error: false, message: null });
    this._taskService.rearrangeTaskPosition(this.currentTaskboardId, this.selectedTaskId, columnId)
      .subscribe(
        succRes => {
          this.updateSliceFromApiCallState('status', { loading: false, error: false, message: 'Updated' });
          this.selectedColumnData = this.dataService.getCachedColumns().filter(cols => cols.id === columnId)[0];
          this.fetchTaskboardColumns();
          this.clearMessages('status');
        },
        (errRes: string) => {
          this.updateSliceFromApiCallState('status',
          { loading: false, error: true, message: 'Failed' });
          this.clearMessages('status');
        }
      );
  }


  openEditColumnNameModal(column: Columns): void {
    if (!this.auth.isAdmin) {
      return;
    }
    // open modal with filled content
    // dont allow to close
    const modalRef: NgbModalRef = this.modalService.open(GenericUpdateFieldComponent, {
      backdropClass: 'overlay-backdrop',
      backdrop : 'static',
      keyboard : false
    });

    modalRef.componentInstance.itemToUpdate = column.columnSecret;
    modalRef.componentInstance.header = `Update ${column.columnSecret.name}`;
    modalRef.componentInstance.fieldToUpdate = 'name';
    modalRef.componentInstance.updatedItemEvent.subscribe(updates => {
      this._taskService.renameColumn(this.currentTaskboardId, updates.newItem, column.id)
      .pipe(first())
      .subscribe(
        data => {
          this.toastr.successToastr('Successful', null, {toastTimeout: this.toastrTimer, maxShown: 1} );
          this.fetchTaskboardColumns();
        },
        error => {
          this.toastr.errorToastr(error, null, {toastTimeout: this.toastrTimer, maxShown: 1} );
        });
    });
  }

  confirmDeleteAttachment(attachment: AttachmentDetails, idOfCurrTask: string): void {
    const modalRef: NgbModalRef = this.modalService.open(GenericDeleteConfirmationComponent, {
      backdropClass: 'overlay-backdrop',
      backdrop : 'static',
      keyboard : false
    });
    modalRef.componentInstance.itemType = 'attachment';
    modalRef.componentInstance.itemDeleting = attachment.filename;
    modalRef.componentInstance.confirmed.subscribe(() => {
      this.deleteAttachment(attachment.id, idOfCurrTask, modalRef);
    });
  }

  confirmDeleteComment(comment: CommentDetails, commentIndex: number, idOfCurrTask: string): void {
    const modalRef: NgbModalRef = this.modalService.open(GenericDeleteConfirmationComponent, {
      backdropClass: 'overlay-backdrop',
      backdrop : 'static',
      keyboard : false
    });
    modalRef.componentInstance.itemType = 'comment';
    modalRef.componentInstance.itemDeleting = `${comment.comment.substr(0, 50)}...`;
    modalRef.componentInstance.confirmed.subscribe(() => {
      this.deleteComment(comment.uuid, commentIndex, modalRef, idOfCurrTask);
    });
  }

  confirmDeleteColumn(column: Columns): void {
    if (!this.auth.isAdmin) {
      return;
    }
    const modalRef: NgbModalRef = this.modalService.open(GenericDeleteConfirmationComponent, {
      backdropClass: 'overlay-backdrop',
      backdrop : 'static',
      keyboard : false
    });
    modalRef.componentInstance.itemType = 'column';
    modalRef.componentInstance.itemDeleting = column.columnSecret.name;
    modalRef.componentInstance.confirmed.subscribe(() => {
      this.deleteData('column', column.id);
    });
  }

  deleteComment(commentUuid: string, commentIndex: number, refOfDeleteModal: NgbModalRef, idOfInitiatedTask: string) {
    this._taskService.deleteData(`/project/${this.currentTaskboardId}/comment/${this.selectedTaskId}/${commentUuid}`)
    .pipe(first())
    .subscribe(
      () => {
        this.fetchTaskboardColumns();
        refOfDeleteModal.close();
        // this.task.taskSecret.comments.splice(commentIndex, 1);
        // update comment
        if (this.selectedTaskId === idOfInitiatedTask) {
          this.selectedTaskComments.splice(commentIndex, 1);
          (this.selectedTaskData as TaskInterface).taskSecret.comments = this.selectedTaskComments;
        }
      },
      () => {
      });
  }

  deleteAttachment(attachId: string, idOfInitiatedTask: string, refToConfirmModal: NgbModalRef) {
    this.updateSliceFromApiCallState('attachments', { loading: true, error: false, message: null });
    this._taskService.deleteData(`/project/${this.currentTaskboardId}/attachment/${this.selectedTaskId}/${attachId}`)
    .pipe(first())
    .subscribe(
      data => {
        this.fetchTaskboardColumns();
        this.updateSliceFromApiCallState('attachments', { loading: false, error: false, message: 'Removed' });
        // update attachments
        // fetch columns globally
        // update selected attachments and selected task data if the task we deleted form is the one we are stil n
       if (this.selectedTaskId === idOfInitiatedTask) {
        this.selectedAttachments = this.selectedAttachments.filter(a => a.id !== attachId);
        (this.selectedTaskData as TaskInterface).taskSecret.attachments = this.selectedAttachments;
       }
        this.clearMessages('attachments');
        refToConfirmModal.close();
      },
      error => {
        this.updateSliceFromApiCallState('attachments', { loading: false, error: true, message: 'Failed to remove' });
        this.clearMessages('attachments');
        refToConfirmModal.close();
      });
  }

  updateColumnVisibility(): void {
    const modalRef: NgbModalRef = this.modalService.open(UpdateColumnVisibiltyComponent, {
      backdropClass: 'overlay-backdrop',
      backdrop : 'static',
      keyboard : false
    });
    const detailsExclusiveOfMe = (this.membersOfProject || [])
    .filter(user => user.email !== this.auth.currentUserValue.username);
    modalRef.componentInstance.users = detailsExclusiveOfMe;
    modalRef.componentInstance.confirmed.subscribe(visibilityUpdates => {
      console.log(visibilityUpdates);
    });
  }

  stopPropagation(clickEvent: Event): void {
    clickEvent.stopPropagation();
    // force a task fetch
    this.dataService.invalidateTaskCache();
  }

  getColorForPriority(priority: Priority): string {
    return `color: ${PriorityColors[priority] || ''}`;
  }

  checkForEnter(event, functionToCall: Function): void {
    // 13 is keyCode for enter key
    if (event.keyCode === 13) {
      functionToCall.call(this, event.target.value);
    }
  }

  get goalForTaskSelected(): string {
    if ((this.selectedTaskData as TaskInterface).goal) {
      return (this.selectedTaskData as TaskInterface).goal.goalSecret.name;
    }
    return 'None';
  }

  notifyOutOfSync(): void {
    this.outOfSync = true;
    setTimeout(() => {  this.outOfSync = false; }, 10000);
  }

  bootstrapScrollHelpers():void {
    let options: IntersectionObserverInit;
    setTimeout(() => {
      const taskboards = document.querySelectorAll('.taskboard-wrapper');
      const lastTaskColumn = taskboards[taskboards.length - 1];
      const firstTaskColumn = taskboards[0];
      options = this.scrollHelper.getOptions(this.taskboardContainerRef.nativeElement, null, [0, 0.01]);
      this.scrollHelper.checkForChanges(options, lastTaskColumn);
      this.scrollHelper.checkForChanges(options, firstTaskColumn);

      ScrollHelperService.intersecting$.subscribe(vals => {
        this.handleIndicatorVisibility(vals.elemId, vals.intersecting);
      })
    }, 1000);
  }

  handleIndicatorVisibility(columnId: string, inView: boolean): void {
    if (columnId === this.taskboardColumnList[this.taskboardColumnList.length - 1].id) {
      this.showRightScroller = !inView;
    }
    if (columnId === this.taskboardColumnList[0].id) {
      this.showLeftScroller = !inView;
    }
  }

  scrollTaskIntoView(firstOrLast: 'first' | 'last', intoView?: boolean): void {
    const tasks = document.querySelectorAll('.taskboard-wrapper');
    if (firstOrLast === 'first') {
      if (intoView) {
        tasks[0].scrollIntoView();
      } else {
        this.scrollContainer({dir: 'LEFT'}, 300);
      }
    } else if (firstOrLast === 'last') {
      if (intoView) {
        tasks[tasks.length - 1].scrollIntoView();
      } else {
        this.scrollContainer({dir: 'RIGHT'}, 300);
      }
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.scrollHelper.cleanUp();
    // destroy groups
    dragulaGroups.forEach(groupName => this.dragulaService.destroy(groupName));
  }
}
