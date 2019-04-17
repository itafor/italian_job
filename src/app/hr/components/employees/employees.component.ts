import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { EmployeeService } from '../employees/employees.service';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import { GetService } from 'src/app/file-manager/services/get.service';
import { AlertService } from 'src/app/components/alert/alert.service';

interface EmployeesResponse {
  employees: any[]
}

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {

  @Output() updateEmployeeEvent = new EventEmitter();

  constructor(
    public toastr: ToastrManager,
    private getService: GetService,
    private employeeService: EmployeeService,
    private alertService: AlertService
  ) { }

  employeeList: any[];
  rows = [];
  count = 0;
  offset = 0;
  limit = 50;
  suspendingState = false
  responsemsg;
  userHasError = true;
  loading = false;
  employeeInfo;
  userId;
  employeeName: String;
  userIdList = [];


  openTabs: any[] = [];
  @ViewChild('employeesTabSet') refNgbTabset: NgbTabset;


  newTabHandler(): void {
    if (this.createEmployeeNewTab()) {
      this.addToTabs();
      this.focusOnCreatedTab();
    } else {
      this.toastr.warningToastr('Tab already open', null);
    }
    return;
  }
  populateUsers() {
    this.getService.fetchUsers().subscribe(user => {
      this.userIdList = user.data;
      this.userId = user.data;
     
    })
  }

  createEmployeeNewTab(): boolean {
    const newTabsOpen = this.openTabs.filter(tabsOpen => tabsOpen.type === 'NEW_EMPLOYEE');
    if (newTabsOpen.length > 0) {
      return false;
    }
    return true;
  }


  employeeSuccessHandler(employeeCreated, tabIndex: number, idToClose?: string): void {
    this.closeTab(null, tabIndex, idToClose);
    this.fetchdata();
  }


  updateEmployeeEventHandler($event: { employeeSecret: { firstname: string, lastname: string }, id: string }) {
    const { employeeSecret } = $event;
    this.addToTabs(`Updating ${employeeSecret.firstname} ${employeeSecret.lastname}`, $event, 'UPDATE_EMPLOYEE', $event.id);

    this.focusOnCreatedTab();
  }

  viewEmployeeHandler(employee) {

    this.addToTabs(`${employee.employeeSecret.firstname} ${employee.employeeSecret.lastname}`, employee, 'VIEW_EMPLOYEE', employee.id);
    this.focusOnCreatedTab();
  }

  linkUserHandler(employee) {
    this.addToTabs(`Linking To ${employee.employeeSecret.firstname}`, employee, 'USER_LINKUP');
    this.employeeInfo = employee;
    this.employeeName = this.employeeInfo.employeeSecret.firstname;
    this.populateUsers();
    this.focusOnCreatedTab();
  }


  closeParentDepartmentHandler(employee) {
    this.closeTab(null, employee);
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
      newTab = { title: 'New Employee', type: 'NEW_EMPLOYEE' };
    }
    else if (type === 'VIEW_EMPLOYEE') {
      newTab = { title, content: tabContent, type: 'VIEW_EMPLOYEE', id };
    }
    else if (type === 'UPDATE_EMPLOYEE') {
      newTab = { title, content: tabContent, type: 'UPDATE_EMPLOYEE', id };
    }
    else {
      newTab = { title, content: tabContent, type: 'USER_LINKUP' };
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
    this.employeeService.fetchEmployees().subscribe((data: EmployeesResponse) => {
      if (data) {
        this.employeeList = data.employees;
      }
      this.onPage(data);
      this.page(this.offset, this.limit);
    })

  }

  page(offset, limit) {
    this.count = this.employeeList.length;
    const start = offset * limit;
    const end = start + limit;
    const rows = [...this.rows];

    for (let i = start; i < end; i++) {
      rows[i] = this.employeeList[i];
    }

    this.rows = rows;

  }


  onPage(event) {
    this.page(event.offset, event.limit);
  }

  delete(row) {
    this.rows.splice(row, 1);

  }

  suspend(data) {
    this.suspendingState = true;
    this.employeeService.suspend(data.id)
      .pipe()
      .subscribe(
        data => {
          this.toastr.successToastr('Employee Suspended', null, { maxShown: 1 });
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

  unsuspend(data) {
    this.suspendingState = true;
    this.employeeService.unsuspend(data.id)
      .pipe()
      .subscribe(
        data => {
          this.toastr.successToastr('Employee Unsuspended', null, { maxShown: 1 });
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


  deleteConfirmHandler(data) {
    this.suspendingState = true;
    this.employeeService.deleteEmployee(data.id)
      .pipe()
      .subscribe(
        data => {
          this.toastr.successToastr('Employee Deleted', null);
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


  validateUserEmail(value) {
    if (value === 'default') {
      this.userHasError = true;
      this.isBtnDisabled();
    }
    else {
      this.userHasError = false;
      this.loading = false;
    }

  }

  isBtnDisabled() {
    return this.userHasError || this.loading;
  }

  linkUpForm(evt: Event) {
    evt.preventDefault();
    this.loading = true;
    this.employeeService.userLinking(this.employeeInfo.id, this.userId).subscribe(
      successRes => {
        this.fetchdata();
        this.toastr.successToastr('Employee Successfully Linked', null, { maxShown: 1 });
        this.closeParentDepartmentHandler(this.employeeInfo.id);
        this.userId = null;
      },
      errorRes => {
        this.toastr.warningToastr('Warning: This Operation Has Already Been Performed', null, { maxShown: 1 });
        this.loading = false;
      },
      () => {
        this.loading = false;
      }
    );
    return false;
  }

  refreshTable(tabChangeEvent) {
    if (tabChangeEvent['nextId'] === 'employees') {
      this.fetchdata();
    }
  }

}


