import { Component, OnInit, Output, EventEmitter  } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FlxUiDataTable } from 'flx-ui-datatable' ;
import { Router } from '@angular/router';
import { AlertService } from 'src/app/components/alert/alert.service';
import { AccountingService } from '../../service/accounting.service';
import { ToastrManager } from 'ng6-toastr-notifications';


@Component({
  selector: 'app-create-inventory',
  templateUrl: './create-inventory.component.html',
  styleUrls: ['./create-inventory.component.scss']
})
export class CreateInventoryComponent implements OnInit {

  public form: FormGroup;
  public inventoryCategory;
  loading = false;
  disableBtn;
  category;
  quantity;
  unit_cost;
  errmessage = false;
  itemerrmessage = false;
  qtymessage = false;
  unitmessage = false;
  count = 0;
  offset = 0;
  limit = 3;

  @Output() inventoryCreatedSuccessfulEvent = new EventEmitter();


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: AccountingService,
    private alertService: AlertService,
    private toaster: ToastrManager, public dataService: FlxUiDataTable
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      item_description: [null, Validators.compose([Validators.required, Validators.minLength(3)])],
      category: [null, Validators.required],
      quantity: [null, Validators.required],
      unit_cost: [null, Validators.compose([Validators.required, Validators.minLength(3)])],
    });

    this.categories();

  }

  get f() { return this.form.controls; }


  onSubmit() {
    this.disableBtn = true;
    // stop here if form is invalid
    if (this.form.invalid) {
        return;
    }

    this.loading = true;

    const item_description = this.f.item_description.value;
    const category = this.f.category.value;
    const quantity = this.f.quantity.value.toString();
    const unit_cost = this.f.unit_cost.value.toString();

    this.service.addInventory(item_description, category, quantity, unit_cost)
        .subscribe(
          data => {
            this.toaster.successToastr('Inventory successfully', null, { toastTimeout: 3000 });
            this.loading = false;
            this.inventoryCreatedSuccessfulEvent.emit(data);
            this.disableBtn = false;
            console.log(data)
          },
          error => {
            this.toaster.errorToastr('Inventory creation failed', null, { toastTimeout: 3000 });
            this.loading = false;
            this.alertService.error(error, true);
            this.disableBtn = false;

          });
  }

  categories() {
    this.service.getInventoryCategory(this.offset, this.limit).subscribe((data: any) => {
      if (data) {
        this.inventoryCategory = data.data;
      }
    });
  }

  int(quantity) {
    if (quantity && quantity.length) {
      this.errmessage = true;
    }
    else {
      this.errmessage = false;
    }
  }
  initCategory(event) {
    const category = this.f.category.value;
    if(category.length<3){
      this.errmessage = true;
      this.disableBtn = true;
    }else {
      this.errmessage = false;
      this.disableBtn = false;
    }
  }
  initDescription(event) {
    const item_description = this.f.item_description.value;
    if(item_description.length<3){
      this.itemerrmessage = true;
      this.disableBtn = true;
    }else {
      this.itemerrmessage = false;
      this.disableBtn = false;
    }
  }
  initQuantity(event) {
    const quantity = this.f.quantity.value.toString();
    if(quantity.length<3){
      this.qtymessage = true;
      this.disableBtn = true;
    }else {
      this.qtymessage = false;
      this.disableBtn = false;
    }
  }
  initUnitCost(event) {
    const unit_cost = this.f.unit_cost.value.toString();
    if(unit_cost.length<3){
      this.unitmessage = true;
      this.disableBtn = true;
    }else {
      this.unitmessage = false;
      this.disableBtn = false;
    }
  }

}
