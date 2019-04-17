import { Component, OnInit, ViewChild, Output, EventEmitter} from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/components/alert/alert.service';
import { AccountingService } from '../../service/accounting.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-receivable',
  templateUrl: './receivable.component.html',
  styleUrls: ['./receivable.component.scss']
})
export class ReceivableComponent implements OnInit {
  @Output() customerUpdatedSuccessfulEvent = new EventEmitter();

  constructor(private service: AccountingService,
    private alertService: AlertService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    public toaster: ToastrManager,
   private activeModal: NgbActiveModal) {}

  bank = false;
  cash = false;
  receiptupload;
  loadingpayment = false;
  loadingBank= false;
  expSubmitted = false;
  submitted = false;
  bankList: any;
  theAmountPaid: any;
  public receivablesForm: FormGroup;
  public createBankform: FormGroup;
  loading = false;
  details: any;
  closeResult: string;
  vendorDataForUpdate = null;
  vendorList: any[];
  tableValue: any;
  expenseDate;
  vendorListToUpdate = null;
  suspendingState = false
  responsemsg;
  rows = [];
  count = 0;
  offset = 0;
  limit = 10;
  currencies = [];
  @ViewChild('vendorsTabSet') refNgbTabset: NgbTabset;
  openTabs: any[] = [];


  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.createBankform.reset();
  }


  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  newTabHandler(): void {
    this.addToTabs();
    // focus on new tab
    this.focusOnCreatedTab();
  }

  vendorSuccessHandler(vendorCreated, tabIndex: number): void {
    this.closeTab(null, tabIndex);
    this.getVendors();
  }

  viewVendorHandler(vendor): void {
    this.addToTabs(`${vendor.secret.name}'s Data`, vendor, 'UPDATE_CUSTOMER');
      this.focusOnCreatedTab();
    }

  get latestTabId(): string {
    return `tab-id-${this.openTabs.length - 1}`;
  }

  tabIdForIndex(index: number): string {
    return `tab-id-${index}`;
  }

  addToTabs(title?: string, tabContent?: any, type?: string): void {
    let newTab;
    if (!title) {
      newTab = { title: 'New Customer', type: 'NEW_RECEIVABLE' };
    } else if (type === 'VIEW_RECEIVABLE') {
      newTab = { title, content: tabContent, type: 'VIEW_RECEIVABLE' };
    } else {
      newTab = { title, content: tabContent, type: 'UPDATE_RECEIVABLE' };
    }
    this.openTabs.push(newTab);
  }

  closeTab(event?: MouseEvent, index?: number): void {
    if (event) { event.preventDefault(); }
    this.removeFromTab(index);
  }

  removeFromTab(index: number): void {
    this.openTabs.splice(index, 1);
  }
  focusOnCreatedTab() {
    setTimeout(() => { this.refNgbTabset.select(this.latestTabId); }, 50);
  }

  ngOnInit() {
    this.getVendors();
    this.receivablesFormFields();
    this.fetchBank();
    this. bankFields();
    this.fetchCurrency();
  }

  fetchCurrency(){
    this.service.getCurrency().subscribe((data: any) => {
      if (data) {
        let gotcurrency = data.data[0];
        Object.keys(gotcurrency).map(field => {
          this.currencies.push(gotcurrency[field]);
        });
      }
    });
  }

  onPage(offset, limit) {
    this.count = this.vendorList.length;
    const start = this.offset * this.limit;
    const end = start + this.limit;
    this.rows = this.vendorList;
    console.log('Page Results', start, end, this.rows);
  }

  delete(row) {
    this.rows.splice(row, 1);

  }

  preview(row) {
  }
  fetchBank() {
    this.service.getBank().subscribe((data: any) => {
      if (data) {
        this.bankList = data.data;
        console.log(this.bankList);
      }
    });
  }

  getVendors() {
    this.service.getVendor().subscribe((data: any) => {
      if (data) {
        this.vendorList = data.data;
        console.log(this.vendorList);
      }
     
      if(data.data.length ==0){
        this.tableValue = 'hasNoValue';
      }else{
        this.tableValue = 'hasValue';
      }

      this.onPage(this.offset, this.limit);
    });

  }

   
  getVendor(content,dataRow) {
    this.addToTabs('New Receivables', content, 'UPDATE_CUSTOMER');
    this.focusOnCreatedTab();
    this.vendorDataForUpdate = dataRow;
  }
  

  toggleBank() {
    this.bank = !this.bank;
  }
  toggleCash() {
    this.cash = !this.cash;
  }

  
  receivablesFormFields() {
    this.receivablesForm = this.fb.group({
      amountPayable:[null],
      paymentTypeBank: [null],
      paymentTypeCash: [null],
      bankAccount: [null, Validators.compose([Validators.required])],
      reason:[null],
      amountPaidViaBank: [null, Validators.compose([Validators.required])],
      cashPaid: [null],
      vendor: [null],
      receipts: [null]
    });
  }
  bankFields(){
    this.createBankform = this.fb.group({
      bankName: [null, Validators.compose([Validators.required])],
      accountName: [null, Validators.compose([Validators.required])],
      accountNumber: [null, Validators.compose([Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(10), Validators.required])],
      branch: [null],
      currency: [null]
    });
  }
  get getBankformData() { return this.createBankform.controls; }
  

  addBank() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.createBankform.invalid) {
        return;
    }
    this.loadingBank = true;

    const bankName = this.getBankformData.bankName.value;
    const accountName = this.getBankformData.accountName.value;
    const accountNumber = this.getBankformData.accountNumber.value;
    const branch = this.getBankformData.branch.value;
    const currency = this.getBankformData.currency.value;

    this.service.addBank(bankName, accountName, accountNumber, branch, currency)
        .subscribe(
          data => {
            this.toaster.successToastr('Bank created successfully', null, {toastTimeout: 3000} );
            this.loadingBank = false;
            this.modalService.dismissAll();
            this.fetchBank();
            this.createBankform.reset()
          },
          error => {
            this.toaster.errorToastr('An error occured', null, {toastTimeout: 3000} );
            this.loadingBank = false;
            this.alertService.error(error, true);
          });
  }

  get paymentTypeOption() {

    const selected = []
    // if (this.f.paymentTypeBank.value) {
    //   selected.push('bank')
    // }
    // if (this.f.paymentTypeCash.value) {
    //   selected.push('cash')
    // }
    return selected;
  }

  get f() { return this.receivablesForm.controls; }
  

  
  initReceiptUpload(event) {
    this.receiptupload = event.target.files;
  }

  initStoreExpense() {
    let receiptFormData = new FormData();
    let receiptcount = 0;
    if (this.receiptupload) {
      for (let file of this.receiptupload) {
        let gotfile = <File>file;
        receiptcount++;
        receiptFormData.append('files', gotfile, gotfile.name);
        if (receiptcount == this.receiptupload.length) {
          this.uploadReceipt(receiptFormData);
        }
      }
    } else {
      this.storeExpense();
    }
    //this.loadingExpense = true;
  }

  uploadReceipt(receiptFormData) {
    this.service.uploadReceipt(receiptFormData)
      .pipe(first())
      .subscribe(
        data => {
          if (data.data.token) {
            this.storeExpense(data.data.token);
          }
        },
        error => {
          //this.loadingExpense = false;
        });
  }

  storeExpense(token = null) {
    this.expSubmitted = true;
    if (!this.receivablesFormFields) {
      return;
    }
    this.loadingpayment= true;
    const amountPayable = this.f.amountPayable.value;
    const category = this.f.category.value;
    const bankAccount = this.f.bankAccount.value;
    const amountPaidViaBank = this.f.amountPaidViaBank.value;
    const creditAmount = this.f.creditAmount.value;
    const cashPaid = this.f.cashPaid.value
    const vendor = this.f.vendor.value;
    const expenseDate = this.expenseDate.value;

    this.service.addExpense(this.paymentTypeOption, amountPayable, category, bankAccount,
      amountPaidViaBank, creditAmount, cashPaid, vendor, token, expenseDate)
      .subscribe(
        data => {
          this.toaster.successToastr('Expense created successfully', null, { toastTimeout: 4000 });
          this.loadingpayment = false;
         // this.closeTab(null,tabIndex)
          //this.categories();
          console.log("payment" + data.data);
        },
        error => {
          this.toaster.errorToastr('Expense creation failed', null, { toastTimeout: 4000 });
          this.loadingpayment = false;
          this.alertService.error(error, true);
        });

  }

 
  getAmountPaid(amt:any){
this.theAmountPaid= amt;
  }

forceResize(tabChangeEvent, idOfTable: string): void {
  if (tabChangeEvent['nextId'] === idOfTable) {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 10);
  }
}

}
