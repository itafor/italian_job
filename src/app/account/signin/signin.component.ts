import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../account.authentication';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  public form: FormGroup;
  loading = false;
  submitted = false;
  homeUrl = '/home';
  dashboardUrl = '/dashboard';
  showAlert = false;

  constructor(private fb: FormBuilder, private router: Router, private authenticationService: AuthenticationService) {
    if (this.authenticationService.currentUserValue) {
      this.router.navigate([this.dashboardUrl]);
    }
  }

  ngOnInit() {
    this.form = this.fb.group({
      username: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required])]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {
    // stop here if form is invalid
    if (this.form.invalid) {
        return;
    }

    this.submitted = true;

    this.loading = true;
    this.authenticationService.login(this.f.username.value, this.f.password.value)
        .subscribe(
            data => {
              if (!this.authenticationService.detailsOfPeopleInMyOrg().length) {
                // only make call if no people in org, i.e. fresh sign in
                this.authenticationService.populateEmailsOfPeopleInMyOrganization();
              }
              this.router.navigate([this.dashboardUrl]);
            },
            error => {
                // this.alertService.error(error);
                this.loading = false;
                this.showAlert = true;
            });
  }
}
