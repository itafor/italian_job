import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { NgbTabset, NgbActiveModal, NgbDateStruct, NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AlertService } from 'src/app/components/alert/alert.service';
import { Subscription } from 'rxjs';



interface UserResponse {
  user: any[]
}

import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { EmployeeService } from 'src/app/hr/components/employees/employees.service';
import { UserManagementService } from '../../usermanagement.service';
import { HrService } from 'src/app/hr/services/hr.service';

export class dateI {
  day: any;
  month: any;
  year: any;
}

@Component({
  selector: 'app-create-requestleave',
  templateUrl: './create-requestleave.component.html',
  styleUrls: ['./create-requestleave.component.scss']
})
export class CreateRequestleaveComponent implements OnInit, OnDestroy {
  todayDate = new Date();
  time;
  userInfo;
  date;
  userDetail
  displayErr = false;
  constructor(private employeeService: EmployeeService, public toastr: ToastrManager, private alertService: AlertService, private fb: FormBuilder, private calendar: NgbCalendar,
    private dateFormatter: NgbDateParserFormatter,
    private userSrv: UserManagementService,
    private hrService: HrService) {
    this.userInfo = JSON.parse(localStorage.getItem('currentUser'));
    this.time = {
      hour: new Date().getHours(),
      minute: new Date().getMinutes() - 1
    };
    this.date = this.calendar.getToday();
  }


  public form: FormGroup;
  public unpaidform: FormGroup;
  openTabs: any[] = [];
  leaveList: any[];
  rows = [];
  count = 0;
  offset = 0;
  limit = 30;
  loading = false;
  paid = false;
  unpaid = false;
  hasError = true;
  leaveTypesList;
  leaveTypesId;
  categoryChangesSub: Subscription;

  @ViewChild('leavesTabSet') refNgbTabset: NgbTabset;
  ngOnInit() {
    this.fetchUser();
    this.fetchLeaveTypes();
    this.form = this.fb.group({
      numberOfDays: [null, Validators.compose([Validators.required])],
      date: [null, Validators.compose([Validators.required])],
      category: [null, Validators.compose([Validators.required])]
    });
    this.unpaidform = this.fb.group({
      leaveTypesId: ['default', Validators.compose([Validators.required])],
      numberOfDays: [null, Validators.compose([Validators.required])],
      comment: [null],
      date: [null, Validators.compose([Validators.required])],
      category: [null, Validators.compose([Validators.required])]
    });

    this.categoryChangesSub = this.form.valueChanges.subscribe(changes => {
      this.unpaidform.patchValue({ category: changes.category });
    })
  }




  fetchUser() {
    this.userSrv.fetchUsers().subscribe(user => {
      this.userDetail = this.userSrv.fetchSingleUser(user.data);
    })
  }

  fetchLeaveTypes() {
    this.hrService.fetchLeaves().subscribe((leaveTypes: any) => {
      this.leaveTypesList = leaveTypes.leaveTypes;
      this.leaveTypesId = leaveTypes.leaveTypes;

    })
  }

  processPaidCategory() {
    this.paid = true;
    this.unpaid = false;
  }
  get f() {
    return this.form.controls;
  }

  get f_() {
    return this.unpaidform.controls;
  }

  processUnpaidCategory() {
    this.unpaid = true;
    this.paid = false;
  }

  dateUpdated(date: NgbDateStruct) {
    this.date = date;
    this.getStringDate(this.date);
    this.checkWeekend(date);
  }
  getNgDateFormat() {
    let todayDate = new Date()
    let date = { year: todayDate.getFullYear(), month: todayDate.getMonth() + 1, day: todayDate.getDate() };
    return date;

  }
  getStringDate(date: any) {
    let day = date.day; let month = date.month; let year = date.year;
    day = day.toString().length > 1 ? day : `0${day}`;
    month = month.toString().length > 1 ? month : `0${month}`;
    let newDate = `${year}-${month}-${day}`;
    return newDate;
  }
  checkWeekend(date) {
    let day = date.day; let month = date.month; let year = date.year;
    let newDate = `${year},${month},${day}`;
    let jsDate = new Date(newDate).toString();
    if (jsDate.includes('Sun') || jsDate.includes('Sat')) {
      this.displayErr = true;
    } else {

      this.displayErr = false;
    }
  }


  isBtnDisabled() {
    return this.form.invalid || this.loading || this.displayErr;
  }

  confirmBtnDisabled() {
    return this.unpaidform.invalid || this.loading || this.displayErr || this.hasError;
  }



  validateLeaveType(event) {
    if (event.srcElement.value === 'default') {
      this.hasError = true;
      this.confirmBtnDisabled();
    }
    else {
      this.hasError = false;
    }
  }

  closeRequestLeaveHandler(content) {
    this.closeTab(null, content);
  }

  newTabHandler(): void {
    if (this.createRequestLeaveNewTab()) {
      this.addToTabs();
      this.focusOnCreatedTab();
    } else {
      this.toastr.warningToastr('Tab already open', null);
    }
    return;
  }

  createRequestLeaveNewTab(): boolean {
    const newTabsOpen = this.openTabs.filter(tabsOpen => tabsOpen.type === 'CREATE_REQUEST_LEAVE');
    if (newTabsOpen.length > 0) {
      return false;
    }
    return true;
  }

  leavesSuccessHandler(leaveCreated, tabIndex: number): void {
    this.closeTab(null, tabIndex);
    // this.fetchLeaves();
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
      newTab = { title: 'New Request Leave', type: 'CREATE_REQUEST_LEAVE' };
    }
    else if (type === 'UPDATE_REQUEST_LEAVE') {
      newTab = { title, content: tabContent, type: 'UPDATE_REQUEST_LEAVE', id };
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
    this.paid = false;
    this.unpaid = false;
    this.unpaidform.reset();
    this.form.reset();
    this.displayErr = false;
  }





  removeFromTab(indexes: number[]): void {

    indexes.forEach(i => {
      this.openTabs.splice(i, 1);
    });

  }

  focusOnCreatedTab() {
    setTimeout(() => { this.refNgbTabset.select(this.latestTabId); }, 50);
  }

  // fetchdata() {
  //   this.hrService.fetchLeaves().subscribe((data: LeavesResponse) => {
  //     if (data) {
  //       this.leaveList = data.leaveTypes;
  //     }
  //     this.page(this.offset, this.limit);
  //   })

  // }


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
      // this.fetchdata();
    }
  }

  onSubmit() {
    this.loading = true;
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    const numberOfDays = this.f.numberOfDays.value.toString();
    const date = this.getStringDate(this.date);
    const category = this.f.category.value;


    this.employeeService.requestLeave(this.userDetail.uuid, category, numberOfDays, date)
      .pipe()
      .subscribe(
        successRes => {
          this.toastr.successToastr('Leave Request Successful', null);
          this.closeRequestLeaveHandler(this.userInfo.id);
          this.form.reset();
          this.displayErr = false;
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


  submitForm() {
    console.log(this.unpaidform.value);
    this.loading = true;
    if (this.unpaidform.invalid) {
      return;
    }

    this.loading = true;
    const leaveTypesId = this.f_.leaveTypesId.value;
    const numberOfDays = this.f_.numberOfDays.value.toString();
    const comment = this.f_.comment.value;
    const date = this.getStringDate(this.date);
    const category = this.f_.category.value;


    this.employeeService.requestUnpaidLeave(comment, this.userDetail.uuid, category, leaveTypesId, numberOfDays, date)
      .pipe()
      .subscribe(
        successRes => {
          this.toastr.successToastr('Leave Request Successful', null);
          this.closeRequestLeaveHandler(this.userInfo.id);
          this.unpaidform.reset();
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

  ngOnDestroy(): void {
    if (this.categoryChangesSub) {
      this.categoryChangesSub.unsubscribe();
    }
  }







}
