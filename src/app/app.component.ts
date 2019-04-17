import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from './account/account.authentication';
import { User } from './models/user';
import { DragulaService } from 'ng2-dragula';
import * as jwt_decode from 'jwt-decode';


@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent {
  currentUser: User;
  expireDate;
  isTest: boolean;
  constructor(translate: TranslateService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private activatedRoute: ActivatedRoute) {
    translate.addLangs(['en', 'fr']);
    translate.setDefaultLang('en');

    const browserLang: string = translate.getBrowserLang();
    translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');

    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);

    const currentmilliseconds = (new Date).getTime(); // get current time in milliseconds

    if (this.currentUser && this.currentUser.token) {
      const tokenInfo = this.getDecodedAccessToken(this.currentUser.token); // decode token
      this.expireDate = tokenInfo.exp; // get token expiration dateTime
    }

    if (window.location.search.startsWith('?test')) {
      return;
    }

    if (!this.currentUser || window.location.pathname === '/' || currentmilliseconds > (this.expireDate * 1000)) {
      this.authenticationService.logout();
      this.router.navigate(['/account/signin']);
    }
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/account/signin']);
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch (Error) {
      return null;
    }
  }
}
