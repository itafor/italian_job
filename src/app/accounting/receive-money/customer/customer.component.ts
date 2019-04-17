import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { AccountingService } from '../../service/accounting.service';
import { AlertService } from 'src/app/components/alert/alert.service';
import { ToastrManager } from 'ng6-toastr-notifications';

interface CustomersResponse {
  customers: any[];
}

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  constructor(
    private service: AccountingService,
    private alertService: AlertService,
    private modalService: NgbModal,
    public toaster: ToastrManager,
    private activeModal: NgbActiveModal
  ) {}
  customerList: any[];
  tableValue: any;
  rows = [];
  count = 0;
  offset = 0;
  limit = 10;
  closeResult: string;
  loading = false;
  customerDataForUpdate = null;
  suspendingState = false;
  responsemsg;
  openTabs: any[] = [];
  @ViewChild('customersTabSet') refNgbTabset: NgbTabset;

  newTabHandler(): void {
    this.addToTabs();
    // focus on new tab
    this.focusOnCreatedTab();
  }

  customerSuccessHandler(customerCreated, tabIndex: number): void {
    this.closeTab(null, tabIndex);
    this.refreshCustomerList();
  }

  viewCustomerHandler(customer): void {
    this.addToTabs(
      `${customer.secret.name}'s Data`,
      customer,
      'UPDATE_CUSTOMER'
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
      newTab = { title: 'New Customer', type: 'NEW_CUSTOMER' };
    } else if (type === 'VIEW_CUSTOMER') {
      newTab = { title, content: tabContent, type: 'VIEW_CUSTOMER' };
    } else {
      newTab = { title, content: tabContent, type: 'UPDATE_CUSTOMER' };
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
    this.refreshCustomerList();
  }

  refreshCustomerList() {
    this.service.getCustomer().subscribe((data: any) => {
      if (data) {
        this.customerList = data.data;
        console.log(this.customerList);
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
    this.count = this.customerList.length;
    const start = this.offset * this.limit;
    const end = start + this.limit;
    this.rows = this.customerList;
  }

  delete(row) {
    this.rows.splice(row, 1);
  }

  preview(row) {}

  customerUpdate(updatecusForm, tabIndex: number) {
    if (updatecusForm.valid) {
      this.loading = true;
      this.service
        .updateCustomer(
          this.customerDataForUpdate._id,
          this.customerDataForUpdate.secret.name,
          this.customerDataForUpdate.secret.phoneNumber,
          this.customerDataForUpdate.secret.email,
          this.customerDataForUpdate.secret.address
        )
        .subscribe(
          data => {
            this.closeTab(null, tabIndex);
            this.toaster.successToastr(
              'Selected Customer Updated successfully',
              null,
              { toastTimeout: 3000 }
            );
            this.refreshCustomerList();
            this.loading = false;
          },
          error => {
            this.toaster.errorToastr('An error occured', null, {
              toastTimeout: 3000
            });
            this.alertService.error(error, true);
            this.loading = false;
          }
        );
    } else {
      return;
    }
  }

  getCusstomer(content, dataRow) {
    this.addToTabs('Edit Customer', content, 'UPDATE_CUSTOMER');
    this.focusOnCreatedTab();
    this.customerDataForUpdate = dataRow;
  }

  deleteCustomer(id: number) {
    if (
      confirm(
        'Are you sure you want to permanently delete the selected customer?'
      )
    ) {
      this.service.removeCustomer(id).subscribe(
        data => {
          this.toaster.successToastr(
            'Selected Customer Deleted Successfully',
            null,
            { toastTimeout: 3000 }
          );
          this.refreshCustomerList();
        },
        error => {
          this.toaster.errorToastr(
            'An error occured, Attempt to delete Customer failed',
            null,
            { toastTimeout: 3000 }
          );
        }
      );
    }
  }

  suspend(id: number) {
    if (confirm('Are you sure you want to suspend the selected customer?')) {
      this.suspendingState = true;
      this.service
        .suspendCustomer(id)
        .pipe()
        .subscribe(
          data => {
            this.toaster.successToastr('Customer Suspended Successfully', null);
            this.responsemsg = data;
            this.suspendingState = false;
            console.log(data);
            this.refreshCustomerList();
          },
          error => {
            this.responsemsg = error;
            this.toaster.errorToastr(
              'Error: Unable To Perform Operation',
              null
            );
            this.suspendingState = false;
          }
        );
    }
  }

  unsuspend(id: number) {
    if (confirm('Are you sure you want to unsuspend the selected customer?')) {
      this.suspendingState = true;
      this.service
        .unsuspendCustomer(id)
        .pipe()
        .subscribe(
          data => {
            this.toaster.successToastr(
              'Customer Unsuspended Successfully',
              null
            );
            this.responsemsg = data;

            this.suspendingState = false;
            console.log(data);
            this.refreshCustomerList();
          },
          error => {
            this.responsemsg = error;
            this.toaster.errorToastr('Customer unsuspension failed', null);
            this.suspendingState = false;
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
