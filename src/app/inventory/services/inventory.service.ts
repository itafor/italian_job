import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  user;

  fetchInventoryCategories(): any {
     return '';
  }

  constructor(private http: HttpClient) {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
  }

  createInventoryCategory(categoryName) {
    return this.http.post(`${environment.accountingUrl}/account/inventory_category`, {
      name: categoryName
    }).pipe();
  }

}
