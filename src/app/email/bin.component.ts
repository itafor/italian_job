import { Component, NgZone, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { Message } from './message';
import { MailService, SendMailObj } from './email.service';
import { PaginationInterface, MsgGetSuccessResponse, EmailObject,
  defaultPaginationObject, DownloadStatusInterface,
  PaginationNumbersInterface, MetaDataUpdateInterface
 } from './interfaces';
import { ToastrManager } from 'ng6-toastr-notifications';
import { BehaviorSubject } from 'rxjs';
import { AuthenticationService } from '../account/account.authentication';
import { User } from '../models/user';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MailBoxType, DownloadStatus } from './enums';
import { mailEnter as mailEnterAnimation } from './animations';

const SMALL_WIDTH_BREAKPOINT = 991;


@Component({
  selector: 'app-email-bin',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./email.component.scss'],
  providers: [MailService],
  animations: [
    mailEnterAnimation
  ],
  template: `
  <div role="paginationSpinner" *ngIf="downloadFeedback.show">
  <span [ngClass]="downloadFeedback.class">{{ downloadFeedback.text }}</span>
</div>
<div class="mx-2 my-2 card">
  <div class="card-body">
      <ngb-tabset #myMailTabset="ngbTabset" [destroyOnHide]="false">
          <ngb-tab title="Trash">
            <ng-template ngbTabContent>
                <app-email-trash
                (selectedMail)="handleMailSelection($event)"></app-email-trash>
            </ng-template>
          </ngb-tab>
          <ngb-tab *ngFor="let item of openTabs; let index=index" id="{{tabIdForIndex(index)}}">
            <ng-template ngbTabTitle>
              <span [innerHTML]="item.title"></span> &nbsp;
              <span (click)="closeTab($event, index)" class="indicate--danger">
                  &times;
              </span>
            </ng-template>
            <ng-template ngbTabContent>
              <ng-container *ngIf="item.type  === 'EXISTING_MAIL' ">
                  <app-email-view [mail]="item.content"
                  [loggedInUserEmail]="user.username"
                  [page]="item.page"
                  (downloadFeedbackEvent)="downloadFeedbackHandler($event)"
                  [showRecoverMailCTA]="true"></app-email-view>
              </ng-container>
            </ng-template>
          </ngb-tab>
        </ngb-tabset>
  </div>
</div>

  `
})
export class BinComponent implements OnInit {
  selectedMessage: Message;
  messageOpen = false;
  isOpened = true;
  _autoCollapseWidth = 991;
  openTabs: any[] = [];
  @ViewChild('myMailTabset') refNgbTabset: NgbTabset;
  user: User;
  error = '';
  allSelected = {
    allSelected: false,
    showBulkActions: false
  };
  downloadFeedback = {
    show: false,
    class: {
      'text-danger': false
    },
    text: ''
  };

  metaUpdatesArray: MetaDataUpdateInterface[] = [];

  private pagesLoadedDataFrom: number[] = [];
  constructor(
    private mailService: MailService,
    zone: NgZone,
    public uiNotifs: ToastrManager,
    private auth: AuthenticationService,
    private router: Router
    ) {
    this.user = this.auth.currentUserValue;
  }

  ngOnInit(): void {
  }

  getInitials(name) {
    return name.split('<')[0].match(/\b(\w)/g).join('').substr(0, 2);
  }

  trim (name) {
    return name.substring(0, 5);
  }


  onSelect(message: Message, draft?: boolean, indexForAttach?: number): void {
    this.selectedMessage = message;
    if (draft) {
    } else {
      this.addToTabs(
        this.uiFriendlySubject(this.selectedMessage.subject), this.selectedMessage, 'EXISTING_MAIL', indexForAttach);
    }
    this.focusOnCreatedTab();
  }

  get latestTabId(): string {
    return `tab-id-${this.openTabs.length - 1}`;
  }

  tabIdForIndex(index: number): string {
    return `tab-id-${index}`;
  }

  addToTabs(title?: string, tabContent?: Message, type?: string, indexForAttach?: number): void {
    const newTab = title ? { title, content: tabContent, type, page: indexForAttach } : { title: 'New Mail', type: 'NEW_MAIL' };
    this.openTabs.push(newTab);
  }

  closeTab(event?: MouseEvent, index?: number): void {
    if (event) { event.preventDefault(); }
    this.removeFromTab(index);
  }


  removeFromTab(index: number): void {
    this.openTabs.splice(index, 1);
  }

  focusOnCreatedTab() {
    setTimeout(() => { this.refNgbTabset.select(this.latestTabId); }, 50);
  }

  downloadFeedbackHandler(downloadEvent: DownloadStatusInterface): void {
    this.downloadFeedback.show = true;
    if (downloadEvent.payload) {
      this.downloadFeedback = {
        ...this.downloadFeedback,
        class: {
          'text-danger': true
        },
        // text: downloadEvent.payload
        text: 'Download Failed (:'
      };
    } else {
      let text;
      text = downloadEvent.status === DownloadStatus.FINISHED ? 'Download Completed' : 'Download Started';
      this.downloadFeedback = {
        ...this.downloadFeedback,
        class: {
          'text-danger': false
        },
        text
      };
    }
    setTimeout(() => {
      this.downloadFeedback.show = false;
    }, 500);
  }

  handleMailSelection($event) {
    const {message} = $event;
    this.onSelect(message, false, $event.index);
  }

  uiFriendlySubject(subject: string): string {
    const uiSubject = (subject.length ? subject : '(no Subject)' );
    return uiSubject;
  }
}

