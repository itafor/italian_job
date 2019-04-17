import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { TaskManagerService } from 'src/app/taskmanager/taskmanager.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AlertService } from 'src/app/components/alert/alert.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';

interface ProjectResponse {
  projectData: any[];
}

interface FieldsResponse {
  fieldsList: any[]
}


@Component({
  selector: 'app-fields',
  templateUrl: './fields.component.html',
  styleUrls: ['./fields.component.scss']
})
export class FieldsComponent implements OnInit {

  constructor(private taskmanagerService: TaskManagerService, private alertService: AlertService,
    private route: ActivatedRoute, public toastr: ToastrManager, private fb: FormBuilder, ) { }
  public form: FormGroup;
  openTabs: any[] = [];
  projectInfo;
  projectID;
  rows = [];
  count = 0;
  offset = 0;
  limit = 50;
  fieldList;
  fieldsData;
  loading = false;
  types = ['NUMBER', 'MONEY', 'DATE', 'TEXT'];
  public checkForUpdates = [
    'name',
    'description',
    'type',

  ];

  @ViewChild('fieldsTabSet') refNgbTabset: NgbTabset;

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.projectID = params['id'];
    });
    this.fetchProjectInfo();
    this.fetchfields();
  }
  newTabHandler(): void {
    if (this.createFieldsNewTab()) {
      this.addToTabs();
      this.focusOnCreatedTab();
    } else {
      this.toastr.warningToastr('Tab already open', null, { maxShown: 1 });
    }
    return;
  }

  createFieldsNewTab(): boolean {
    const newTabsOpen = this.openTabs.filter(tabsOpen => tabsOpen.type === 'CREATE_FIELDS');
    if (newTabsOpen.length > 0) {
      return false;
    }
    return true;
  }


  fieldsSuccessHandler(fieldCreated, tabIndex: number, idToClose?: string): void {
    this.closeTab(null, tabIndex, idToClose);
    this.fetchfields();
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
      newTab = { title: 'New Field', type: 'CREATE_FIELDS' };
    }
    else if (type === 'VIEW_FIELDS') {
      newTab = { title, content: tabContent, type: 'VIEW_FIELDS', id };
    }
    else if (type === 'UPDATE_FIELDS') {
      newTab = { title, content: tabContent, type: 'UPDATE_FIELDS', id };
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

  fetchfields() {
    this.taskmanagerService.fetchFields(this.projectID).subscribe((data: FieldsResponse) => {
      if (data) {
        this.fieldList = data.fieldsList;
      }
      this.onPage(data);
      this.page(this.offset, this.limit);
    });
  }

  page(offset, limit) {
    this.count = this.fieldList.length;
    const start = offset * limit;
    const end = start + limit;
    const rows = [...this.rows];

    for (let i = start; i < end; i++) {
      rows[i] = this.fieldList[i];
    }

    this.rows = rows;

  }


  onPage(event) {
    this.page(event.offset, event.limit);
  }

  refreshTable(tabChangeEvent) {
    if (tabChangeEvent['nextId'] === 'fields') {
      this.fetchfields();
    }
  }

  isBtnDisabled() {
    return this.form.invalid || this.loading;
  }

  updateFieldHandler(content) {
    this.addToTabs(`Updating ${content.fieldsSecret.name}`, content, 'UPDATE_FIELDS');
    this.fieldsData = content;
    this.form = this.fb.group({
      name: [content.fieldsSecret.name, Validators.compose([Validators.required])],
      description: [content.fieldsSecret.description, Validators.compose([Validators.required])],
      type: [content.fieldsSecret.type, Validators.compose([Validators.required])]
    });
    this.focusOnCreatedTab();

  }

  closeUpdateFieldHandler(content) {
    this.closeTab(null, content);
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

    const name = this.f.name.value;
    const description = this.f.description.value;
    const type = this.f.type.value;
    const updatedFields: string[] = this.checkForUpdates;
    this.taskmanagerService.updateFields(this.projectID, this.fieldsData.id, description, name, type, updatedFields)
      .pipe()
      .subscribe(
        successRes => {
          this.fetchfields();
          this.toastr.successToastr('Field Updated Successfully', null, { maxShown: 1 });
          this.closeUpdateFieldHandler(this.fieldsData.id);
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




}
