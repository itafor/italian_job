import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EmployeeService } from '../employees/employees.service';
import { HrService } from '../../services/hr.service';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AlertService } from 'src/app/components/alert/alert.service';


interface DepartmentsResponse {
  departments: any[]
}


interface EmployeeResponse {
  employee: any[];
}

@Component({
  selector: 'app-assign-department',
  templateUrl: './assign-department.component.html',
  styleUrls: ['./assign-department.component.scss']
})
export class AssignDepartmentComponent implements OnInit {

  constructor(private employeeService: EmployeeService, private hrService: HrService, public toastr: ToastrManager,
    private alertService: AlertService) { }
  departmentList: any[];

  departmentHasError = true;
  submitting = false;
  newDepartment: any;
  closeDept = true;
  employeeInfo;


  @Input() employeeData;
  @Output() assignDepartmentSuccessfulEvent = new EventEmitter();

  ngOnInit() {
    this.fetchDepartmentsData();
    this.fetchEmployeeData();

  };


  fetchEmployeeData() {
    this.employeeService.fetchEmployee(this.employeeData.id).subscribe((data: EmployeeResponse) => {
      if (data) {
        this.employeeInfo = data.employee;
      }
      this.employeeInfo;
    })
  }


  fetchDepartmentsData() {
    this.hrService.fetchDepartments().subscribe((departmentRes: DepartmentsResponse) => {
      if (departmentRes) {
        this.departmentList = departmentRes.departments

      }
    })
  }


  validateDepartment(value) {
    if (value === 'default') {
      this.departmentHasError = true;
      this.isBtnDisabled();
    }
    else {
      this.departmentHasError = false;
      this.submitting = false;
    }

  }

  isBtnDisabled() {
    return this.departmentHasError || this.submitting;
  }

  submitForm(evt: Event) {
    evt.preventDefault();
    this.submitting = true;
    this.employeeService.assignDepartment(this.employeeData.id, this.newDepartment).subscribe(
      successRes => {
        this.fetchEmployeeData();
        this.toastr.successToastr('Department Assigned', null, { maxShown: 1 });
        this.assignDepartmentSuccessfulEvent.emit(successRes['employeeData']);
      },
      errorRes => {
        this.alertService.error(errorRes, true);
        this.submitting = false;
      },
      () => {
        this.submitting = false;
      }
    );
    return false;
  }


}
