import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { HrService } from '../../services/hr.service';
import { Observable } from 'rxjs';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AlertService } from 'src/app/components/alert/alert.service';

interface RolesResponse {
  roles: any[]
}

interface RoleResponse {
  role: any[]
}

@Component({
  selector: 'app-list-roles',
  templateUrl: './list-roles.component.html',
  styleUrls: ['./list-roles.component.scss']
})
export class ListRolesComponent implements OnInit {
  roleList: any[];
  roleInfo;
  rows = [];
  count = 0;
  offset = 0;
  limit = 40;
  responsemsg;
  suspendingState = false
  newRoleName: string;
  submitting = false;

  constructor(private hrService: HrService, public toastr: ToastrManager, private alertService: AlertService) { }


  openTabs: any[] = [];
  @ViewChild('rolesTabSet') refNgbTabset: NgbTabset;

  newTabHandler(): void {
    if (this.createRoleNewTab()) {
      this.addToTabs();
      this.focusOnCreatedTab();
    } else {
      this.toastr.warningToastr('Tab already open', null);
    }
    return;
  }

  createRoleNewTab(): boolean {
    const newTabsOpen = this.openTabs.filter(tabsOpen => tabsOpen.type === 'NEW_ROLE');
    if (newTabsOpen.length > 0) {
      return false;
    }
    return true;
  }

  roleSuccessHandler(roleCreated, tabIndex: number): void {
    this.closeTab(null, tabIndex);
    this.getRoles();
  }

  updateRoleHandler(content) {
    this.addToTabs(`Updating ${content.roleSecret.name}`, content, 'UPDATE_ROLE');
    this.roleInfo = content;
    this.newRoleName = this.roleInfo.roleSecret.name
    this.focusOnCreatedTab();
  }

  closeUpdateRoleHandler(content) {
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
      newTab = { title: 'New Role', type: 'NEW_ROLE' };
    }
    else if (type === 'VIEW_ROLE') {
      newTab = { title, content: tabContent, type: 'VIEW_ROLE', id };
    }
    else if (type === 'UPDATE_ROLE') {
      newTab = { title, content: tabContent, type: 'UPDATE_ROLE', id };
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
    this.getRoles();
  }

  getRoles() {
    this.hrService.fetchRoles().subscribe((data: RolesResponse) => {
      if (data) {
        this.roleList = data.roles;
      }
      this.onPage(this.offset, this.limit);
    })
  }

  onPage(offset, limit) {
    this.count = this.roleList.length;
    const start = this.offset * this.limit;
    const end = start + this.limit;
    this.rows = this.roleList;
  }


  isBtnDisabled() {
    return !this.newRoleName || this.submitting;
  }

  submitForm(evt: Event) {
    evt.preventDefault();
    this.submitting = true;
    this.hrService.updateRole(this.roleInfo.id, this.newRoleName).subscribe(
      successRes => {
        this.getRoles();
        this.toastr.successToastr('Role Updated', null, { maxShown: 1 });
        this.closeUpdateRoleHandler(this.roleInfo.id);
        this.newRoleName = null;

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


  deleteConfirmHandler(data) {
    this.suspendingState = true;
    this.hrService.deleteRole(data.id)
      .pipe()
      .subscribe(
        data => {
          this.toastr.successToastr('Role Deleted', null, { maxShown: 1 });
          this.responsemsg = data;
          this.getRoles();
          this.suspendingState = false;
        },
        error => {
          this.responsemsg = error;
          this.toastr.errorToastr('Error: Unable To Perform Operation', null, { maxShown: 1 });
          this.suspendingState = false;
        });
  }

  refreshTable(tabChangeEvent) {
    if (tabChangeEvent['nextId'] === 'roles') {
      this.getRoles();
    }
  }



}
