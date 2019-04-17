import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FlxUiDataTable } from 'flx-ui-datatable' ;
import { Router } from '@angular/router';
import { AlertService } from 'src/app/components/alert/alert.service';
import { AccountingService } from '../../service/accounting.service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-create-vendor',
  templateUrl: './create-vendor.component.html',
  styleUrls: ['./create-vendor.component.scss']
})

export class CreateVendorComponent implements OnInit {

  public form: FormGroup;
  loading = false;
  submitted = false;

  @Output() vendorCreatedSuccessfulEvent = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: AccountingService,
    private alertService: AlertService,
    private toaster: ToastrManager, public dataService: FlxUiDataTable
    ) {}

    ngOnInit() {
      this.form = this.fb.group({
      name: [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100),])],
      phoneNumber: [null, Validators.compose([Validators.pattern("^[0-9]*$"), Validators.maxLength(11), Validators.minLength(11)])],
      email: [null, Validators.compose([Validators.email])],
      address: [null],
      });
    }
    get f() { return this.form.controls; }

    onSubmit() {
      this.submitted = true;

      // stop here if form is invalid
      if (this.form.invalid) {
          return;
      }

      this.loading = true;

      const name = this.f.name.value;
      const address = this.f.address.value;
      const email = this.f.email.value;
      const phoneNumber = this.f.phoneNumber.value;

      this.service.createVendor(name, phoneNumber, email, address)
          .subscribe(
            data => {
              this.toaster.successToastr('Vendor created successfully', null,{toastTimeout: 3000});
              this.loading = false;
              this.vendorCreatedSuccessfulEvent.emit(data);
            },
            error => {
              this.toaster.errorToastr('Vendor creation failed', null, {toastTimeout: 3000});
              this.loading = false;
              this.alertService.error(error, true);
            });
    }

}
