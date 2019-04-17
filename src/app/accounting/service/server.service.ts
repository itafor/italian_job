import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ServerService {
  user;
  public rootURL = 'https://p-accounting-api-dev.quabbly.com/v1/account/';

  //public rootURL = "http://127.0.0.1:8000/api/";

  constructor(private http: HttpClient) {
  this.user = JSON.parse(localStorage.getItem('currentUser'));
}

createVendor(name: string, phoneNumber: string, email: string, address: string) {
  const url = `${environment.accountingUrl}/account/vendor`;
  return this.http.post<any>(url, { name, phoneNumber, email, address })
      .pipe();
}

addVendor(formData: any) {
  return  this.http.post(this.rootURL + 'vendor', formData, {
    headers: {
      'Authorization': `Bearer ${this.user.token}`
    }
  });
}

getVendor() {
  return  this.http.get(this.rootURL + 'vendor');
}

updateVendor(formData: any) {
  return  this.http.put(this.rootURL + 'vendor/' + formData._id, formData);
}


  createCustomer(formData: any) {
  return  this.http.post(this.rootURL + 'customer', formData).pipe().toPromise();
  }

   getCustomer(formData: any) {
  return  this.http.get(this.rootURL + 'customer', formData);
  }

  updateCustomer(formData: any) {
  return  this.http.put(this.rootURL + 'customer/' + formData._id, formData);

  }

createExpenseCategory(formData: any) {
  return  this.http.post(this.rootURL + 'expense_category', formData);
  }

  getExpenseCategory(formData: any) {
  return  this.http.get(this.rootURL + 'expense_category', formData);
  }

}
