import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { FlxUiDataTable } from 'flx-ui-datatable';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/components/alert/alert.service';
import { AccountingService } from '../../service/accounting.service';
import { ToastrManager } from 'ng6-toastr-notifications';



@Component({
  selector: 'app-create-invoice',
  templateUrl: './create-invoice.component.html',
  styleUrls: ['./create-invoice.component.scss']
})
export class CreateInvoiceComponent implements OnInit {
  loadingInvoce = false;
  invoiceList;
  quantityValues = 0;
  priceValues = 0;
  getAmount: any[] = [];
  subtotal = null;
  amtPaid = null;
  tax = null;
  submitted = false;
  nestedForm: FormGroup;
  subForm: FormGroup;

  @Output() invoiceCreatedSuccessfulEvent = new EventEmitter();

  constructor(private _fb: FormBuilder,
    private service: AccountingService,
    private router: Router,
    private alertService: AlertService,
    private toaster: ToastrManager,
    public dataService: FlxUiDataTable) { }


  ngOnInit() {
    this.nestedForm = this._fb.group({
      senderName: [null],
      senderEmail: [null],
      senderAddress: [null, Validators.required],
      senderPhoneNumber: [null],
      senderBusinessPhoneNumber: [null],
      receiverName: [null],
      receiverEmail: [null],
      receiverAddress: [null],
      receiverPhoneNumber: [null],

      invoiceNumber: [null],
      invoiceDate: [null],
      invoiceTerms: [null],
      invoiceDueDate: [null],

      items: this._fb.array([this.itemsFormGroup()]),
      tax: [null],
      amountPaid: [null],
    });
    this.displayInvoice();
  }

  displayInvoice() {
    this.service.getInvoice().subscribe((data: any) => {
      if (data) {
        this.invoiceList = data.data;
      }
    });

  }


  itemsFormGroup() {
    return this.subForm = this._fb.group({
      itemDescription: [null],
      price: [null],
      quantity: [null],
      invoiceAmount: [null],
    });
  }

  addItem() {
    this.itemArray.push(this.itemsFormGroup());
  }
  removeItem(index) {
    if (index > 0) {
      this.itemArray.removeAt(index);
    } else {
      alert('OOPS, you can\'t remove this item!');
    }
  }

  get itemArray() { return <FormArray>this.nestedForm.get('items'); }
  get invoice() { return this.nestedForm.controls; }

  get items() { return this.subForm.controls; }


  addInvoice() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.nestedForm.invalid) {
      return;
    }
    this.loadingInvoce = true;

    const senderName = this.invoice.senderName.value;
    const senderEmail = this.invoice.senderEmail.value;
    const senderAddress = this.invoice.senderAddress.value;
    const senderPhoneNumber = this.invoice.senderPhoneNumber.value;
    const senderBusinessPhoneNumber = this.invoice.senderBusinessPhoneNumber.value;

    const receiverName = this.invoice.receiverName.value;
    const receiverEmail = this.invoice.receiverEmail.value;
    const receiverAddress = this.invoice.receiverAddress.value;
    const receiverPhoneNumber = this.invoice.receiverPhoneNumber.value;

    const invoiceNumber = this.invoice.invoiceNumber.value;
    const invoiceDate = this.invoice.invoiceDate.value;
    const invoiceDueDate = this.invoice.invoiceDueDate.value;
    const invoiceTerms = this.invoice.invoiceTerms.value;
    const tax = this.invoice.tax.value;
    const amountPaid = this.invoice.amountPaid.value;
    const items = this.invoice.items;

    this.service.createInvoice(items.value, senderName, senderEmail, senderAddress, senderPhoneNumber, senderBusinessPhoneNumber,
      receiverName, receiverEmail, receiverAddress,
      receiverPhoneNumber, invoiceNumber, invoiceDate, invoiceDueDate,
      invoiceTerms, tax, amountPaid).subscribe(
        data => {
          this.toaster.successToastr('Invoice Created Successfully', null, { toastTimeout: 3000 });
          this.loadingInvoce = false;
          this.invoiceCreatedSuccessfulEvent.emit(data);
        },
        error => {
          this.toaster.errorToastr('An error occured', null, { toastTimeout: 3000 });
          this.loadingInvoce = false;
          this.alertService.error(error, true);
        }
      );


  }



  priceValue(p: any) {
    
  }

  taxValue(event) {
    this.tax = event;
  }
  amtPaidValue(event) {
    this.amtPaid = event;
  }
  calculate(price: string, qty: string, index: number): string {
    if (price && qty) {
      if (price && qty) {
        const value = (parseInt(price, 10) * parseInt(qty, 10)).toString();
        (<FormGroup>(<FormGroup>this.nestedForm.controls['items']).controls[index]).controls['invoiceAmount'].setValue(value);
        const v = (<FormGroup>(<FormGroup>this.nestedForm.controls['items']).controls[index]).controls['invoiceAmount'].value;

        this.getAmount.push(v);
        const sum = this.getAmount.reduce(function (a, b) {
          return parseFloat(a) + parseFloat(b);
        }, 0);
        this.subtotal = sum;

        const invoiceAmt = this.getAmount.forEach(function (element) {
          return element += element;
        });
      }

    }

    return '';
  }

  convertTodate(event) {
    const d = new Date(event);
    const datestring = ('0' + (d.getMonth() + 1)).slice(-2) + '/' + ('0' + d.getDate()).slice(-2) + '/' + + d.getFullYear();
  }

}
