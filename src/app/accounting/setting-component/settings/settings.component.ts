import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/components/alert/alert.service';
import { AccountingService } from '../../service/accounting.service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  expenseCategory: any[];
  allsettings: any;
  editedSettings: any;
  settingsValues: any;
  chargeCategoryID: any;
  chargeCategoryName: any;
  addWhiteSpace: any;
  currencies = [];
  selectedCurrency:any;
  invalidrequisitionEmailError = false;
  invalidprocumentEmailError = false;
  reqEmailAlreadyExistError = false;
  procEmailAlreadyExistError = false
  procumentDefault = [];
  requisitionDefault = [];
  currencyDefault: any;
  chargeCategoryDefault:any;
  constructor(
    private service: AccountingService,
    private alertService: AlertService,
    private modalService: NgbModal,
    public toaster: ToastrManager,
    private activeModal: NgbActiveModal,
    private fb: FormBuilder,
  ) { }
  loading = false;
  details: any;
  closeResult: string;
  public form: FormGroup;
  public createExpenseCatform: FormGroup;
  subForm: FormGroup;
  loadingSettings = false;
  submitted = false;
  bl = null;
  whichPayment: string;
  bankList: any[];
  tableValue: any;
  rows = [];
  count = 0;
  offset = 0;
  limit = 10;
  
  @ViewChild('banksTabSet') refNgbTabset: NgbTabset;
  openTabs: any[] = [];

  openup(contentexpense) {
    this.modalService.open(contentexpense, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
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

  newTabHandler(): void {
    this.addToTabs();
    // focus on new tab
    this.focusOnCreatedTab();
  }

  bankSuccessHandler(vendorCreated, tabIndex: number): void {
    this.closeTab(null, tabIndex);
  }

  viewBankHandler(bank): void {
    this.addToTabs(`${bank.secret.bankName}'s Data`, bank, 'UPDATE_BANK');
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
      newTab = { title: 'New Bank', type: 'NEW_BANK' };
    } else if (type === 'VIEW_BANK') {
      newTab = { title, content: tabContent, type: 'VIEW_BANK' };
    } else {
      newTab = { title, content: tabContent, type: 'UPDATE_BANK' };
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

  onPage(offset, limit) {
    this.count = this.bankList.length;
    const start = this.offset * this.limit;
    const end = start + this.limit;
    this.rows = this.bankList;
    console.log('Page Results', start, end, this.rows);
  }

  ngOnInit() {
    this.settingsFormField();
    this.expenseCatFormFields();
    this.fetchExpenseCategory();
    this.fetchSettings();
    this.fetchCurrency();
    this.categories();
  }

  addCurrency(curr:any){
    if(curr.target.value){
    this.currencyDefault=curr.target.value;
    }
  }
  getchargeCategoryDefault(chargeCat:any){
    if(chargeCat.target.value){
      this.chargeCategoryID=chargeCat.target.value;
      }
  }

  settingsFormField() {
    this.form = this.fb.group({
      enableApprovalForProcurement: [null],
      enableBankTransferCharge: [null],
      enablerequisitionApprover: [null],
      procurementApprovers: [null],
      requisitionApprovers: [null],
      chargeCategory: [null],
      currency: [null],
    });
    this.service.getSettings().subscribe((data: any) => {
      if (data) {
      this.settingsValues = data.data[0];
      this.chargeCategoryID = this.settingsValues && this.settingsValues.chargeCategory &&
      this.settingsValues.chargeCategory._id ? this.settingsValues.chargeCategory._id : '';
      this.chargeCategoryName = this.settingsValues && this.settingsValues.chargeCategory &&
      this.settingsValues.chargeCategory.secret && this.settingsValues.chargeCategory.secret.name ?
      this.settingsValues.chargeCategory.secret.name  : '';
      this.selectedCurrency = this.settingsValues && this.settingsValues.secret && this.settingsValues.secret.currency ? this.settingsValues.secret.currency : '';
      if (this.settingsValues) {
        this.procumentDefault = this.settingsValues.secret.procurementApprovers ? this.settingsValues.secret.procurementApprovers : [];
        this.requisitionDefault = this.settingsValues.secret.requisitionApprovers ? this.settingsValues.secret.requisitionApprovers : [];
      this.currencyDefault = this.settingsValues && this.settingsValues.secret && this.settingsValues.secret.currency ? this.settingsValues.secret.currency :'';
      this.chargeCategoryDefault = this.settingsValues && this.settingsValues.chargeCategory && this.settingsValues.chargeCategory.secret ? this.settingsValues.chargeCategory.secret.name : '';
    }
        this.form.setValue({
          enableApprovalForProcurement: 'true', // data.data[0].secret.enableApprovalForProcurement,
          enableBankTransferCharge: 'true', //data.data[0].secret.enableBankTransferCharge,
          enablerequisitionApprover: 'true',
          procurementApprovers: this.settingsValues && this.settingsValues.secret && this.settingsValues.secret.procurementApprovers ? '': '',
         requisitionApprovers: this.settingsValues && this.settingsValues.secret && this.settingsValues.secret.requisitionApprovers ? '': '',
          chargeCategory: this.settingsValues && this.settingsValues.chargeCategory && this.settingsValues.chargeCategory.secret ? '' : '',
          currency: this.settingsValues && this.settingsValues.secret && this.settingsValues.secret.currency ? '' : '',
        });
      }
    });
  }
  
  get settings() { return this.form.controls; }

  fetchExpenseCategory() {
    this.service.getExpenseCategory().subscribe((data: any) => {
      if (data) {
        this.expenseCategory = data.data;
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

  fetchSettings() {
    this.service.getSettings().subscribe((data: any) => {
      if (data) {
        this.allsettings = data.data;
      }
    });
  }





  addSettings() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    this.loadingSettings = true;

    const chargeCategory = this.settings.chargeCategory.value;
    const enableBankTransferCharge = this.settings.enableBankTransferCharge.value;
    const enableApprovalForProcurement = this.settings.enableApprovalForProcurement.value;
    const enablerequisitionApprover = this.settings.enablerequisitionApprover.value;
    const procurementApprovers: string = this.settings.procurementApprovers.value;
    const requisitionApprovers: string = this.settings.requisitionApprovers.value;
    const currency = this.settings.currency.value;
    let procurementApproverArray = []
    let requisitionApprovalArray = []
    if(typeof(procurementApprovers) === 'string') {
      procurementApprovers.split(',').map(val => val.trim()).forEach(trimmed => {
        if (this.ValidateEmail(trimmed)) {
          procurementApproverArray.push(trimmed)
        } 
      })
    } else {
      procurementApproverArray = procurementApprovers;
    }

    if (typeof (requisitionApprovers) === 'string') {
      requisitionApprovers.split(',').map(val => val.trim()).forEach(trimmed => {
        if (this.ValidateEmail(trimmed)) {
          requisitionApprovalArray.push(trimmed);
        } 
      })
    } else {
      requisitionApprovalArray = requisitionApprovers;
    }

    this.service.settings(
      this.chargeCategoryID,
      enableBankTransferCharge,
      enableApprovalForProcurement,
      enablerequisitionApprover,
      this.procumentDefault,
      this.requisitionDefault,
      this.currencyDefault,
      ).subscribe(
        data => {
          this.fetchSettings();
          this.toaster.successToastr('Settings updated Successfully', null, { toastTimeout: 3000 });
          this.loadingSettings = false;
          this.settingsFormField();
        },
        error => {
          this.toaster.errorToastr(error, null, { toastTimeout: 10000 });
          this.alertService.error(error, true);
          this.loadingSettings = false;

        }
      );
  }

  forceResize(tabChangeEvent, idOfTable: string): void {
    if (tabChangeEvent['nextId'] === idOfTable) {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 10);
    }
  }

  removeMailRequi(index) {
    this.requisitionDefault.splice(index , 1);
     console.log(index);
   }
   
 checkReqEmail(mail){
  this.reqEmailAlreadyExistError = false;
   if(this.requisitionDefault.indexOf(mail) == -1){
    this.requisitionDefault.push(mail);
    this.reqEmailAlreadyExistError = false;
   }else{
     this.reqEmailAlreadyExistError = true;
   }
 }
   addReqEMail() {
   // let keycodeVal = event.keyCode;
    //console.log(keycodeVal);
    this.invalidrequisitionEmailError = false;
    if (this.form.get('requisitionApprovers').value.length) {
      const email = this.form.get('requisitionApprovers').value;
      if (this.ValidateEmail(email) ) {
        this.invalidrequisitionEmailError = false;
        this.checkReqEmail(email)
        this.form.get('requisitionApprovers').reset();
          } else {
            this.invalidrequisitionEmailError = true;
      }
      console.log(this.form.get('requisitionApprovers').value);
    }
  }


  removeMailProc(index) {
    this.procumentDefault.splice(index , 1);
     console.log(index);
   }
 
   checkProcEmail(mail){
    this.procEmailAlreadyExistError = false;
     if(this.procumentDefault.indexOf(mail) == -1){
      this.procumentDefault.push(mail);
      this.procEmailAlreadyExistError = false;
     }else{
       this.procEmailAlreadyExistError = true;
     }
   }

  addEMail() {
    this.invalidprocumentEmailError = false;
    if (this.form.get('procurementApprovers').value.length) {
      const email = this.form.get('procurementApprovers').value;
      if (this.ValidateEmail(email)) {
        this.invalidprocumentEmailError = false;
        this.checkProcEmail(email);
        this.form.get('procurementApprovers').reset();
          } else {
            this.invalidprocumentEmailError = true;
      }
      console.log(this.form.get('procurementApprovers').value);
    }
  }
  ValidateEmail(inputText) {
    const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (inputText.match(mailformat)) {
      return true;
  } else {
    return false;
  }
}

categories() {
  this.service.getExpenseCategory().subscribe((data: any) => {
    if (data) {
      this.expenseCategory = data.data;
    }
  });
}

expenseCatFormFields() {
  this.createExpenseCatform = this.fb.group({
    name: [null, Validators.compose([Validators.required])],
    categoryType: [null],
    parentCategory: [null],
  });
}
get ecf() { return this.createExpenseCatform.controls; }

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
