import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { FlxUiDataTable } from 'flx-ui-datatable';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/components/alert/alert.service';
import { AccountingService } from '../../service/accounting.service';
import { ToastrModule, ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.scss']
})
export class BankComponent implements OnInit {
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
  bl = null;
  bankList: any[];
  tableValue: any;
  rows = [];
  count = 0;
  offset = 0;
  limit = 20;
  @ViewChild('banksTabSet') refNgbTabset: NgbTabset;
  openTabs: any[] = [];

  newTabHandler(): void {
    this.addToTabs();
    // focus on new tab
    this.focusOnCreatedTab();
  }

  bankSuccessHandler(vendorCreated, tabIndex: number): void {
    this.closeTab(null, tabIndex);
    this.fetchBank();
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

  ngOnInit() {
    this.fetchBank();
  }

  onPage(offset, limit) {
    this.count = this.bankList.length;
    const start = this.offset * this.limit;
    const end = start + this.limit;
    this.rows = this.bankList;
    console.log('Page Results', start, end, this.rows);
  }

  delete(row) {
    this.rows.splice(row, 1);
  }

  preview(row) {}

  fetchBank() {
    this.service.getBank().subscribe((data: any) => {
      if (data) {
        this.bankList = data.data;
        console.log(this.bankList);
      }

      if (data.data.length == 0) {
        this.tableValue = 'hasNoValue';
      } else {
        this.tableValue = 'hasValue';
      }
      this.onPage(this.offset, this.limit);
    });
  }

  bankUpdate(updatecustomerForm, tabIndex: number) {
    if (updatecustomerForm.valid) {
      this.loading = true;
      this.service
        .updateBank(
          this.bl._id,
          this.bl.secret.bankName,
          this.bl.secret.accountName,
          this.bl.secret.accountNumber,
          this.bl.secret.branch
        )
        .subscribe(
          data => {
            this.closeTab(null, tabIndex);
            this.toaster.successToastr(
              'Selected Bank Updated Successfully',
              null,
              { toastTimeout: 3000 }
            );
            this.fetchBank();
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

  getBank(content, dataRow) {
    this.addToTabs('Edit Bank', content, 'UPDATE_BANK');
    this.focusOnCreatedTab();
    this.bl = dataRow;
  }

  deleteBank(id: number) {
    if (
      confirm('Are you sure you want to permanently delete the selected bank?')
    ) {
      this.service.removeBank(id).subscribe(
        data => {
          this.toaster.successToastr(
            'Selected Bank Deleted Successfully',
            null,
            { toastTimeout: 3000 }
          );
          this.fetchBank();
        },
        error => {
          this.toaster.errorToastr(
            'An error occured, Attempt to delete Bank failed',
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
