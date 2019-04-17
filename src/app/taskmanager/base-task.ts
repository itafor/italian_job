import { AttachmentDetails, TaskInterface, Goal, Columns,
  DetailsOfMembersOfProjectInt, ApiLoadingOrError, CommentDetails,
 } from './interfaces';
import { AttachmentIcons, Priority, PriorityIndicators, PriorityColors, PriorityBgColors } from './enums';
import { Observable } from 'rxjs';
import { distinctUntilChanged, debounceTime, map } from 'rxjs/operators';
import { AuthenticationService } from '../account/account.authentication';
import { TaskManagerService } from './taskmanager.service';
import { AttachmentComponent } from './modals';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export default abstract class BaseTask {
  static namesFromEmailRegex = new RegExp(/[a-zA-Z0-9]+/g);
  task: TaskInterface;
  selectedTaskData: TaskInterface;
  prioritiesAvailableToUpdateTo: {color: string; icon: PriorityIndicators, text: Priority}[];
  updatingPriority: boolean;
  updatingGoal: boolean;
  updatingStatus: boolean;
  goals: Goal[] = [];
  statusesAvailableToUpdateTo: Columns[];
  goalsAvailableToUpdateTo: Goal[];
  availableColumnsList: Columns[];
  thisVar = 'this';
  currentTaskboardId?: string;
  projectId?: string;
  apiCallState: {[key: string]: ApiLoadingOrError} = {};

  constructor(public auth: AuthenticationService,
    public _taskService: TaskManagerService,
    noThis?: boolean) {
    if (noThis) {
      this.thisVar = null;
    }
  }

   abstract saveAttachment(token: string): void;

  get taskObj(): TaskInterface {
    if (this.thisVar) {
      return this.task;
    }
    return this.selectedTaskData;
  }

  get priority() {
    return this.taskObj.taskSecret.priority || Priority.NONE;
  }

  get priorityColor() {
    return `color: ${PriorityColors[this.priority]};` || '';
  }

  get GenericProjectId(): string {
    if (this.thisVar) {
      return this.projectId;
    }
    return this.currentTaskboardId;
  }

  get membersOfProject(): any[] {
    if (!this._taskService.membersOfProject.length) {
      this._taskService.populateDetailsOfMembersInProject(this.GenericProjectId);
      setTimeout(() => {
        return this._taskService.membersOfProject(this.GenericProjectId);
      }, 700);
    } else {
      return this._taskService.membersOfProject(this.GenericProjectId);
    }
  }

  get assignee(): string {
    const { assignee }  = this.taskObj.taskSecret;
    return (assignee ? assignee.userName : 'Unassigned');
  }

  goalsExclusiveOfSelected(): Goal[] {
    if (!this.taskObj.goal) {
      return this.goals;
    }
    return this.goals.filter(gols => gols.id !== this.taskObj.goal.id);
  }

  prepocessMimes(rawMime: string): string {
    if (rawMime === 'text/plain') {
      return 'txt';
    } else if (rawMime.split('/')[1].indexOf('vnd.openxmlformats-officedocument') > -1) {
      const msType = rawMime.split('/')[1].split('.');
      return msType[msType.length - 1];
    }

    return rawMime.split('/')[1];
  }

  iconForAttachment(attachment: AttachmentDetails): AttachmentIcons {
    const type = this.prepocessMimes(attachment.mimetype) || '';
    switch (type.toLowerCase()) {
      case 'png': case 'jpg': case 'jpeg': case 'gif': case 'bmp':
        return AttachmentIcons.IMAGE;
      case 'txt':
        return AttachmentIcons.TEXT;
      case 'document': case 'doc': case 'docx':
        return AttachmentIcons.DOC;
      case 'xls': case 'sheet':
        return AttachmentIcons.EXCEL;
      case 'ppt': case 'pptx': case 'presentation':
        return AttachmentIcons.POWERPOINT;
      case 'zip': case 'rar': case 'gzip': case 'gz':
        return AttachmentIcons.ARCHIVE;
      case 'mp3': case 'm4a': case 'wma':
        return AttachmentIcons.AUDIO;
      case 'mp4': case 'avi':
        return AttachmentIcons.VIDEO;
      case 'pdf':
        return AttachmentIcons.PDF;
      default:
        return AttachmentIcons.FILE;
    }
  }

  uiFileTypeForAttachment(attachment: AttachmentDetails): string {
    return (this.prepocessMimes(attachment.mimetype) || 'FILE').substr(0, 3);
  }

  initialsOf(name: string): string {
    return name.match(/\b(\w)/g).join('').substr(0, 2) || 'NA';
  }

  prioritiesExclusiveOfSelected(): {color: string; icon: PriorityIndicators; text: Priority; }[] {
    return Object.keys(Priority).map(pKey => (
      {  color: `color: ${PriorityColors[pKey]};`, icon: PriorityIndicators[pKey], text:  Priority[pKey]  }) )
      .filter(priority => (priority.text !== this.priority) && priority.icon);
  }

  getStylesForPriority(priority: Priority): string {
    return `color: ${PriorityColors[priority]};background-color: ${PriorityBgColors[priority]};`;
  }


  toggleUpdatingPriority() {
    this.updatingPriority = !this.updatingPriority;
    this.prioritiesAvailableToUpdateTo = this.prioritiesExclusiveOfSelected();
  }

  toggleUpdatingGoal() {
    this.updatingGoal = !this.updatingGoal;
    this.goalsAvailableToUpdateTo = this.goalsExclusiveOfSelected();
  }


  getDetailsFromEmailAddress(uniqueIdentifier: string): DetailsOfMembersOfProjectInt {
    const details = this.membersOfProject.filter(detail => detail.email === uniqueIdentifier)[0];
    return (details ? { id: details.id, fullname: details.fullname, email: details.email } : null);
  }

  appendSelfAssignInfo(term: DetailsOfMembersOfProjectInt): DetailsOfMembersOfProjectInt | any {
    if (term.email === this.auth.currentUserValue.username) {
      return {...term, isCurrentUser: true};
    }
    return term;
  }
  populateSuggestions(cond: string ): any[] {
    // later on, show First Lastname <email>
      return this.membersOfProject.filter((contact => this.existsIn(contact, cond)))
      .map(detail => this.appendSelfAssignInfo(detail))
      .sort((a, b) => a.email === this.auth.currentUserValue.username ? 1 : -1)
      .reverse()
      .slice(0, 5);
  }

  assigneeTypeAheadFormatter(details: any): string {
    // this dictates what gets displayed to user
    // put the Assign to me here
    const isMe = details.isCurrentUser ? '(assign to me)' : '';
    return `${details.fullname} ${isMe}`;
  }

  existsIn(base: DetailsOfMembersOfProjectInt, term: string): boolean {
    return JSON.stringify(base).toLowerCase().indexOf(term.toLowerCase()) > -1;
  }

  showContacts(item): boolean {
    return (item.length >= 3);
  }

  suggestAssignees = (mails$: Observable<string>) => mails$.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    map(currentTerm => this.showContacts(currentTerm) ? this.populateSuggestions(currentTerm) : [])
  )

  inputFormatter(term: DetailsOfMembersOfProjectInt) {
    // This dictates what gets sent as value to input
    return term.email;
  }

  uiFriendlyReporterName(): string {
    if ((this.membersOfProject || []).length) {
      const foundUserDetails = this.membersOfProject.filter(detail => detail.email === this.taskObj.userName)[0];
      return (foundUserDetails ? foundUserDetails.fullname : 'Unknown');
    } else {
      const gotNames = this.getUserNameFromEmail(this.taskObj.userName);
      if (gotNames) { return  gotNames; }
    }
    return 'Unknown';
  }

  getUserNameFromEmail(email: string): string {
    // sep email by @[0]
    const names = email.split('@')[0];
    // separators
    // first .
    // then - for multi names
    return names.match(BaseTask.namesFromEmailRegex).join(' ') || '';
  }

  clearMessages(slice: string): void {
    setTimeout(() => {
      this.updateSliceFromApiCallState(slice, { loading: this.apiCallState[slice].loading, message: null });
    }, 3000);
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

  updateGoal(goal: Goal) {
    this.updatingGoal = false;
    this.updateSliceFromApiCallState('goal', { loading: true, error: false, message: null });
    this._taskService.atttachTaskToGoal({  projectId: this.GenericProjectId, taskId: this.taskObj.id, goalId: goal.id })
      .subscribe(
        () => {
          this.updateSliceFromApiCallState('goal', { loading: false, error: false });
          this.taskObj.taskSecret['goalId'] = goal.id;
          const indexOfNewGoal = this.goals.findIndex(g => g.id === goal.id);
          if (indexOfNewGoal > - 1) {
            // For task modal
            // add taskId to goals
            // append to goal prop of task
            if (!this.goals[indexOfNewGoal].goalSecret.taskList) {
              this.goals[indexOfNewGoal].goalSecret.taskList = [];
            }
            this.goals[indexOfNewGoal].goalSecret.taskList.push(this.taskObj);
          } else {
            this.goals.push(goal);
          }
          this.taskObj.goal = goal;
          this.clearMessages('goal');
        },
        () => {
          this.updateSliceFromApiCallState('goal',
          { loading: false, error: true, message: 'Couldn\'t attach to Goal' });
          this.clearMessages('goal');
        }
      );
  }

  updatePriority(priority) {
    this.updatingPriority = false;
    this.updateSliceFromApiCallState('priority', { loading: true, error: false, message: null });
    this._taskService.genericUpdateTask(
      {taskId: this.taskObj.id, projectId: this.GenericProjectId, updatedFields: ['priority']},
      { priority })
      .subscribe(
        succRes => {
          this.updateSliceFromApiCallState('priority', { loading: false, error: false });
          this.taskObj.taskSecret = (succRes.task as TaskInterface).taskSecret;
          this.clearMessages('priority');
        },
        (errRes: string) => {
          this.updateSliceFromApiCallState('priority',
          { loading: false, error: true, message: 'Couldn\'t update.' });
          this.clearMessages('priority');
        }
      );
  }

  urlWithToken(url: string): string {
    return this._taskService.getAttachUrlWithToken(url);
  }

  authorization(comment: CommentDetails): boolean {
    return (comment.userEmail === this.auth.currentUserValue.username) || false;
  }

  openAttachmentModal(modalService: NgbModal, optionalTakeUntil?: Subject<void>) {
    const modalRef = modalService.open(AttachmentComponent,
      { centered: true, backdropClass: 'light-blue-backdrop' , windowClass: 'modal-holder' });

    modalRef.componentInstance.newAttachmentsEvent
    .pipe(takeUntil(optionalTakeUntil || new Subject<void>()))
    .subscribe(attachmentData => {
      this.updateSliceFromApiCallState('attachments', { loading: true, error: false });
      this._taskService.uploadAttachment(attachmentData)
      .subscribe(
        (data: {data: {token: string}}) => {
          if (data.data.token) {
            this.saveAttachment(data.data.token);
          }
          if (modalRef) {
            modalRef.close();
          }
        },
        // error is a string here becuae of inteceptor
        // update if it becomes necessary
        (error: string) => {
          if (modalRef) {
            modalRef.close();
          }
          // if its necessary to ensure we display error on selected task
          // this is a point to address
          // pass the id of task into this func
          // so we can cross reference here, that we are on same task
          // although, clearMessages also presents an issue
          // since it will clear regardless in the timeout set
          this.updateSliceFromApiCallState('attachments', { loading: false, error: true, message: error });
          this.clearMessages('attachments');
        });
    });
  }
}
