import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { HrService } from '../../services/hr.service';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AlertService } from 'src/app/components/alert/alert.service';

interface DepartmentsResponse {
  departments: any[]
}

@Component({
  selector: 'app-list-departments',
  templateUrl: './list-departments.component.html',
  styleUrls: ['./list-departments.component.scss']
})
export class ListDepartmentsComponent implements OnInit {

  constructor(private hrService: HrService, public toastr: ToastrManager, private alertService: AlertService) { }

  departmentList: any[];
  deptInfo;
  rows = [];
  count = 0;
  offset = 0;
  limit = 30;
  isActive = false;
  responsemsg;
  showErrAlert = false;
  disableIcon;
  suspendingState = false
  openTabs: any[] = [];
  parentDeptHasError = true;
  submitting = false;
  newParentDept: any;
  newDeptName: string;


  @Input() department;
  @ViewChild('departmentsTabSet') refNgbTabset: NgbTabset;

  isBtnDisabled() {
    return this.parentDeptHasError || this.submitting;
  }

  newTabHandler(): void {
    if (this.createDepartmentNewTab()) {
      this.addToTabs();
      this.focusOnCreatedTab();
    } else {
      this.toastr.warningToastr('Tab already open', null);
    }
    return;
  }

  createDepartmentNewTab(): boolean {
    const newTabsOpen = this.openTabs.filter(tabsOpen => tabsOpen.type === 'NEW_DEPARTMENT');
    if (newTabsOpen.length > 0) {
      return false;
    }
    return true;
  }

  departmentSuccessHandler(departmentCreated, tabIndex: number): void {
    this.closeTab(null, tabIndex);
    this.fetchdata();
  }

  updateDepartmentHandler(deptDetails) {
    this.addToTabs(`Updating ${deptDetails.departmentSecret.name}`, deptDetails, 'UPDATE_DEPARTMENT');
    this.focusOnCreatedTab();
  }

  assignDepartmentLeadHandler(deptDetails) {
    this.addToTabs(`Assigning ${deptDetails.departmentSecret.name} Head`, deptDetails, 'ASSIGN_DEPARTMENT_LEAD');
    this.focusOnCreatedTab();
  }

  assignParentDepartmentHandler(deptDetails) {
    this.addToTabs(`Assigning To ${deptDetails.departmentSecret.name}`, deptDetails, 'ASSIGN_PARENT_DEPARTMENT');
    this.deptInfo = deptDetails;
    this.newDeptName = this.deptInfo.departmentSecret.name
    this.focusOnCreatedTab();
  }

  closeParentDepartmentHandler(deptDetails) {
    this.closeTab(null, deptDetails);
  }

  get latestTabId(): string {
    return `tab-id-${this.openTabs.length - 1}`;
  }

  tabIdForIndex(index: number): string {
    return `tab-id-${index}`;
  }

  addToTabs(title?: string, tabContent?: any, type?: string, id?: string): void {
    let newTab;
    if (!title) {
      newTab = { title: 'New Department', type: 'NEW_DEPARTMENT' };
    }
    else if (type === 'VIEW_DEPARTMENT') {
      newTab = { title, content: tabContent, type: 'VIEW_DEPARTMENT', id };
    }
    else if (type === 'UPDATE_DEPARTMENT') {
      newTab = { title, content: tabContent, type: 'UPDATE_DEPARTMENT', id };
    }
    else if (type === 'ASSIGN_DEPARTMENT_LEAD') {
      newTab = { title, content: tabContent, type: 'ASSIGN_DEPARTMENT_LEAD' };
    }
    else {
      newTab = { title, content: tabContent, type: 'ASSIGN_PARENT_DEPARTMENT' };
    }
    this.openTabs.push(newTab);
  }

  closeTab(event?: MouseEvent, index?: number, id?: string): void {
    let indexes: number[] = [];
    if (index || typeof index === 'number') {
      indexes.push(index);
    }
    if (event) {
      event.preventDefault();
    }
    if (id) {
      // get index from ID
      const indexFromID = this.openTabs.findIndex(tab => tab.id === id);
      if (indexFromID > -1) {
        indexes.push(indexFromID);
      }
    }
    this.removeFromTab(indexes);
    this.focusOnCreatedTab();
  }


  removeFromTab(indexes: number[]): void {

    indexes.forEach(i => {
      this.openTabs.splice(i, 1);
    });

  }

  focusOnCreatedTab() {
    setTimeout(() => { this.refNgbTabset.select(this.latestTabId); }, 50);
  }


  ngOnInit() {
    this.fetchdata();
  }



  fetchdata() {
    this.hrService.fetchDepartments().subscribe((data: DepartmentsResponse) => {
      if (data) {
        this.departmentList = data.departments;
      }
      this.page(this.offset, this.limit);
    })

  }

  page(offset, limit) {
    this.count = this.departmentList.length;
    const start = offset * limit;
    const end = start + limit;
    this.rows = this.departmentList;
  }


  onPage(Event) {
    this.page(Event.offset, Event.limit);

  }

  delete(tab) {
  }

  activeButton() {
    if (this.isActive === true) {
      return this.isActive = false;
    }
    else {
      return this.isActive = true;
    }
  }

  suspend(data) {
    this.suspendingState = true;
    this.hrService.suspend(data.id)
      .pipe()
      .subscribe(
        data => {
          this.toastr.successToastr('Department Suspended', null, { maxShown: 1 });
          this.responsemsg = data;
          this.fetchdata();
          this.suspendingState = false;
        },
        error => {
          this.responsemsg = error;
          this.toastr.errorToastr('Error: Unable To Perfom Operation', null, { maxShown: 1 });
          this.suspendingState = false;
        });
  }

  unsuspend(data) {
    this.suspendingState = true;
    this.hrService.unsuspend(data.id)
      .pipe()
      .subscribe(
        data => {

          this.toastr.successToastr('Department Unsuspended', null, { maxShown: 1 });
          this.responsemsg = data;
          this.hrService.fetchDepartments();
          this.fetchdata();
          this.suspendingState = false;
        },
        error => {
          this.responsemsg = error;
          this.toastr.errorToastr('Error: Unable To Perfom Operation', null, { maxShown: 1 });
          this.suspendingState = false;
        });

  }

  deleteConfirmHandler(data) {
    this.suspendingState = true;
    this.hrService.deleteDepartment(data.id)
      .pipe()
      .subscribe(
        data => {
          console.log(data);
          this.toastr.successToastr('Department Deleted', null, { maxShown: 1 });
          this.responsemsg = data;
          this.fetchdata();
          this.suspendingState = false;
        },
        error => {
          this.responsemsg = error;
          this.toastr.errorToastr('Error: Unable To Perform Operation', null, { maxShown: 1 });
          this.suspendingState = false;
        });
  }

  validateParentDept(value) {
    if (value === 'default') {
      this.parentDeptHasError = true;
      this.isBtnDisabled();
    }
    else {
      this.parentDeptHasError = false;
      this.submitting = false;
    }

  }

  submitForm(evt: Event) {
    evt.preventDefault();
    this.submitting = true;
    this.hrService.assignParentDepartment(this.deptInfo.id, this.newParentDept, this.newDeptName).subscribe(
      successRes => {
        this.fetchdata();
        this.toastr.successToastr('Parent Department Assigned', null, { maxShown: 1 });
        this.closeParentDepartmentHandler(this.deptInfo.id);
        this.newParentDept = null;
      },
      errorRes => {
        this.alertService.error(errorRes, true);
        this.submitting = false;
      },
      () => {
        this.submitting = false;
      }
    );
    return false;
  }

  refreshTable(tabChangeEvent) {
    if (tabChangeEvent['nextId'] === 'departments') {
      this.fetchdata();
    }
  }



}
