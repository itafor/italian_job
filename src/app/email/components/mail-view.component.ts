import { Component, ViewEncapsulation,
  ChangeDetectionStrategy, Input,
  Output, EventEmitter, ViewChild
 } from '@angular/core';

 import { Message } from '../message';
 import { SendEventInterface, DownloadStatusInterface } from '../interfaces';
 import { OnwardActions } from '../enums';
 import { CreateEmailComponent } from '../containers/create/create.component';

@Component({
  selector: 'app-email-view',
  encapsulation: ViewEncapsulation.Emulated,
  template: `
  <div class="card">
  <div class="d-flex mb-3 card-body">
    <div class="mr-3">
      <div class="widget-icon rounded-circle bg-{{mail.type ? mail.type : 'black'}} text-white">{{
        getInitials(mail.from) }}</div>
    </div>
    <div class="pl-0 w-100">
      <div class="date">
        {{mail.date | date: 'fullDate'}}
      </div>
      <h4 class="lead mt-0">
        {{mail.subject}}
      </h4>
      <small class="d-block mb-4">
        <b>
          {{mail.from}}
        </b>
        to  {{ getUiFriendlyListOfReceipients() }} &nbsp;
        <span title="{{ hoverNotice }}"
        (click)="showAllReceipients()"
        id="collapser"
        style="cursor: pointer;"
        *ngIf="showCollpaser()">
          <i class="icon ion-chevron-{{caretDir}}"></i>
        </span>
        <div *ngIf="display"
        style="
        display: flex;
        flex-direction: column;
        width: 200px;
        margin-left: auto;
        margin-right: auto;
        padding: 20px 10px;
        border: 1px solid #535050;
        font-size: 1.3em;
        text-overflow: ellipsis;
        position: fixed;
        z-index: 4000;
        background: #fff;
        left: 60vw;
        font-style: italic;">
          <h4>All Receipients: </h4>
          <div style="
          display: flex;
          flex-direction: column;
          overflow-x: hidden">
            <span *ngFor="let r of receipientsMeta.all"
            style="white-space: nowrap">{{ r }}</span>
          </div>
        </div>
      </small>

      <div [innerHtml]="mail.body | sanitizeHtml" class="mail__body" *ngIf="!asText()" appExternalLink></div>
      <div *ngIf="asText()" class="mail__body flex-justify-content-center" appExternalLink>
        <pre class="text__format">
          {{  mail.body }}
        </pre>
      </div>
      <div class="my-2 mx-2" style="font-size: 0.8em;">
        <app-email-attachments-preview
        *ngIf="mail.attachments"
        [attachments]="mail.attachments"
        [page]="page"
        (downloadEvent)="propagateDownloadStatusEventHandler($event)"></app-email-attachments-preview>
      </div>
      <div class="my-2 mx-2">
        <app-email-actions [showNavToggle]="false"
        (onwardMailEvent)="prepareForOnwardMovement($event)"
        [quarantined]="showRecoverMailCTA"
        ></app-email-actions>
      </div>
      <ng-container *ngIf="embedMail">
          <app-create-email [initMailObj]="onwardMailObj"
          (sendMailEvent)="propagateSendMailEvent($event)"
          [mailSender]="loggedInUserEmail"
          [initMailContext]="embedMailContext"
          (discardEvent)="handleMailDiscard()"
          ></app-create-email>
      </ng-container>
    </div>
  </div>
</div>
  `,
  styles: [
    `
  .mail__body {
    padding: 0 20px;
	  word-break: break-all;
	}
	.mail__body.flex-justify-content-center {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  .mail__body.flex-justify-content-center > pre.text__format {
    white-space: pre-line;
    word-break: break-word;
    margin: 0;
  }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmailViewComponent {
  embedMail = false;
  @Input() mail: Message;
  @Input() loggedInUserEmail: string;
  @Input() page: number;
  @Input() showRecoverMailCTA: boolean;
  onwardMailObj: Message = new Message;
  @Output() sendMailEvent = new EventEmitter<SendEventInterface>();
  @Output() downloadFeedbackEvent = new EventEmitter<DownloadStatusInterface>();
  receipientsMeta = {
    all: [],
    trimmed: false
  };
  display = false;
  caretDir = 'down';
  hoverNotice = 'Show All';
  embedMailContext = undefined;
  @ViewChild(CreateEmailComponent) refEmbeddedMail: CreateEmailComponent;
  // CreateEmailComponent;
  getInitials(name) {
    return name.split('<')[0].match(/\b(\w)/g).join('').substr(0, 2);
  }

  propagateSendMailEvent(event: SendEventInterface) {
    this.sendMailEvent.emit(event);
  }

  propagateDownloadStatusEventHandler(downloadEvent: DownloadStatusInterface) {
    this.downloadFeedbackEvent.emit(downloadEvent);
  }
  prepareForOnwardMovement(typeOfAction: OnwardActions) {
    setTimeout(() => {
      this.refEmbeddedMail.scrollIntoView();
    }, 1000);

    // open create-mail
    // populate
    this.embedMail = true;
    this.embedMailContext = typeOfAction;
    Object.assign(this.onwardMailObj, this.mail);
    switch (typeOfAction) {
      case OnwardActions.REPLY:
        this.onwardMailObj.subject = `RE: ${this.uiFriendlySubject(this.mail.subject)}`;
        return;
      case OnwardActions.FORWARD:
        this.onwardMailObj.subject = `Fwd: ${this.uiFriendlySubject(this.mail.subject)}`;
        return;
    }
  }

  getAppropriateWayToReferToSentTo(to: string): string {
    // TODO: multiple receivers in to field
    const parsedReceiver = to.split('<');
    let emailOfReceiver;
    if (parsedReceiver.length > 1) {
      emailOfReceiver = parsedReceiver[1].replace('>', '');
    } else {
      emailOfReceiver = parsedReceiver[0];
    }
    if (emailOfReceiver === this.loggedInUserEmail) {
      return 'me';
    }
    return emailOfReceiver;
  }

  getUiFriendlyListOfReceipients(): string[] {
    const receipients: string[] = [];
    const toFromStingsToArrayOfStrings = [...this.mail.to.split(','), ...this.mail.cc.split(',')];
    toFromStingsToArrayOfStrings.forEach(r => {
      if (r.trim().length) {
        receipients.push(this.getAppropriateWayToReferToSentTo(r.trim()));
      }
    });
    this.receipientsMeta = {
      ...this.receipientsMeta,
      all: [...receipients]
    };
    if (receipients.length > 3) {
      this.receipientsMeta = {
        ...this.receipientsMeta,
        trimmed: true
      };
      const leftOut = receipients.length - 3;
      const leftOutTense = leftOut > 1 ? `and ${leftOut} other persons.` : `and 1 person.`;
      return [...receipients.slice(0, 2),  leftOutTense];
    }
    return receipients;
  }

  showCollpaser(): boolean {
    return [...this.mail.to.split(','),
    ...this.mail.cc.split(',')].length > 3;
  }

  showAllReceipients() {
    this.display = !this.display;
    this.caretDir = this.display ? 'up' : 'down';
    this.hoverNotice = this.display ? 'Collpase' : 'Show All';
  }

  uiFriendlySubject(subject: string): string {
    const uiSubject = (subject.length ? subject : '(no Subject)' );
    return uiSubject;
  }

  asText(): boolean {
    return this.mail.contentType.startsWith('text/plain');
  }

  handleMailDiscard(): void {
    // what happens to drafts - we remove them too?
    this.embedMail = false;
  }
}
