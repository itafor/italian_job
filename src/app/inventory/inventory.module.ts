import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';
import { CustomFormsModule } from 'ng2-validation';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { AlertModule } from '../components/alert/alert.module';
import { HttpClientModule } from '@angular/common/http';
import { InventoryService } from './services/inventory.service';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ng6-toastr-notifications';
import { CreateInventoryCategoryComponent } from './components/create-inventory-category/create-inventory-category.component';
import { ListInventoryCategoryComponent } from './components/list-inventory-category/list-inventory-category.component';
import { InventoryRoutes } from './inventory.routing';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(InventoryRoutes),
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
    CreateInventoryCategoryComponent,
    ListInventoryCategoryComponent
  ],
  providers: [HttpClientModule, InventoryService]
})
export class InventoryModule {}
