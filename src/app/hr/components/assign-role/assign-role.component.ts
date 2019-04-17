import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EmployeeService } from '../employees/employees.service';
import { HrService } from '../../services/hr.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AlertService } from 'src/app/components/alert/alert.service';


interface RolesResponse {
  roles: any[]
}

interface EmployeeResponse {
  employee: any[];
}



@Component({
  selector: 'app-assign-role',
  templateUrl: './assign-role.component.html',
  styleUrls: ['./assign-role.component.scss']
})
export class AssignRoleComponent implements OnInit {

  constructor(private employeeService: EmployeeService, private hrService: HrService, public toastr: ToastrManager, private alertService: AlertService) { }

  roleList: any[];

  employeeInfo;
  roleHasError = true;
  submitting = false;
  newRole: any;
  checkmark = false;
  closeDept = true;


  @Input() employeeData;
  @Output() assignRoleSuccessfulEvent = new EventEmitter();

  ngOnInit() {
    this.fetchRolesData();
    this.fetchEmployeeData();

  }

  fetchEmployeeData() {
    this.employeeService.fetchEmployee(this.employeeData.id).subscribe((data: EmployeeResponse) => {
      if (data) {
        this.employeeInfo = data.employee;
      }
      this.employeeInfo;
    })
  }
  
  fetchRolesData() {
    this.hrService.fetchRoles().subscribe((rolesRes: RolesResponse) => {
      if (rolesRes) {
        this.roleList = rolesRes.roles;
      }
    })
  }

  validateRole(value) {
    if (value === 'default') {
      this.roleHasError = true;
      this.isBtnDisabled();
      this.checkmark = false;
    }
    else {
      this.roleHasError = false;
      this.submitting = false;
      this.checkmark = true;
    }

  }

  isBtnDisabled() {
    return this.roleHasError || this.submitting;
  }

  submitForm(evt: Event) {
    evt.preventDefault();
    this.submitting = true;
    this.employeeService.assignRole(this.employeeData.id, this.newRole).subscribe(
      successRes => {
        this.fetchEmployeeData();
        this.toastr.successToastr('Role Assigned', null, { maxShown: 1 });
        this.assignRoleSuccessfulEvent.emit(successRes['employeeData']);
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
