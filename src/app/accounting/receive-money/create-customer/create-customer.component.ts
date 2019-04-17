import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FlxUiDataTable } from 'flx-ui-datatable';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/components/alert/alert.service';
import { AccountingService } from '../../service/accounting.service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.scss']
})
export class CreateCustomerComponent implements OnInit {
  public form: FormGroup;
  loading = false;
  submitted = false;

  @Output() customerCreatedSuccessfulEvent = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: AccountingService,
    private alertService: AlertService,
    private toaster: ToastrManager,
    public dataService: FlxUiDataTable
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100)
        ])
      ],
      phoneNumber: [
        null,
        Validators.compose([
          Validators.pattern('^[0-9]*$'),
          Validators.maxLength(11),
          Validators.minLength(11)
        ])
      ],
      email: [null, Validators.compose([Validators.email])],
      address: [null]
    });
  }
  get f() {
    return this.form.controls;
  }

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

    this.service.createCustomer(name, phoneNumber, email, address).subscribe(
      data => {
        this.toaster.successToastr('Customer Created Successfully', null, {
          toastTimeout: 6000
        });
        this.loading = false;
        this.customerCreatedSuccessfulEvent.emit(data);
      },
      error => {
        this.toaster.errorToastr('Customer creation failed', null, {
          toastTimeout: 6000
        });
        this.loading = false;
        this.alertService.error(error, true);
      }
    );
  }
}
