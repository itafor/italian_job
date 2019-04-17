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
  selector: 'app-view-sales',
  templateUrl: './view-sales.component.html',
  styleUrls: ['./view-sales.component.scss']
})
export class ViewSalesComponent implements OnInit {
  bank = false;
  cash = false;
  credit = false;
  creditcard = false;
  incomeCategoryList: any[];
  customerList: any[];
  public expenseCategory;
  public saleCategory;
  public vendorList;
  public form: FormGroup;
  public createExpenseCatform: FormGroup;
  public createSaleCatform: FormGroup;
  public createBankform: FormGroup;
  public customerForm: FormGroup;
  loading = false;
  loadingExpense = false;

  loadingBank = false;
  loadingCustomer = false;
  submitted = false;
  expSubmitted = false;
  bankList: any;
  closeResult: string;
  receiptupload;
  parentExpenseId;
  disabler;
  expenseData;
  count = 0;
  offset = 0;
  limit = 20;


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

  @Output() saleCreatedSuccessfulEvent = new EventEmitter();

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
    this.createSaleCatform.reset();
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
  toggleCreditCard() {
    this.creditcard = !this.creditcard;
  }

  categories() {
    this.service.getSaleCategory().subscribe((data: any) => {
      if (data) {
        this.saleCategory = data.data;
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
    this.refreshIncomeCategoryList(this.offset, this.limit);
    this.refreshCustomerList();
  }


  expenseCatFormFields() {
    this.createSaleCatform = this.fb.group({
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
      saleDescription: [null],
      category: [null],
      bankAccount: [null],
      transferFee: [null],
      amountReceivedViaBank: [null],
      creditAmount: [null],
      cashReceived: [null],
      customer: [null],
      receipts: [null],
      saleDate: [null]
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
    return selected;
  }

  get f() {
    return this.form.controls;
  }
  get ecf() {
    return this.createSaleCatform.controls;
  }
  get getBankformData() {
    return this.createBankform.controls;
  }
  get getCustomerFormData() {
    return this.customerForm.controls;
  }

  addBank() {
    this.submitted = true;
   
    if (this.createBankform.invalid) {
      return;
    }
    this.loadingBank = true;

    const bankName = this.getBankformData.bankName.value;
    const accountName = this.getBankformData.accountName.value;
    const accountNumber = this.getBankformData.accountNumber.value;
    const branch = this.getBankformData.branch.value;
    const currency = '';

    this.service
      .addBank(bankName, accountName, accountNumber, branch, currency)
      .subscribe(
        data => {
          this.toaster.successToastr('Bank created successfully', null, {
            toastTimeout: 3000
          });
          this.loadingBank = false;
          this.modalService.dismissAll();
          this.fetchBank();
        },
        error => {
          this.toaster.errorToastr('An error occured', null, {
            toastTimeout: 3000
          });
          this.loadingBank = false;
          this.alertService.error(error, true);
        }
      );
  }

  createVendor() {
    this.submitted = true;

   
    if (this.customerForm.invalid) {
      return;
    }

    this.loadingCustomer = true;

    const name = this.getCustomerFormData.name.value;
    const address = this.getCustomerFormData.address.value;
    const email = this.getCustomerFormData.email.value;
    const phoneNumber = this.getCustomerFormData.phoneNumber.value;

    this.service.createCustomer(name, phoneNumber, email, address).subscribe(
      data => {
        this.toaster.successToastr('Customer created successfully', null, {
          toastTimeout: 3000
        });
        this.loadingCustomer = false;
        this.refreshCustomerList()
        this.modalService.dismissAll();
      },
      error => {
        this.toaster.errorToastr('Customer creation failed', null, {
          toastTimeout: 3000
        });
        this.loadingCustomer = false;
        this.alertService.error(error, true);
      }
    );
  }

  onSubmit() {
    this.submitted = true;
  
    if (this.createSaleCatform.invalid) {
      return;
    }
    this.loading = true;
    const name = this.ecf.name.value;
    const categoryType = this.ecf.categoryType.value;
   
    this.service
      .createSaleCategory(name, categoryType)
      .subscribe(
        data => {
          this.toaster.successToastr(
            'Sales Category created successfully',
            null,
            { toastTimeout: 3000 }
          );
          this.modalService.dismissAll();
          this.loading = false;
          this.categories();

          this.createSaleCatform.reset();
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

  initBroadCast() {
    this.service.currentMessage.subscribe(message => {
      if (message) {
        this.expenseData = message;
        this.parentExpenseId = message;
      
      }
    });
    this.service.changeMessage('');
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
        
        }
      );
  }

  storeExpense(token = null) {
    this.expSubmitted = true;

    this.disabler = true;
    if (this.form.invalid) {
      return;
    }
    this.loadingExpense = true;
    const saleDescription = this.f.saleDescription.value;
    const category = this.f.category.value;
    const bankAccount = this.f.bankAccount.value;
    const transferFee = this.f.transferFee.value;
    const amountReceivedViaBank = this.f.amountReceivedViaBank.value;
    const creditAmount = this.f.creditAmount.value;
    const cashReceived = this.f.cashReceived.value;
    const customer = this.f.customer.value;
    const saleDate = this.f.saleDate.value;
    const cashAccount = this.f.cashAccount.value;
    this.service
      .addNewSales(
        this.paymentTypeOption,
        saleDescription,
        category._id,
        bankAccount,
        amountReceivedViaBank,
        creditAmount,
        cashReceived,
        customer,
        token,
        saleDate,
        cashAccount,
        transferFee,
        this.parentExpenseId
      )
      .subscribe(
        data => {
          this.toaster.successToastr('Sales created successfully', null, {
            toastTimeout: 4000
          });
          this.loadingExpense = false;
          this.saleCreatedSuccessfulEvent.emit(data);
          this.categories();
        },
        error => {
          this.toaster.errorToastr('Sales creation failed', null, {
            toastTimeout: 4000
          });
          this.loadingExpense = false;
          this.disabler = false;
          this.alertService.error(error, true);
        }
      );
  }

  refreshIncomeCategoryList(offset, limit) {
    this.service.getIncomeCategory(offset, limit).subscribe((data: any) => {
      if (data) {
        this.incomeCategoryList = data.data;
       
      }
    });
  }

  refreshCustomerList() {
    this.service.getCustomer().subscribe((data: any) => {
      if (data) {
        this.customerList = data.data;
         console.log(this.customerList);
      }
    });
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
}
