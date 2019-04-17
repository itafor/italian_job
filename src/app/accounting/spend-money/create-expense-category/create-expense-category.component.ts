import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FlxUiDataTable } from 'flx-ui-datatable';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/components/alert/alert.service';
import { AccountingService } from '../../service/accounting.service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-create-expense-category',
  templateUrl: './create-expense-category.component.html',
  styleUrls: ['./create-expense-category.component.scss']
})
export class CreateExpenseCategoryComponent implements OnInit {
  public form: FormGroup;
  loading = false;
  submitted = false;
  expenseCategoryList = [];
  disableBtn;

  @Output() expenseCategoryCreatedSuccessfulEvent = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: AccountingService,
    private alertService: AlertService,
    private toaster: ToastrManager,
    public dataService: FlxUiDataTable
  ) {}

  ngOnInit() {
    this.getExpenseCategory();

    this.form = this.fb.group({
      name: [null, Validators.compose([Validators.required])],
      categoryType: [null],
      parentCategory: [null]
    });
  }
  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.disableBtn = true;
    // stop here if form is invalid
    if (this.form.invalid) {
      this.disableBtn = false;
      return;
    }
    this.loading = true;
    const name = this.f.name.value;
    const categoryType = this.f.categoryType.value;
    const parentCategory = this.f.parentCategory.value;
      // this.f.parentCategory && this.f.parentCategory.value
      //   ? this.f.parentCategory.value
      //   : '';

    this.service
      .createExpenseCategory(name, parentCategory, categoryType)
      .subscribe(
        data => {
          this.toaster.successToastr(
            'Expense Category Created Successfully',
            null,
            { toastTimeout: 3000 }
          );
          this.loading = false;
          this.disableBtn = false;
          this.expenseCategoryCreatedSuccessfulEvent.emit(data);
        },
        error => {
          this.toaster.errorToastr(error, null, { toastTimeout: 3000 });
          this.loading = false;
          this.disableBtn = false;
          this.alertService.error(error, true);
        }
      );
  }

  getExpenseCategory() {
    this.service.getExpenseCategory().subscribe((data: any) => {
      if (data) {
        this.expenseCategoryList = data.data;
      }
    });
  }
}
