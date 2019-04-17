import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from 'src/app/account/account.authentication';

export interface CreateVendorInt {
  paymentType: string[];
  description: string;
  category: string;
  bankAccount?: string;
  amountPaidViaBank?: string;
  creditAmount?: string;
  cashPaid?: string;
  vendor: string;
  receipts?: string;
  token: string;
}
@Injectable({
  providedIn: 'root'
})
export class AccountingService {
  user;
  private messageSource = new BehaviorSubject('');
  currentMessage = this.messageSource.asObservable();

  constructor(private http: HttpClient, public auth: AuthenticationService) {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
  }

  changeMessage(message: string) {
    this.messageSource.next(message);
  }

  public url = `${environment.accountingUrl}/account/`;
  fileManagerUrl =
    'https://p-file-manager-api-dev.quabbly.com/v1/service/upload_files';

  createVendor(
    name: string,
    phoneNumber: string,
    email: string,
    address: string
  ) {
    return this.http
      .post<any>(this.url + `vendor`, { name, phoneNumber, email, address })
      .pipe();
  }

  getVendor() {
    return this.http.get(this.url + `vendor`);
  }

  updateVendor(
    id: number,
    name: string,
    phoneNumber: string,
    email: string,
    address: string
  ) {
    return this.http.put(this.url + `vendor/` + id, {
      name,
      phoneNumber,
      email,
      address
    });
  }

  getVendorById(formData: any) {
    return this.http.get(this.url + `vendor` + formData.id, formData);
  }

  removeVendor(_id: number) {
    return this.http.delete(this.url + `vendor/` + _id);
  }

  suspendVendor(_id: number) {
    return this.http.put(this.url + `vendor/suspend/` + _id, {});
  }

  unsuspendVendor(_id: number) {
    return this.http.put(this.url + `vendor/unsuspend/` + _id, {});
  }

  createCustomer(
    name: string,
    phoneNumber: string,
    email: string,
    address: string
  ) {
    return this.http
      .post<any>(this.url + `customer`, { name, phoneNumber, email, address })
      .pipe();
  }

  getCustomer() {
    return this.http.get(this.url + `customer`);
  }

  updateCustomer(
    id: number,
    name: string,
    phoneNumber: string,
    email: string,
    address: string
  ) {
    return this.http.put(this.url + `customer/` + id, {
      name,
      phoneNumber,
      email,
      address
    });
  }

  suspendCustomer(_id: number) {
    return this.http.put(this.url + `customer/suspend/` + _id, {});
  }

  unsuspendCustomer(_id: number) {
    return this.http.put(this.url + `customer/unsuspend/` + _id, {});
  }

  createExpenseCategory(
    name: string,
    parentCategory: string,
    categoryType: string
  ) {
    return this.http
      .post<any>(this.url + `expense_category`, {
        name,
        parentCategory,
        categoryType
      })
      .pipe();
  }

  removeCustomer(_id: number) {
    return this.http.delete(this.url + `customer/` + _id);
  }

  getExpenseCategory() {
    return this.http.get(this.url + `expense_category`);
  }

  getCurrency() {
    return this.http.get(this.url + `currency`);
  }

  updateExpenseCategory(
    id: number,
    categoryType: string,
    name: string,
    parentCategory: string
  ) {
    return this.http.put(this.url + `expense_category/` + id, {
      name,
      parentCategory,
      categoryType
    });
  }

  removeExpenseCategory(_id: number) {
    return this.http.delete(this.url + `expense_category/` + _id);
  }

  addBank(
    bankName: string,
    accountName: string,
    accountNumber: string,
    branch: string,
    currency: string
  ) {
    return this.http
      .post<any>(this.url + `bank`, {
        bankName,
        accountName,
        accountNumber,
        branch,
        currency
      })
      .pipe();
  }

  getBank() {
    return this.http.get(this.url + `bank`);
  }

  updateBank(
    id: number,
    bankName: string,
    accountName: string,
    accountNumber: string,
    branch: string
  ) {
    return this.http.put(this.url + `bank/` + id, {
      bankName,
      accountName,
      accountNumber,
      branch
    });
  }

  getAuditTrail() {
    return this.http.get(this.url + `audit_trail`);
  }
  getInventory(offset, limit) {
    let params = new HttpParams().set('offset', offset).set('limit', limit);
    return this.http.get(this.url + `inventory`, { params: params });
  }
  getInventoryCategory(offset, limit) {
    let params = new HttpParams().set('offset', offset).set('limit', limit);
    return this.http.get(this.url + `inventory_category`, { params: params });
  }

  updateInventory(
    id: number,
    item_description: string,
    category: string,
    quantity: string,
    unit_cost: string
  ) {
    return this.http.put(this.url + `inventory/` + id, {
      item_description,
      category,
      quantity,
      unit_cost
    });
  }

  updateInventorycategory(
    id: number,
    name: string,
    description: string,
    parent_category: string
  ) {
    return this.http.put(this.url + `inventory/` + id, {
      name,
      description,
      parent_category
    });
  }

  addInventory(
    item_description: string,
    category: string,
    quantity: string,
    unit_cost: string
  ) {
    return this.http
      .post<any>(this.url + `inventory`, {
        item_description,
        category,
        quantity,
        unit_cost
      })
      .pipe();
  }
  addInventoryCategory(name: string, description: string) {
    return this.http
      .post<any>(this.url + `inventory_category`, { name, description })
      .pipe();
  }

  suspendInventory(_id: number) {
    return this.http.put(this.url + `inventory/suspend/` + _id, {});
  }

  UnsuspendInventory(_id: number) {
    return this.http.put(this.url + `inventory/unsuspend/` + _id, {});
  }

  removeBank(_id: number) {
    return this.http.delete(this.url + `bank/` + _id);
  }

  addExpense(
    paymentType: any[],
    expenseDescription: string,
    category: string,
    bankAccount: string,
    amountPaidViaBank: string,
    creditAmount: string,
    cashPaid: string,
    vendor: string,
    receipts: string,
    expenseDate: string
  ) {
    return this.http
      .post<any>(this.url + `expense`, {
        paymentType,
        expenseDescription,
        category,
        bankAccount,
        amountPaidViaBank,
        creditAmount,
        cashPaid,
        vendor,
        receipts,
        expenseDate
      })
      .pipe();
  }

  addNewExpense(
    paymentType: any[],
    expenseDescription: string,
    category: string,
    bankAccount: string,
    amountPaidViaBank: number,
    creditAmount: string,
    cashPaid: string,
    vendor: string,
    receipts: string,
    expenseDate: string,
    transferFee: string,
    parentExpenseId: string,
    amountPaidViaCard:number,
    cardDescription:string,
    cardId:number,
    cashAccount:string,
    bankAccountExchangeRate:number,
    cashAccountExchangeRate:number,
    cardAccountExchangeRate:number
  ) {
    return this.http
      .post<any>(this.url + `expense`, {
        paymentType,
        expenseDescription,
        category,
        bankAccount,
        amountPaidViaBank,
        creditAmount,
        cashPaid,
        vendor,
        receipts,
        expenseDate,
        transferFee,
        parentExpenseId,
        amountPaidViaCard,
        cardDescription,
        cardId,
        cashAccount,
        bankAccountExchangeRate,
        cashAccountExchangeRate,
        cardAccountExchangeRate
      })
      .pipe();
  }

  updateExpense(
    id: number,
    expenseDate: Date,
    paymentType: any[],
    expenseDescription: string,
    category: string,
    bankAccount: string,
    amountPaidViaBank: number,
    creditAmount: number,
    cashPaid: number,
    vendor: string,
    cardId:string,
    amountPaidViaCard:number,
    cashAccount:string,
    bankAccountExchangeRate:number,
    cardAccountExchangeRate:number,
    cashAccountExchangeRate:number
  ) {
    console.log(bankAccount);
    return this.http
      .put<any>(this.url + `expense/` + id, {
        expenseDate,
        paymentType,
        expenseDescription,
        category,
        bankAccount,
        amountPaidViaBank,
        creditAmount,
        cashPaid,
        vendor,
        cardId,
        amountPaidViaCard,
        cashAccount,
        bankAccountExchangeRate,
        cardAccountExchangeRate,
        cashAccountExchangeRate
      })
      .pipe();
  }

  getExpense(offset, limit) {
    let params = new HttpParams().set('offset', offset).set('limit', limit);
    return this.http.get(this.url + `expense`, { params: params });
  }

  removeExpense(_id: number) {
    return this.http.delete(this.url + `expense/` + _id);
  }
  // addSales(
  //   paymentType: any[],
  //   expenseDescription: string,
  //   category: string,
  //   bankAccount: string,
  //   amountPaidViaBank: string,
  //   creditAmount: string,
  //   cashPaid: string,
  //   vendor: string,
  //   receipts: string,
  //   expenseDate: string
  // ) {
  //   return this.http
  //     .post<any>(this.url + `expense`, {
  //       paymentType,
  //       expenseDescription,
  //       category,
  //       bankAccount,
  //       amountPaidViaBank,
  //       creditAmount,
  //       cashPaid,
  //       vendor,
  //       receipts,
  //       expenseDate
  //     })
  //     .pipe();
  // }

  addNewSales(
    paymentType: any[],
    saleDescription: string,
    category: string,
    bankAccount: string,
    amountReceivedViaBank: string,
    creditAmount: string,
    cashReceived: string,
    customer: string,
    receipts: string,
    saleDate: string,
    cashAccount:string,
    transferFee: string,
    parentExpenseId: string,
   
  ) {
    return this.http
      .post<any>(this.url + `sale`, {
        paymentType,
        saleDescription,
        category,
        bankAccount,
        amountReceivedViaBank,
        creditAmount,
        cashReceived,
        customer,
        receipts,
        saleDate,
        cashAccount,
        transferFee,
        parentExpenseId,
        
      })
      .pipe();
  }

  updateSales(
    id: number,
    paymentType: any[],
    saleDescription: string,
    category: string,
    bankAccount: string,
    creditAmount: number,
    amountReceivedViaBank: number,
    cashReceived: number,
    customer: string,
    saleDate: Date
  ) {
    return this.http
      .put<any>(this.url + `sale/` + id, {
        paymentType,
        saleDescription,
        category,
        bankAccount,
        creditAmount,
        amountReceivedViaBank,
        cashReceived,
        customer,
        saleDate
      })
      .pipe();
  }

  getSales(offset, limit) {
    let params = new HttpParams().set('offset', offset).set('limit', limit);
    return this.http.get(this.url + `sale`, { params: params });
  }

 
  removeSales(_id: number) {
    return this.http.delete(this.url + `sale/` + _id);
  }

  uploadReceipt(attachmentFormData) {
    const url = this.fileManagerUrl;
    return this.http.post<any>(url, attachmentFormData).pipe(
      map(response => {
        return response;
      })
    );
  }

  addSales(
    paymentType: any[],
    expenseDescription: string,
    category: string,
    bankAccount: string,
    amountReceivedViaBank: string,
    creditAmount: string,
    cashReceived: string,
    customer: string,
    receipts: string
  ) {
    return this.http
      .post<any>(this.url + `sale`, {
        paymentType,
        expenseDescription,
        category,
        bankAccount,
        amountReceivedViaBank,
        creditAmount,
        cashReceived,
        customer,
        receipts
      })
      .pipe();
  }
  // getSales() {
  //   return this.http.get(this.url + `sale`);
  // }

  getSaleCategory() {
    return this.http.get(this.url + `income_category`);
  }

  createSaleCategory(
    name: string,
    
    categoryType: string
  ) {
    return this.http
      .post<any>(this.url + `income_category`, {
        name,
        categoryType
      })
      .pipe();
  }

  // removeSales(_id: number) {
  //   return this.htaddnewtp.delete(this.url + `sale/` + _id);
  // }

  createInvoice(
    items: any[],
    senderName: string,
    senderEmail: string,
    senderAddress: string,
    senderPhoneNumber: string,
    senderBusinessPhoneNumber: string,
    receiverName: string,
    receiverEmail: string,
    receiverAddress: string,
    receiverPhoneNumber: string,
    invoiceNumber: string,
    invoiceDate: string,
    invoiceDueDate: string,
    invoiceTerms: string,
    tax: string,
    amountPaid: string
  ) {
    console.log(items);
    return this.http
      .post<any>(this.url + `invoice`, {
        items,
        senderName,
        senderEmail,
        senderAddress,
        senderPhoneNumber,
        senderBusinessPhoneNumber,
        receiverName,
        receiverEmail,
        receiverAddress,
        receiverPhoneNumber,
        invoiceNumber,
        invoiceDate,
        invoiceDueDate,
        invoiceTerms,
        tax,
        amountPaid
      })
      .pipe();
  }

  getInvoice() {
    return this.http.get(this.url + `invoice`);
  }

  createIncomeCategory(
    name: string,
    categoryType: string,
    parentCategory: string
  ) {
    return this.http
      .post<any>(this.url + `income_category`, {
        name,
        categoryType,
        parentCategory
      })
      .pipe();
  }

  createCashAccount(name: string, currency: string) {
    return this.http
      .post<any>(this.url + `cashaccount`, {
        name,
        currency
      })
      .pipe();
  }

  updateIncomeCategory(
    id: number,
    name: string,
    categoryType: string,
    parentCategory: string
  ) {
    return this.http.put(this.url + `income_category/` + id, {
      name,
      categoryType,
      parentCategory
    });
  }

  updateCashAccount(id: number, name: string) {
    return this.http.put(this.url + `cashaccount/` + id, {
      name
    });
  }

  getIncomeCategory(offset, limit) {
    let params = new HttpParams().set('offset', offset).set('limit', limit);
    return this.http.get(this.url + `income_category`, { params: params });
  }

  getCashAccount() {
    return this.http.get(this.url + `cashaccount`);
  }

  removeIncomeCategory(_id: number) {
    return this.http.delete(this.url + `income_category/` + _id);
  }

  deleteCashAccount(_id: number) {
    return this.http.delete(this.url + `cashaccount/` + _id);
  }

  addCard(description: string, openingBalance: string, currency: string) {
    return this.http
      .post<any>(this.url + `card`, { description, openingBalance, currency })
      .pipe();
  }

  getCardCategory() {
    return this.http.get(this.url + `card`);
  }

  updateCardCategory(id: number, description: string, openingBalance: any) {
    return this.http.put(this.url + `card/` + id, {
      description,
      openingBalance
    });
  }

  settings(
    chargeCategory: string,
    enableBankTransferCharge: boolean,
    enableApprovalForProcurement: boolean,
    enablerequisitionApprover: boolean,
    procurementApprovers: any[],
    requisitionApprovers: any[],
    currency: string
  ) {
    return this.http
      .put<any>(this.url + 'settings', {
        chargeCategory,
        enableBankTransferCharge,
        enableApprovalForProcurement,
        enablerequisitionApprover,
        procurementApprovers,
        requisitionApprovers,
        currency
      })
      .pipe();
  }

  getSettings() {
    return this.http.get(this.url + 'settings');
  }

  getAttachUrlWithToken(origUrl: string): string {
    return `${origUrl}?token=${this.auth.currentUserValue.token}`;
  }
}
