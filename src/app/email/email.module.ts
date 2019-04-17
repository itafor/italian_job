import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ng6-toastr-notifications';
import { EditorModule } from '@tinymce/tinymce-angular';

import {
  MatSidenavModule,
  MatFormFieldModule,
  MatInputModule,
 } from '@angular/material';
import { NgbTooltipModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { EmailComponent } from './email.component';
import { OutgoingMailsComponent } from './outgoing-mails.component';
import { BinComponent } from './bin.component';
import { EmailRoutes } from './email.routing';
import { SanitizeHtmlPipe, FileSizePipe } from './email.pipe';
import { TimeAgoModule } from '../core/timeago.module';

import * as fromContainers from './containers';
import * as fromComponents from './components';
import { ExternalLinkDirective } from './directives';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule.forChild(EmailRoutes),
    NgbTooltipModule,
    NgbModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    EditorModule,
    TimeAgoModule
  ],
  declarations: [
    EmailComponent,
    OutgoingMailsComponent,
    BinComponent,
    SanitizeHtmlPipe,
    FileSizePipe,
    ...fromContainers.containers,
    ...fromComponents.components,
    ExternalLinkDirective,
  ],
  entryComponents: [fromComponents.EmailPromptComponent],
  providers: [DatePipe]
})
export class EmailModule {}
