import { Component, OnInit, ViewEncapsulation, Input, NgZone,
  OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { Message } from '../../message';
import { MailService } from '../../email.service';
import { HttpErrorResponse } from '@angular/common/http';
import { mailEnter as mailEnterAnimation } from '../../animations';
import { ListEmailsComponent } from '../mail-list';
import { MailBoxType } from '../../enums';
import { AuthenticationService } from '../../../account/account.authentication';

@Component({
  selector: 'app-email-sent',
  encapsulation: ViewEncapsulation.Emulated,
  templateUrl: './sent.component.html',
  styleUrls: ['../../email.component.scss'],
  animations: [mailEnterAnimation]
})
export class SentEmailsComponent extends  ListEmailsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() recentlySent: Message[];
  mailbox = MailBoxType.SENT;
  sent = MailBoxType.SENT;
  constructor(mailService: MailService,
    zone: NgZone, authenticationService: AuthenticationService) {
      super(mailService, zone, authenticationService);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.recentlySent.firstChange) {
      this.messages = [
        changes.recentlySent.currentValue[0],
        ...this.messages
      ];
      this.messagesInView = [
        changes.recentlySent.currentValue[0],
        ...this.messagesInView
      ];
    }
  }
}
