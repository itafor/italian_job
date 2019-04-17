import { Component, OnInit } from '@angular/core';
import { TemplateService } from '../template.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

interface templateResponse {
  templates: any[];
}

@Component({
  selector: 'app-list-template',
  templateUrl: './list-template.component.html',
  styleUrls: ['./list-template.component.scss']
})
export class ListTemplateComponent implements OnInit {

  constructor(private templateService: TemplateService, private router: Router) { }
  templateList = [];
  rows = [];
  count = 0;
  offset = 0;
  limit = 10;
  editTemplate = '/notifications/update-template';
  listTemplate = '/notifications/list-template';
  showAlert = false;
  responsemsg = '';

  ngOnInit() {
    this.fetchdata();
  }

  fetchdata(){
    this.templateService.fetch().subscribe((data: templateResponse) => {
      if (data) {
        this.templateList = data.templates;
      }
      this.onPage(this.offset, this.limit);
    });
  }

  onPage(offset, limit) {
    this.count = this.templateList.length;
    const start = this.offset * this.limit;
    const end = start + this.limit;
    this.rows = this.templateList;
  }

  edit(data) {
    const theRouter = this.router;
    theRouter.navigate([this.editTemplate + '/' + data.templateId]);
  }

  suspend(data) {
    this.templateService.suspend(data.templateId)
      .pipe()
      .subscribe(
        data => {
          this.fetchdata();
        },
        error => {
          this.responsemsg = error;
          this.showAlert = true;
        });
  }

  unsuspend(data) {
    this.templateService.unsuspend(data.templateId)
      .pipe()
      .subscribe(
        data => {
          this.fetchdata();
        },
        error => {
          this.responsemsg = error;
          this.showAlert = true;
        });
  }

  delete(data) {
    this.templateService.delete(data.templateId)
      .pipe()
      .subscribe(
        data => {
          this.fetchdata();
        },
        error => {
          this.responsemsg = error;
          this.showAlert = true;
        });
  }

}
