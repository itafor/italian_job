import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomFormsModule } from 'ng2-validation';
import { FileMangerRoutes } from './file-manger.routing';
// custom modules
import { ToastrModule } from 'ng6-toastr-notifications';
import { NgbTooltipModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxLoadingModule } from 'ngx-loading';
// services
import { FileManagerService } from './services/file-manager.service';
// component
import { MyFileComponent } from './components/myfile/myfile.component';
import { SharedwithmeComponent } from './components/sharedwithme/sharedwithme.component';



@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(FileMangerRoutes),
    ToastrModule.forRoot(),
    NgxLoadingModule.forRoot({}),
    NgbTooltipModule,
    NgbModule.forRoot(),
    CustomFormsModule,

  ],
  declarations: [ MyFileComponent, SharedwithmeComponent ],
  providers: [ FileManagerService ],
})
export class FileManagerModule { }
