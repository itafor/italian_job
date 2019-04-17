import { Component, OnInit, ViewEncapsulation, NgZone, OnDestroy } from '@angular/core';
import { Message } from '../../message';
import { MailService } from '../../email.service';
import { HttpErrorResponse } from '@angular/common/http';
import { mailEnter as mailEnterAnimation } from '../../animations';
import { ListEmailsComponent } from '../mail-list';
import { MailBoxType } from '../../enums';
import { AuthenticationService } from '../../../account/account.authentication';

@Component({
  selector: 'app-email-trash',
  encapsulation: ViewEncapsulation.Emulated,
  templateUrl: './trash.component.html',
  styleUrls: ['../../email.component.scss'],
  animations: [mailEnterAnimation]
})
export class TrashEmailsComponent extends  ListEmailsComponent implements OnInit, OnDestroy {
  mailbox = MailBoxType.TRASH;
  trash = MailBoxType.TRASH;
  constructor(mailService: MailService,
    zone: NgZone, authenticationService: AuthenticationService) {
      super(mailService, zone, authenticationService);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }
}
