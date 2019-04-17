import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EmployeeService } from '../employees/employees.service';
import { HrService } from '../../services/hr.service';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AlertService } from 'src/app/components/alert/alert.service';


interface EmployeesResponse {
  employees: any[]
}

@Component({
  selector: 'app-assign-department-lead',
  templateUrl: './assign-department-lead.component.html',
  styleUrls: ['./assign-department-lead.component.scss']
})
export class AssignDepartmentLeadComponent implements OnInit {

  constructor(private employeeService: EmployeeService, private hrService: HrService, public toastr: ToastrManager, private alertService: AlertService) { }

  employeeList: any[];
  newDeptTitle: string;
  employeeHasError = true;
  submitting = false;
  newHead: any;
  leadInfo: any;

  @Input() department;
  @Output() assignLeadSuccessfulEvent = new EventEmitter();

  ngOnInit() {
    this.fetchDeptsData();
    this.fetchEmployeesData();

  }

  fetchDeptsData() {
    this.hrService.fetchDepartments().subscribe((department) => {
      if (department) {
        this.newDeptTitle = this.department.departmentSecret.name;
      }
    })
  }

  fetchEmployeesData() {
    this.employeeService.fetchEmployees().subscribe((employeesRes: EmployeesResponse) => {
      if (employeesRes) {
        this.employeeList = employeesRes.employees
      }
    })
  }

  validateEmployee(value) {
    if (value === 'default') {
      this.employeeHasError = true;
      this.isBtnDisabled();
    }
    else {
      this.employeeHasError = false;
      this.submitting = false;
    }

  }

  isBtnDisabled() {
    return this.employeeHasError || this.submitting;
  }

  submitForm(evt: Event) {
    evt.preventDefault();
    this.submitting = true;
    this.hrService.assignDepartmentLead(this.department.id, this.newHead, this.newDeptTitle).subscribe(
      successRes => {
        this.fetchDeptsData();
        this.toastr.successToastr('Deparment Lead Assigned', null, { maxShown: 1 });
        this.assignLeadSuccessfulEvent.emit(successRes['department']);
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
