import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { ToastrManager } from 'ng6-toastr-notifications';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { AccountingService } from 'src/app/accounting/service/accounting.service';
import { AlertService } from 'src/app/components/alert/alert.service';

@Component({
  selector: 'app-expense-category',
  templateUrl: './expense-category.component.html',
  styleUrls: ['./expense-category.component.scss']
})
export class ExpenseCategoryComponent implements OnInit {
  constructor(
    private service: AccountingService,
    private modalService: NgbModal,
    public toaster: ToastrManager,
    private activeModal: NgbActiveModal,
    private alertService: AlertService
  ) {}
  expenseCategoryList: any[];
  tableValue: any;
  expenseCategoryListHasData: any;
  ExpenseCatListToUpdate = null;
  rows = [];
  count = 0;
  offset = 0;
  limit = 20;
  disableBtn;
  loading = false;
  closeResult: string;
  modalContext;

  open(content, dataRow) {
    const modalRef = this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title'
    });
    modalRef.result.then(
      result => {
        this.closeResult = `Closed with: ${result}`;
      },
      reason => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
    modalRef.result.then(
      result => {
        this.closeResult = `Closed with: ${result}`;
      },
      reason => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
    this.modalContext = dataRow;
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
  @ViewChild('expenseCategoriesTabSet') refNgbTabset: NgbTabset;

  newTabHandler(): void {
    if (this.createExpenseCatNewTab()) {
      this.addToTabs();
      this.focusOnCreatedTab();
    } else {
      this.toaster.warningToastr('Tab already open', null, {toastTimeout: 3000, maxShown: 1});
    }
    return;
  }

  createExpenseCatNewTab(): boolean {
    const newTabsOpen = this.openTabs.filter(tabsOpen => tabsOpen.type === 'NEW_EXPENSE_CATEGORY');
    if (newTabsOpen.length > 0) {
      return false;
    }
    return true;
  }

  editExpenseCatNewTab(): boolean {
    const newTabsOpen = this.openTabs.filter(tabsOpen => tabsOpen.type === 'UPDATE_EXPENSE_CATEGORY' );
    if (newTabsOpen.length > 0) {
      return false;
    }
    return true;
  }

  expenseCategorySuccessHandler(
    expenseCategoryCreated,
    tabIndex: number
  ): void {
    this.closeTab(null, tabIndex);
    this.refreshExpenseCategoryList();
  }

  viewExpenseCategoryHandler(expenseCategory): void {
    this.addToTabs(
      `${expenseCategory.secret.name}'s Data`,
      expenseCategory,
      'UPDATE_expenseCategory'
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
      newTab = { title: 'New Expense Category', type: 'NEW_EXPENSE_CATEGORY' };
    } else if (type === 'VIEW_EXPENSE_CATEGORY') {
      newTab = { title, content: tabContent, type: 'VIEW_EXPENSE_CATEGORY' };
    } else {
      newTab = { title, content: tabContent, type: 'UPDATE_EXPENSE_CATEGORY' };
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
    this.refreshExpenseCategoryList();
  }
  refreshExpenseCategoryList() {
    this.service.getExpenseCategory().subscribe((data: any) => {
      if (data) {
        this.expenseCategoryList = data.data;
        console.log(this.expenseCategoryList)
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
    this.count = this.expenseCategoryList.length;
    const start = this.offset * this.limit;
    const end = start + this.limit;
    this.rows = this.expenseCategoryList;
  }

  delete(row) {
    this.rows.splice(row, 1);
  }

  preview(row) {}

  updateExpenseCategories(updateExpenseCategoryForm, tabIndex: number) {
    if (updateExpenseCategoryForm.valid) {
      this.loading = true;
      this.disableBtn = true;
      return this.service
        .updateExpenseCategory(
          this.modalContext._id,
          this.modalContext.secret.categoryType,
          this.modalContext.secret.name,
          this.modalContext.secret.parentCategory
        )
        .subscribe(
          successRes => {
            this.closeTab(null, tabIndex);
            this.toaster.successToastr(
              'Selected expense category Updated successfully',
              null,
              { toastTimeout: 3000 }
            );
            this.refreshExpenseCategoryList();
            this.loading = false;
            this.disableBtn = false;
          },
          error => {
            this.toaster.errorToastr(error, null, { toastTimeout: 3000 });
            this.loading = false;
            this.disableBtn = false;
            this.alertService.error(error, true);
          }
        );
    } else {
      return;
    }
  }

  getExpCat(content, dataRow) {
    if (this.editExpenseCatNewTab()){
      this.addToTabs('Edit Expense Cateory', content, 'UPDATE_EXPENSE_CATEGORY');
    this.focusOnCreatedTab();
    this.modalContext = dataRow;
    }
    else {
      this.toaster.warningToastr('Tab already open', null, {toastTimeout: 3000, maxShown: 1} );
    }
    return;
  }

  deleteExpenseCategory(id: number) {
    if (
      confirm(
        'Are you sure you want to permanently delete the selected expense category?'
      )
    ) {
      this.service.removeExpenseCategory(id).subscribe(
        data => {
          this.toaster.successToastr(
            'Selected expense category deleted successfully',
            null,
            { toastTimeout: 3000 }
          );
          this.refreshExpenseCategoryList();
        },
        error => {
          this.toaster.errorToastr(
            'An error occured, Attempt to delete expense category failed',
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

  showParentOption(parentId, currentId) {
    if (parentId == currentId) {
      return true;
    } else {
      return false;
    }
  }
}
