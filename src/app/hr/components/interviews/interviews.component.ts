import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { InterviewService } from './interviews.service';
import { first } from 'rxjs/operators';
import { AlertService } from 'src/app/components/alert/alert.service';


@Component({
  selector: 'app-interviews',
  templateUrl: './interviews.component.html',
  styleUrls: ['./interviews.component.scss']
})
export class InterviewsComponent implements OnInit {
  public form: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private interviewservice: InterviewService,
    private alertService: AlertService
    ) {}

  ngOnInit() {
    this.form = this.fb.group({
      firstname: [null, Validators.compose([Validators.required])],
      lastname: [null, Validators.compose([Validators.required])],
      email: [null, Validators.compose([Validators.required, Validators.email])],
      phone: [null, Validators.compose([Validators.required])],
      title: [null, Validators.compose([Validators.required])],
      details: [null, Validators.compose([Validators.required])]
    });
  }

  get f() { return this.form.controls; }


  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.form.invalid) {
        return;
    }

    this.loading = true;

    const firstname = this.f.firstname.value;
    const lastname = this.f.lastname.value;
    const email = this.f.email.value;
    const title = this.f.title.value;
    const details = this.f.details.value;
    const phone = this.f.phone.value;

    this.interviewservice.create(firstname, lastname, email, phone, title, details)
        .subscribe(
          data => {
            this.alertService.success('Successful', true);
            this.loading = false;
          },
          error => {
            this.alertService.error(error, true);
            this.loading = false;
          });
  }
}
