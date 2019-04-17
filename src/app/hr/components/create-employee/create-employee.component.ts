
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { EmployeeService } from '../employees/employees.service';
import { first } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/account/account.authentication';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AlertService } from 'src/app/components/alert/alert.service';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.scss']
})
export class CreateEmployeeComponent implements OnInit {
  public form: FormGroup;
  loading = false;
  createButton = true;
  @Output() employeeCreatedSuccessfulEvent = new EventEmitter();

  constructor(private fb: FormBuilder, private router: Router, private employeeService: EmployeeService, private authSrv: AuthenticationService, public toastr: ToastrManager,
    private alertService: AlertService) { }

  ngOnInit() {
    this.form = this.fb.group({
      firstname: [null, Validators.compose([Validators.required, Validators.maxLength(50), Validators.minLength(3)])],
      middlename: [],
      lastname: [null, Validators.compose([Validators.required, Validators.maxLength(50), Validators.minLength(3)])],
      personalEmail: [null, Validators.compose([Validators.required, Validators.email])],
      companyEmail: [null, Validators.compose([Validators.email])],
      phone1: [null, Validators.compose([Validators.pattern("^[0-9]*$"), Validators.required, Validators.maxLength(11), Validators.minLength(11)])],
      phone2: [null, Validators.compose([Validators.pattern("^[0-9]*$"),Validators.maxLength(11), Validators.minLength(11)])],
      houseAddress: [null, Validators.compose([Validators.required])]
    });
  }


  get f() {
    return this.form.controls;
  }

  isBtnDisabled() {
    return this.form.invalid || this.loading;
  }

  onSubmit(evt: Event) {

    evt.preventDefault();
    this.loading = true;

    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    const firstname = this.f.firstname.value;
    const middlename = this.f.middlename.value;
    const lastname = this.f.lastname.value;
    const companyEmail = this.f.companyEmail.value;
    const personalEmail = this.f.personalEmail.value;
    const houseAddress = this.f.houseAddress.value;
    const phone1 = this.f.phone1.value;
    const phone2 = this.f.phone2.value;

    this.employeeService.create(firstname, middlename, lastname, companyEmail, personalEmail, houseAddress, phone1, phone2)
      .pipe(first())
      .subscribe(
        successRes => {
          this.toastr.successToastr('Employee Created Successfully', null);
          this.employeeCreatedSuccessfulEvent.emit(successRes['employee']);
          this.form.reset();
        },
        error => {
          this.loading = false;
          this.alertService.error(error, true);
        },
        () => {
          this.loading = false;
        }

      );
  }
}
