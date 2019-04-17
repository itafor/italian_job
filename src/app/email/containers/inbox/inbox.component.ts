import { Component, OnInit, ViewEncapsulation, NgZone, OnDestroy } from '@angular/core';
import { MailService } from '../../email.service';
import { mailEnter as mailEnterAnimation } from '../../animations';
import { ListEmailsComponent } from '../mail-list';
import { MailBoxType } from '../../enums';
import { AuthenticationService } from '../../../account/account.authentication';

@Component({
  selector: 'app-email-inbox',
  encapsulation: ViewEncapsulation.Emulated,
  templateUrl: './inbox.component.html',
  styleUrls: ['../../email.component.scss'],
  animations: [mailEnterAnimation]
})
export class ReceivedEmailsComponent extends  ListEmailsComponent implements OnInit, OnDestroy {
  inbox = MailBoxType.INBOX;
  mailbox = MailBoxType.INBOX;
  constructor(mailService: MailService,
    zone: NgZone,
    authenticationService: AuthenticationService) {
      super(mailService, zone, authenticationService);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }
}
