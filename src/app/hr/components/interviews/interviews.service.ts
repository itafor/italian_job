import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


@Injectable({ providedIn: 'root' })
export class InterviewService {
    constructor(private http: HttpClient) {
    }


    create(firstname: string, lastname: string, email: string, phone: string, title: string, details: string) {
        const url = `${environment.authurl}/admin/interview`;
        return this.http.post<any>(url, { firstname, lastname, email, phone, title, details })
            .pipe();
    }

}
