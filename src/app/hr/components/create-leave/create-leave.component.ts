import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { HrService } from '../../services/hr.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AlertService } from 'src/app/components/alert/alert.service';

@Component({
  selector: 'app-create-leave',
  templateUrl: './create-leave.component.html',
  styleUrls: ['./create-leave.component.scss']
})
export class CreateLeaveComponent implements OnInit {
  public form: FormGroup;
  loading = false;


  @Output() leaveCreatedSuccessfulEvent = new EventEmitter();
  constructor(private fb: FormBuilder, private hrService: HrService, public toastr: ToastrManager,
    private alertService: AlertService) { }

  ngOnInit() {
    this.form = this.fb.group({
      leavename: [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
      leavedays: [null, Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")])]
    });
  }

  get f() {
    return this.form.controls;
  }

  isBtnDisabled() {
    return this.form.invalid || this.loading;
  }

  submitForm(evt: Event) {

    evt.preventDefault();
    this.loading = true;

    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    const name = this.f.leavename.value;
    const days = this.f.leavedays.value;
    this.hrService.createLeave(name, days)
      .pipe()
      .subscribe(
        successRes => {
          this.toastr.successToastr('Leave Type Created Successfully', null, { maxShown: 1 });
          this.leaveCreatedSuccessfulEvent.emit(successRes['leave']);
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
