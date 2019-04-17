import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter
} from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { AccountingService } from '../../service/accounting.service';
import { AlertService } from 'src/app/components/alert/alert.service';

interface SalesResponse {
  sales: any[];
}

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit {
  @Output() saleUpdatedSuccessfulEvent = new EventEmitter();
  constructor(
    private service: AccountingService,
    private alertService: AlertService,
    private modalService: NgbModal,
    private router: Router,
    private toaster: ToastrManager,
    private activeModal: NgbActiveModal
  ) {}
  salesList: any[];
  tableValue: any;
  rows = [];
  count = 0;
  offset = 0;
  limit = 20;
  closeResult: string;
  sl = null;
  loadingSale = false;
  loading = false;
  el: any;
  public saleCategory;
  customerList: any[];
  incomeCategoryList: any[];
  bankList: any;
  bank = false;
  cash = false;
  credit = false;
  card = false;
  creditcard = false;
  showCredit = false;

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
  @ViewChild('saleTabSet') refNgbTabset: NgbTabset;

  newTabHandler(): void {
    this.addToTabs();
  
    this.focusOnCreatedTab();
  }

  saleSuccessHandler(saleCreated, tabIndex: number): void {
    this.closeTab(null, tabIndex);
    this.fetchSales();
  }

  paymentTypeIsSelected(paymentTypes: string[], paymentType: string): boolean {
    return paymentTypes.indexOf(paymentType) > -1;
  }
  getPayemntSelected(check) {
    if (check) {
      return true;
    } else {
      return false;
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

  fetchBank() {
    this.service.getBank().subscribe((data: any) => {
      if (data) {
        this.bankList = data.data;
      }
    });
  }

  editSaleSuccessHandler(saleCreated, tabIndex: number): void {
    this.closeTab(null, tabIndex);
    this.fetchSales();
  }

  viewSaleHandler(event?: Event, data?: any): void {
    if (event) {
      event.preventDefault();
    }
    this.addToTabs(`${data.secret.name}'s Data`, data);
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
      newTab = { title: 'New Sales', type: 'NEW_SALE' };
    } else if (type === 'VIEW_SALE') {
      newTab = { title, content: tabContent, type: 'VIEW_SALE' };
    } else {
      newTab = { title, content: tabContent, type: 'UPDATE_SALE' };
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
    this.fetchSales();
    this.fetchBank();
    this.refreshIncomeCategoryList(this.offset, this.limit);
    this.refreshCustomerList();
  }

  refreshCustomerList() {
    this.service.getCustomer().subscribe((data: any) => {
      if (data) {
        this.customerList = data.data;
        console.log(this.customerList);
      }
    });
  }

  refreshIncomeCategoryList(offset, limit) {
    this.service.getIncomeCategory(offset, limit).subscribe((data: any) => {
      if (data) {
        this.incomeCategoryList = data.data;
        console.log(data);
      }
    });
  }

  fetchSales() {
    this.service.getSales(this.offset, this.limit).subscribe((data: any) => {
      if (data) {
        this.salesList = data.data;
        this.saleCategory = data.data;
        console.log(this.salesList);
      }

      if (data.data.length == 0) {
        this.tableValue = 'hasNoValue';
      } else {
        this.tableValue = 'hasValue';
      }
      this.onPage(this.offset, this.limit);
    });
  }
  onPage(offset, limit) {
    this.count = this.salesList.length;
    const start = this.offset * this.limit;
    const end = start + this.limit;
    this.rows = this.salesList;
    console.log('Page Results', start, end, this.rows);
  }

  getStrToInt(str: string) {
    let toInt = 0;
    if (typeof str === 'string') {
      toInt = parseFloat(str);
    }
    return toInt;
  }

  goToViewExpense() {
    this.router.navigate(['accounting/view-sales']);
  }

  delete(row) {
    this.rows.splice(row, 1);
  }

  preview(row) {}

  saleUpdate(tabIndex: number) {
    this.loadingSale = true;
    this.service
      .updateSales(
        this.sl._id,
        this.sl.secret.paymentType,
        this.sl.secret.saleDescription,
        this.sl.category._id,
        this.sl && this.sl.bankAccount && this.sl.bankAccount._id ? this.sl.bankAccount._id : '',
        parseInt(this.sl.secret.creditAmount),
        parseInt(this.sl.secret.amountReceivedViaBank),
        parseInt(this.sl.secret.cashReceived),
        this.sl.customer._id,
        this.sl.saleDate
      )
      .subscribe(
        data => {
          this.closeTab(null, tabIndex);
          this.toaster.successToastr('Sales updated successfully', null, {
            toastTimeout: 3000
          });
          this.saleUpdatedSuccessfulEvent.emit(data);
          this.loadingSale = false;
        },
        error => {
          this.toaster.errorToastr('An error occured', null, {
            toastTimeout: 3000
          });
          this.loadingSale = false;
          this.alertService.error(error, true);
        }
      );
  }

  getSale(content, dataRow) {
    this.addToTabs('Edit Sales', content, 'UPDATE_SALES');
    this.focusOnCreatedTab();
    this.sl = dataRow;
  }

  viewSale(content, dataRow) {
    this.service.changeMessage(dataRow);
    this.addToTabs('View Sales', content, 'VIEW_SALE');
    this.focusOnCreatedTab();
    this.el = dataRow;
  }

  deleteSales(id: number) {
    if (
      confirm(
        'Are you sure you want to permanently delete the selected  sales?'
      )
    ) {
      this.service.removeSales(id).subscribe(
        data => {
          this.toaster.successToastr(
            'Selected Sale Category Deleted Successfully',
            null,
            { toastTimeout: 3000 }
          );
          this.fetchSales();
        },
        error => {
          this.toaster.errorToastr(
            'An error occured while Attempting to Delete Sales ',
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
}
