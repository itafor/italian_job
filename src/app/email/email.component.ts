import { Component, NgZone, OnInit, ViewEncapsulation } from '@angular/core';
import { MailService } from './email.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { BehaviorSubject } from 'rxjs';
import { AuthenticationService } from '../account/account.authentication';
import { mailEnter as mailEnterAnimation } from './animations';
import { TabAwareMailContainer } from './containers/tab-aware-mail-list-container';


@Component({
  selector: 'app-email',
  encapsulation: ViewEncapsulation.Emulated,
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss'],
  providers: [MailService],
  animations: [
    mailEnterAnimation
  ]
})
export class EmailComponent extends TabAwareMailContainer implements OnInit {
  buttonText = new BehaviorSubject('Compose');

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

