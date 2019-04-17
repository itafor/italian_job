import { TabAwareMailContainer } from './containers/tab-aware-mail-list-container';
import { Component, NgZone, OnInit, ViewEncapsulation } from '@angular/core';
import { MailService } from './email.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AuthenticationService } from '../account/account.authentication';
import { mailEnter as mailEnterAnimation } from './animations';


@Component({
  selector: 'app-email-outgoing',
  encapsulation: ViewEncapsulation.Emulated,
  templateUrl: './outgoing-mails.component.html',
  styleUrls: ['./email.component.scss'],
  providers: [MailService],
  animations: [
    mailEnterAnimation
  ]
})
export class OutgoingMailsComponent extends TabAwareMailContainer implements OnInit {

  constructor(
    mailService: MailService,
    zone: NgZone,
    uiNotifs: ToastrManager,
    auth: AuthenticationService,
    ) {
      super(mailService, zone, uiNotifs, auth);
    }

  ngOnInit(): void {
    super.ngOnInit();
  }
}

