import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskManagerService } from 'src/app/taskmanager/taskmanager.service';


interface ProjectResponse {
  projectData: any[];
}


@Component({
  selector: 'app-project-settings',
  templateUrl: './project-settings.component.html',
  styleUrls: ['./project-settings.component.scss']
})
export class ProjectSettingsComponent implements OnInit {

  constructor(private taskmanagerService: TaskManagerService,
    private route: ActivatedRoute) { }
  projectInfo;
  projectID;
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.projectID = params['id'];
    });
    this.fetchProjectInfo();
  }


  fetchProjectInfo() {
    this.taskmanagerService.fetchTaskboardColumns(this.projectID).subscribe((projectData: ProjectResponse) => {
      if (projectData) {
        this.projectInfo = projectData;
      }
    });
  }
}
