import { Injectable } from '@angular/core';
import { Router, CanActivate, CanActivateChild } from '@angular/router';
import { AuthenticationService } from 'src/app/account/account.authentication';
import { AlertService } from 'src/app/components/alert/alert.service';


@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate, CanActivateChild {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService
    ) {}

    canActivate() {
        if (this.authenticationService.isAdmin) {
            // admin so return true
            return true;
        }
        this.alertService.error('Access denied', true);
        this.router.navigate(['/dashboard']);
        return false;
    }

    canActivateChild() {
      if (this.authenticationService.isAdmin) {
          // admin so return true
          return true;
      }
      this.alertService.error('Access denied', true);
      this.router.navigate(['/dashboard']);
      return false;
    }
}
