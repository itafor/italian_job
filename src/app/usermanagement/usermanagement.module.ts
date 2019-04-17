import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EditorModule } from '@tinymce/tinymce-angular';
import { DragulaModule } from 'ng2-dragula';
import { ToastrModule } from 'ng6-toastr-notifications';
import { MatCardModule} from '@angular/material/card';
import { AlertModule } from '../components/alert/alert.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { UserManagementRoutes } from './usermanagement.routing';
import { UserManagementComponent } from './usermanagement.component';
import { UserManagementService } from './usermanagement.service';
import { CreateRequestleaveComponent } from './component/create-requestleave/create-requestleave.component';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    NgbModule,
    AlertModule,
    RouterModule.forChild(UserManagementRoutes),
    DragulaModule.forRoot(),
    ToastrModule.forRoot(),
    EditorModule,
    NgxDatatableModule,
  ],
  declarations: [UserManagementComponent, CreateRequestleaveComponent],
  providers: [UserManagementService],
  exports: [] 
})
export class UserManagementModule {}
