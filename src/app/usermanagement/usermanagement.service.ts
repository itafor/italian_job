import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {

  baseUrl = environment.userManagementUrl;
  user;

  constructor(private http: HttpClient) {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
  }

  get token() {
    return;
  }

  fetchUsers() {
    const url = this.baseUrl + '/users/all';
    return this.http.get<any>(url)
        .pipe(map(response => {
            return response;
        }));
  }

  fetchSingleUser(users) {
    let userData = users; let userInfo
    if(userData.length) {
      userData.map(user => {
        if (this.user.username === user.email) {
          userInfo = user;
        }
      })
    }
    return userInfo;

   
  }
  createUser(firstname: string, lastname: string, email: string, password: string) {
    const url = this.baseUrl + '/users/add';
    return this.http.post<any>(url, { firstname, lastname, email, password })
        .pipe(map(response => {
            return response;
        }));
  }

  updatePassword(oldPassword: string, newPassword: string, confirmPassword: string) {
    const data = { oldPassword, newPassword, confirmPassword };
    const url = this.baseUrl + '/users/password';
    return this.http.put<any>(url, data)
        .pipe(map(response => {
            return response;
        }));
  }

 
}
