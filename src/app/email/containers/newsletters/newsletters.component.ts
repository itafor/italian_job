import { Component, OnInit, ViewEncapsulation, NgZone, OnDestroy } from '@angular/core';
import { MailService } from '../../email.service';
import { mailEnter as mailEnterAnimation } from '../../animations';
import { ListEmailsComponent } from '../mail-list';
import { MailBoxType } from '../../enums';
import { AuthenticationService } from '../../../account/account.authentication';

@Component({
  selector: 'app-email-newsletter',
  encapsulation: ViewEncapsulation.Emulated,
  templateUrl: './newsletters.component.html',
  styleUrls: ['../../email.component.scss'],
  animations: [mailEnterAnimation]
})
export class NewslettersComponent extends  ListEmailsComponent implements OnInit, OnDestroy {
  newsletter = MailBoxType.NEWSLETTER;
  mailbox = MailBoxType.NEWSLETTER;
  constructor(mailService: MailService,
    zone: NgZone,
    authenticationService: AuthenticationService) {
      super(mailService, zone, authenticationService);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }
}
