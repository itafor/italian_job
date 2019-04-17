import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FlxUiDataTable } from 'flx-ui-datatable';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/components/alert/alert.service';
import { AccountingService } from '../../service/accounting.service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-create-bank',
  templateUrl: './create-bank.component.html',
  styleUrls: ['./create-bank.component.scss']
})
export class CreateBankComponent implements OnInit {
  public form: FormGroup;
  public CurrencyList;
  loading = false;
  submitted = false;
  currencies = [];

  @Output() bankCreatedSuccessfulEvent = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: AccountingService,
    private alertService: AlertService,
    private toaster: ToastrManager,
    public dataService: FlxUiDataTable
  ) {}

  ngOnInit() {
    this.fetchCurrency();
    this.form = this.fb.group({
      bankName: [null, Validators.compose([Validators.required])],
      accountName: [null, Validators.compose([Validators.required])],
      currency: [null, Validators.compose([Validators.required])],
      accountNumber: [
        null,
        Validators.compose([
          Validators.pattern('^[0-9]*$'),
          Validators.maxLength(10),
          Validators.minLength(10),
          Validators.required
        ])
      ],
      branch: [null]
    });
  }
  get f() {
    return this.form.controls;
  }

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

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    const bankName = this.f.bankName.value;
    const accountName = this.f.accountName.value;
    const accountNumber = this.f.accountNumber.value;
    const branch = this.f.branch.value;
    const currency = this.f.currency.value;

    this.service
      .addBank(bankName, accountName, accountNumber, branch, currency)
      .subscribe(
        data => {
          this.toaster.successToastr('Bank Created Successfully', null, {
            toastTimeout: 3000
          });
          this.loading = false;
          this.bankCreatedSuccessfulEvent.emit(data);
        },
        error => {
          this.toaster.errorToastr(error, null, {
            toastTimeout: 6000
          });
          this.loading = false;
          this.alertService.error(error, true);
        }
      );
  }

  ccurrencies() {
    this.service.getCurrency().subscribe((data: any) => {
      if (data) {
        this.CurrencyList = data.data;
      }
    });
  }



}
