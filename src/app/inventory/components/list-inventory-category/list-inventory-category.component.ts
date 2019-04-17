import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { InventoryService } from '../../services/inventory.service';

interface InventoryCategoryResponse {
  categories: any[];
}

@Component({
  selector: 'app-list-inventory-category',
  templateUrl: './list-inventory-category.component.html',
  styleUrls: ['./list-inventory-category.component.scss']
})
export class ListInventoryCategoryComponent implements OnInit {

  constructor(private inventoryService: InventoryService, public toastr: ToastrManager) { }

  inventoryCategoryList = [];
  rows = [];
  count = 0;
  offset = 0;
  limit = 30;
  isActive = false;
  responsemsg = '';
  showErrAlert = false;
  disableIcon;
  suspendingState = false;
  openTabs: any[] = [];


  @ViewChild('inventoryCategoryTabSet') refNgbTabset: NgbTabset;

  newTabHandler(): void {
    if (this.createInventoryCategoryNewTab()) {
      this.addToTabs();
      this.focusOnCreatedTab();
    } else {
      this.toastr.warningToastr('Tab already open', null);
    }
    return;
  }

  createInventoryCategoryNewTab(): boolean {
    const newTabsOpen = this.openTabs.filter(tabsOpen => tabsOpen.type === 'NEW_INVENTORY_CATEGORY');
    if (newTabsOpen.length > 0) {
      return false;
    }
    return true;
  }

  inventoryCategorySuccessHandler(inventoryCategoryCreated, tabIndex: number): void {
    this.closeTab(null, tabIndex);
    this.fetchdata();
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
      newTab = { title: 'New Inventory Category', type: 'NEW_INVENTORY_CATEGORY' };
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
  focusOnCreatedTab() {
    setTimeout(() => { this.refNgbTabset.select(this.latestTabId); }, 50);
  }


  ngOnInit() {
    this.fetchdata();
  }

  fetchdata() {
    this.inventoryService.fetchInventoryCategories().subscribe((data: InventoryCategoryResponse) => {
      // if (data) {
      //   this.departmentList = data.departments;
      // }
      // this.page(this.offset, this.limit);
    });
  }

  page(offset, limit) {
    this.count = this.inventoryCategoryList.length;
    const start = offset * limit;
    const end = start + limit;
    this.rows = this.inventoryCategoryList;
  }


  onPage(Event) {
    this.page(Event.offset, Event.limit);
  }

  delete(tab) {
    console.log(tab);
  }

  activeButton() {
    if (this.isActive === true) {
      return this.isActive = false;
    } else {
      return this.isActive = true;
    }
  }
}
