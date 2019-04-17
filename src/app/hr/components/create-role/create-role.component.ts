import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HrService } from '../../services/hr.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AlertService } from 'src/app/components/alert/alert.service';
interface RolesResponse {
  roles: any[]
}

@Component({
  selector: 'app-create-role',
  templateUrl: './create-role.component.html',
  styleUrls: ['./create-role.component.scss']
})

export class CreateRoleComponent {
  roleList: any[] = [];
  closeResult: string;
  disableBtn;
  submitting = false;
  roletitle;

  @Output() roleCreatedSuccessfulEvent = new EventEmitter();

  constructor(private hrService: HrService, public toastr: ToastrManager, private alertService: AlertService) { }

  isBtnDisabled() {
    this.disableBtn = false;
    return !this.roletitle || this.submitting;
  }


  submitForm(evt: Event) {
    evt.preventDefault();
    this.submitting = true;
    this.hrService.createRole(this.roletitle).subscribe(
      successRes => {
        this.getRoles();
        this.toastr.successToastr('Role Created Successfully', null, {toastTimeout:3000} );
        this.roleCreatedSuccessfulEvent.emit(successRes['role']);
        this.roletitle = null;
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
  getRoles() {
    this.hrService.fetchRoles().subscribe((data: RolesResponse) => {
      if (data) {
        this.roleList = data.roles;
      }
    })
  }

}
