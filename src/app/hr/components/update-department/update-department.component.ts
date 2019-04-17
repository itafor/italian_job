import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HrService } from '../../services/hr.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AlertService } from 'src/app/components/alert/alert.service';




@Component({
  selector: 'app-update-department',
  templateUrl: './update-department.component.html',
  styleUrls: ['./update-department.component.scss']
})
export class UpdateDepartmentComponent implements OnInit {
  disableBtn;
  submitting = false;
  newDeptTitle: string;

  @Input() department;
  @Output() departmentUpdatedSuccessfulEvent = new EventEmitter();

  constructor(private hrService: HrService, public toastr: ToastrManager, private alertService: AlertService) { }

  ngOnInit() {
    this.newDeptTitle = this.department.departmentSecret.name;
  }

  fetchdata() {
    this.hrService.fetchDepartments().subscribe((department) => {
      if (department) {
        this.newDeptTitle = this.department.departmentSecret.name;
      }
    })
  }

  isBtnDisabled() {
    this.disableBtn = true;
    return !this.newDeptTitle || this.submitting;
  }

  submitForm(evt: Event) {
    evt.preventDefault();
    this.submitting = true;
    this.hrService.updateDepartment(this.department.id, this.newDeptTitle).subscribe(
      successRes => {
        this.fetchdata();
        this.toastr.successToastr('Department Updated', null, { maxShown: 1 });
        this.departmentUpdatedSuccessfulEvent.emit(successRes['department']);
        this.newDeptTitle = null;

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
