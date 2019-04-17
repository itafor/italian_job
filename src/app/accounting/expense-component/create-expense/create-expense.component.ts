import {
  NgbModal,
  NgbActiveModal,
  ModalDismissReasons
} from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { FlxUiDataTable } from 'flx-ui-datatable';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/components/alert/alert.service';
import { AccountingService } from '../../service/accounting.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-create-expense',
  templateUrl: './create-expense.component.html',
  styleUrls: ['./create-expense.component.scss']
})
export class CreateExpenseComponent implements OnInit {
  bank = false;
  cash = false;
  credit = false;
  card = false;
  allsettings:any;
  selectedCurrency:any;
  bankCurrency:any;
  // bkval= 'initValue';
  // apvb='initValue';
  public expenseCategory;
  public vendorList;
  public cashAccountList;
  public cardList;
  public form: FormGroup;
  public createExpenseCatform: FormGroup;
  public createBankform: FormGroup;
  public vendorForm: FormGroup;
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
  disabler;
  currencies = [];
  bankexchange = false;
  cashexchange = false;
  cardExchange = false;

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
    this.vendorForm.reset();
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
    console.log('Click');
    this.bank = !this.bank;
    console.log('bank togger:', this.bank)
    if(this.bank == false){
      this.form.get('amountPaidViaBank').reset();
    }
    if(this.bank == false){
      this.form.get('bankAccount').reset();
    }
  }
  
  toggleCash() {
    this.cash = !this.cash;
    if(this.cash == false){
      this.form.get('cashPaid').reset();
    }
    if(this.cash == false){
      this.form.get('cashAccount').reset();
    }
  }

  toggleCredit() {
    this.credit = !this.credit;
    if(this.credit == false){
      this.form.get('creditAmount').reset();
    }
  }

  toggleCard(){
    this.card = !this.card;
    if(this.card == false){
      this.form.get('amountPaidViaCard').reset();
    }
    if(this.card== false){
      this.form.get('cardId').reset();
    }
   
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

  initbankexchangerate(event){
    let bankid = event.target.value;
    this.bankexchange = false;
    Object.keys(this.bankList).map(field => {
      if(this.bankList[field]._id == bankid && this.bankList[field].secret.currency != 
        this.allsettings.secret.currency){
        this.bankexchange = true;
      }
    });
  }

  initCashexchangerate(event){
    let cashid = event.target.value;
    console.log(cashid)
    this.cashexchange = false;
    Object.keys(this.cashAccountList).map(field => {
      console.log(this.cashAccountList[field]._id);
      if(this.cashAccountList[field]._id == cashid && this.cashAccountList[field].secret.currency != 
        this.allsettings.secret.currency){
        this.cashexchange = true;
      }
    });
  }

  
  initCardexchangerate(event){
    let cardid = event.target.value;
    console.log(cardid)
    this.cardExchange = false;
    Object.keys(this.cardList).map(field => {
      console.log(this.cardList[field]._id);
      if(this.cardList[field]._id == cardid && this.cardList[field].secret.currency != 
        this.allsettings.secret.currency){
        this.cardExchange = true;
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
    this.getCard();
    this.getCashAccount();
    this.fetchCurrency();
    this.fetchSettings();
  }
  fetchSettings() {
    this.service.getSettings().subscribe((data: any) => {
      if (data) {
        this.allsettings = data.data[0];
        this.selectedCurrency= this.allsettings && this.allsettings.secret && this.allsettings.secret.currency ? this.allsettings.secret.currency : '';
      }
    });
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
        this.parentExpenseId = message;
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
    this.vendorForm = this.fb.group({
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
      branch: [null],
      currency: [null],
    });
  }

  getCurrency(currency:any){
this.bankCurrency= currency;
  }
  expenseFormFields() {
    this.form = this.fb.group({
      paymentTypeBank: [null],
      paymentTypeCredit: [null],
      paymentTypeCash: [null],
      paymentTypeCard: [null],
      expenseDescription:[null, Validators.compose([Validators.required])],
      category:  [null, Validators.compose([Validators.required])],
      bankAccount: [null],
      transferFee: [null],
      amountPaidViaBank:  [null],
      creditAmount:  [null],
      cashPaid: [null],
      vendor: [null],
      receipts: [null],
      expenseDate: [''],
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

  get f() { return this.form.controls; }
  get ecf() { return this.createExpenseCatform.controls; }
  get getBankformData() { return this.createBankform.controls; }
  get getVendorformData() { return this.vendorForm.controls; }

  
   
  // Bank Account and amount paid via bank custom validation
  get getamountPaidViaBank(){
    return this.form.get('amountPaidViaBank');
  }
  get getbankAccount(){
    return this.form.get('bankAccount');
  }
  triggePaymentTypeBankValidator(){
    if (this.bank) {
      this.getamountPaidViaBank.setValidators(this.bankValidator);
      this.getamountPaidViaBank.updateValueAndValidity();

      this.getbankAccount.setValidators(this.bankValidator);
      this.getbankAccount.updateValueAndValidity();

      
    } else {
      this.getamountPaidViaBank.setValidators(null);
      this.getamountPaidViaBank.updateValueAndValidity();

      this.getbankAccount.setValidators(null);
      this.getbankAccount.updateValueAndValidity();
    }
   }
 
   bankValidator(control: AbstractControl) {
     console.log(control);
       if(control) {
         const paymentBank = control.root.get('paymentTypeBank');
         if(paymentBank) {
          if(control.value === null || control.value === undefined || control.value === '' ){
            return {'bankAccount_error': 'This field is required'};
          }
        }
     }
     return null;
   }

  // Cash account and cash paid custom validation
  get getcashPaid(){
    return this.form.get('cashPaid');
  }
  get getcashAccount(){
    return this.form.get('cashAccount');
  }
  triggePaymentTypeCashValidator(){
    if (this.cash) {
      this.getcashPaid.setValidators(this.cashValidator);
      this.getcashPaid.updateValueAndValidity();

      this.getcashAccount.setValidators(this.cashValidator);
      this.getcashAccount.updateValueAndValidity();

      
    } else {
      this.getcashPaid.setValidators(null);
      this.getcashPaid.updateValueAndValidity();

      this.getcashAccount.setValidators(null);
      this.getcashAccount.updateValueAndValidity();
    }
   }
 
   cashValidator(control: AbstractControl) {
     console.log(control);
       if(control) {
         const paymentCash = control.root.get('paymentTypeCash');
         if(paymentCash) {
          if(control.value === null || control.value === undefined || control.value === '' ){
            return {'cash_error': 'This field is required'};
          }
        }
     }
     return null;
   }


   
   
  // creditAmount custom validation
  get getCreditAmount(){
    return this.form.get('creditAmount');
  }

  triggePaymentTypeCreditValidator(){
    if (this.credit) {
      this.getCreditAmount.setValidators(this.creditValidator);
      this.getCreditAmount.updateValueAndValidity();
    } else {
      this.getCreditAmount.setValidators(null);
      this.getCreditAmount.updateValueAndValidity();
    }
   }
 
   creditValidator(control: AbstractControl) {
       if(control) {
         const paymentCredit = control.root.get('paymentTypeCredit');
         if(paymentCredit) {
          if(control.value === null || control.value === undefined || control.value === '' ){
            return {'creditAmount_error': 'This field is required'};
          }
        }
     }
     return null;
   }
   
   
  // getamountPaidViaCard and getcardDescription custom validation
  get getamountPaidViaCard(){
    return this.form.get('amountPaidViaCard');
  }
  get getcardDescription(){
    return this.form.get('cardId');
  }
  triggePaymentTypeCardValidator(){
    if (this.card) {
      this.getamountPaidViaCard.setValidators(this.cardValidator);
      this.getamountPaidViaCard.updateValueAndValidity();

      this.getcardDescription.setValidators(this.cardValidator);
      this.getcardDescription.updateValueAndValidity();
      
    } else {
      this.getamountPaidViaCard.setValidators(null);
      this.getamountPaidViaCard.updateValueAndValidity();

      this.getcardDescription.setValidators(null);
      this.getcardDescription.updateValueAndValidity();
    }
   }
 
   cardValidator(control: AbstractControl) {
     console.log(control);
       if(control) {
         const paymentCard = control.root.get('paymentTypeCard');
         if(paymentCard) {
          if(control.value === null || control.value === undefined || control.value === '' ){
            return {'creditCard_error': 'This field is required'};
          }
        }
     }
     return null;
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
    const currency = this.getBankformData.currency.value;
    this.service.addBank(bankName, accountName, accountNumber, branch, currency)
        .subscribe(
          data => {
            this.toaster.successToastr('Bank created successfully', null, {toastTimeout: 3000} );
            this.loadingBank = false;
            this.modalService.dismissAll();
            this.fetchBank();
          },
          error => {
            this.toaster.errorToastr('An error occured', null, {toastTimeout: 3000} );
            this.loadingBank = false;
            this.alertService.error(error, true);
          });
  }


  createVendor() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.vendorForm.invalid) {
        return;
    }

    this.loadingVendor = true;

    const name = this.getVendorformData.name.value;
    const address = this.getVendorformData.address.value;
    const email = this.getVendorformData.email.value;
    const phoneNumber = this.getVendorformData.phoneNumber.value;

    this.service.createVendor(name, phoneNumber, email, address)
        .subscribe(
          data => {
            this.toaster.successToastr('Vendor created successfully', null,{toastTimeout: 3000});
            this.loadingVendor = false;
            this.modalService.dismissAll();
            this.vendors();
          },
          error => {
            this.toaster.errorToastr('Vendor creation failed', null, {toastTimeout: 3000});
            this.loadingVendor = false;
            this.alertService.error(error, true);
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

    this.disabler = true;
    if (this.form.invalid) {
      return;
    }
    this.loadingExpense = true;
    const expenseDescription = this.f.expenseDescription.value;
    const category = this.f.category.value;
    const bankAccount = this.f.bankAccount.value;
    const transferFee = this.f.transferFee.value;
    const amountPaidViaBank = this.f.amountPaidViaBank.value;
    const amountPaidViaCard = this.f.amountPaidViaCard.value;
    const cardDescription = this.f.cardDescription.value;
    const cashAccount = this.f.cashAccount.value;
    
    const cardId = this.f.cardId.value;
    
    const creditAmount = this.f.creditAmount.value;
    const cashPaid = this.f.cashPaid.value;
    const vendor = this.f.vendor.value;
    const expenseDate = this.f.expenseDate.value;
    const bankAccountExchangeRate = this.f.bankAccountExchangeRate.value;
    const cashAccountExchangeRate = this.f.cashAccountExchangeRate.value;
    const cardAccountExchangeRate = this.f.cardAccountExchangeRate.value;
    
    this.service.addNewExpense(this.paymentTypeOption, expenseDescription, category, bankAccount,
      amountPaidViaBank,creditAmount, cashPaid, vendor, token, expenseDate, transferFee, this.parentExpenseId,
      amountPaidViaCard,cardDescription,cardId,cashAccount,bankAccountExchangeRate,cashAccountExchangeRate,cardAccountExchangeRate)
      .subscribe(
        data => {
          this.toaster.successToastr('Expense created successfully', null, {
            toastTimeout: 4000
          });
          this.loadingExpense = false;
          this.expenseCreatedSuccessfulEvent.emit(data);
          this.categories();
          console.log('Expense Data: ' + data);
        },
        error => {
          this.toaster.errorToastr(error, null, {
            toastTimeout: 10000
          });
          this.loadingExpense = false;
          this.disabler = false;
          this.alertService.error(error, true);
        }
      );
  }
  
  getExpenseCategoryDisplayName(identity){
    if(identity == 'expenseOnDirectCosts'){
      return 'Expense On Direct Costs';
    }else if(identity == 'expenseOnFixedAssets'){
      return 'Expense On Fixed Assets';
    }else if(identity == 'expenseOnCurrentAssets'){
      return 'Expense On Current Assets';
    }else if(identity == 'generalOperatingExpense'){
      return 'General Operating Expense';
    }
    return;
  }

 subForm(){
   console.log(this.form);
 }

}
