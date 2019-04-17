import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OmsService {

  user;
  constructor(private http: HttpClient) {
  this.user = JSON.parse(localStorage.getItem('currentUser'));
}


  fetchOrders() {
    return this.http.get(`${environment.omsUrl}/order/paid`)
  }

}

