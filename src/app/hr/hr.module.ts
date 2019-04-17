import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';
import { CustomFormsModule } from 'ng2-validation';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { HRRoutes } from './hr.routing';
import { EmployeesComponent } from './components/employees/employees.component';
import { InterviewsComponent } from './components/interviews/interviews.component';
import { AlertModule } from '../components/alert/alert.module';
import { CreateRoleComponent } from './components/create-role/create-role.component';
import { CreateDepartmentComponent } from './components/create-department/create-department.component';
import { ListRolesComponent } from './components/list-roles/list-roles.component';
import { ListDepartmentsComponent } from './components/list-departments/list-departments.component';
import { CreateEmployeeComponent } from './components/create-employee/create-employee.component';
import { HttpClientModule } from '@angular/common/http';
import { HrService } from './services/hr.service';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ViewEmployeeComponent } from './components/view-employee/view-employee.component';
import { UpdateDepartmentComponent } from './components/update-department/update-department.component';
import { ToastrModule } from 'ng6-toastr-notifications';
import { AssignDepartmentLeadComponent } from './components/assign-department-lead/assign-department-lead.component';
import { AssignDepartmentComponent } from './components/assign-department/assign-department.component';
import { AssignRoleComponent } from './components/assign-role/assign-role.component';
import { EditEmployeeComponent } from './components/edit-employee/edit-employee.component';
import { AttachmentComponent } from './components/attachment/attachment.component';
import { EventsComponent } from './components/events/events.component';
import { CreateEventComponent } from './components/create-event/create-event.component';
import { ListLeaveComponent } from './components/list-leave/list-leave.component';
import { CreateLeaveComponent } from './components/create-leave/create-leave.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(HRRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgbProgressbarModule,
    CustomFormsModule,
    TextMaskModule,
    FileUploadModule,
    AlertModule,
    ToastrModule.forRoot(),
    NgxDatatableModule,
    NgbModule
  ],
  entryComponents: [],
  declarations: [
    EmployeesComponent,
    InterviewsComponent,
    CreateRoleComponent,
    CreateDepartmentComponent,
    ListRolesComponent,
    ListDepartmentsComponent,
    CreateEmployeeComponent,
    ViewEmployeeComponent,
    UpdateDepartmentComponent,
    AssignDepartmentLeadComponent,
    AssignDepartmentComponent,
    AssignRoleComponent,
    EditEmployeeComponent,
    AttachmentComponent,
    EventsComponent,
    CreateEventComponent,
    ListLeaveComponent,
    CreateLeaveComponent
  ],
  providers: [HttpClientModule, HrService]
})
export class HRModule {}
