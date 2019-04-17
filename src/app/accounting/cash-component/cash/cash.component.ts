import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { AccountingService } from '../../service/accounting.service';
import { AlertService } from 'src/app/components/alert/alert.service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-cash',
  templateUrl: './cash.component.html',
  styleUrls: ['./cash.component.scss']
})
export class CashComponent implements OnInit {

  constructor(
    private service: AccountingService,
    private toaster: ToastrManager,
    private alertService: AlertService
  ) { }


  cashAccountList: any[];
  tableValue: any;
  rows = [];
  count = 0;
  offset = 0;
  limit = 20;
  loading = false;
  chosen;
  submitting;

  ngOnInit() {
    this.reloadCashAccountList()
  }


  openTabs: any[] = [];
  @ViewChild('cashAccountTabset') refNgbTabset: NgbTabset;

  // newTabHandler(): void {
  //   this.addToTabs();
  //   // focus on new tab
  //   this.focusOnCreatedTab();
  // }

  CashAccountSuccessHandler(expenseCategoryCreated, tabIndex: number): void {
    this.closeTab(null, tabIndex);
    this.reloadCashAccountList();
  }

  reloadCashAccountList() {
    this.service.getCashAccount().subscribe((data: any) => {
      if (data) {
        this.cashAccountList = data.data;
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
    this.count = this.cashAccountList.length;
    const start = this.offset * this.limit;
    const end = start + this.limit;
    this.rows = this.cashAccountList;
    console.log('Page Results', start, end, this.rows);
  }


  addToTabs(title?: string, tabContent?: any, type?: string): void {
    let newTab;
    if (!title) {
      newTab = { title: 'New Cash Account', type: 'NEW_CASH_ACCOUNT' };
    } else if (type === 'VIEW_CASH_ACCOUNT') {
      newTab = { title, content: tabContent, type: 'VIEW_CASH_ACCOUNT' };
    } else {
      newTab = { title, content: tabContent, type: 'UPDATE_CASH_ACCOUNT' };
    }
    this.openTabs.push(newTab);
  }

  removeFromTab(index: number): void {
    this.openTabs.splice(index, 1);
  }

  focusOnCreatedTab() {
    setTimeout(() => {
      this.refNgbTabset.select(this.latestTabId);
    }, 50);
  }

  get latestTabId(): string {
    return `tab-id-${this.openTabs.length - 1}`;
  }
  tabIdForIndex(index: number): string {
    return `tab-id-${index}`;
  }

  forceResize(tabChangeEvent, idOfTable: string): void {
    if (tabChangeEvent['nextId'] === idOfTable) {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 10);
    }
  }

  closeTab(event?: MouseEvent, index?: number): void {
    if (event) {
      event.preventDefault();
    }
    this.removeFromTab(index);
  }

  editCashAccount(content, dataRow) { if (this.updateCashAccountNewTab()) {
    this.addToTabs('Edit Cash Account', content, 'UPDATE_CASH_ACCOUNT');
    this.focusOnCreatedTab();
    this.chosen = dataRow;
  } else {
    this.toaster.warningToastr('Tab already open', null, {toastTimeout: 3000, maxShown: 1} );
  }
  
  }

  updateCashAccount(updateVendorForm, tabIndex: number) {
    if (updateVendorForm.valid) {
      this.loading = true;
      this.submitting = true;
      return this.service
        .updateCashAccount(
          this.chosen._id,
          this.chosen.secret.name,
        )
        .subscribe(
          successRes => {
            this.closeTab(null, tabIndex);
            this.toaster.successToastr(
              'Selected Account Updated successfully',null,{ toastTimeout: 3000 }
            );
            this.reloadCashAccountList();
            this.loading = false;
            this.submitting = false;

          },
          error => {
            this.toaster.errorToastr(error, null, { toastTimeout: 3000 });
            this.loading = false;
            this.submitting = false;
            this.alertService.error(error, true);
          }
        );
    } else {
      return;
    }
  }

  deleteCashAccount(id: number) {
    if (
      confirm(
        'Are you sure you want to permanently delete the selected  account?'
      )
    ) {
      this.service.deleteCashAccount(id).subscribe(
        data => {
          this.toaster.successToastr(
            'Account deleted successfully',
            null,
            { toastTimeout: 3000 }
          );
          this.reloadCashAccountList();
        },
        error => {
          this.toaster.errorToastr(
            'An error occured, Attempt to delete account failed',
            null,
            { toastTimeout: 3000 }
          );
        }
      );
    }
  }

  newTabHandler(): void {
    if (this.createCashAccount()) {
      this.addToTabs();
      this.focusOnCreatedTab();
    } else {
      this.toaster.warningToastr('Tab already open', null, {toastTimeout: 3000, maxShown: 1});
    }
    return;
  }

  getCashAccount() {
    if (this.updateCashAccountNewTab()) {
      this.addToTabs();
      this.focusOnCreatedTab();
    } else {
      this.toaster.warningToastr('Tab already open', null, {toastTimeout: 3000, maxShown: 1} );
    }
    
  }

  updateCashAccountNewTab(): boolean {
    const newTabsOpen = this.openTabs.filter(tabsOpen => tabsOpen.type === 'UPDATE_CASH_ACCOUNT' );
    if (newTabsOpen.length > 0) {
      return false;
    }
    return true;
  }

  createCashAccount(): boolean {
    const newTabsOpen = this.openTabs.filter(tabsOpen => tabsOpen.type === 'NEW_CASH_ACCOUNT' );
    if (newTabsOpen.length > 0) {
      return false;
    }
    return true;
  }

}
