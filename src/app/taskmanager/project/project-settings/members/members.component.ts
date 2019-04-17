import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { TaskManagerService } from 'src/app/taskmanager/taskmanager.service';
import { ToastrManager } from 'ng6-toastr-notifications';

interface ProjectResponse {
  projectData: any[];
}

interface FieldsResponse {
  data: any[]
}

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent implements OnInit {

  constructor(private taskmanagerService: TaskManagerService,
    private route: ActivatedRoute, public toastr: ToastrManager) { }

  openTabs: any[] = [];
  projectInfo;
  projectID;
  rows = [];
  count = 0;
  offset = 0;
  limit = 50;
  membersList;
  @ViewChild('membersTabSet') refNgbTabset: NgbTabset;

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.projectID = params['id'];
    });
    this.fetchProjectInfo();
    this.fetchmembers();

  }

  newTabHandler(): void {
    if (this.addMembersNewTab()) {
      this.addToTabs();
      this.focusOnCreatedTab();
    } else {
      this.toastr.warningToastr('Tab already open', null, { maxShown: 1 });
    }
    return;
  }

  addMembersNewTab(): boolean {
    const newTabsOpen = this.openTabs.filter(tabsOpen => tabsOpen.type === 'ADD_MEMBERS');
    if (newTabsOpen.length > 0) {
      return false;
    }
    return true;
  }


  membersSuccessHandler(membersCreated, tabIndex: number, idToClose?: string): void {
    this.closeTab(null, tabIndex, idToClose);
    this.fetchmembers();
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
      newTab = { title: 'New Member', type: 'ADD_MEMBERS' };
    }
    else if (type === 'VIEW_MEMBER') {
      newTab = { title, content: tabContent, type: 'VIEW_MEMBER', id };
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


  fetchProjectInfo() {
    this.taskmanagerService.fetchTaskboardColumns(this.projectID).subscribe((projectData: ProjectResponse) => {
      if (projectData) {
        this.projectInfo = projectData;
      }
    })
  }

  fetchmembers() {
    this.taskmanagerService.fetchMembers(this.projectID).subscribe((data: FieldsResponse) => {
      if (data) {
        this.membersList = data.data;
      }
      this.onPage(data);
      this.page(this.offset, this.limit);
    });
  }

  page(offset, limit) {
    this.count = this.membersList.length;
    const start = offset * limit;
    const end = start + limit;
    const rows = [...this.rows];

    for (let i = start; i < end; i++) {
      rows[i] = this.membersList[i];
    }

    this.rows = rows;

  }


  onPage(event) {
    this.page(event.offset, event.limit);
  }

  refreshTable(tabChangeEvent) {
    if (tabChangeEvent['nextId'] === 'fields') {
      this.fetchmembers();
    }
  }


}
