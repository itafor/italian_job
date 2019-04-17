import { CreateEmailComponent } from './create/create.component';
import { SentEmailsComponent } from './sent/sent.component';
import { ReceivedEmailsComponent } from './inbox/inbox.component';
import { NewslettersComponent } from './newsletters/newsletters.component';
import { AlertComponent } from './alerts/alerts.component';
import { TrashEmailsComponent } from './trash/trash.component';

export const containers: any[] = [
  CreateEmailComponent,
  SentEmailsComponent,
  ReceivedEmailsComponent,
  NewslettersComponent,
  AlertComponent,
  TrashEmailsComponent,
];

export * from './create/create.component';
export * from './sent/sent.component';
export * from './inbox/inbox.component';
export * from './newsletters/newsletters.component';
export * from './alerts/alerts.component';
export * from './trash/trash.component';
