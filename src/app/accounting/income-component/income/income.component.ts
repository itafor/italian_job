import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { ToastrManager } from 'ng6-toastr-notifications';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { AccountingService } from 'src/app/accounting/service/accounting.service';
import { AlertService } from 'src/app/components/alert/alert.service';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss']
})
export class IncomeComponent implements OnInit {
  constructor(
    private service: AccountingService,
    private modalService: NgbModal,
    private toaster: ToastrManager,
    private activeModal: NgbActiveModal,
    private alertService: AlertService
  ) {}
  incomeCateoryList: any[];
  public incomeCategoryList;
  tableValue: any;
  rows = [];
  count = 0;
  offset = 0;
  limit = 20;
  disableBtn;
  loading = false;
  closeResult: string;
  modalContext;

  open(content, dataRow) {
    // console.log(dataRow);
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
  @ViewChild('incomeCategoriesTabSet') refNgbTabset: NgbTabset;

  newTabHandler(): void {
    if(this.createNewIncomeCat()){
      this.addToTabs();
      this.focusOnCreatedTab();
    }
    else {
      this.toaster.warningToastr('Tab already open', null, {toastTimeout: 3000, maxShown: 1});
    }
    return;
  }

  createNewIncomeCat(): boolean {
    const newTabsOpen = this.openTabs.filter(tabsOpen => tabsOpen.type === 'NEW_INCOME_CATEGORY');
    if (newTabsOpen.length > 0) {
      return false;
    }
    return true;
  }

  incomeSuccessHandler(incomeCategoryCreated, tabIndex: number): void {
    this.closeTab(null, tabIndex);
    this.fetchIncomeCategory(this.offset, this.limit);
  }

  viewIncomeCategoryHandler(incomecategory): void {
    this.addToTabs(
      `${incomecategory.secret.name}'s Data`,
      incomecategory,
      'UPDATE_incomecategory'
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
      newTab = { title: 'New Income Category', type: 'NEW_INCOME_CATEGORY' };
    } else if (type === 'VIEW_INCOME_CATEGORY') {
      newTab = { title, content: tabContent, type: 'VIEW_INCOME_CATEGORY' };
    } else {
      newTab = { title, content: tabContent, type: 'UPDATE_INCOME_CATEGORY' };
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
    this.refreshIncomeCategoryList(this.offset, this.limit);
    this.getAllIncomeCategory();
    this.fetchIncomeCategory(this.offset, this.limit);
  }
  refreshIncomeCategoryList(offset, limit) {
    this.service.getIncomeCategory(offset, limit).subscribe((data: any) => {
      if (data) {
        this.incomeCateoryList = data.data;
        // console.log(data)
      }
      if (data.data.length == 0) {
        this.tableValue = 'hasNoValue';
      } else {
        this.tableValue = 'hasValue';
      }
    });
  }

  onPage(event) {
    //  console.log('Page Event', event);
     this.fetchIncomeCategory(event.offset, event.limit);
  }

  delete(row) {
    this.rows.splice(row, 1);
  }

  preview(row) {}



  updateIncomeCategory(updateIncomeCategoryForm, tabIndex: number) {
    if (updateIncomeCategoryForm.valid) {
      this.loading = true;
      this.disableBtn = true;
      return this.service
        .updateIncomeCategory(
          this.modalContext._id,
          this.modalContext.secret.name,
          this.modalContext.secret.categoryType,
          this.modalContext.secret.parentCategory
        )
        .subscribe(
          successRes => {
            this.closeTab(null, tabIndex);
            this.toaster.successToastr(
              'Selected Income category Updated successfully',
              null,
              { toastTimeout: 3000 }
            );
            this.fetchIncomeCategory(this.offset, this.limit);
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


  fetchIncomeCategory(offset, limit) {
    this.service.getIncomeCategory(offset, limit).subscribe((data: any) => {
      if (data) {
        this.incomeCateoryList = data.data;
        this.count = data.recordCount;
         this.rows = this.incomeCateoryList;
        console.log(this.incomeCateoryList);
      }
      if(data.data.length == 0){
        this.tableValue = 'hasNoValue';
      }else{
        this.tableValue = 'hasValue';
      }
    });
  }

  getIncomeCat(content, dataRow) {
    if(this.editIncomeCat()){
      this.addToTabs('Edit Income Category', content, 'UPDATE_INCOME_CATEGORY');
      this.focusOnCreatedTab();
      this.modalContext = dataRow;
    }
    else {
      this.toaster.warningToastr('Tab already open', null, {toastTimeout: 3000, maxShown: 1} );
    }
    return;
  }
  editIncomeCat(): boolean {
    const newTabsOpen = this.openTabs.filter(tabsOpen => tabsOpen.type === 'UPDATE_INCOME_CATEGORY' );
    if (newTabsOpen.length > 0) {
      return false;
    }
    return true;
  }

  deleteIncomeCategory(id: number) {
    if (
      confirm(
        'Are you sure you want to permanently delete the selected  income category?'
      )
    ) {
      this.service.removeIncomeCategory(id).subscribe(
        data => {
          this.toaster.successToastr(
            'Selected income category deleted successfully',
            null,
            { toastTimeout: 3000 }
          );
          this.fetchIncomeCategory(this.offset, this.limit);
        },
        error => {
          this.toaster.errorToastr(
            'An error occured, Attempt to delete income category failed',
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

  getAllIncomeCategory() {
    this.service.getIncomeCategory(this.offset, this.limit).subscribe((data: any) => {
      if (data) {
        this.incomeCategoryList = data.data;
        // console.log(data)
      }
    });
  }
}
