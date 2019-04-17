import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { HrService } from '../../services/hr.service';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AlertService } from 'src/app/components/alert/alert.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';


interface LeavesResponse {
  leaveTypes: any[]
}

@Component({
  selector: 'app-list-leave',
  templateUrl: './list-leave.component.html',
  styleUrls: ['./list-leave.component.scss']
})
export class ListLeaveComponent implements OnInit {

  @Input() leaveData;
  constructor(private hrService: HrService, public toastr: ToastrManager, private alertService: AlertService, private fb: FormBuilder) { }
  public form: FormGroup;
  openTabs: any[] = [];
  leaveList: any[];
  rows = [];
  count = 0;
  offset = 0;
  limit = 30;
  loading = false;
  suspendingState = false;
  public checkForUpdates = [
    'name',
    'numberOfDays',
  ];
  @ViewChild('leavesTabSet') refNgbTabset: NgbTabset;

  ngOnInit() {
    this.fetchdata();
  }

  newTabHandler(): void {
    if (this.createLeaveNewTab()) {
      this.addToTabs();
      this.focusOnCreatedTab();
    } else {
      this.toastr.warningToastr('Tab already open', null);
    }
    return;
  }

   createLeaveNewTab(): boolean {
    const newTabsOpen = this.openTabs.filter(tabsOpen => tabsOpen.type === 'NEW_LEAVE_TYPE');
    if (newTabsOpen.length > 0) {
      return false;
    }
    return true;
  }

  leaveSuccessHandler(leaveCreated, tabIndex: number): void {
    this.closeTab(null, tabIndex);
    this.fetchdata();
  }


  updateLeaveHandler(content) {
    this.addToTabs(`Updating ${content.leaveTypeSecret.name}`, content, 'UPDATE_LEAVE_TYPE');
    this.leaveData = content;
    this.form = this.fb.group({
      leavename: [content.leaveTypeSecret.name, Validators.compose([Validators.required])],
      leavedays: [content.leaveTypeSecret.numberOfDays, Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")])],
     
    });
    this.focusOnCreatedTab();
  }


  closeUpdateLeaveHandler(content) {
    this.closeTab(null, content);
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
      newTab = { title: 'New Leave Type', type: 'NEW_LEAVE_TYPE' };
    }
    else if (type === 'VIEW_LEAVE_TYPE') {
      newTab = { title, content: tabContent, type: 'VIEW_LEAVE_TYPE', id };
    }
    else if (type === 'UPDATE_LEAVE_TYPE') {
      newTab = { title, content: tabContent, type: 'UPDATE_LEAVE_TYPE', id };
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



  fetchdata() {
    this.hrService.fetchLeaves().subscribe((data: LeavesResponse) => {
      if (data) {
        this.leaveList = data.leaveTypes;
      }
      this.page(this.offset, this.limit);
    })

  }


  page(offset, limit) {
    this.count = this.leaveList.length;
    const start = offset * limit;
    const end = start + limit;
    this.rows = this.leaveList;
  }


  onPage(Event) {
    this.page(Event.offset, Event.limit);

  }


  refreshTable(tabChangeEvent) {
    if (tabChangeEvent['nextId'] === 'leaves') {
      this.fetchdata();
    }
  }

  get f() {
    return this.form.controls;
  }

  onUpdate(evt: Event) {
    evt.preventDefault();
    this.loading = true;

    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    const leavename = this.f.leavename.value;
    const leavedays = this.f.leavedays.value;
    const updatedFields: string[] = this.checkForUpdates;
    this.hrService.updateLeave(this.leaveData.id, leavename, leavedays, updatedFields)
      .pipe()
      .subscribe(
        successRes => {
          this.fetchdata();
          this.toastr.successToastr('Leave Type Updated Successfully', null, { maxShown: 1 });
          this.closeUpdateLeaveHandler(this.leaveData.id);
          this.form.reset();
        },
        error => {
          this.loading = false;
          this.alertService.error(error, true);
        },
        () => {
          this.loading = false;
        }

      );
  }

  isBtnDisabled() {
    return this.form.invalid || this.loading;
  }

  
  deleteLeaveHandler(data) {
    this.suspendingState = true;
    this.hrService.deleteLeave(data.id)
      .pipe()
      .subscribe(
        data => {
          this.fetchdata();
          this.toastr.successToastr('Leave Type Deleted', null, { maxShown: 1 });
          this.suspendingState = false;
        },
        error => {
          this.alertService.error(error, true);
          this.toastr.errorToastr('Error: Unable To Perform Operation', null, { maxShown: 1 });
          this.suspendingState = false;
        });
  }

}
