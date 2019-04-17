import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter
} from '@angular/core';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountingService } from '../../service/accounting.service';
import { AlertService } from 'src/app/components/alert/alert.service';
import { Router } from '@angular/router';

// interface ExpenseResponse {
//   expense: any[];
// }

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss'],
})
export class ExpenseComponent implements OnInit {
  parentExpenseId;
  viewExpenseData;

  constructor(
    private service: AccountingService,
    private alertService: AlertService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private router: Router,
    private toaster: ToastrManager,
    private activeModal: NgbActiveModal,
  ) { }

  @Output() expenseupdateddSuccessfulEvent = new EventEmitter();

  public form: FormGroup;
  public createExpenseCatform: FormGroup;
  public customerForm: FormGroup;
  public createBankform;
  public expenseCategory;
  public vendorList;
  bank = false;
  cash = false;
  credit = false;
  card = false;
  expensID: any;
  showCredit = false;
  showCash = false;
  showMe = false;
  showBank = false;
  washee = false;
  bankList: any;
  cardList: any;
  cashAccountList: any;
  expenseList: any[];
  p: number = 1;
  tableValue: any;
  theAmount: number;
  rows = [];
  count = 0;
  offset = 0;
  limit = 30;
  loading = false;
  loadingVendor = false;
  submitted = false;
  closeResult: string;
  el: any;
  loadingExpense = false;

  open(content, dataRow) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        result => {
          this.closeResult = `Closed with: ${result}`;
        },
        reason => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
    this.el = dataRow;
  }

  openup(contentexpense) {
    this.modalService.open(contentexpense, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  onopen(vendor) {
    this.modalService.open(vendor, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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
  openTabs: any[] = [];
  @ViewChild('expenseTabSet') refNgbTabset: NgbTabset;

  newTabHandler(): void {
    this.addToTabs();
    // focus on new tab
    this.focusOnCreatedTab();
  }

  expenseSuccessHandler(expenseCreated, tabIndex: number): void {
    this.closeTab(null, tabIndex);
    this.fetchExpenses(this.offset, this.limit);
  }

  viewExpenseHandler(expense): void {
    this.addToTabs(
      `${expense.secret.expenseDescription}'s Data`,
      expense,
      'UPDATE_EXPENSE'
    );
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
      this.service.changeMessage('');
      newTab = { title: 'New Expense', type: 'NEW_EXPENSE' };
    } else if (type === 'VIEW_EXPENSE') {
      newTab = { title, content: tabContent, type: 'VIEW_EXPENSE' };
    } else if (type === 'RELATED_EXPENSE') {
      newTab = { title, content: tabContent, type: 'RELATED_EXPENSE' };
    } else {
      newTab = { title, content: tabContent, type: 'UPDATE_EXPENSE' };
    }
    this.openTabs.push(newTab);
  }

  closeTab(event?: MouseEvent, index?: number): void {
    if (event) {
      event.preventDefault();
    }
    this.removeFromTab(index);
  }

  removeFromTab(index: number): void {
    this.openTabs.splice(index, 1);
  }
  focusOnCreatedTab() {
    setTimeout(() => {
      this.refNgbTabset.select(this.latestTabId);
    }, 50);
  }

  ngOnInit() {
    this.fetchExpenses(this.offset, this.limit);
    this.getExpenseCategory();
    this.expenseCatFormFields();
    this.vendors();
    this.categories();
    this.fetchBank();
    this.vendorFields();
    this.fetchBank();
    this.getCashAccount();
    this.getCard();
  }
  getSelectedItemId(itemId:any){
    console.log('selecte Item id: ', itemId);
  }
  convertDate(myDate:string){
    let date= new Date(myDate);
    let createdDate = date.toDateString();
    return createdDate;
  }
  changeItemPerPage(e:any){
  this.limit =  e.target.value;
  }
  getCashAccount() {
    this.service.getCashAccount().subscribe((data: any) => {
      if (data) {
        this.cashAccountList = data.data;
      }

    });
  }

  getStrToInt(str: string) {
    let toInt = 0;
    if (typeof (str) === 'string') {
      toInt = parseFloat(str)
    }
    return toInt
  }
  expenseCatFormFields() {
    this.createExpenseCatform = this.fb.group({
      name: [null, Validators.compose([Validators.required])],
      categoryType: [null],
      parentCategory: [null],
    });
  }
  vendorFields() {
    this.customerForm = this.fb.group({
      name: [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100),])],
      phoneNumber: [null, Validators.compose([Validators.pattern("^[0-9]*$"), Validators.maxLength(11), Validators.minLength(11)])],
      email: [null, Validators.compose([Validators.email])],
      address: [null],
    });
  }

  get ecf() { return this.createExpenseCatform.controls; }
  get getcustomerFormData() { return this.customerForm.controls; }


  fetchExpenses(offset, limit) {
    this.service.getExpense(offset, limit).subscribe((data: any) => {
      if (data) {
        this.expenseList = data.data;
        this.count = data.recordCount;
        this.rows = this.expenseList;
        console.log(this.expenseList);
      }
      if (data.data.length == 0) {
        this.tableValue = 'hasNoValue';
      } else {
        this.tableValue = 'hasValue';
      }
    });
  }

  getExpenseCategory() {
    this.service.getExpenseCategory().subscribe((data: any) => {
      if (data) {
        this.expenseCategory = data.data;
        console.log(this.expenseCategory);
      }
    });
  }

  onPage(event) {
    this.fetchExpenses(event.offset, event.limit);
  }

  delete(row) {
    this.rows.splice(row, 1);

  }

  preview(row) {
  }

  paymentTypeIsSelected(paymentTypes: string[], paymentType: string): boolean {
    return paymentTypes.indexOf(paymentType) > -1;
  }
  getPayemntSelected(check) {
    if (check) {
      return true
    } else {
      return false;
    }

  }
  toggleCard() {
    this.card = !this.card;
  }
  toggleBank() {
    this.bank = !this.bank;
  }

  toggleCash(event, value) {
    console.log(value)
    let checked = true;
    if (value) {
      if(event.target.checked) {
        console.log('checked')
        this.cash = true;
      } else {
        this.cash = false;
        console.log('not checked')
      }
      checked = false;
    } else if (value === null){
      if(event.target.checked) {
        console.log('not checked')
        this.showCash = true;
      } else {
        console.log(' checked')
        this.showCash = false;
      }
      checked = false;
  }
}
  toggleCredit(event, value) {
    console.log(value)
    let checked = true;
    if (value) {
      if (event.target.checked) {
        console.log('checked')
        this.credit = true;
      } else {
        this.credit = false;
        console.log('not checked')
      }
      checked = false;
    } else {
      if (event.target.checked) {
        console.log('not checked')
        this.showCredit = true;
      } else {
        console.log(' checked')
        this.showCredit = false;
      }
    }
  }

  vendors() {
    this.service.getVendor().subscribe((data: any) => {
      if (data) {
        this.vendorList = data.data;
      }
    });
  }
  fetchBank() {
    this.service.getBank().subscribe((data: any) => {
      if (data) {
        this.bankList = data.data;
      }
    });
  }
  categories() {
    this.service.getExpenseCategory().subscribe((data: any) => {
      if (data) {
        this.expenseCategory = data.data;
      }
    });
  }

  getCard() {
    this.service.getCardCategory().subscribe((data: any) => {
      if (data) {
        this.cardList = data.data;
      }
    });
  }

  expenseUpdate(tabIndex: number) {
    this.loadingExpense = true;
    this.service
      .updateExpense(
        this.el._id,
        this.el.expenseDate,
        this.el.secret.paymentType,
        this.el.secret.expenseDescription,
        this.el.category._id,
        this.el && this.el.bankAccount && this.el.bankAccount._id ? this.el.bankAccount._id : '',
        parseInt(this.el.secret.amountPaidViaBank),
        parseInt(this.el.secret.creditAmount),
        parseInt(this.el.secret.cashPaid),
        this.el.vendor._id,
        this.el.cardId,
        parseInt(this.el.secret.amountPaidViaCard),
        this.el.cashAccount,
        parseInt(this.el.secret.bankAccountExchangeRate),
        parseInt(this.el.secret.cardAccountExchangeRate),
        parseInt(this.el.secret.cashAccountExchangeRate),
      )
      .subscribe(
        data => {
          this.closeTab(null, tabIndex);
          this.toaster.successToastr('Expense updated successfully', null, { toastTimeout: 3000 });
          this.expenseupdateddSuccessfulEvent.emit(data);
          this.loadingExpense = false;
          this.fetchExpenses(this.offset, this.limit);
          console.log('update data: ' + data)
        },
        error => {
          this.toaster.errorToastr(error, null, {
            toastTimeout: 3000
          });
          this.loadingExpense = false;
          // this.alertService.error(error, true);
        }
      );
  }

  goToViewExpense() {
    this.router.navigate(['accounting/view-expense']);
  }

  getExpense(content, dataRow) {
    this.viewExpenseData = dataRow;
    this.addToTabs('Edit Expense', content, 'UPDATE_EXPENSE');
    this.focusOnCreatedTab();
    this.el = dataRow;
    this.expensID= this.el && this.el._id ? this.el._id : ''; 
    console.log('expense list: ' + dataRow.createdAt);
  }

  viewExpense(content, dataRow) {
    this.service.changeMessage(dataRow);
    this.addToTabs('View Expense', content, 'VIEW_EXPENSE');
    this.focusOnCreatedTab();
    this.el = dataRow;
  }

 

  createChildExpense(content, dataRow) {
    this.service.changeMessage(dataRow._id);
    this.parentExpenseId = dataRow._id;
    this.addToTabs('New Related Expense', content, 'RELATED_EXPENSE');
    this.focusOnCreatedTab();
    this.el = dataRow;
  }

  deleteExpense(id: number) {
    if (
      confirm(
        'Are you sure you want to permanently delete the selected  Expense?'
      )
    ) {
      this.service.removeExpense(id).subscribe(
        data => {
          this.toaster.successToastr(
            'Selected expense  deleted successfully',
            null,
            { toastTimeout: 3000 }
          );
          this.fetchExpenses(this.offset, this.limit);
        },
        error => {
          this.toaster.errorToastr(
            error,
            null,
            { toastTimeout: 3000 }
          );
        }
      );
    }
  }

  forceResize(tabChangeEvent, idOfTable: string): void {
    if (tabChangeEvent['nextId'] === idOfTable) {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 10);
    }
  }



  createVendor() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.customerForm.invalid) {
      return;
    }

    this.loadingVendor = true;

    const name = this.getcustomerFormData.name.value;
    const address = this.getcustomerFormData.address.value;
    const email = this.getcustomerFormData.email.value;
    const phoneNumber = this.getcustomerFormData.phoneNumber.value;

    this.service.createVendor(name, phoneNumber, email, address)
      .subscribe(
        data => {
          this.toaster.successToastr('Vendor created successfully', null, { toastTimeout: 3000 });
          this.loadingVendor = false;
          this.modalService.dismissAll();
          this.vendors();
        },
        error => {
          this.toaster.errorToastr(error, null, { toastTimeout: 10000 });
          this.loadingVendor = false;
          //this.alertService.error(error, true);
        });
  }


  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.createExpenseCatform.invalid) {
      return;
    }
    this.loading = true;
    const name = this.ecf.name.value;
    const categoryType = this.ecf.categoryType.value;
    const parentCategory = this.ecf.parentCategory.value;
    this.service.createExpenseCategory(name, parentCategory, categoryType)
      .subscribe(
        data => {
          this.toaster.successToastr('Expense Category created successfully', null, { toastTimeout: 3000 });
          this.modalService.dismissAll();
          this.loading = false;
          this.categories();
          this.createExpenseCatform.reset();
        },
        error => {
          this.toaster.errorToastr(error, null, { toastTimeout: 3000 });
          //this.alertService.error(error, true);
          this.loading = false;
        });
  }


}


