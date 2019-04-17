import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FlxUiDataTable } from 'flx-ui-datatable';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/components/alert/alert.service';
import { AccountingService } from '../../service/accounting.service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-create-card',
  templateUrl: './create-card.component.html',
  styleUrls: ['./create-card.component.scss']
})
export class CreateCardComponent implements OnInit {
  public form: FormGroup;
  loading = false;
  submitted = false;
  currencies = [];
  @Output() cardCategoryCreatedSuccessfulEvent = new EventEmitter();

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
      // name: [null, Validators.compose([Validators.required])],
      //categoryType: [null],
      description: ['', Validators.maxLength(100)],
      openingBalance: [null, Validators.compose([Validators.required])],
      currency: [null]
    });
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

    const openingBalance = this.f.openingBalance.value;
    const description = this.f.description.value;
    const currency = this.f.currency.value;

    this.service.addCard(description, openingBalance, currency).subscribe(
      data => {
        this.toaster.successToastr('Credit Card created successfully', null, {
          toastTimeout: 4000
        });
        this.loading = false;
        this.cardCategoryCreatedSuccessfulEvent.emit(data);
      },
      error => {
        this.toaster.errorToastr('credit card creation failed', null, {
          toastTimeout: 3000
        });
        this.loading = false;
        this.alertService.error(error, true);
      }
    );
  }
}
