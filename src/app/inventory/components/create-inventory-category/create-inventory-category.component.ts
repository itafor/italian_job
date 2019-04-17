import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AlertService } from 'src/app/components/alert/alert.service';

@Component({
  selector: 'app-create-inventory-category',
  templateUrl: './create-inventory-category.component.html',
  styleUrls: ['./create-inventory-category.component.scss']
})
export class CreateInventoryCategoryComponent {
  closeResult: string;
  disableBtn;
  submitting = false;
  categoryName;

  @Output() inventoryCreatedSuccessfulEvent = new EventEmitter();

  constructor(private inventoryService: InventoryService, public toastr: ToastrManager, private alertService: AlertService) { }


  isBtnDisabled() {
    this.disableBtn = true;
    return !this.categoryName || this.submitting;
  }


  submitForm(evt: Event) {
    evt.preventDefault();
    this.submitting = true;
    this.inventoryService.createInventoryCategory(this.categoryName).subscribe(
      successRes => {
        this.toastr.successToastr('Inventory Category Created Successfully', null);
        this.inventoryCreatedSuccessfulEvent.emit(successRes['']);
        this.categoryName = null;
      },
      errorRes => {
        this.alertService.error(errorRes, true);
        this.submitting = false;
      },
      () => {
        this.submitting = false;
      }
    );
    return false;
  }

}
