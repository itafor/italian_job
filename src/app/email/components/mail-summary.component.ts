import { Component, ViewEncapsulation,
  ChangeDetectionStrategy, Input,
  Output, EventEmitter, OnChanges, SimpleChanges
 } from '@angular/core';

 import { trigger, style, transition, animate, keyframes, query, stagger } from '@angular/animations';
 import { Message } from '../message';
 import { MailBoxType } from '../enums';


@Component({
  selector: 'app-email-summary',
  encapsulation: ViewEncapsulation.Emulated,
  template: `
  <a class="d-flex b-b w-100 mail-link" href="javascript:;" @mailEnter
  [attr.data-addressed]="addressedTo"
  [attr.data-subject]="mail.subject"
  [attr.data-id]="mail.id"
  [attr.data-text_format]="shouldFormatAsText()">
    <div class="mr w-20">
      <app-email-metadata [mail]="mail"
      (mailSelectedEvent)="mailSelectedHandler($event)"
      (mailReadStatusUpdatedEvent)="mailReadHandler($event)"
      [checkedState]="inBulkMail"
      [showRead]="showRead()"></app-email-metadata>
    </div>
    <div class="pl-3 d-flex align-items-center">
      <div class="widget-icon rounded-circle bg-{{mail.type ? mail.type : 'black'}} text-white">
      {{ getInitials(addressedTo) }}
      </div>
    </div>
    <div class="pl-3 d-flex justify-content-start align-items-center w-20 crop__text">
        <span class="bold ff-headers">
          {{ addressedTo }}
        </span>
        <small class="bold text-muted time">

        </small>
    </div>
    <div class="pl-3 d-flex justify-content-start align-items-center relative w-40  crop__text">
      <span class="mb-0 text-left">
        {{  uiFriendlySubject }}
      </span>
      <span class="attachment--icon hide--on--hover ml-auto mr-3" *ngIf="hasAttachments()">
        <i class="icon ion-android-attach"></i>
      </span>
    </div>

    <div class="pl-3 d-flex align-items-center hide--on--hover ml-auto">
        <span class="text-muted">{{ mail.date | timeAgo }}</span>
    </div>

    <div class="action--icons action--icons__right mr-3">
      <app-email-actions [previewPane]="true"
      (deleteMailEvent)="handleDeleteMailAction()" [quarantined]="permaDelete()"></app-email-actions>
    </div>
  </a>
  `,
  styleUrls: ['./mail-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('mailEnter', [
    transition(':enter', [
      style({opacity: 0}),
        animate('.6s ease-in', keyframes([
          style({opacity: 0, transform: 'translateY(-75%)', offset: 0}),
          style({opacity: .5, transform: 'translateY(35px)', offset: .3}),
          style({opacity: 1, transform: 'translateY(0%)', offset: 1}),
          ]))
      ])
    ])
  ]
})
export class EmailSummaryComponent {
  @Input() mail: Message;
  @Input() mailboxType: MailBoxType;
  @Output() mailNavToggleEvent = new EventEmitter<void>();
  @Output() mailMetaUpdateEvent = new EventEmitter();
  @Output() mailDeleteEvent = new EventEmitter<{id: string}>();
  @Input() inBulkMail: boolean;

  getInitials(name) {
    if (name && name.length) {
      const parsedSender = name.split('<');
      let emailOfSender;
      if (parsedSender.length > 1) {
        emailOfSender = parsedSender[1].replace('>', '');
      } else {
        emailOfSender = parsedSender[0];
      }

      let matchedInitials;
      if (matchedInitials = emailOfSender.match(/\b(\w)/g)) {
        matchedInitials = matchedInitials.join('').substr(0, 2);
      }
      return matchedInitials || '';
    } else {
      return 'NA';
    }
  }

  get addressedTo(): string {
    switch (this.mailboxType) {
      case MailBoxType.INBOX:
        return this.mail.from || '';
      case MailBoxType.SENT:
        return this.mail.to || '';
      default:
        return this.mail.from || '';
    }
  }

  hasAttachments(): boolean {
    return !!(this.mail.attachments && this.mail.attachments.length);
  }

  mailSelectedHandler($event: Event) {
    this.mailMetaUpdateEvent.emit($event);
  }

  mailReadHandler($event: Event) {
    this.mailMetaUpdateEvent.emit($event);
  }

  showRead(): boolean {
    return (this.mailboxType !== MailBoxType.SENT);
  }

  get uiFriendlySubject(): string {
    return this.mail.subject || '(no Subject)';
  }

  handleDeleteMailAction() {
    this.mailDeleteEvent.emit({id: this.mail.id});
  }

  permaDelete(): boolean {
    // or SPam
    return this.mailboxType === MailBoxType.TRASH;
  }

  shouldFormatAsText(): boolean {
    return this.mail.contentType.startsWith('text/plain');
  }
}
