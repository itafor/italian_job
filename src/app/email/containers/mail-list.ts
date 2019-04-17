import { OnInit, NgZone, EventEmitter, Output, OnDestroy } from '@angular/core';
import { PaginationInterface, defaultPaginationObject, MetaDataUpdateInterface,
  MsgGetSuccessResponse, PaginationNumbersInterface } from '../interfaces';
import { Message } from '../message';
import { OnwardActions, MailBoxType, BulkActions } from '../enums';
import { MailService } from '../email.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from '../../account/account.authentication';

const SMALL_WIDTH_BREAKPOINT = 991;

export class ListEmailsComponent implements OnInit, OnDestroy {
  mailbox: MailBoxType = null;
  paginationObj: PaginationInterface;
  totalMessages: number;
  pagesLoadedDataFrom: number[] = [];
  messages: Message[];
  messagesInView: Message[];
  selectedMessage: Message;
  pageCount: number;
  @Output() selectedMail = new EventEmitter();
  isOpened = true;
  _autoCollapseWidth = 991;
  error: string = undefined;
  feedback = {
    text: '',
    show: false
  };
  allSelected = {
    allSelected: false,
    showBulkActions: false
  };
  metaUpdatesArray: MetaDataUpdateInterface[] = [];

  public mediaMatcher: MediaQueryList = matchMedia(
    `(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`
  );

  static mapToExpectedDisplayFormat(m, index?: number): Message {
    const id = m.id ? m.id : `${m.from}-${index}-${Math.random() * 100}`;
    const msg = new Message;
    msg.body = m.content || m.mailBody || ' <p>&nbsp;</p> ';
    msg.icon = 'group';
    msg.iconClass = 'mat-text-primary';
    msg.from = m.from;
    msg.subject = m.subject;
    msg.date = m.sendDate || m.sentDate;
    msg.tag = 'personal';
    msg.type = 'success';
    msg.starred = m.starred || false;
    msg.read = m.seen;
    msg.important = m.important || false;
    msg.attachments = m.attachments;
    msg.id = id;
    msg.to = m.to;
    msg.cc = m.cc || '';
    msg.contentType = m.contentType;
    return msg;
  }



  constructor(
    public mailService: MailService,
    zone: NgZone,
    public authenticationService: AuthenticationService) {
      this.mediaMatcher.addListener(mql =>
        zone.run(() => {
          // this.mediaMatcher = mql;
        })
      );
  }

  ngOnInit(): void {
    if (this.isOver()) {
      this.isOpened = false;
    }
    this.paginationObj = {...defaultPaginationObject};
    this.populateBox();
  }

  populateBox() {
    this.setPaginationFeedback();
    this.mailService.getMails(this.mailbox).subscribe(
      successRes => {
        if (successRes.summary === null) {
          this.error = 'Oops, we have a problem with our servers. Please try again later :)';
          return;
        }
        const { messages, totalMessages } = successRes.summary;
        this.totalMessages = totalMessages;
        if (messages) {
          const msgs: Array<Message> = [];
          messages.forEach(function (m, index) {
            const msg = ListEmailsComponent.mapToExpectedDisplayFormat(m, index + 1);
            msgs.push(msg);
          });
          this.updateMessagesInSystem(msgs);
          this.updatePagesInCache(this.paginationObj.offset);
          if (this.paginationObj.offset === this.howManyPages() ) {
            this.paginationObj.endOfMails = true;
          }
        } else {
          this.messages = [];
        }
        this.error = undefined;
      },
      (errRes: HttpErrorResponse) => {
        this.apiErrorHandler(errRes);
      },
      () => {
        this.clearPaginationFeedback();
       }
      );
  }

  toogleSidebar(): void {
    this.isOpened = !this.isOpened;
  }

  isOver(): boolean {
    return this.mediaMatcher.matches;
  }

  get messagesShowingIndex(): string {
    const endPoint = this.startPointOfCurrentPage + this.paginationObj.limit -  1;
    let showEndPoint = ` - ${endPoint}`;

    if (this.paginationObj.endOfMails) {
      // gonna be stratPInt - lastIndex or messages.length
      showEndPoint = ` - ${this.totalMessages}`;
    }
    return `${this.startPointOfCurrentPage} ${showEndPoint}`;
  }

  get startPointOfCurrentPage(): number {
    return ((this.paginationObj.offset - 1) * this.paginationObj.limit) + 1;
  }


  loadMore(forwardDirection: boolean): void {
    this.setPaginationFeedback();
    const newMessages = [];
    const pagObj = {...this.paginationObj};
    forwardDirection ? pagObj.offset++ : pagObj.offset--;

    const pageYouNeedNotInCache = this.makePaginationAPICall({
      forwardDirection,
      pageBeforePageAttempt: this.paginationObj.offset,
      pageAttemptingToGo: pagObj.offset
    });

    if (pageYouNeedNotInCache) {
      this.mailService.getMailsWithPaginationPromise(pagObj, this.mailbox).then((res: MsgGetSuccessResponse) => {
        const {messages, totalMessages, pageCount } = res.summary;
        // new message since you checked
        // move to func
        if (totalMessages) { this.totalMessages = totalMessages; }
        // if we got new messages
        if ( messages && messages.length) {
          // console.log(messages);
            messages.forEach(function (m, index) {
              const idAdjustedForPagination = ((pagObj.offset - 1) * pagObj.limit) + 1 + index;
              const msg = ListEmailsComponent.mapToExpectedDisplayFormat(m, idAdjustedForPagination);
              newMessages.push(msg);
            });
          // only do this if you made API call
          this.updateMessagesInSystem(newMessages);
          // update pagination Object
          // abandon cache for now
          this.updatePaginationObject(forwardDirection, true);
        } else {
            // if we didnt get new messages at all
        }
        this.bulkSelectionHandler(false);
        this.allSelected = {allSelected: false, showBulkActions: false};
        this.clearPaginationFeedback();
      })
      .catch(errRes => {
        // indicate error to user
        // for now console log
        this.apiErrorHandler(errRes);
      });
    } else {
      this.updatePaginationObject(forwardDirection, false);
      this.updateMessagesInSystem();
      this.bulkSelectionHandler(false);
      this.allSelected = {allSelected: false, showBulkActions: false};
      this.clearPaginationFeedback();
    }
  }

  loadNext(): void {
    this.loadMore(true);
  }

  loadPrevious(): void {
    this.loadMore(false);
  }



  updatePaginationObject(increment: boolean, updatePagesInCache: boolean = false): void {
    increment ? this.paginationObj.offset++ : this.paginationObj.offset--;
    if (updatePagesInCache) {
      this.updatePagesInCache(this.paginationObj.offset);
    }
    this.updateEndOfMails();
 }

 updatePagesInCache(pageToAdd: number): void {
    this.pagesLoadedDataFrom.push(pageToAdd);
 }

 updateMessagesInSystem(newMessages?: Message[]) {
   if (newMessages) {
     // also perhaps
   // choose direction to add new data to
   // front or back of array
     this.messages = [
       ...this.messages || [],
       ...newMessages
     ];
   // update what gets shown
   // NOTES
   // watch for rerenders
   // if unnecessary rerenders use assignment
   this.messagesInView = [...newMessages];
   return;
   } else {
     // going back,
     // update messages in view;
    this.messagesInView = this.messages.slice(
      (this.paginationObj.offset - 1) * this.paginationObj.limit,
      (this.paginationObj.offset * this.paginationObj.limit));
     }
  }

 updateEndOfMails(): void {
    // check curr offset against total pages
    if ( this.paginationObj.offset === this.howManyPages() ) {
      this.paginationObj.endOfMails = true;
    } else {
      this.paginationObj.endOfMails = false;
    }
  }


  makePaginationAPICall(pagFacts: PaginationNumbersInterface): boolean {
      if (pagFacts.forwardDirection) {
        // we intend to go forward
        // check if we have gone there before,
        // just jave a list of pages we have reached
        if (this.pagesLoadedDataFrom.indexOf(pagFacts.pageAttemptingToGo) > -1) {
          // we've been here before
          // dont call API
          return false;
        } else { return true; }
      } else {
        return false;
      }
  }

  paginationAwareIndex(dumbIndex: number): number {
    return dumbIndex + this.startPointOfCurrentPage;
  }

  clickedMail(message, index: number) {
    this.selectedMessage = message;
    this.selectedMail.emit({
      message,
      index: this.paginationAwareIndex(index)
    });
    if ((this.mailbox !== MailBoxType.SENT) && !message.read) {
      const msgsToUpdate = this.messages.filter(msg => msg.id === message.id);
      this.updateMessagesMeta(msgsToUpdate, {
        id: message.id,
        newReadStatus: true
      });
    }
  }

  /**
   * @method howManyPages
   * @description returns how many pages you expect to navigate
   */
  howManyPages(): number {
    return Math.ceil(this.totalMessages / this.paginationObj.limit);
  }

  apiErrorHandler(err?: HttpErrorResponse) {
    if (err && err.status < 400) {
      this.error = 'Please check your internet connection';
    } else if (err && err.status === 400) {
      this.error = `
      You do not seem to have an account configured for mail. Please contact your company's admin.
      `;
    } else if (err && (err.status === 401  || err.status === 403)) {
      this.error = 'Please log in again. Taking you to the sign in screen.';
      this.authenticationService.logout();
    }
    this.clearPaginationFeedback();
  }

  handleMailDeletion(idObject) {
    this.setFeedback('Deleting Mail...');
    // remove from messages

    const remainingMsgs = [ ...this.messages];
    const index = remainingMsgs.findIndex((msg) => msg.id === idObject.id );
    if (index > -1) {
      remainingMsgs.splice(index, 1);
      // mutate
      this.messages = [
        ...remainingMsgs
      ];
      this.totalMessages--;
      this.updateMessagesInSystem();
      const metaArrayIndex = this.metaUpdatesArray.findIndex(msg => msg.id === idObject.id);
      if (metaArrayIndex > - 1) {
        this.metaUpdatesArray.splice(metaArrayIndex, 1);
      }
    }
    // make API call
    setTimeout(() => {
      this.clearFeedback('Deleted successfully...');
    }, 500);
  }

  handleBulkMailDeletion(mailsToDelete: Message[]) {
    this.setFeedback('Deleting Mail...');
        const remainingMsgs = [ ...this.messages];
        // remove from messages

        for (const itemToDelete of mailsToDelete) {
          const index = remainingMsgs.findIndex((msg) => msg.id === itemToDelete.id );
          if (index > -1) {
            remainingMsgs.splice(index, 1);
          }
          const metaArrayIndex = this.metaUpdatesArray.findIndex(msg => msg.id === itemToDelete.id);
          if (metaArrayIndex > - 1) {
            this.metaUpdatesArray.splice(metaArrayIndex, 1);
          }
        }
        this.messages = [
          ...remainingMsgs
        ];
        this.totalMessages--;
        this.updateMessagesInSystem();

        // make API call
        setTimeout(() => {
          this.clearFeedback('Deleted successfully...');
        }, 500);
  }

  clearFeedback(finishText?: string) {
    if (finishText) {
      this.setFeedback(finishText);
      setTimeout(() => { this.clearFeedback(); }, 1500);
    } else {
      this.feedback = {
        text: null,
        show: false
      };
    }
  }

  get uiFeedback() { return this.feedback; }

  setFeedback(text: string) {
    this.feedback = {
      text,
      show: true
    };
  }

  setPaginationFeedback() {
    this.paginationObj.loading = true;
    this.setFeedback('Loading...');
  }

  clearPaginationFeedback() {
    this.paginationObj.loading = false;
    this.clearFeedback();
  }

  noMails(): boolean {
    return (!this.messages || this.messages.length < 1);
  }

  metaDataUpdateHandler(metaUpdateEvent: MetaDataUpdateInterface) {
    if (metaUpdateEvent.hasOwnProperty('checked')) {
      this.handleIndividualCheckEvents(metaUpdateEvent.id, metaUpdateEvent.checked);
    }
    if (metaUpdateEvent.newReadStatus) {
      const itemsToUpdate = this.messages.filter(msgs => msgs.id === metaUpdateEvent.id);
      this.updateMessagesMeta(itemsToUpdate, metaUpdateEvent);
    }
    // youd have to splice array tho
    // then gen new array
    // do something with items
    // update msgs
    // call
  }

  updateMessagesMeta(mailsToUpdate: Message[], updateEvent: MetaDataUpdateInterface): void {
    this.setFeedback('Marking as read...');
    // make API call
    this.mailService.markAsRead(this.mailbox, this.pluckIdsFromMessages(mailsToUpdate)).subscribe(
      succRes => {
        // what to dow ith result
        mailsToUpdate.map((mail: Message) => {

          const updatedMail = {
            ...mail,
            read: updateEvent.newReadStatus
          };
          const key = this.messages.indexOf(mail);
          // to eliminate anim
          // mutate messages object
          // but get new messagesInView obj
          this.messages.splice(key, 1, updatedMail);
          this.messagesInView = this.messages.slice(
            (this.paginationObj.offset - 1) * this.paginationObj.limit,
            (this.paginationObj.offset * this.paginationObj.limit));

          // update messages In system - i.e messages in cache
          // update in place - to avoid rerenders
        });
        setTimeout(() => { this.clearFeedback('Marked as Read'); }, 500);
      },

      errRes => {
        this.clearFeedback('Failed to marked as Read');
      },

      () => {

        // finalize UI Feedback
      }
    );
  }

  bulkSelectionHandler(selectAll: boolean) {
    if (selectAll) {
      this.metaUpdatesArray = Array.from(this.messagesInView, m  => ({id: m.id, checked: true }));
    } else {
      this.metaUpdatesArray = Array.from(this.messagesInView, m => ({id: m.id, checked: false}));
    }
    // update bulk actions prop
    // console.log(this.metaUpdatesArray);
  }

  handleIndividualCheckEvents(id: string, checkedState: boolean) {
    const index = this.metaUpdatesArray.findIndex(item => item.id === id);
    if (index > -1) {
      this.metaUpdatesArray[index].checked = checkedState;
      if (checkedState === false) {
        // uncheck bulk checkbox
        this.allSelected = {allSelected: false, showBulkActions: this.someSelected()};
      }
    } else {
      // check late for mutation issues
      this.metaUpdatesArray.push({id, checked: checkedState});
    }
    if (this.allMailsInViewSelected()) {
      this.allSelected = {allSelected: true, showBulkActions: true};
    }
    this.allSelected = {...this.allSelected, showBulkActions: this.someSelected()};
  }

  bulkActionHandler($event) {
    const itemsToUpdate = this.messagesInView.filter(
      // by id & checked
      // is by id necessary?
      // keep the id as guarantee
      // you should clear metaUpdatesArray as messages in view changes though
      // a subject perhaps?
      msgs => this.metaUpdatesArray.findIndex(item => (item.id === msgs.id) && item.checked) > -1
      );
      if ($event === BulkActions.BULK_DELETE) {
        this.handleBulkMailDeletion(itemsToUpdate);
      } else {
        try {
          const bulkActionToTake = this.mapBulkEventToMetaDataUpdateInterface($event);
          this.updateMessagesMeta(itemsToUpdate, bulkActionToTake);
        } catch (error) {
          console.error(error.message);
        }
      }
  }

  mapBulkEventToMetaDataUpdateInterface(bulkEvent: BulkActions): MetaDataUpdateInterface {
    const event = bulkEvent.toLowerCase().replace('bulk', '').trim();
    switch (event) {
      case 'mark as read':
        return {
          id: null,
          newReadStatus: true
        };
      default:
        throw new Error(`NOT YET IMPLEMENTED  ${bulkEvent}`);
    }
  }

  handleSingleReadUpdate(mailDetails: MetaDataUpdateInterface) {
    this.setFeedback('Marking as read...');
    const mailToUpdate = this.messages.filter(msg => msg.id === mailDetails.id);
    this.updateMessagesMeta(mailToUpdate, mailDetails);
    setTimeout(() => { this.clearFeedback(); }, 500);
  }

  allMailsInViewSelected(): boolean {
    const { length } = this.metaUpdatesArray;
    return (this.metaUpdatesArray.every(item => item.checked === true) &&
    (length === this.paginationObj.limit || length === this.totalMessages));
  }

  someSelected(): boolean {
    return this.metaUpdatesArray.filter(item => item.checked === true).length > 1;
  }

  mailIsChecked(candidateId: string): boolean {
    const index = this.metaUpdatesArray.findIndex(item => item.id === candidateId);
    if (index > -1) {
      return this.metaUpdatesArray[index].checked;
    }
    return index > -1;
  }

  pluckIdsFromMessages(messages: Message[]): string[] {
    return messages.map(msg => msg.id);
  }

  ngOnDestroy(): void {}
}
