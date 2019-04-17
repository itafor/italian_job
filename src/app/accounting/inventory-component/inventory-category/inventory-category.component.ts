import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/components/alert/alert.service';
import { AccountingService } from '../../service/accounting.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-inventory-category',
  templateUrl: './inventory-category.component.html',
  styleUrls: ['./inventory-category.component.scss']
})
export class InventoryCategoryComponent implements OnInit {

  constructor(private service: AccountingService,
    public toaster: ToastrManager,
    private alertService: AlertService,
    private modalService: NgbModal,) { }

  
  public inventoryCategory;
  loading = false;
  details: any;
  disableBtn;
  closeResult: string;
  suspendingState = false
  suspendinventory = false;
  bl = null;
  inventoryCatList: any[];
  tableValue:any;
  rows = [];
  selectedInventory;
  category_name;
  count = 0;
  offset = 0;
  limit = 20;
  @ViewChild('inventoryTabSet') refNgbTabset: NgbTabset;
  openTabs: any[] = [];

  
  newTabHandler(): void {
    if (this.createInventoryCategoryNewTab()) {
      this.addToTabs();
      this.focusOnCreatedTab();
    } else {
      this.toaster.warningToastr('Tab already open', null, {toastTimeout: 3000, maxShown: 1});
    }
    return;
  }

  createInventoryCategoryNewTab(): boolean {
    const newTabsOpen = this.openTabs.filter(tabsOpen => tabsOpen.type === 'NEW_INVENTORY_CATEGORY' );
    if (newTabsOpen.length > 0) {
      return false;
    }
    return true;
  }
  uodateInventoryNewTab(): boolean {
    const newTabsOpen = this.openTabs.filter(tabsOpen => tabsOpen.type === 'UPDATE_INVENTORY_CATEGORY' );
    if (newTabsOpen.length > 0) {
      return false;
    }
    return true;
  }

  inventorySuccessHandler(vendorCreated, tabIndex: number): void {
    this.closeTab(null, tabIndex);
    this.fetchInventoryCategory(this.offset, this.limit);
  }
  viewInventoryCategoryHandler(category): void {
    this.addToTabs(`${category.secret.category_id}'s Data`, category, 'UPDATE_INVENTORY_CATEGORY');
      this.focusOnCreatedTab();
    }

  focusOnCreatedTab() {
    setTimeout(() => { this.refNgbTabset.select(this.latestTabId); }, 50);
  }

  ngOnInit() {
    this.fetchInventoryCategory(this.offset, this.limit);
    this.categories(this.offset, this.limit);
  }

  onPage(event) {
    console.log('Page Event', event);
    this.fetchInventoryCategory(event.offset, event.limit);
 }
   
  addToTabs(title?: string, tabContent?: any, type?: string): void {
    let newTab;
    if (!title) {
      newTab = { title: 'New Inventory Category', type: 'NEW_INVENTORY_CATEGORY'};
    }
    else if (type === 'VIEW_INVENTORY_CATEGORY') {
      newTab = { title, content: tabContent, type: 'VIEW_INVENTORY_CATEGORY' };
    }
    else {
      newTab = { title, content: tabContent, type: 'UPDATE_INVENTORY_CATEGORY' }
    }
    this.openTabs.push(newTab);
  }
  closeTab(event?: MouseEvent, index?: number): void {
    if (event) { event.preventDefault(); }
    this.removeFromTab(index);
  }
  removeFromTab(index: number): void {
    this.openTabs.splice(index, 1);
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

  fetchInventoryCategory(offset, limit) {
    this.service.getInventoryCategory(offset, limit).subscribe((data: any) => {
      if (data) {
        this.inventoryCatList = data.data;
        this.count = data.recordCount;
         this.rows = this.inventoryCatList;
        console.log(this.inventoryCatList);
      }
      if(data.data.length == 0){
        this.tableValue = 'hasNoValue';
      }else{
        this.tableValue = 'hasValue';
      }
    });
  }

  getInventoryCategory(content,dataRow) {
    if (this.uodateInventoryNewTab()) {
      this.addToTabs('Edit Inventory Category', content, 'UPDATE_INVENTORY_CATEGORY');
      this.focusOnCreatedTab();
      this.bl = dataRow;
    } else {
      this.toaster.warningToastr('Tab already open', null, {toastTimeout: 3000, maxShown: 1} );
    }
    
  }

  inventoryCategoryUpdate(updateInventorycategory, tabIndex: number) {
    if (updateInventorycategory.valid) {
        this.loading = true;
        this.disableBtn = true;
        console.log(this.bl.secret.parentCategoryId.toString())
        this.service.updateInventorycategory(
          this.bl._id, this.bl.secret.name, this.bl.secret.description,
        this.bl.secret.parentCategoryId)
        .subscribe(
          data => {
            this.closeTab(null, tabIndex);
            this.toaster.successToastr('Inventory Updated successfully', null, {toastTimeout: 3000, maxShown: 1});
            this.fetchInventoryCategory(this.offset, this.limit);
            this.loading = false;
            console.log(data);
            this.disableBtn = false;
          },
          error => {
            this.toaster.errorToastr('Update failed', null, {toastTimeout: 3000, maxShown: 1} );
            this.alertService.error(error, true);
            this.loading = false;
            this.disableBtn = false;
          });
    } else {
      return;
    }
  }
  categories(offset, limit) {
    this.service.getInventoryCategory(offset, limit).subscribe((data: any) => {
      if (data) {
        this.inventoryCategory = data.data;
      }
    });
  }


}
