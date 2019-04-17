import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { ToastrManager } from 'ng6-toastr-notifications';
import { FlxUiDataTable } from 'flx-ui-datatable';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { AccountingService } from 'src/app/accounting/service/accounting.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/components/alert/alert.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  constructor(
    private service: AccountingService,
    private modalService: NgbModal,
    private toaster: ToastrManager,
    private activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private router: Router,
    private alertService: AlertService,
    public dataService: FlxUiDataTable
  ) {}
  incomeCateoryList: any[];
  tableValue: any;
  ExpenseCatListToUpdate = null;
  rows = [];
  count = 0;
  offset = 0;
  limit = 20;

  loading = false;
  closeResult: string;
  modalContext;

  open(content, dataRow) {
    console.log(dataRow);
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
    this.addToTabs();
    // focus on new tab
    this.focusOnCreatedTab();
  }

  cardSuccessHandler(expenseCategoryCreated, tabIndex: number): void {
    this.closeTab(null, tabIndex);
    this.refreshIncomeCategoryList();
  }

  viewIncomeCategoryHandler(expenseCategory): void {
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
      newTab = { title: 'New Credit Card', type: 'NEW_CARD_CATEGORY' };
    } else if (type === 'VIEW_INCOME_CATEGORY') {
      newTab = { title, content: tabContent, type: 'VIEW_CARD_CATEGORY' };
    } else {
      newTab = { title, content: tabContent, type: 'UPDATE_CARD_CAT' };
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
    this.refreshIncomeCategoryList();
  }
  refreshIncomeCategoryList() {
    this.service.getCardCategory().subscribe((data: any) => {
      if (data) {
        this.incomeCateoryList = data.data;
      }
      if (data.data.length == 0) {
        this.tableValue = '';
      } else {
        this.tableValue = '';
      }
      this.onPage(this.offset, this.limit);
    });
  }

  onPage(offset, limit) {
    this.count = this.incomeCateoryList.length;
    const start = this.offset * this.limit;
    const end = start + this.limit;
    this.rows = this.incomeCateoryList;
    console.log('Page Results', start, end, this.rows);
  }

  delete(row) {
    this.rows.splice(row, 1);
  }

  preview(row) {}

  CardCategoryUpdate(tabIndex: number) {
    this.loading = true;
    return this.service
      .updateCardCategory(
        this.modalContext._id,
        this.modalContext.secret.description,
        this.modalContext.secret.openingBalance
      )
      .subscribe(
        successRes => {
          this.closeTab(null, tabIndex);
          this.toaster.successToastr(
            'Selected credit card Updated successfully',
            null,
            { toastTimeout: 3000 }
          );
          this.modalService.dismissAll();
          this.refreshIncomeCategoryList();
          this.loading = false;
          console.log('update category updated');
        },
        errRes => {
          console.error(errRes);
          this.toaster.errorToastr('An error occured', null, {
            toastTimeout: 3000
          });
          this.loading = false;
          console.log('error of us' + errRes);
        }
      );
  }

  getIncomeCat(content, dataRow) {
    this.addToTabs('Edit Credit Card', content, 'UPDATE_VENDOR');
    this.focusOnCreatedTab();
    this.modalContext = dataRow;
  }

  deleteIncomeCategory(id: number) {
    if (
      confirm(
        'Are you sure you want to permanently delete the selected  Credit Card?'
      )
    ) {
      this.service.removeIncomeCategory(id).subscribe(
        data => {
          this.toaster.successToastr(
            'Selected Credit Card deleted successfully',
            null,
            { toastTimeout: 3000 }
          );
          this.refreshIncomeCategoryList();
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
}
