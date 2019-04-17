import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EditorModule } from '@tinymce/tinymce-angular';
import { DragulaModule } from 'ng2-dragula';
import { ToastrModule } from 'ng6-toastr-notifications';
import { MatCardModule} from '@angular/material/card';
import { AlertModule } from '../components/alert/alert.module';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TaskManagerRoutes } from './taskmanager.routing';
import { TaskManagerProjectComponent } from './project/taskmanager-project.component';
import { TaskManagerTaskComponent } from './task/taskmanager.component';
import { TaskManagerRoleComponent } from './role/taskmanager-role.component';
import { TaskPageComponent } from './task-page/task-page.component';
import { EditorWithButtonsComponent } from './editor-buttons.component';
import { TaskManagerService } from './taskmanager.service';
import { TaskManagerDataService } from './data.service';
import { ScrollHelperService } from './scroll-helper.service';
import { QuillModule } from 'ngx-quill';
import { ProjectSettingsComponent } from './project/project-settings/project-settings.component';
import { GoalsComponent } from './project/project-settings/goals/goals.component';
import { FieldsComponent } from './project/project-settings/fields/fields.component';
import { MembersComponent } from './project/project-settings/members/members.component';
import { GeneralComponent } from './project/project-settings/general/general.component';
import { QuabblyCommentComponent } from './comment.component';
import {
  MatButtonModule, MatNativeDateModule, MatIconModule, MatSidenavModule, MatListModule, MatToolbarModule
} from '@angular/material';
import { TimeAgoModule } from '../core/timeago.module';

import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CreateGoalsComponent } from './project/project-settings/goals/create-goals/create-goals.component';
import { CreateFieldsComponent } from './project/project-settings/fields/create-fields/create-fields.component';
import { AddMembersComponent } from './project/project-settings/members/add-members/add-members.component';
import { modals } from './modals';
import { Formatter as QuabblyFormatter } from '../core/helpers/formatter';
import { ViewGoalsComponent } from './project/project-settings/goals/view-goals/view-goals.component';
import { AccessDeniedComponent } from './403.component';

@Pipe({
  name: 'sanitizeTaskHtml',
  pure: false
})
export class SanitizeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }
  transform(value: any): any {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}

@Pipe({
  name: 'sanitizeTaskStyle',
  pure: false
})
export class SanitizeStylePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }
  transform(value: any): any {
    return this.sanitizer.bypassSecurityTrustStyle(value);
  }
}


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    NgbModule,
    RouterModule.forChild(TaskManagerRoutes),
    DragulaModule.forRoot(),
    ToastrModule.forRoot(),
    EditorModule,
    NgxDatatableModule,
    QuillModule, MatButtonModule,
    TimeAgoModule,
    MatToolbarModule,
    MatNativeDateModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    AlertModule,
  ],
  declarations: [
    TaskManagerProjectComponent,
    TaskManagerTaskComponent,
    TaskManagerRoleComponent,
    TaskPageComponent,
    EditorWithButtonsComponent,
    SanitizeHtmlPipe,
    SanitizeStylePipe,
    ProjectSettingsComponent,
    GoalsComponent,
    FieldsComponent,
    MembersComponent,
    GeneralComponent,
    CreateGoalsComponent,
    CreateFieldsComponent,
    ...modals,
    AddMembersComponent,
    QuabblyCommentComponent,
    ViewGoalsComponent,
    AccessDeniedComponent,
   ],
  providers: [TaskManagerService, TaskManagerDataService, QuabblyFormatter, ScrollHelperService],
  entryComponents: [ ...modals],
  exports: [MatButtonModule,
    MatToolbarModule,
    MatNativeDateModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule]
})
export class TaskManagerModule {}
