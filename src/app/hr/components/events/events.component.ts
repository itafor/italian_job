import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { HrService } from '../../services/hr.service';
import { Observable } from 'rxjs';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AlertService } from 'src/app/components/alert/alert.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';

interface EventsResponse {
  employees: any[]
}

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {
  public form: FormGroup;
  eventList: any[];
  rows = [];
  count = 0;
  offset = 0;
  limit = 40;
  responsemsg;
  suspendingState = false
  loading = false;
  starttime;
  stoptime;
  time;



  @Input() eventData;
  @Output() eventUpdatedSuccessfulEvent = new EventEmitter();
  constructor(private fb: FormBuilder, private hrService: HrService, public toastr: ToastrManager, private alertService: AlertService) { }


  openTabs: any[] = [];
  @ViewChild('eventsTabSet') refNgbTabset: NgbTabset;

  newTabHandler(): void {
    if (this.createEventNewTab()) {
      this.addToTabs();
      this.focusOnCreatedTab();
    } else {
      this.toastr.warningToastr('Tab already open', null, { maxShown: 1 });
    }
    return;
  }

  createEventNewTab(): boolean {
    const newTabsOpen = this.openTabs.filter(tabsOpen => tabsOpen.type === 'NEW_EVENT');
    if (newTabsOpen.length > 0) {
      return false;
    }
    return true;
  }

  eventSuccessHandler(eventCreated, tabIndex: number): void {
    this.closeTab(null, tabIndex);
    this.getEvents();

  }

  updateEventHandler(content) {
    this.addToTabs(`Updating ${content.eventSecret.name}`, content, 'UPDATE_EVENT');
    this.eventData = content;
    this.form = this.fb.group({
      name: [content.eventSecret.name, Validators.compose([Validators.required])],
      description: [content.eventSecret.description, Validators.compose([Validators.required])],
      startTime: [content.eventSecret.startTime, Validators.compose([Validators.required])],
      stopTime: [content.eventSecret.stopTime, Validators.compose([Validators.required])],
    });
    this.focusOnCreatedTab();
  }



  closeUpdateEventHandler(content) {
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
      newTab = { title: 'New Event', type: 'NEW_EVENT' };
    }
    else if (type === 'VIEW_EVENT') {
      newTab = { title, content: tabContent, type: 'VIEW_EVENT', id };
    }
    else if (type === 'UPDATE_EVENT') {
      newTab = { title, content: tabContent, type: 'UPDATE_EVENT', id };
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
    this.getEvents();

  }

  getEvents() {
    this.hrService.fetchEvents().subscribe((data: EventsResponse) => {
      if (data) {
        this.eventList = data.employees;
      }
      this.onPage(data);
      this.page(this.offset, this.limit);
    })
  }

  page(offset, limit) {


    this.count = this.eventList.length;
    const start = offset * limit;
    const end = start + this.limit;
    this.rows = this.eventList;
  }


  get f() {
    return this.form.controls;
  }


  onPage(event) {
    this.page(event.offset, event.limit);
  }

  onUpdate(evt: Event) {
    evt.preventDefault();
    this.loading = true;

    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    const name = this.f.name.value;
    const description = this.f.description.value;
    const stopTime = new Date(this.f.stopTime.value);
    const startTime = new Date(this.f.startTime.value);

    this.hrService.updateEvent(this.eventData.id, name, description, startTime, stopTime)
      .pipe()
      .subscribe(
        successRes => {
          this.getEvents();
          this.toastr.successToastr('Event Updated Successfully', null, { maxShown: 1 });
          this.closeUpdateEventHandler(this.eventData.id);
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

  deleteConfirmHandler(data) {
    this.suspendingState = true;
    this.hrService.deleteEvent(data.id)
      .pipe()
      .subscribe(
        data => {
          this.toastr.successToastr('Event Deleted', null, { maxShown: 1 });
          this.responsemsg = data;
          this.getEvents();
          this.suspendingState = false;
        },
        error => {
          this.responsemsg = error;
          this.toastr.errorToastr('Error: Unable To Perform Operation', null, { maxShown: 1 });
          this.suspendingState = false;
        });
  }

  suspend(data) {
    this.suspendingState = true;
    this.hrService.suspendEvent(data.id)
      .pipe()
      .subscribe(
        data => {
          this.toastr.successToastr('Event Suspended', null, { maxShown: 1 });
          this.responsemsg = data;
          this.getEvents();
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
    this.hrService.unsuspendEvent(data.id)
      .pipe()
      .subscribe(
        data => {

          this.toastr.successToastr('Event Unsuspended', null, { maxShown: 1 });
          this.responsemsg = data;
          this.getEvents();
          this.suspendingState = false;
        },
        error => {
          this.responsemsg = error;
          this.toastr.errorToastr('Error: Unable To Perfom Operation', null, { maxShown: 1 });
          this.suspendingState = false;
        });

  }

  refreshTable(tabChangeEvent) {
    if (tabChangeEvent['nextId'] === 'events-id') {
      this.getEvents();
    }
  }



}

