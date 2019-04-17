import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


@Injectable({ providedIn: 'root' })
export class VendorService {
    constructor(private http: HttpClient) {
    }


    create(name: string, phoneNumber: string, email: string, address: string) {
        const url = `${environment.accountingUrl}/account/vendor`;
        return this.http.post<any>(url, { name, phoneNumber, email, address })
            .pipe();
    }

}
