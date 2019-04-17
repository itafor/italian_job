import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { first } from 'rxjs/operators';
import { HrService } from '../../services/hr.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AlertService } from 'src/app/components/alert/alert.service';

@Component({
  selector: 'app-create-department',
  templateUrl: './create-department.component.html',
  styleUrls: ['./create-department.component.scss']
})
export class CreateDepartmentComponent {
  departmentList: any[] = [];
  closeResult: string;
  disableBtn;
  submitting = false;
  deparmenttitle;

  @Output() departmentCreatedSuccessfulEvent = new EventEmitter();

  constructor(private hrService: HrService, public toastr: ToastrManager, private alertService: AlertService) { }


  isBtnDisabled() {
    this.disableBtn = true;
    return !this.deparmenttitle || this.submitting;
  }


  submitForm(evt: Event) {
    evt.preventDefault();
    this.submitting = true;
    this.hrService.createDepartment(this.deparmenttitle).subscribe(
      successRes => {
        this.toastr.successToastr('Department Created Successfully', null, { maxShown: 1 });
        this.departmentCreatedSuccessfulEvent.emit(successRes['department']);
        this.deparmenttitle = null;
        this.hrService.fetchDepartments();
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
