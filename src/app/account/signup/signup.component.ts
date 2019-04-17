import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { AuthenticationService } from '../account.authentication';
import { first } from 'rxjs/operators';
import { AlertService } from 'src/app/components/alert/alert.service';

const password = new FormControl('', Validators.required);
const confirmPassword = new FormControl('', CustomValidators.equalTo(password));

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  public form: FormGroup;
  loading = false;
  submitted = false;
  loginUrl = '/account/signin';
  showAlert = false;
  errors = '';

  constructor(
      private fb: FormBuilder,
      private router: Router,
      private authenticationService: AuthenticationService,
      private alertService: AlertService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      firstname: [null, Validators.compose([Validators.required])],
      lastname: [null, Validators.compose([Validators.required])],
      email: [null, Validators.compose([Validators.required, Validators.email])],
      companyName: [null, Validators.compose([Validators.required])],
      password: password,
      confirmPassword: confirmPassword
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

    const email = this.f.email.value;
    const pwd = this.f.password.value;

    this.authenticationService.register(email, pwd, this.f.firstname.value, this.f.lastname.value, this.f.companyName.value)
        .subscribe(
            data => {
                this.alertService.success('Registration successful', true);
                this.router.navigate([this.loginUrl]);
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
                this.showAlert = true;
                this.errors = error;
            });
  }
}
