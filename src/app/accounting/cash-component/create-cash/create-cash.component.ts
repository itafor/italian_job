import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/components/alert/alert.service';
import { AccountingService } from '../../service/accounting.service';
import { ToastrManager } from 'ng6-toastr-notifications';


@Component({
  selector: 'app-create-cash',
  templateUrl: './create-cash.component.html',
  styleUrls: ['./create-cash.component.scss']
})
export class CreateCashComponent implements OnInit {

  public form: FormGroup;
  loading = false;
  submitted = false;
  incomeCategoryList = [];
  submitting;
  currencies = [];


  @Output() cashAccountCreatedSuccessfulEvent = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private service: AccountingService,
    private toaster: ToastrManager,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.fetchCurrency();
    this.form = this.fb.group({
      name: [null,Validators.compose([Validators.required])],
      currency: [null,Validators.compose([Validators.required])]
    });
  }
  get f() { return this.form.controls; }

  fetchCurrency(){
    this.service.getCurrency().subscribe((data: any) => {
      if (data) {
        let gotcurrency = data.data[0];
        Object.keys(gotcurrency).map(field => {
          this.currencies.push(gotcurrency[field]);
        });
      }
    });
  }

  onSubmit() {
    this.submitted = true;
    this.submitting = true;
    // stop here if form is invalid
    if (this.form.invalid) {
        return;
    }
    this.loading = true;
    const name = this.f.name.value;
    const currency = this.f.currency.value;
    this.service.createCashAccount(name, currency)
        .subscribe(
          data => {
        this.toaster.successToastr('Cash account created successfully', null, {toastTimeout: 3000} );
            this.loading = false;
            this.cashAccountCreatedSuccessfulEvent.emit(data);
            this.submitting = false;
          },
          error => {
        this.toaster.errorToastr('Cash creation failed', null, {toastTimeout: 3000});
            this.loading = false;
           this.alertService.error(error, true);
           this.submitting = false;
       });
  }


}
