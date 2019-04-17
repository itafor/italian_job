import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { TaskManagerService } from 'src/app/taskmanager/taskmanager.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AlertService } from 'src/app/components/alert/alert.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';

interface ProjectResponse {
  project: any[];
}

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {

  constructor(private taskmanagerService: TaskManagerService,
    private route: ActivatedRoute, public toastr: ToastrManager,
    private alertService: AlertService, private fb: FormBuilder) { }
  public form: FormGroup;
  projectInfo;
  projectID;
  addDescription= false;
  displayDesc = true;
  loading = false;
  projectDescription;
  public checkForUpdates = [
    'description'
  ];


  @Input() generalSetUp: any;
  openTabs: any[] = [];
  @ViewChild('goalsTabSet') refNgbTabset: NgbTabset;

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.projectID = params['id'];
    });
    this.fetchProjectInfo();
    
  }



  fetchProjectInfo() {
    this.taskmanagerService.fetchTaskboardColumns(this.projectID).subscribe((projectData: ProjectResponse) => {
      if (projectData) {
        this.projectInfo = projectData.project;
      }
    })
  }

  addDescriptionHandler() {
    this.addDescription = true;
    this.displayDesc = false;
    this.form = this.fb.group({
      projectDescription: [this.projectInfo.projectSecret.description, Validators.compose([Validators.required])]
    });
  }
  closeDescriptionHandler() {
    this.addDescription = false;
    this.displayDesc = true;
    this.projectDescription = null;
  }


  get f() {
    return this.form.controls;
  }

  

  isBtnDisabled() {
    return this.form.invalid || this.loading;
  }



  submitForm(evt: Event) {
    evt.preventDefault();
    this.loading = true;
    if (this.form.invalid) {
      return;
    }
    const projectDescription = this.f.projectDescription.value;
    const updatedFields: string[] = this.checkForUpdates;
    this.taskmanagerService.addDescriptionProject(this.projectID, projectDescription, updatedFields).subscribe(
      successRes => {
        this.fetchProjectInfo();
        this.toastr.successToastr('Description Added', null, { maxShown: 1 });
        this.closeDescriptionHandler();
      },
      errorRes => {
        this.alertService.error(errorRes, true);
        this.loading = false;
      },
      () => {
        this.loading = false;
      }
    );
    return false;
  }


  get boardUrl(): string[] {
    return ['/', 'taskmanager', 'project', this.projectID];
  }



}
