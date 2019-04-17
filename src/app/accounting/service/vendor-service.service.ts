import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class VendorServiceService {

  public vendorUrl = "https://p-accounting-api-dev.quabbly.com/v1/account/";
  constructor(private http : HttpClient) { }

  create(
    name: string,
    email: string,
    phoneNumber: string,
    address: string,
) {
    const url = this.vendorUrl + 'vendor';
    return this.http.post<any>(url, { name, email, phoneNumber, address})
        .pipe(map(status => status));
}

addVendor(formData:any) {
  return  this.http.post(this.vendorUrl + 'vendor', formData);
}

getVendor() {
    return this.http.get(this.vendorUrl + 'vendor')
}

getCustomer(){
    return this.http.get(this.vendorUrl + 'customer')
}


getExpenseCategory(){
    return  this.http.get(this.vendorUrl + 'expense_category');
    }

fetchEmployee(employeeId) {
    return this.http.get(`${this.vendorUrl}/vendor/${employeeId}`)
}
}
