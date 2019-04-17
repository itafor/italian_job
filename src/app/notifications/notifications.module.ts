import { NotificationsComponent } from './notifications.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';
import { CustomFormsModule } from 'ng2-validation';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';


import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NotificationsRoutes } from './notifications.routing';
import { AlertModule } from '../components/alert/alert.module';
import { ListTemplateComponent } from './template/list-template/list-template.component';
import { CreateTemplateComponent } from './template/create-template/create-template.component';
import { UpdateTemplateComponent } from './template/update-template/update-template.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(NotificationsRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgbProgressbarModule,
    CustomFormsModule,
    TextMaskModule,
    FileUploadModule,
    AlertModule,
    NgxDatatableModule
  ],
  declarations: [
    ListTemplateComponent,
    CreateTemplateComponent,
    UpdateTemplateComponent,
    NotificationsComponent,
  ]
})
export class NotificationsModule { }
