import {
  NgbModal,
  NgbActiveModal,
  ModalDismissReasons
} from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FlxUiDataTable } from 'flx-ui-datatable';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/components/alert/alert.service';
import { AccountingService } from '../../service/accounting.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-view-expense',
  templateUrl: './view-expense.component.html',
  styleUrls: ['./view-expense.component.scss']
})
export class ViewExpenseComponent implements OnInit {
  bank = false;
  cash = false;
  credit = false;
  card = false;
  public expenseCategory;
  public vendorList;
  public cashAccountList;
  public cardList;
  public form: FormGroup;
  public createExpenseCatform: FormGroup;
  public createBankform: FormGroup;
  public customerForm: FormGroup;
  loading = false;
  loadingExpense = false;
  loadingBank = false;
  loadingVendor = false;
  submitted = false;
  expSubmitted = false;
  bankList: any;
  closeResult: string;
  receiptupload;
  parentExpenseId;
  expenseData;

  constructor(
    private service: AccountingService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private router: Router,
    private alertService: AlertService,
    private toaster: ToastrManager,
    public dataService: FlxUiDataTable
  ) {}

  @Output() expenseCreatedSuccessfulEvent = new EventEmitter();

  open(content) {
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
    this.createExpenseCatform.reset();
    this.createBankform.reset();
    this.customerForm.reset();
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

  toggleBank() {
    this.bank = !this.bank;
  }
  toggleCash() {
    this.cash = !this.cash;
  }
  toggleCredit() {
    this.credit = !this.credit;
  }
  toggleCard(){
    this.card = !this.card;
  }
  categories() {
    this.service.getExpenseCategory().subscribe((data: any) => {
      if (data) {
        this.expenseCategory = data.data;
      }
    });
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

  ngOnInit() {
    this.expenseCatFormFields();
    this.vendorFields();
    this.bankFields();
    this.expenseFormFields();
    this.categories();
    this.vendors();
    this.fetchBank();
    this.initBroadCast();
   this.getCashAccount();
   this.getCard();
  }
  getCashAccount() {
    this.service.getCashAccount().subscribe((data: any) => {
      if (data) {
        this.cashAccountList = data.data;
      }
     
  });
}
getCard(){
  this.service.getCardCategory().subscribe((data: any) => {
    if (data) {
      this.cardList = data.data;
    }
});
}
  initBroadCast() {
    this.service.currentMessage.subscribe(message => {
      if (message) {
        this.expenseData = message;
        console.log(this.expenseData);
      }
    });
    this.service.changeMessage('');
  }
  expenseCatFormFields() {
    this.createExpenseCatform = this.fb.group({
      name: [null, Validators.compose([Validators.required])],
      categoryType: [null],
      parentCategory: [null]
    });
  }

  vendorFields() {
    this.customerForm = this.fb.group({
      name: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100)
        ])
      ],
      phoneNumber: [
        null,
        Validators.compose([
          Validators.pattern('^[0-9]*$'),
          Validators.maxLength(11),
          Validators.minLength(11)
        ])
      ],
      email: [null, Validators.compose([Validators.email])],
      address: [null]
    });
  }
  bankFields() {
    this.createBankform = this.fb.group({
      bankName: [null, Validators.compose([Validators.required])],
      accountName: [null, Validators.compose([Validators.required])],
      accountNumber: [
        null,
        Validators.compose([
          Validators.pattern('^[0-9]*$'),
          Validators.maxLength(10),
          Validators.minLength(10),
          Validators.required
        ])
      ],
      branch: [null]
    });
  }

  expenseFormFields() {
    this.form = this.fb.group({
      paymentTypeBank: [null],
      paymentTypeCredit: [null],
      paymentTypeCash: [null],
      paymentTypeCard: [null],
      expenseDescription: [null],
      category: [null],
      bankAccount: [null],
      transferFee: [null],
      amountPaidViaBank: [null],
      creditAmount: [null],
      cashPaid: [null],
      vendor: [null],
      receipts: [null],
      expenseDate: [null],
      amountPaidViaCard:[null],
      cardDescription:[null],
      cardId:[null],
      cashAccount:[null],
      bankAccountExchangeRate:[null],
      cashAccountExchangeRate:[null],
      cardAccountExchangeRate:[null],
    });
  }
  get paymentTypeOption() {
    const selected = [];
    if (this.f.paymentTypeBank.value) {
      selected.push('bank');
    }
    if (this.f.paymentTypeCredit.value) {
      selected.push('credit');
    }
    if (this.f.paymentTypeCash.value) {
      selected.push('cash');
    }
    if (this.f.paymentTypeCard.value) {
      selected.push('card');
    }
    return selected;
  }

  get f() {
    return this.form.controls;
  }
  get ecf() {
    return this.createExpenseCatform.controls;
  }
  get getBankformData() {
    return this.createBankform.controls;
  }
  get getcustomerFormData() {
    return this.customerForm.controls;
  }

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

    this.service.createVendor(name, phoneNumber, email, address).subscribe(
      data => {
        this.toaster.successToastr('Vendor created successfully', null, {
          toastTimeout: 3000
        });
        this.loadingVendor = false;
        this.modalService.dismissAll();
        this.vendors();
      },
      error => {
        this.toaster.errorToastr('Vendor creation failed', null, {
          toastTimeout: 3000
        });
        this.loadingVendor = false;
        this.alertService.error(error, true);
      }
    );
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
    this.service
      .createExpenseCategory(name, parentCategory, categoryType)
      .subscribe(
        data => {
          this.toaster.successToastr(
            'Expense Category created successfully',
            null,
            { toastTimeout: 3000 }
          );
          this.modalService.dismissAll();
          this.loading = false;
          this.categories();
          this.createExpenseCatform.reset();
        },
        error => {
          this.toaster.errorToastr('An error occured', null, {
            toastTimeout: 3000
          });
          this.alertService.error(error, true);
          this.loading = false;
        }
      );
  }

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
    this.service
      .uploadReceipt(receiptFormData)
      .pipe(first())
      .subscribe(
        data => {
          if (data.data.token) {
            this.storeExpense(data.data.token);
          }
        },
        error => {
          //this.loadingExpense = false;
        }
      );
  }

  storeExpense(token = null) {
    this.expSubmitted = true;
    if (this.form.invalid) {
      return;
    }
    this.loadingExpense = true;
    const expenseDescription = this.f.expenseDescription.value;
    const category = this.f.category.value;
    const bankAccount = this.f.bankAccount.value;
    const transferFee = this.f.transferFee.value;
    const amountPaidViaBank = this.f.amountPaidViaBank.value;
    const creditAmount = this.f.creditAmount.value;
    const cashPaid = this.f.cashPaid.value;
    const vendor = this.f.vendor.value;
    const expenseDate = this.f.expenseDate.value;
    const amountPaidViaCard=this.f.amountPaidViaCard.value;
    const cardDescription=this.f.cardDescription.value;
    const cardId=this.f.cardId.value;
    const cashAccount=this.f.cashAccount.value;
    const bankAccountExchangeRate = this.f.bankAccountExchangeRate.value;
    const cashAccountExchangeRate = this.f.cashAccountExchangeRate.value;
    const cardAccountExchangeRate = this.f.cardAccountExchangeRate.value;
    this.service
      .addNewExpense(
        this.paymentTypeOption,
        expenseDescription,
        category,
        bankAccount,
        amountPaidViaBank,
        creditAmount,
        cashPaid,
        vendor,
        token,
        expenseDate,
        transferFee,
        this.parentExpenseId,
        amountPaidViaCard,
        cardDescription,
        cardId,
        cashAccount,
        bankAccountExchangeRate,
        cashAccountExchangeRate,
        cardAccountExchangeRate
      )
      .subscribe(
        data => {
          this.toaster.successToastr('Expense created successfully', null, {
            toastTimeout: 4000
          });
          this.loadingExpense = false;
          this.expenseCreatedSuccessfulEvent.emit(data);
          this.categories();
        },
        error => {
          this.toaster.errorToastr('Expense creation failed', null, {
            toastTimeout: 4000
          });
          this.loadingExpense = false;
          this.alertService.error(error, true);
        }
      );
  }

  getExpenseCategoryDisplayName(identity) {
    if (identity == 'expenseOnDirectCosts') {
      return 'Expense On Direct Costs';
    } else if (identity == 'expenseOnFixedAssets') {
      return 'Expense On Fixed Assets';
    } else if (identity == 'expenseOnCurrentAssets') {
      return 'Expense On Current Assets';
    } else if (identity == 'generalOperatingExpense') {
      return 'General Operating Expense';
    }
    return;
  }

  urlWithToken(url: string): string {
    return this.service.getAttachUrlWithToken(url);
  }
}
