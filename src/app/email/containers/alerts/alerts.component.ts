import { Component, OnInit, ViewEncapsulation, NgZone, OnDestroy } from '@angular/core';
import { MailService } from '../../email.service';
import { mailEnter as mailEnterAnimation } from '../../animations';
import { ListEmailsComponent } from '../mail-list';
import { MailBoxType } from '../../enums';
import { AuthenticationService } from '../../../account/account.authentication';

@Component({
  selector: 'app-email-alert',
  encapsulation: ViewEncapsulation.Emulated,
  templateUrl: './alerts.component.html',
  styleUrls: ['../../email.component.scss'],
  animations: [mailEnterAnimation]
})
export class AlertComponent extends  ListEmailsComponent implements OnInit, OnDestroy {
  alert = MailBoxType.ALERT;
  mailbox = MailBoxType.ALERT;
  constructor(mailService: MailService,
    zone: NgZone,
    authenticationService: AuthenticationService) {
      super(mailService, zone, authenticationService);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }
}
