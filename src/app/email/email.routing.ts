import { Routes } from '@angular/router';

import { EmailComponent } from './email.component';
import { OutgoingMailsComponent } from './outgoing-mails.component';
import { BinComponent } from './bin.component';

export const EmailRoutes: Routes = [
  {
    path: '',
    component: EmailComponent,
    data: {
      heading: 'Email',
      removeFooter: true,
      modeDocked: true
    }
  },
  {
    path: 'sent',
    component: OutgoingMailsComponent,
    data: {
      heading: 'Email',
      removeFooter: true,
      modeDocked: true
    }
  },
  {
    path: 'trash',
    component: BinComponent,
    data: {
      heading: 'Email',
      removeFooter: true,
      modeDocked: true
    }
  }
];
