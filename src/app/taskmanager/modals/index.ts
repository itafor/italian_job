import { NgbActiveModal, NgbDateStruct, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { Component, ChangeDetectionStrategy, EventEmitter,
  Input, Output, OnChanges, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { DetailsOfMembersOfProjectInt } from '../interfaces';
import { LogHourEnum } from '../enums';

@Component({
  template:
  `
  <div class="modal-header" data-role="updatemodal">
    <h4 style="text-transform: capitalize" class="modal-title">{{ header }}</h4>
    <span aria-hidden="true" (click)="activeModal.dismiss('Cross click')" class="close" style="cursor: pointer;">
      <i class="fa fa-close"></i>
    </span>
  </div>
  <div class="modal-body">
   <div class="row">
      <small class="text-center text-danger" *ngIf="btnDisabled">Column {{ fieldToUpdate }} must be between 3 and 30 characters.</small>
      <input ref-subTaskDescription class="form-control"
      placeholder="Enter subtask description" value="{{ itemToUpdate[fieldToUpdate] }}"
      (keyup)="sizeValidations($event.target.value)" />
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-primary"
    (click)="updateSubTask(subTaskDescription.value)"
    [disabled]="btnDisabled"><i class="fa fa-spinner fa-spin mr-1" *ngIf="loading"></i>Update</button>
    <button type="button" class="btn btn-light" (click)="activeModal.close('Close click')">Cancel</button>
  </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenericUpdateFieldComponent {
  @Input() itemToUpdate: any;
  @Input() header: string;
  @Input() fieldToUpdate: string;
  @Output() updatedItemEvent = new EventEmitter<any>();
  btnDisabled = false;
  loading = false;

  constructor(public activeModal: NgbActiveModal) {}

  updateSubTask(newItem: string) {
    if (newItem === this.itemToUpdate[this.fieldToUpdate]) {
      this.activeModal.dismiss();
    }
    this.loading = true;
    this.updatedItemEvent.emit({newItem});
    setTimeout(() => {
      this.activeModal.dismiss();
    }, 500);
  }

  sizeValidations(value: string): void {
    if ((value.trim().length >= 3) && (value.trim().length <= 30)) {
     this.btnDisabled = false;
    } else {
      this.btnDisabled = true;
    }
  }
}


@Component({
  template: `
  <div class="modal-header">
    <h5 class="modal-title" id="modal-basic-title">Delete {{ itemType }} </h5>
    <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="modal-body text-center">
    <p class="delete__warning">Are you sure you want to delete &nbsp;
      <br>
      <span class="text-primary">{{ itemDeleting }}</span>?</p>
  </div>
  <div class="modal-footer" style="border-top: 1px solid #dee2e6;">
    <span *ngIf="loading">
      <i class="fa fa-spinner fa-spin"></i>
    </span>
    <span *ngIf="message">
      {{ message }}
    </span>
    <button type="button" class="btn btn-light"
    (click)="activeModal.close('Cancel click')"
    [disabled]="loading"
    ngbAutoFocus>Cancel</button>
    <button type="button" class="btn btn-danger"
    [disabled]="loading"
    (click)="delete()">Delete</button>
  </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenericDeleteConfirmationComponent {
  @Input() itemType: string;
  @Input() itemDeleting: string;
  @Input() message: string;
  @Output() confirmed: EventEmitter<void> = new EventEmitter();
  loading = false;
  constructor(public activeModal: NgbActiveModal) {}

  delete(): void {
    this.loading = true;
    this.confirmed.emit();
  }
}


@Component({
  template: `
    <div class="modal-header">
      <h5 classs="modal-title">Update Column Visibility</h5>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <p class="lead text-center">Hide column from:</p>
      <div class="col-8 offset-3">
      <div class="form-check form-check-inline">
        <input class="form-check-input" type="radio" [(ngModel)]="hideFrom"
        name="hideFrom" id="inlineRadio1" value="option1">
        <label class="form-check-label" for="inlineRadio1">Everyone</label>
      </div>
      <div class="form-check form-check-inline">
        <input class="form-check-input" type="radio" [(ngModel)]="hideFrom"
        name="hideFrom" id="inlineRadio2" value="specificPeople">
        <label class="form-check-label" for="inlineRadio2">Specific Users</label>
      </div>
      </div>
      <div [ngClass]="{'d-none':  !showSpecificPeople() }">
      <div class="row">
        <div class="email__list--container">
          <span class="mr-2 mb-2 email__list" *ngFor="let share of peopleToRemove;let index = index;">
            <span class="mt-1"  >{{share}} </span>
            <i title="Discard" (click)="removeFromList(index)" class="fa fa-times ml-2"></i>
          </span>
        </div>
      </div>
      <div class="row" style="margin: 0 auto;">
        <input ngbAutofocus (keyup)="parse($event, typeAhead)" ref-typeAhead
        name="shareEmail" type="email" [ngbTypeahead]="suggestRemovals"
        [inputFormatter]="inputFormatter"
        [resultFormatter]="personTypeAheadFormatter"
        class="form-control email" placeholder="Search by name and email..." multiple>
      </div>
      </div>
    </div>
    <div class="modal-footer" style="border-top: 1px solid #dee2e6;">
      <span *ngIf="loading">
        <i class="fa fa-spinner fa-spin"></i>
      </span>
      <span *ngIf="message">
        {{ message }}
      </span>
      <button type="button" class="btn btn-light"
      (click)="activeModal.close('Cancel click')"
      [disabled]="loading"
      ngbAutoFocus>Cancel</button>
      <button type="button" class="btn btn-primary"
      [disabled]="loading"
      (click)="confirm(typeAhead)">Update</button>
    </div>
  `,
  styles: [
    `
    span.email__list {
     padding: 5px;
     border-radius: 4px;
     border: 1px solid black;
    }

    span.email__list i {
      color: red;
      cursor: pointer;
    }

    .email__list--container {
      margin: 5px 5px 0 5px;
      display: flex;
      flex-wrap: wrap;
    }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpdateColumnVisibiltyComponent implements OnInit, OnChanges {
  loading: boolean;
  message: string;
  hideFrom: string;
  peopleToRemove: string[] = [];
  @Input() users: DetailsOfMembersOfProjectInt[];
  @Output() confirmed = new EventEmitter<any>();
  stringifiedDetails: string;

  constructor(public activeModal: NgbActiveModal) {}
  confirm(refToInput: HTMLInputElement): void {
    const mails = refToInput.value.toLowerCase().trim().split(',').filter(m => m !== '');
    this.checkForDups(mails);
    refToInput.value = '';
    this.confirmed.emit({ action: 'HIDE', ids: this.ids });
  }

  ngOnChanges(changes) {
    console.log(changes);
  }

  get ids(): string[] {
    if (this.showSpecificPeople()) {
      // specific
      return this.getIdsFromEmails(this.peopleToRemove) || [];
    } else {
      return this.users.map(u => u.id) || [];
    }
  }

  ngOnInit() {
    this.stringifiedDetails = JSON.stringify(this.users);
  }

  showSpecificPeople(): boolean {
    return this.hideFrom === 'specificPeople';
  }

  // typeahead funcs
  showContacts(item): boolean {
    return (item.length >= 3);
  }

  populateSuggestions(cond: string ): any[] {
      return this.users.filter((contact => this.existsIn(contact, cond)))
      .slice(0, 5);
  }

  existsIn(base: DetailsOfMembersOfProjectInt, term: string): boolean {
    return JSON.stringify(base).toLowerCase().indexOf(term.toLowerCase()) > -1;
  }

  suggestRemovals = (mails$: Observable<string>) => mails$.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    map(currentTerm => this.showContacts(currentTerm) ? this.populateSuggestions(currentTerm) : [])
  )

  inputFormatter(term: DetailsOfMembersOfProjectInt) {
    return term.email;
  }

  personTypeAheadFormatter(details: DetailsOfMembersOfProjectInt): string {
    return `${details.fullname || ''} <${details.email}>`;
  }

  parse(event: any, refToInput: HTMLInputElement): void {
    if (this.watchedKeyCodes(event.keyCode)) {
      event.preventDefault();
      const mails = refToInput.value.toLowerCase().trim().split(',').filter(m => m !== '');
      this.checkForDups(mails);
      refToInput.value = '';
    }
  }

  getIdsFromEmails(emails: string[]): string[] {
    return emails.map(email => {
      const found = this.users.findIndex(u => u.email === email);
      if (found > -1) {
        return this.users[found].id;
      }
    });
  }

  checkForDups(mails: string[]): void {
    const mailsWithoutDups = mails.filter(mail => this.peopleToRemove.indexOf(mail.toLowerCase()) === -1);
    this.peopleToRemove.push(...mailsWithoutDups);
  }

  watchedKeyCodes(codes: number): boolean {
    switch (codes) {
      case 188: case 186: case 13:
        return true;
      default:
        return false;
    }
  }

  removeFromList(index: number) {
    this.peopleToRemove.splice(index, 1);
  }
}

@Component({
  template:
  `
  <div class="modal-header" data-role="subtaskupdatemodal">
    <h4 style="text-transform: capitalize" class="modal-title">Rename subtask</h4>
    <span aria-hidden="true" (click)="activeModal.dismiss('Cross click')" class="close" style="cursor: pointer;">
      <i class="fa fa-close"></i>
    </span>
  </div>
  <div class="modal-body">
   <div class="row">
      <input ref-subTaskDescription class="form-control"
      placeholder="Enter subtask description" value="{{ subtask.summary }}" />
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-primary"
    (click)="updateSubTask(subTaskDescription.value)">Update</button>
    <button type="button" class="btn btn-light" (click)="activeModal.close('Close click')">Cancel</button>
  </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubTaskComponent {
  @Input() subtask: any;
  @Output() newDetailsEvent = new EventEmitter<any>();

  constructor(public activeModal: NgbActiveModal) {}

  updateSubTask(newSummary: string) {
    this.newDetailsEvent.emit({
      newSummary,
      subTaskUuid: this.subtask.uuid});
    this.activeModal.dismiss();
  }
}

@Component({
  template: `
  <div class="modal-header">
      <h4 class="modal-title" id="modal-basic-title">Upload File</h4>
      <span aria-hidden="true" class="close"  style="cursor: pointer;"
      (click)="activeModal.dismiss('Cross click')">&times;</span>
    </div>
    <div class="modal-body">
    <p class="alert alert-danger" *ngIf="error">{{ error }}</p>
      <form  (ngSubmit)="processAttachmentUpload(attachments.files)" enctype="multipart/form-data">
        <div class="form-group">
          <div>
            <input id="fileupload" type="file"
            (change)="updateValidity()" #attachments class="form-control" style="height: 100%; text-align: left;">
          </div>
        </div>
        <div id="modal-submitbtn" class="modal-footer">
          <button type="submit" [disabled]="loading || disabled" class="btn btn-dark uploadefile">
            <i *ngIf="loading" class="fa fa-spinner fa-spin"></i> Upload
          </button>
        </div>
      </form>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttachmentComponent {
  @Input() subtask: any;
  @Input() error: string;
  @Input() loading;
  @ViewChild('attachments') refAttachmentsInput: ElementRef;
  @Output() newAttachmentsEvent = new EventEmitter<any>();
  disabled = true;
  maxSizeBytes = 1024 * 1024;

  constructor(public activeModal: NgbActiveModal) {}

  processAttachmentUpload(attachments) {
    this.loading = true;
    const attachmentFormData = new FormData();
    for (const file of attachments) {
      attachmentFormData.append('files', file, file.name);
    }
    this.newAttachmentsEvent.emit(attachmentFormData);
  }

  updateValidity() {
    this.disabled = (this.refAttachmentsInput.nativeElement as HTMLInputElement).files.length ? false : true;
    if ( (this.refAttachmentsInput.nativeElement as HTMLInputElement).files.length) {
      // check size
      const fileTooLarge = (this.refAttachmentsInput.nativeElement as HTMLInputElement).files[0].size > this.maxSizeBytes;
      if (fileTooLarge) {
        this.error = 'File too Large. We support files less than 1mb.';
      } else {
        this.error = null;
      }
      this.disabled = fileTooLarge;
    } else {
      this.disabled = true;
      this.error = null;
    }
  }
}


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template:   `
  <div class="modal-header">
      <h4 class="modal-title" id="modal-basic-title">Register Logged Time</h4>
      <span aria-hidden="true" class="close"  style="cursor: pointer;"
      (click)="activeModal.dismiss('Cross click')">&times;</span>
  </div>
  <div class="modal-body" style="padding: 0.5rem 1rem;">
    <p class="alert alert-danger" *ngIf="error">{{ error }}</p>
    <div style="width: 100%;" class="d-flex">
      <span style="width: 30px;display: flex;align-items: center;">
        <i class="ion ion-android-stopwatch" style="font-size: 3em;"></i>
      </span>
      <div style="width: 100%;padding: 2px 15px;
      margin-top: auto; margin-bottom: auto;">
        <hr style="background: blue;
        height: 10px;
        margin: 0;
        border-radius: 5px;"/>
        <span class="text">Time logged</span>
      </div>
    </div>
    <div class="row">
      <div class="col-6">
        <div class="form-group">
          <label class="text required">Log Time</label>
          <input type="text" placeholder="Enter in this format 4w | 3d | 2h" class="form-control"
          ref-loggedTime (keyup)="parseTime(loggedTime)" maxlength="20"/>
        </div>
      </div>
      <div class="col-6">
        <div class="form-group" [ngClass]="  {'d-none': !currentTimeBeingLogged }  ">
          <label class="text">You are logging</label>
          <span class="form-control simulate__disabled time__confirm">{{ currentTimeBeingLogged }}</span>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <label class="required text">Date and Time logged</label>
      </div>
    </div>
    <div class="row">
      <div class="col-7">
        <div class="form-group">
          <ngb-datepicker #dp [(ngModel)]="date" (select)="dateUpdated($event)"
          [maxDate]="maximumDateAllowed"></ngb-datepicker>
        </div>
      </div>
      <div class="col-5">
        <div class="form-group">
          <ngb-timepicker [(ngModel)]="time" [meridian]="meridian" (ngModelChange)="updateValidityOfTime()"></ngb-timepicker>
        </div>
        <span *ngIf="!timeDateComboValidity" class="text-danger">You cannot set a time in the future</span>
      </div>
    </div>
  </div>
  <div class="modal-footer" style="padding: 0.5rem;">
    <span class="mr-2" *ngIf="loading"><i class="fa fa-spinner fa-spin"></i></span>
    <button type="button" class="btn btn-primary"
    (click)="submit()" [disabled]="!currentTimeBeingLogged || loading">Save</button>
    <button type="button" class="btn btn-light" data-dismiss="modal" (click)="activeModal.close()">Close</button>
  </div>
  `,
  styles: [
    `
      .simulate__disabled {
        background-color: #eee;
      }

      .time__confirm {
        text-overflow: ellipsis;
        overflow: hidden;white-space: nowrap;padding-left:0.375em;padding-right:0.375em;
      }

      .row {
        margin-top: 7px;
      }

      .required::after {
        content: "  *";
        color: red;
        display: inline;
      }

      .text {
        font-family: 'Noto Sans JP', Cambria sans-serif;
        font-weight: 400;
        font-size: 0.9em;
      }
    `
  ]
})
export class LogTimeComponent {
  @Output() timeLogged = new EventEmitter();
  error: string;
  meridian = true;
  time;
  date: NgbDateStruct;
  acceptedShortTimeFormats = Object.values(LogHourEnum);
  currentTimeBeingLogged: string;
  maximumDateAllowed;
  loading: boolean;
  rawLoggedTimeObj: { [key: string]: number } = {};
  timeDateComboValid: boolean;
  constructor(public activeModal: NgbActiveModal,
    private calendar: NgbCalendar,
    private dateFormatter: NgbDateParserFormatter
    ) {
    this.time = {
      hour: new Date().getHours(),
      minute: new Date().getMinutes() - 1
    };
    this.date = this.calendar.getToday();
    this.maximumDateAllowed = this.calendar.getToday();
  }

  parseTime(rawTime: HTMLInputElement): void {
    const refToInput = rawTime;
    const rawTimeString = rawTime.value.trim().toLowerCase();
    const timeObj = {};
    rawTimeString.toLowerCase().split(':')
      .filter(t => this.acceptedShortTimeFormats.indexOf(t.charAt(t.length - 1)) > -1)
      .map(t => timeObj[t.charAt(t.length - 1)] = parseInt(t, 10));
    this.currentTimeBeingLogged = this.humanReadableTime(timeObj);
    this.rawLoggedTimeObj = timeObj;
    if (rawTimeString && !this.validateAsAcceptableFormat(rawTimeString)) {
      refToInput.setAttribute('class', refToInput.getAttribute('class').replace('is-invalid', '').concat(' is-invalid'));
      this.currentTimeBeingLogged = null;
    } else {
      refToInput.setAttribute('class', refToInput.getAttribute('class').replace('is-invalid', ''));
    }
  }

  dateUpdated(date: NgbDateStruct) {
    this.setDate(date);
    this.updateValidityOfTime();
  }

  updateValidityOfTime(): void {
    // current date x curr Time should be greater than selected time
    const { hour, minute } = this.time;
    const now = new Date();
    const currentTimeDateCombo = new Date(`${this.dateFormatter.format(this.date)} ${hour}:${minute}`);
    this.timeDateComboValid = (now > currentTimeDateCombo);
  }

  get timeDateComboValidity(): boolean {
    this.updateValidityOfTime();
    return this.timeDateComboValid;
  }

  setDate(date: NgbDateStruct) {
    this.date = date;
  }

  transformShortToLong(short: string): string {
    short = short.toLowerCase();
    switch (short) {
      case 'w':
        return 'week(s)';
      case 'm':
        return 'month(s)';
      case 'h':
        return 'hour(s)';
      case 'd':
        return 'day(s)';
    }
  }

  validateAsAcceptableFormat(candidate: string): boolean {
    if (candidate.length > 20) {
      return false;
    }
    // return (new RegExp(/^(\d{1,3}[dmwh]{1}:*)+$/g).test(candidate));
    return (new RegExp(/^(\d+)([dwh]{1}$)/)).test(candidate);
  }

  humanReadableTime(timeObject: { [key: string]: number} ): string {
    let readableString = '';
    Object.keys(timeObject).map(timeFrame => {
      if (timeObject[timeFrame]) {
        readableString = readableString.concat(` ${timeObject[timeFrame]}${this.transformShortToLong(timeFrame)}`);
      }
    });
    return readableString;
  }

  submit(): void {
    const { hour, minute } = this.time;
    const currentTimeDateCombo = new Date(`${this.dateFormatter.format(this.date)} ${hour}:${minute}`);
    this.timeLogged.emit({
      date: currentTimeDateCombo,
      loggedTime: this.rawLoggedTimeObj
    });
    this.loading = true;
  }
}

export const modals: any[] = [
  GenericUpdateFieldComponent,
  GenericDeleteConfirmationComponent,
  UpdateColumnVisibiltyComponent,
  SubTaskComponent,
  AttachmentComponent,
  LogTimeComponent,
];
