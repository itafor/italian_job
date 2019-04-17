import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { DetailsOfOrganizationInt } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    static peopleInMyOrg: any[] = [];
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;


    constructor(private http: HttpClient, private router: Router) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(username: string, password: string) {
        return this.http.post<any>(`${environment.authurl}/auth/login`, { username, password })
            .pipe(map(status => {
                if (status && status.token  && status.user) {
                    const user = new User();
                    user.firstName = status.user.firstname;
                    user.lastName = status.user.lastname;
                    user.token = status.token;
                    user.username = username;
                    user.id = status.user.id;
                    user.roles = status.user.roles || [];
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                }

                return null;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
        this.router.navigate(['/account/signin']);
    }

    redirectToAccessDeniedPageWithData() {
      this.router.navigate(['/taskmanager/403']);
    }

    register(email: string, password: string, firstname: string, lastname: string, companyName: string) {
        return this.http.post<any>(`${environment.authurl}/auth/register`, { email, password, firstname, lastname, companyName })
            .pipe();
    }

    detailsOfPeopleInMyOrg(): DetailsOfOrganizationInt[] {
      if (AuthenticationService.peopleInMyOrg.length) {
        const safeToSendDetails = AuthenticationService.peopleInMyOrg.map(peopleWithId => ({
          email: peopleWithId.email,
          firstname: peopleWithId.firstname,
          lastname: peopleWithId.lastname,
          id: peopleWithId.id,
          uuid: peopleWithId.uuid
        }));
        return safeToSendDetails;
      }
      return [];
    }

    populateEmailsOfPeopleInMyOrganization() {
      this.http.get<any>(`${environment.authurl}/users/all`).pipe()
            .subscribe(successRes => {
              AuthenticationService.peopleInMyOrg = successRes['data'];
            },
            errRes => {
              console.error(errRes);
            });
    }

    get isAdmin(): boolean {
      return (this.currentUserValue.roles || []).indexOf('ADMIN') > -1;
    }
}
