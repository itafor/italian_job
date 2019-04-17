import { LogHourEnum } from './../enums';
import { TaskManagerDataService } from './../data.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { NgbModal, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TaskManagerService } from '../taskmanager.service';
import { ActivatedRoute, Router } from '@angular/router';
import { first, delay } from 'rxjs/operators';
import { Subscription, Observable, of, fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthenticationService } from '../../account/account.authentication';
import { CustomValidators as QuabblyValidators } from '../../core/forms/validators';
import {
  ApiLoadingOrError, AssigneeDetails, CommentDetails, Project,
  SubTask, TaskDetailsInterface, Columns, TaskInterface,
  UiState, defaultApiLoadingOrErrorState, Field, FieldDetails,
  GoalDetails, Goal, DetailsOfMembersOfProjectInt, AttachmentDetails
 } from '../interfaces';
import { GenericDeleteConfirmationComponent, SubTaskComponent,
  AttachmentComponent, LogTimeComponent, } from '../modals';
import BaseTaskManagerClass from '../base-task';

const onDestroy$: Subject<void> = new Subject();

@Component({
  selector: 'app-taskmanager-taskpage',
  templateUrl: './task-page.component.html',
  styleUrls: [
    '../task/taskmanager.component.scss',
    './task-page.component.scss',
    '../task-description.css'
  ],
  encapsulation: ViewEncapsulation.Emulated,
})
export class TaskPageComponent extends BaseTaskManagerClass implements OnInit, OnDestroy {
  task: TaskInterface;
  projectId: string;
  ui: UiState = {
    loading: true,
    error: null,
    addingSubtask: false,
    commentLoading: false
  };
  editingState = {
    summary: false,
    description: false,
  };

  apiCallState = {
    subTask: defaultApiLoadingOrErrorState,
    taskSummary: defaultApiLoadingOrErrorState,
    taskDescription: defaultApiLoadingOrErrorState,
    attachments: defaultApiLoadingOrErrorState,
    watchers: defaultApiLoadingOrErrorState,
    deleteTask: defaultApiLoadingOrErrorState,
    priority: defaultApiLoadingOrErrorState,
    status: defaultApiLoadingOrErrorState,
    assignee: defaultApiLoadingOrErrorState,
    goal: { ...defaultApiLoadingOrErrorState, loading: true },
    fields: { ...defaultApiLoadingOrErrorState, loading: true },
    loggedHours: { ...defaultApiLoadingOrErrorState, loading: true },
  };

  routeSubscription: Subscription;
  currentUser;
  updatingAssignee =  false;
  updatingPriority = false;
  updatingGoal = false;
  updatingStatus = false;
  confirmDeleteModal: NgbModalRef;
  fields: Field[];
  showUnsetFields: boolean;
  loggedHours: string;
  unsetFields: Field[] = [];
  projectName: string;

  constructor(private _activatedRoute: ActivatedRoute,
    _taskService: TaskManagerService,
    public dataService: TaskManagerDataService,
    private modalService: NgbModal,
    auth: AuthenticationService,
    private router: Router,
    public activeModal: NgbActiveModal,
    ) {
      super(auth, _taskService);
      this.currentUser = this.auth.currentUserValue;
    }
  ngOnInit(): void {
    const weNavFromModal = this.dataService.getCachedTask();
    this.projectName = this.dataService.getProjectName();
    if (weNavFromModal && weNavFromModal.taskSecret) {
      this.task = weNavFromModal;
      this.availableColumnsList = this.dataService.getCachedColumns();
      this.updateUI('loading', false);
      this.populateGoals(this._activatedRoute.snapshot.params['projectId']);
      this.populateFields(this._activatedRoute.snapshot.params['projectId']);
      this.populateLoggedHours(this._activatedRoute.snapshot.params['projectId']);
    } else {
      this.routeSubscription = this._activatedRoute.params.subscribe(routeParams => {
        this.getTask({ projectId: routeParams['projectId'], taskId: routeParams['taskId'] });
      });
    }

    this.projectId = this._activatedRoute.snapshot.params['projectId'];
    this._taskService.populateDetailsOfMembersInProject(this.projectId || this._activatedRoute.snapshot.params['projectId']);
  }


  getTask(fetchDetails: { projectId: string; taskId: string }) {
    this.updateUI('loading', true);
    this._taskService.fetchTask(fetchDetails.projectId, fetchDetails.taskId)
      .pipe(first())
      .subscribe((res: { status: string; task: TaskInterface; columnList: Columns[] }) => {
        if (res.task) {
          // struicter checks?
          // check secret???
          this.task = res.task;
          this.availableColumnsList = res.columnList;
          this.populateGoals();
          this.populateFields();
          this.getProjectName();
          this.populateLoggedHours();
        }
      },
      (err: HttpErrorResponse) => {
        let errAsString;
        if (typeof err === 'string') {
          errAsString = err;
        }
        this.handleNetworkError(err.message || errAsString);
        // Gonna assume task not found as intercepor doesnt give me context
        this.router.navigateByUrl(`/taskmanager/project/${this.projectId}`);
      },
      () => {
        this.updateUI('loading', false);
      });
  }

  getProjectName(): void {
    this._taskService.fetchProjects().subscribe(
      (succRes: {status: string; projectList: Project[]}) => {
        this.projectName = succRes.projectList.filter(p => p.id === this.projectId)[0].projectSecret.name || null;
      }
    );
  }

  populateGoals(projectId?: string): void {
    this._taskService.fetchGoals(this.projectId || projectId)
      .subscribe(
        (succRes: { goal: Goal[] }) => {
          this.goals = succRes.goal;
          // TODO(oneeyedsunday) better impl
          // Use this till Goal n Task r/ship is fixed
          this.updateSliceFromApiCallState('goal', { loading: false, error: false, message: null });
        },
        errRes => {
          console.error(errRes);
          this.updateSliceFromApiCallState('goal', { loading: false, error: true, message: 'Couldn\'t Load' });
        }
      );
  }

  populateLoggedHours(projectId?: string): void {
    this._taskService.fetchLoggedHours(this.projectId || projectId, this.task.id)
      .subscribe(
        (succRes: { status: string; data: string }) => {
          this.loggedHours = this.formatAsHumanReadableDate(succRes.data);
          this.updateSliceFromApiCallState('loggedHours', { loading: false, error: false, message: null });
        },
        errRes => {
          console.error(errRes);
          this.updateSliceFromApiCallState('loggedHours', { loading: false, error: true, message: 'Couldn\'t Load' });
        }
      );
  }

  populateFields(projectId?: string): void {
    this._taskService.fetchFields(this.projectId || projectId)
      .subscribe(
        (succRes: {status: string; fieldsList: Field[]}) => {
          // console.log(succRes);
          this.fields = succRes.fieldsList;
          this.getUnsetFields();
          this.updateSliceFromApiCallState('fields', { loading: false, error: false, message: null });
        },
        errRes => {
          console.error(errRes);
          this.updateSliceFromApiCallState('fields', { loading: false, error: true, message: 'Couldn\'t Load' });
        }
      );
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    if (this.confirmDeleteModal) { this.confirmDeleteModal.close(); }
    onDestroy$.next();
    onDestroy$.complete();
  }

  updateUI(key, value): void {
    this.ui = { ...this.ui, [key]: value  };
  }

  handleNetworkError(message: string) {
    this.updateUI('error', message || 'Please try again, An error ocured');
    this.updateUI('loading', false);
  }

  uiFriendlyWatchers(): string {
    const { watchers } = this.task.taskSecret;
    return (watchers ? watchers.length : 0).toString();
  }

  toggleCreateSubTask() {
    this.ui = {
      ...this.ui,
      addingSubtask: !this.ui.addingSubtask
    };
  }

  toggleUpdatingStatus() {
    this.updatingStatus = !this.updatingStatus;
    this.statusesAvailableToUpdateTo = this.statusesExclusiveOfSelected();
  }


  updateSliceFromApiCallState(slice: string, newSliceState: ApiLoadingOrError) {
    this.apiCallState = {
      ...this.apiCallState,
      [slice]: {
        ...this.apiCallState[slice],
        ...newSliceState
      }
    };
  }

  openSubtaskModal(subtask: any, index: number) {
    const modalRef = this.modalService.open(SubTaskComponent,
      { centered: true, backdropClass: 'light-blue-backdrop' , windowClass: 'modal-holder' });
    modalRef.componentInstance.subtask = subtask;

    modalRef.componentInstance.newDetailsEvent
    .pipe(takeUntil(onDestroy$))
    .subscribe(newData => {
      this.updateSubTaskWithUiUpdates(newData, index);
    });
  }

  addSubTask(subTaskName: string) {
    // validate
    if (!subTaskName.trim().length) {
      return;
    }
    this.toggleCreateSubTask();

    this.updateSliceFromApiCallState('subTask', { loading: true, error: false, message: null });

    this._taskService.createSubTask(this.projectId, subTaskName, this.task.id)
      .subscribe(
        succRes => {
          // for now, only update subtasks
          // not full task because of unwanted rendering
          this.task.taskSecret.subTasks = (succRes.task as TaskInterface).taskSecret.subTasks;
          this.updateSliceFromApiCallState('subTask', { loading: false, error: false, message: 'Created' });
          this.clearMessages('subTask');
        },
        (errRes: HttpErrorResponse) => {
          // show err message
          console.log(errRes);
          this.updateSliceFromApiCallState('subTask', { loading: false, error: true, message: 'An error occured' });
          this.clearMessages('subTask');
        }
      );
  }

  updateSubTaskWithUiUpdates(updateEventDetails: { newSummary: string, subTaskUuid: string}, index) {
    let { newSummary } = updateEventDetails;
    if (!newSummary.trim().length) {
      return;
    }
    newSummary = newSummary.trim();

    this.updateSliceFromApiCallState('subTask', { loading: true, error: false, message: null });
    this._taskService.updateSubTask(this.projectId, newSummary, updateEventDetails.subTaskUuid, this.task.id)
      .subscribe(succRes => {
        this.task.taskSecret.subTasks[index] = succRes.subTaskList[index];
        this.updateSliceFromApiCallState('subTask', { loading: false, error: false, message: 'Updated' });
        this.clearMessages('subTask');
      },
      errRes => {
        console.error(errRes);
        this.updateSliceFromApiCallState('subTask', { loading: false, error: true, message: 'An error occured' });
        this.clearMessages('subTask');
      });
  }

  clearMessages(slice: string): void {
    setTimeout(() => {
      this.updateSliceFromApiCallState(slice, { loading: this.apiCallState[slice].loading, message: null });
    }, 3000);
  }

  updateEditingState(slice: string, newStatus: boolean): void {
    this.editingState = {
      ...this.editingState,
      [slice]: newStatus
    };
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

  updateTaskSummary(newSummary: string) {
    if (!newSummary.trim().length) {
      return;
    }
    this.finishEditingSummary();
    this.updateSliceFromApiCallState('taskSummary', { loading: true, error: false, message: null });
    this._taskService.updateTaskSummary(this.projectId, newSummary, this.task.id)
    .pipe(first())
    .subscribe(
      succRes => {
        this.task.taskSecret.summary = (succRes.task as TaskInterface).taskSecret.summary;
        this.updateSliceFromApiCallState('taskSummary', { loading: false, error: false, message: 'Updated' });
        this.clearMessages('taskSummary');
      },
      (errorRes: HttpErrorResponse) => {
        console.error(errorRes);
        this.updateSliceFromApiCallState('taskSummary', { loading: false, error: true, message: 'An error occured' });
        this.clearMessages('taskSummary');
      });
  }

  updateDescription(newDescription: string) {
    // this.updateSliceFromApiCallState('taskDescription', { loading: true, error: false, message: null });
    this._taskService.updateTaskDescription(this.projectId, newDescription, this.task.id)
    .subscribe(
      succRes => {
        this.task.taskSecret.description = (succRes.task as TaskInterface).taskSecret.description;
        this.finishEditingDescription();
        this.updateSliceFromApiCallState('taskDescription', { loading: false, error: false, message: 'Updated' });
        this.clearMessages('taskDescription');
      },
      (error: HttpErrorResponse) => {
        this.updateSliceFromApiCallState('taskDescription', { loading: false, error: true, message: 'An error occured' });
        this.finishEditingDescription();
        this.clearMessages('taskDescription');
      });
  }

  saveAttachment(token) {
    this.updateSliceFromApiCallState('attachments', { loading: true, error: false, message: null });
    this._taskService.saveAttachment(this.projectId, token, this.task.id)
      .pipe(first())
      .subscribe(
        data => {
          this.updateSliceFromApiCallState('attachments', { loading: false, error: false, message: 'Added' });
          this.task.taskSecret.attachments = (data.task as TaskInterface).taskSecret.attachments;
          this.clearMessages('attachments');
        },
        (error: HttpErrorResponse) => {
          this.updateSliceFromApiCallState('attachments', { loading: false, error: true, message: 'An Error occured' });
          this.clearMessages('attachments');
        });
  }

  initSubTaskCreation() {
    const subtaskCreationCTA = document.getElementById('addsubtaskbutton');
    subtaskCreationCTA.scrollIntoView();
    subtaskCreationCTA.click();
  }

  openAttachmentModal() {
    super.openAttachmentModal(this.modalService, onDestroy$);
  }

  deleteAttachment(attachId: string, refToConfirmModal: NgbModalRef) {
    this.updateSliceFromApiCallState('attachments', { loading: true, error: false, message: null });
    this._taskService.deleteData(`/project/${this.projectId}/attachment/${this.task.id}/${attachId}`)
    .pipe(first())
    .subscribe(
      data => {
        this.updateSliceFromApiCallState('attachments', { loading: false, error: false, message: 'Removed' });
        this.task.taskSecret.attachments = this.task.taskSecret.attachments.filter(
          attachments => attachments.id !== attachId
        );
        this.clearMessages('attachments');
        refToConfirmModal.close();
      },
      error => {
        this.updateSliceFromApiCallState('attachments', { loading: false, error: true, message: 'Failed to remove' });
        this.clearMessages('attachments');
        refToConfirmModal.close();
      });
  }

  deleteComment(commentUuid: string, commentIndex: number) {
    this._taskService.deleteData(`/project/${this.projectId}/comment/${this.task.id}/${commentUuid}`)
    .pipe(first())
    .subscribe(
      () => {
        this.modalService.dismissAll();
        this.task.taskSecret.comments.splice(commentIndex, 1);
      },
      () => {
      });
  }

  confirmDeleteTask(modalContent) {
    if  (!this.auth.isAdmin) {
      return;
    }
    this.confirmDeleteModal = this.modalService.open(modalContent, {
      backdropClass: 'overlay-backdrop',
      backdrop : 'static',
      keyboard : false
    });
  }

  deleteTask() {
    if (!this.auth.isAdmin) {
      return;
    }
    this.updateSliceFromApiCallState('deleteTask', { loading: true,  error: false, message: null});
    this._taskService.deleteData(`/project/${this.projectId}/task/${this.task.id}`)
      .pipe(first())
      .subscribe(
        () => {
          // navigate to task board
          if (this.confirmDeleteModal) { this.confirmDeleteModal.close(); }
          this.router.navigate(['/', 'taskmanager',  'project', this.projectId]);
        },
        error => {
          this.updateSliceFromApiCallState('deleteTask', { loading: false, error: true, message: 'Failed to delete task.' });
          this.clearMessages('deleteTask');
        }
      );

    }

  postComment(commentBox: HTMLTextAreaElement) {
    const comment = commentBox.value;
    if (!comment.trim().length) {
      return;
    }
    this.ui.commentLoading = true;
    this._taskService.createTaskComment(this.projectId, comment.trim(), this.task.id)
      .pipe(first())
      .subscribe(
        succRes => {
          /*
          // You may experience blinking in the screen while rendering large commnets
          // This fixes that
          // But doesnt ensure you have the latest comment state which may be problematic
          const newestComment = (succRes.task as TaskInterface).taskSecret.comments[succRes.task.taskSecret.comments.length - 1];
          this.task.taskSecret.comments.push(newestComment);
          */
          this.task.taskSecret.comments = (succRes.task as TaskInterface).taskSecret.comments;
          this.ui = { ...this.ui, commentLoading: false  };
          commentBox.value = '';
          document.getElementById('taskmanager-modal-refScrollComments').scrollIntoView();
        },
        errRes => {
          this.ui = { ...this.ui, commentLoading: false  };
        }
      );
  }

  // on input
  // check computed for scroll height
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

  updateAssignee(): void {
    this.updatingAssignee = true;
  }

  actionAssignee(id, fullname, email, refForClearing) {
    this.updateSliceFromApiCallState('assignee', { loading: true, error: null, message: null });
    this._taskService.updateAssignee(this.projectId, id, fullname, email, this.task.id)
    .pipe(first())
    .subscribe(
      data => {
        this.task.taskSecret.assignee = (data.task as TaskInterface).taskSecret.assignee;
        this.updateSliceFromApiCallState('assignee', { loading: false, error: null, message: null });
        this.cancelAssigneeUpdate(refForClearing);
        this.updatingAssignee = false;
      },
      error => {
        this.updateSliceFromApiCallState('assignee', { loading: false, error: true, message: 'Couldnt assign' });
        this.cancelAssigneeUpdate(refForClearing);
        this.clearMessages('assignee');
      });
  }

  cancelAssigneeUpdate(refToInput): void {
    refToInput.value = '';
    this.updatingAssignee = false;
  }



  handleAssigningFromTypeAhead($event, refToInput) {
    const updatedAssigneeEmail = refToInput.value;
    const { assignee } = this.task.taskSecret;
    if (!QuabblyValidators.isEmail(updatedAssigneeEmail)) {
      this.availUserOfError('assignee', 'Invalid Email', refToInput);
      return;
    }

    if ( assignee &&  (updatedAssigneeEmail === assignee.userEmail)) {
      this.updatingAssignee = false;
      this.cancelAssigneeUpdate(refToInput);
      return;
    }
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

  updateWatchers(): void {
    // show UI notifs i.e. spinner
    this.updateSliceFromApiCallState('watchers', { loading: true });
    const action: string = this.amIWatchingThisTask ? 'Unwatch' : 'Watch';
    // disable btn
    this._taskService.actionTaskWatcher(this.projectId, !this.amIWatchingThisTask, this.task.id)
    .pipe(first())
    .subscribe(
      succRes => {
        this.task.taskSecret.watchers =  (succRes.task.taskSecret as TaskDetailsInterface).watchers;
        this.updateSliceFromApiCallState('watchers', { loading: false, error: null, });
        this.clearMessages('watchers');
      },
      () => {
        // error res
        // show that you failed to update
        this.updateSliceFromApiCallState('watchers', { loading: false, error: true, message: `${action} failed.` });
        this.clearMessages('watchers');
      }
    );
  }

  get amIWatchingThisTask(): boolean {
    if (!this.task.taskSecret.watchers) {
      return false;
    }
    return !!this.task.taskSecret.watchers.filter(watcher =>  this.amIUser(watcher.userEmail)).length;
  }

  get toolTip(): string {
    return this.amIWatchingThisTask ? 'Unwatch Task' : 'Watch Task';
  }

  amIUser(compareEmail): boolean {
    return (compareEmail === this.currentUser.username);
  }

  shrinkToSize(fullString: string, digits: number): string {
    const DOMElement = document.createElement('p');
    DOMElement.innerHTML = fullString;
    const stripped = DOMElement.innerText.trim();
    if (stripped.length > digits) {
      return `${stripped.substr(0, digits)}...`;
    } else {
      return stripped;
    }
  }

  get columnName(): string {
    if (!this.availableColumnsList) {
      return 'Unknown';
    }
    const column = this.availableColumnsList
      .filter(c => c.id === this.task.columnId)[0];
      if (column && column.columnSecret) {
        return column.columnSecret.name;
      }
      return 'Unknown';
  }

  statusesExclusiveOfSelected(): Columns[] {
    return this.availableColumnsList.filter(cols => cols.id !== this.task.columnId);
  }

  checkForEnter(event, functionToCall: Function): void {
    // 13 is keyCode for enter key
    if (event.keyCode === 13) {
      functionToCall.call(this, event.target.value);
    }
  }

  updateStatus(columnId: string) {
    this.updatingStatus = false;
    this.updateSliceFromApiCallState('status', { loading: true, error: false, message: null });
    this._taskService.rearrangeTaskPosition(this.projectId, this.task.id, columnId)
      .subscribe(
        succRes => {
          this.updateSliceFromApiCallState('status', { loading: false, error: false, message: 'Updated' });
          this.task.columnId = (succRes.task as TaskInterface).columnId;
          this.clearMessages('status');
        },
        (errRes: string) => {
          this.updateSliceFromApiCallState('status',
          { loading: false, error: true, message: 'Failed' });
          this.clearMessages('status');
        }
      );
  }

  openLoggedHoursView() {
    const modalRef = this.modalService.open(LogTimeComponent, {
      backdropClass: 'overlay-backdrop',
      backdrop : 'static',
      keyboard : false
    });

    modalRef.componentInstance.timeLogged
    .pipe(takeUntil(onDestroy$))
    .subscribe(newData => {
      const loggedHourType = Object.keys(newData['loggedTime'])[0];
      const loggedHourNumber = newData['loggedTime'][loggedHourType];
      this.updateLogHours((loggedHourType as LogHourEnum), loggedHourNumber, newData['date'], modalRef);
    });
  }

  updateLogHours(loggedHoursType: LogHourEnum, loggedTime: number, logDate: Date, refToModal: NgbModalRef) {
    this.updateSliceFromApiCallState('loggedHours', { loading: true, error: false, message: null });
    this._taskService.updateLoggedHours(this.projectId, this.task.id, { logDate, logNumber: loggedTime, logType: loggedHoursType})
    .pipe(first())
    .subscribe(
      (data: {status: string; data: string}) => {
        this.loggedHours = this.formatAsHumanReadableDate(data.data);
        refToModal.close();
        this.updateSliceFromApiCallState('loggedHours', {  loading: false, error: false, message: null });
        this.clearMessages('loggedHours');
      },
      error => {
        this.updateSliceFromApiCallState('loggedHours', { loading: false, error: true, message: 'Failed to update' });
        this.clearMessages('loggedHours');
      });
  }

  confirmDeleteAttachment(attachment: AttachmentDetails): void {
    const modalRef: NgbModalRef = this.modalService.open(GenericDeleteConfirmationComponent, {
      backdropClass: 'overlay-backdrop',
      backdrop : 'static',
      keyboard : false
    });
    modalRef.componentInstance.itemType = 'attachment';
    modalRef.componentInstance.itemDeleting = attachment.filename;
    modalRef.componentInstance.confirmed.subscribe(() => {
      this.deleteAttachment(attachment.id, modalRef);
    });
  }

  confirmDeleteComment(comment: CommentDetails, commentIndex: number): void {
    const modalRef: NgbModalRef = this.modalService.open(GenericDeleteConfirmationComponent, {
      backdropClass: 'overlay-backdrop',
      backdrop : 'static',
      keyboard : false
    });
    modalRef.componentInstance.itemType = 'comment';
    modalRef.componentInstance.itemDeleting = `${comment.comment.substr(0, 50)}...`;
    modalRef.componentInstance.confirmed.subscribe(() => {
      this.deleteComment(comment.uuid, commentIndex);
    });
  }

  updateComment(updatedComment: string, commentUuid: string, commentIndex: number): void {
    this._taskService.updateTaskComment(this.projectId, this.task.id, commentUuid, updatedComment)
      .subscribe(
        succRes => {
          this.task.taskSecret.comments[commentIndex] = succRes['comment'][commentIndex];
          this.task.taskSecret.comments[commentIndex]['error'] = null;
        },
        errRes => {
          // pass same comment back and error string
          this.task.taskSecret.comments[commentIndex] = this.task.taskSecret.comments[commentIndex];
          this.task.taskSecret.comments[commentIndex]['error'] = 'Unable to update comment';
        }
      );
  }

  toggleShowFieldsDropdown(): void {
    this.showUnsetFields = !this.showUnsetFields;
  }

  getUnsetFields() {
    this.unsetFields = this.fields.filter(f => f.fieldsSecret.value === null);
  }

  transformShortToLong(short: string): string {
    short = short.toLowerCase();
    switch (short) {
      case 'w':
        return 'weeks';
      case 'm':
        return 'months';
      case 'h':
        return 'hours';
      case 'd':
        return 'days';
    }
  }

  formatAsHumanReadableDate(logString: string) {
    return ((logString || '').match(new RegExp(/\d+[wdh]/g)) || [])
      .map(l => parseInt(l, 10).toString().concat(this.transformShortToLong(l.charAt(l.length - 1)))).join(' ');
  }
}

// TODO
// convert small pop ups to forms for reactive validation???

// move these shared funcs


