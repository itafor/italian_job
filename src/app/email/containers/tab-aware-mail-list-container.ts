import { ListEmailsComponent } from './mail-list';
import { ViewChild, NgZone, OnInit } from '@angular/core';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { Message } from '../message';
import { MailService, SendMailObj } from '../email.service';
import { PaginationInterface, MsgGetSuccessResponse, EmailObject,
  defaultPaginationObject, DownloadStatusInterface,
  PaginationNumbersInterface, MetaDataUpdateInterface
 } from '../interfaces';
import { ToastrManager } from 'ng6-toastr-notifications';
import { BehaviorSubject } from 'rxjs';
import { AuthenticationService } from '../../account/account.authentication';
import { User } from '../../models/user';
import { HttpErrorResponse } from '@angular/common/http';
import { MailBoxType, DownloadStatus } from '../enums';

const SMALL_WIDTH_BREAKPOINT = 991;

export class TabAwareMailContainer  implements OnInit {
  private mediaMatcher: MediaQueryList = matchMedia(
    `(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`
  );

  isOpened = true;
  selectedMessage: Message;
  user: User;
  drafts: Message[] = [];
  outbox: Message[] = [];
  _autoCollapseWidth = 991;
  openTabs: any[] = [];
  paginationObj: PaginationInterface;
  @ViewChild('myMailTabset') refNgbTabset: NgbTabset;
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
  sent =  MailBoxType.SENT;
  inbox = MailBoxType.INBOX;


  constructor(
    private mailService: MailService,
    zone: NgZone,
    public uiNotifs: ToastrManager,
    private auth: AuthenticationService,
  ) {
    this.mediaMatcher.addListener(mql =>
      zone.run(() => {
      })
    );

    this.user = this.auth.currentUserValue;
  }

  ngOnInit(): void {
    this.paginationObj = {...defaultPaginationObject};
    if (this.isOver()) {
      this.isOpened = false;
    }
  }

  toogleSidebar(): void {
    this.isOpened = !this.isOpened;
  }

  isOver(): boolean {
    return this.mediaMatcher.matches;
  }

  getInitials(name) {
    return name.split('<')[0].match(/\b(\w)/g).join('').substr(0, 2);
  }

  trim (name) {
    return name.substring(0, 5);
  }

  composeMailHandler(): void {
    this.addToTabs();
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

  handleMailSelection($event) {
    const {message} = $event;
    this.onSelect(message, false, $event.index);
  }

  onSelect(message: Message, draft?: boolean, indexForAttach?: number): void {
    this.selectedMessage = message;
    if (this.isOver()) {
      this.isOpened = false;
    }
    if (draft) {
      this.addToTabs(`Draft: ${this.uiFriendlySubject(this.selectedMessage.subject)}`, this.selectedMessage, 'NEW_MAIL');
    } else {
      this.addToTabs(
        this.uiFriendlySubject(this.selectedMessage.subject), this.selectedMessage, 'EXISTING_MAIL', indexForAttach);
    }
    this.focusOnCreatedTab();
  }

  convertSingleToArray(item: string | string[]): string[] {
    return (Array.isArray(item)) ? item : [...this.parseCommaSeparated(item)];
  }

  parseCommaSeparated(candidiate: string): string[] {
    // 4 here is the minimum length of a valid mail
    // a@b.com
    // 5 - 1
    return candidiate.split(',').filter(mailOrStray => mailOrStray.trim().length > 4);
  }

  sendMailEventHandler(mailToSendWithTabIndex) {
    this.mailService.sendMailWithAttachments({
      ...this.makeExpectedSendMailObj(mailToSendWithTabIndex.mailObj),
        attachments: mailToSendWithTabIndex.attachments || []
    })
    .then(success => {
      this.appropriateUiNotif(true);
      this.postAPIFeedback(mailToSendWithTabIndex.tabIndex, 'ngb-tab-0');
    })
    .catch(err => {
      console.error(err);
      this.appropriateUiNotif(false);
      this.outbox.push(ListEmailsComponent.mapToExpectedDisplayFormat(mailToSendWithTabIndex.mailObj));
      this.postAPIFeedback(mailToSendWithTabIndex.tabIndex, 'ngb-tab-3');
    });
  }

  postAPIFeedback(tabIndex: number, tabIdToFocus: string): void {
    this.closeTab(null, tabIndex);
    // focus on approp panel / tab
    this.refNgbTabset.select(tabIdToFocus);
  }

  appropriateUiNotif(success: boolean): void {
    if (success) {
      this.uiNotifs.successToastr('Mail sent successfully', null, {toastTimeout: 2000});
    } else {
      this.uiNotifs.errorToastr('Mail was not sent', null, {toastTimeout: 2000});
    }
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

  handleDiscardEvent(tabIndex: number): void {
    const focusOnTab = tabIndex ? 1 : (tabIndex - 1);
    this.refNgbTabset.select(this.tabIdForIndex(focusOnTab));
    this.closeTab(null, tabIndex);
  }

  stripHtmlTags(withTags: string): string {
    const DOMElement = document.createElement('p');
    DOMElement.innerHTML = withTags;
    return DOMElement.innerText;
  }

  uiFriendlySubject(subject: string): string {
    subject = this.stripHtmlTags(subject);
    if (subject.length) {
      if (subject.length > 15) {
        return `${subject.substr(0, 15)}...`;
      } else { return subject; }
    } else { return '(no Subject)'; }
  }

  makeExpectedSendMailObj(mailObj): SendMailObj {
    const expectedObj: SendMailObj = {
      recipients: [],
      subject: '',
      content: ''
    };

    expectedObj.recipients = this.convertSingleToArray(mailObj.to);
    expectedObj.content = mailObj.mailBody;
    expectedObj.subject = mailObj.subject;
    expectedObj.cc =  (mailObj.cc ? this.convertSingleToArray(mailObj.cc) : []);
    expectedObj.bcc = (mailObj.bcc ? this.convertSingleToArray(mailObj.bcc) : []);
    return expectedObj;
  }

  draftHandler(draft: EmailObject) {
    this.drafts.push({
      to: draft.to,
      from: draft.from,
      cc: draft.cc,
      bcc: draft.bcc,
      subject: draft.subject,
      sentDate: new Date(Date.now()).toString(),
      id: '',
      content: draft.mailBody,
      contentType: 'text/html'
    });
  }
}
