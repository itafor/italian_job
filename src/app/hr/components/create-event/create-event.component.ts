import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { HrService } from '../../services/hr.service';
import { first } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/account/account.authentication';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AlertService } from 'src/app/components/alert/alert.service';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss']
})
export class CreateEventComponent implements OnInit {
  public form: FormGroup;
  loading = false;
  createButton = true;
  @Output() eventCreatedSuccessfulEvent = new EventEmitter();

  constructor(private fb: FormBuilder, private hrService: HrService, public toastr: ToastrManager,
    private alertService: AlertService) { }

  ngOnInit() {
    this.form = this.fb.group({
      name: [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
      description: [null, Validators.compose([Validators.required])],
      startTime: [null, Validators.compose([Validators.required])],
      stopTime: [null, Validators.compose([Validators.required])],
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

    const name = this.f.name.value;
    const description = this.f.description.value;
    const stopTime = new Date(this.f.stopTime.value);
    const startTime = new Date(this.f.startTime.value);

    this.hrService.createEvent(description, name, startTime, stopTime)
      .pipe(first())
      .subscribe(
        successRes => {
          this.toastr.successToastr('Event Created Successfully', null, { maxShown: 1 });
          this.eventCreatedSuccessfulEvent.emit(successRes['event']);
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
