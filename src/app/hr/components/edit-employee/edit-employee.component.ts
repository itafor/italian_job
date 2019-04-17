import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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


interface EmployeeResponse {
  employee: any[];
}

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.scss']
})
export class EditEmployeeComponent implements OnInit {
  public form: FormGroup;
  employeeInfo: any[];
  loading = false;
  createButton = true;
  submitted = false;
  employeeForm = false;
  disableBtn;
  showAlert = false;
  public checkForUpdates = [
    'firstname',
    'middlename',
    'lastname',
    'personalEmail',
    'companyEmail',
    'phone1',
    'phone2',
    'houseAddress'
  ];



  @Input() employeeData;
  @Output() employeeUpdatedSuccessfulEvent = new EventEmitter();

  constructor(private fb: FormBuilder, private router: Router, private employeeService: EmployeeService, private authSrv: AuthenticationService, public toastr: ToastrManager,
    private alertService: AlertService, private _route: ActivatedRoute

  ) { }



  fetchEmployeeData() {
    this.employeeService.fetchEmployees().subscribe((data: EmployeeResponse) => {
      if (data) {
        this.employeeInfo = data.employee
      }
    })
  }

  ngOnInit() {
    this.fetchEmployeeData();
    this.form = this.fb.group({
      firstname: [this.employeeData.employeeSecret.firstname, Validators.compose([Validators.required, Validators.maxLength(50), Validators.minLength(3)])],
      middlename: [this.employeeData.employeeSecret.middlename],
      lastname: [this.employeeData.employeeSecret.lastname, Validators.compose([Validators.required, Validators.maxLength(50), Validators.minLength(3)])],
      personalEmail: [this.employeeData.employeeSecret.personalEmail, Validators.compose([Validators.required, Validators.email])],
      companyEmail: [this.employeeData.employeeSecret.companyEmail, Validators.compose([Validators.email])],
      phone1: [this.employeeData.employeeSecret.phone1, Validators.compose([Validators.pattern("^[0-9]*$"), Validators.required, Validators.maxLength(11), Validators.minLength(11)])],
      phone2: [this.employeeData.employeeSecret.phone2, Validators.compose([Validators.pattern("^[0-9]*$"), Validators.maxLength(11), Validators.minLength(11)])],
      houseAddress: [this.employeeData.employeeSecret.houseAddress, Validators.compose([Validators.required])]
    });

  }

  get f() {
    return this.form.controls;
  }

  isBtnDisabled() {

    return this.form.invalid || this.loading;
  }

  onUpdate(evt: Event) {
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

    const updatedFields: string[] = this.checkForUpdates.filter(field => {
      // check for updated fields
      if (this.f[field].value !== this.employeeData.employeeSecret[field] &&
        (this.employeeData.employeeSecret[field] || this.f[field].value.trim())) {
        return field
      }
    });
    this.employeeService.updateEmployee(this.employeeData.id, firstname, middlename, lastname, companyEmail, personalEmail, houseAddress, phone1, phone2, updatedFields)
      .pipe()
      .subscribe(
        successRes => {
          this.fetchEmployeeData();
          this.toastr.successToastr('Employee Updated Successfully', null, { maxShown: 1 });
          this.employeeUpdatedSuccessfulEvent.emit(successRes['employeeData']);
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
