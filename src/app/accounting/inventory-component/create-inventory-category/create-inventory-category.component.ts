import { Component, OnInit, Output, EventEmitter  } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FlxUiDataTable } from 'flx-ui-datatable' ;
import { Router } from '@angular/router';
import { AlertService } from 'src/app/components/alert/alert.service';
import { AccountingService } from '../../service/accounting.service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-create-inventory-category',
  templateUrl: './create-inventory-category.component.html',
  styleUrls: ['./create-inventory-category.component.scss']
})
export class CreateInventoryCategoryComponent implements OnInit {

  public form: FormGroup;
  public inventoryCategory;
  loading = false;
  disableBtn;
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
      name: [null, Validators.compose([Validators.required, Validators.minLength(3)])],
      description: [null,],
      category: [null,],
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

    const name = this.f.name.value;
    const description = this.f.description.value;

    this.service.addInventoryCategory(name, description)
        .subscribe(
          data => {
            this.toaster.successToastr('Inventory Category created successfully', null, { toastTimeout: 3000 });
            this.loading = false;
            this.inventoryCreatedSuccessfulEvent.emit(data);
            this.disableBtn = false;
          },
          error => {
            this.toaster.errorToastr('Inventory Category creation failed', null, { toastTimeout: 3000 });
            this.loading = false;
            this.alertService.error(error, true);
            this.disableBtn = false;

          });
  }


  initname(event) {
    const name = this.f.name.value;
    if(name.length<3){
      this.qtymessage = true;
      this.disableBtn = true;
    }else {
      this.qtymessage = false;
      this.disableBtn = false;
    }
  }
  // initDescription(event) {
  //   const description = this.f.description.value;
  //   if(description.length<3){
  //     this.itemerrmessage = true;
  //     this.disableBtn = true;
  //   }else {
  //     this.itemerrmessage = false;
  //     this.disableBtn = false;
  //   }
  // }
  categories() {
    this.service.getInventoryCategory(this.offset, this.limit).subscribe((data: any) => {
      if (data) {
        this.inventoryCategory = data.data;
      }
    });
  }

}
