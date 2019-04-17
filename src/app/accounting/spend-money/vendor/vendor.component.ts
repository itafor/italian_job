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
import { AlertService } from 'src/app/components/alert/alert.service';
import { AccountingService } from '../../service/accounting.service';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.scss']
})
export class VendorComponent implements OnInit {
  @Output() vendorUpdatedSuccessfulEvent = new EventEmitter();

  constructor(
    private service: AccountingService,
    private alertService: AlertService,
    private modalService: NgbModal,
    public toaster: ToastrManager,
    private activeModal: NgbActiveModal
  ) {}

  loading = false;
  details: any;
  closeResult: string;
  vendorDataForUpdate = null;
  vendorList: any[];
  tableValue: any;
  vendorListToUpdate = null;
  suspendingState = false;
  responsemsg;
  rows = [];
  count = 0;
  offset = 0;
  limit = 20;
  @ViewChild('vendorsTabSet') refNgbTabset: NgbTabset;
  openTabs: any[] = [];

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
    this.addToTabs(`${vendor.secret.name}'s Data`, vendor, 'UPDATE_VENDOR');
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
      newTab = { title: 'New Vendor', type: 'NEW_VENDOR' };
    } else if (type === 'VIEW_VENDOR') {
      newTab = { title, content: tabContent, type: 'VIEW_VENDOR' };
    } else {
      newTab = { title, content: tabContent, type: 'UPDATE_VENDOR' };
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
    this.getVendors();
  }

  onPage(offset, limit) {
    this.count = this.vendorList.length;
    const start = this.offset * this.limit;
    const end = start + this.limit;
    this.rows = this.vendorList;
    console.log('Page Results', start, end, this.rows);
  }

  getVendors() {
    this.service.getVendor().subscribe((data: any) => {
      if (data) {
        this.vendorList = data.data;
        console.log(this.vendorList);
      }

      this.onPage(this.offset, this.limit);
    });
  }

  VendorUpdate(updatecustomerForm, tabIndex: number) {
    if (updatecustomerForm.valid) {
      this.loading = true;
      this.service
        .updateVendor(
          this.vendorDataForUpdate._id,
          this.vendorDataForUpdate.secret.name,
          this.vendorDataForUpdate.secret.phoneNumber,
          this.vendorDataForUpdate.secret.email,
          this.vendorDataForUpdate.secret.address
        )
        .subscribe(
          data => {
            this.closeTab(null, tabIndex);
            this.toaster.successToastr(
              'Selected Vendor Updated successfully',
              null,
              { toastTimeout: 3000 }
            );
            this.getVendors();
            this.loading = false;
            this.vendorUpdatedSuccessfulEvent.emit(data);
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

  getVendor(content, dataRow) {
    this.addToTabs('Edit Vendor', content, 'UPDATE_VENDOR');
    this.focusOnCreatedTab();
    this.vendorDataForUpdate = dataRow;
  }

  suspend(id: number) {
    if (confirm('Are you sure you want to suspend the selected vendor?')) {
      this.suspendingState = true;
      this.service
        .suspendVendor(id)
        .pipe()
        .subscribe(
          data => {
            this.toaster.successToastr('Vendor Suspended', null);
            this.responsemsg = data;
            this.suspendingState = false;
            console.log(data);
            this.getVendors();
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
    if (confirm('Are you sure you want to suspend the selected vendor?')) {
      this.suspendingState = true;
      this.service
        .unsuspendVendor(id)
        .pipe()
        .subscribe(
          data => {
            this.toaster.successToastr(
              'Selected vendor deleted successfully',
              null,
              { toastTimeout: 3000 }
            );
            this.getVendors();
          },
          error => {
            this.toaster.errorToastr(
              'An error occured, Attempt to delete vendor failed',
              null,
              { toastTimeout: 3000 }
            );
          }
        );
    }
  }

  deleteVendor(id: number) {
    if (
      confirm(
        'Are you sure you want to permanently delete the selected vendor?'
      )
    ) {
      this.service.removeVendor(id).subscribe(
        data => {
          this.toaster.successToastr(
            'Selected vendor deleted successfully',
            null,
            { toastTimeout: 3000 }
          );
          this.getVendors();
        },
        error => {
          this.toaster.errorToastr(
            'An error occured, Attempt to delete vendor failed',
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
