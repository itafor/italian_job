import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FlxUiDataTable } from 'flx-ui-datatable' ;
import { Router } from '@angular/router';
import { AlertService } from 'src/app/components/alert/alert.service';
import { AccountingService } from '../../service/accounting.service';
import { ToastrManager } from 'ng6-toastr-notifications';


@Component({
  selector: 'app-create-income',
  templateUrl: './create-income.component.html',
  styleUrls: ['./create-income.component.scss']
})
export class CreateIncomeComponent implements OnInit {
  public form: FormGroup;
  loading = false;
  submitted = false;
  incomeCategoryList = [];
  count = 0;
  offset = 0;
  limit = 3;
  disableBtn;
  
  @Output() incomeCategoryCreatedSuccessfulEvent = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: AccountingService,
    private alertService: AlertService,
    private toaster: ToastrManager, public dataService: FlxUiDataTable
    ) {}

    ngOnInit() {
      this.getIncomeCategory(this.offset, this.limit);


      this.form = this.fb.group({
        name: [null,Validators.compose([Validators.required])],
        categoryType: [null],
        parentCategory: [null, ],
      });
      
    }


    
    get f() { return this.form.controls; }

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
      // this.f.parentCategory && this.f.parentCategory.value? this.f.parentCategory.value : '';
      

      this.service.createIncomeCategory(name, categoryType , parentCategory)
          .subscribe(
            data => {
          this.toaster.successToastr('Income Category created successfully', null, {toastTimeout: 3000} );
              this.loading = false;
              this.disableBtn = false;
              this.incomeCategoryCreatedSuccessfulEvent.emit(data);
            },
            error => {
          this.toaster.errorToastr('Income Category creation failed', null, {toastTimeout: 3000});
              this.loading = false;
              this.disableBtn = false;
             this.alertService.error(error, true);
         });
    }

    getIncomeCategory(offset, limit) {
      this.service.getIncomeCategory(offset, limit).subscribe((data: any) => {
        if (data) {
          this.incomeCategoryList = data.data;
        }
      });
    }


}
