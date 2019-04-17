import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/components/alert/alert.service';
import { AccountingService } from '../../service/accounting.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';





@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {

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
  inventoryList: any[];
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
    if (this.createInventoryNewTab()) {
      this.addToTabs();
      this.focusOnCreatedTab();
    } else {
      this.toaster.warningToastr('Tab already open', null, {toastTimeout: 3000, maxShown: 1});
    }
    return;
  }

  createInventoryNewTab(): boolean {
    const newTabsOpen = this.openTabs.filter(tabsOpen => tabsOpen.type === 'NEW_INVENTORY' );
    if (newTabsOpen.length > 0) {
      return false;
    }
    return true;
  }
  uodateInventoryNewTab(): boolean {
    const newTabsOpen = this.openTabs.filter(tabsOpen => tabsOpen.type === 'UPDATE_INVENTORY' );
    if (newTabsOpen.length > 0) {
      return false;
    }
    return true;
  }

  inventorySuccessHandler(vendorCreated, tabIndex: number): void {
    this.closeTab(null, tabIndex);
    // this.fetchInventory();
    this.fetchInventory(this.offset, this.limit);
  }
  viewInventoryHandler(category): void {
    this.addToTabs(`${category.secret.category}'s Data`, category, 'UPDATE_INVENTORY');
      this.focusOnCreatedTab();
    }

  focusOnCreatedTab() {
    setTimeout(() => { this.refNgbTabset.select(this.latestTabId); }, 50);
  }

  ngOnInit() {
    this.categories(this.offset, this.limit);
    this.fetchInventory(this.offset, this.limit);
  }

  onPage(event) {
    //  console.log('Page Event', event);
     this.fetchInventory(event.offset, event.limit);
  }
   
  addToTabs(title?: string, tabContent?: any, type?: string): void {
    let newTab;
    if (!title) {
      newTab = { title: 'New Inventory', type: 'NEW_INVENTORY'};
    }
    else if (type === 'VIEW_INVENTORY') {
      newTab = { title, content: tabContent, type: 'VIEW_INVENTORY' };
    }
    else {
      newTab = { title, content: tabContent, type: 'UPDATE_INVENTORY' }
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

  fetchInventory(offset, limit) {
    this.service.getInventory(offset, limit).subscribe((data: any) => {
      if (data) {
        this.inventoryList = data.data;
        this.count = data.recordCount;
         this.rows = this.inventoryList;
          console.log(this.inventoryList);
        }
      if(data.data.length == 0){
        this.tableValue = 'hasNoValue';
      }else{
        this.tableValue = 'hasValue';
      }
    });
  }


  inventoryUpdate(updateInventory, tabIndex: number) {
    // console.log(this.getCatnew)
    if (updateInventory.valid) {
        this.loading = true;
        this.disableBtn = true;
        this.service.updateInventory(
          this.bl._id, this.bl.secret.item_description, this.bl.category._id,
        this.bl.secret.quantity.toString(), this.bl.secret.unit_cost.toString())
        .subscribe(
          data => {
            this.closeTab(null, tabIndex);
            this.toaster.successToastr('Inventory Updated successfully', null, {toastTimeout: 3000});
            this.fetchInventory(this.offset, this.limit);
            this.loading = false;
            this.disableBtn = false;
          },
          error => {
            this.toaster.errorToastr('Update failed', null, {toastTimeout: 3000} );
            this.alertService.error(error, true);
            this.loading = false;
            this.disableBtn = false;
          });
    } else {
      return;
    }
  }
 get getCatnew() {
    let id = document.getElementById('catproblem').getAttribute('data-value')
    return id
  }
  updateInvCat(event) {
    const {target} = event
  }

  getInventory(content,dataRow) {
    if (this.uodateInventoryNewTab()) {
      this.addToTabs('Edit Inventory', content, 'UPDATE_INVENTORY');
      this.focusOnCreatedTab();
      this.bl = dataRow;
      // console.log(this.bl)
    } else {
      this.toaster.warningToastr('Tab already open', null, {toastTimeout: 3000, maxShown: 1} );
    }
    
  }

  categories(offset, limit) {
    this.service.getInventoryCategory(offset, limit).subscribe((data: any) => {
      if (data) {
        this.inventoryCategory = data.data;
        // console.log(this.inventoryCategory)
      }
    });
  }
  
 

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      this.loading = false 
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  SuspendAnInventory(_id:number) {
    if(confirm('Are you sure you want to suspend the selected Inventory?')){
    this.suspendingState = true;
    this.service.suspendInventory(_id)
      .pipe()
      .subscribe(
        data => {
          this.toaster.successToastr('Inventory Suspended', null);
          this.suspendingState = false;
          // console.log(data)
          // this.suspendinventory = true;
          this.fetchInventory(this.offset, this.limit);
        },
        error => {
          this.toaster.errorToastr('Error: Unable To Perform Operation', null);
          this.suspendingState = false;
        });
      }
  }

  UnsuspendAnInventory(id:number) {
    if(confirm('Are you sure you want to unsuspend the selected Inventory?')){
    this.suspendingState = true;
    this.service.UnsuspendInventory(id)
      .pipe()
      .subscribe(
        data => {
          this.toaster.successToastr('Inventory Unsuspended', null);
          this.suspendingState = false;
          this.suspendinventory = false;
          // console.log(data)
          this.fetchInventory(this.offset, this.limit);
        },
        error => {
          this.toaster.errorToastr('Error: Unable To Perform Operation', null);
          this.suspendingState = false;
        });
      }
  }



}
