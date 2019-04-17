import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../account/account.authentication';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currentUser;
  constructor(private router: Router, private authsrv: AuthenticationService) { }

  ngOnInit() {
    this.currentUser = localStorage.getItem('currentUser');
  }
  logout() {
   this.authsrv.logout();
  }

}
