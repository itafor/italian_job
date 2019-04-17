import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { TaskManagerService } from '../taskmanager.service';
import { first } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from '../../account/account.authentication';


interface ProjectBoard {
  project: string;
}

@Component({
  selector: 'app-taskmanager-project',
  templateUrl: './taskmanager-project.component.html',
  styleUrls: ['./taskmanager-project.component.scss']
})

export class TaskManagerProjectComponent implements OnInit {

  public form: FormGroup;
  disableBtn = false;
  disableCreateProject = false;
  projname;
  closeResult: string;
  submitting = false;
  loadingError: string = null;
  loading = true;
  projectloader = true;
  noProjects = true;
  project_name;
  taskboardUrl = '/taskmanager/project/';
  settingsUrl = '/taskmanager/project/settings/';
  tasknameInputMaxErr = false;
  projectInputMaxErr = false;
  selectedProject;
  Users;
  userinview = '';
  roleinview = '';
  roleList = [];
  public checkForUpdates = [
    'name'
  ];

  constructor(
    private taskmanagerService: TaskManagerService,
    private modalService: NgbModal,
    private router: Router,
    public toastr: ToastrManager,
    private fb: FormBuilder,
    public auth: AuthenticationService,
    ) {}

  projectList = [];
  rows = [];
  count = 0;
  offset = 0;
  limit = 100;


  open(content) {
    if (!this.auth.isAdmin) {
      return;
    }
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.project_name = '';
  }

  private getDismissReason(reason: any): string {
    this.form.reset();
    if (reason === ModalDismissReasons.ESC) {
      this.submitting = false;
      return 'by pressing ESC';


    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  ngOnInit() {
    this.loading = true;
    this.form = this.fb.group({
      projectName: [null, Validators.compose([Validators.required, Validators.minLength(3)])]
    });

    this.fetchProject();
    this.fetchRole();
    this.getAllUser();
  }

  handleNetworkErrors(err: HttpErrorResponse | string) {
    if (typeof err === 'string') {
      this.loadingError = err;
    } else if (err instanceof HttpErrorResponse) {
      this.loadingError = err.message;
    } else {
      this.loadingError = 'An Error Occured';
    }
    this.loading = false;
  }

  getProjectInitial(str: string) {
    if (!str || !str.length) {
      return 'UN';
    }
    const firstLetter = str.slice(0, 1).toUpperCase();
    const secondLetter = str.slice(1, 2).toUpperCase();
    const result = `${firstLetter}${secondLetter}`;
    return result;
  }

  get f() { return this.form.controls; }

  fetchProject() {
    this.taskmanagerService.fetchProjects().subscribe((data: any) => {
      if (data) {
        this.projectList = data.projectList;
        this.projectloader = false;
      }
      this.onPage(this.offset, this.limit);
      this.loading = false;
    },
    err => {
    this.handleNetworkErrors(err);
    });
  }

  fetchRole() {
    this.taskmanagerService.fetchRole().subscribe((data: any) => {
      if (data) {
        this.roleList = data.roleList;
      }
      this.loading = false;
      this.onPage(this.offset, this.limit);
    },
    err => this.handleNetworkErrors(err));
  }

  onPage(offset, limit) {
    this.count = this.projectList.length;
    const start = this.offset * this.limit;
    const end = start + this.limit;
    this.rows = this.projectList;
  }

  isBtnDisabled() {
    this.disableBtn = true;
    return !this.projname || !this.projname.length || this.projname.length > 50 || this.projname.length < 3 ||  this.submitting;

  }

  int(projname) {
    if (projname && projname.length > 50) {
      this.tasknameInputMaxErr = true;
    } else {
      this.tasknameInputMaxErr = false;
    }
  }

  submitForm() {
    this.project_name = '';
    this.submitting = true;
    this.loading = true;
    this.disableCreateProject = true;


    const projectName = this.f.projectName.value;

    if (projectName && projectName.length <= 2) {
      this.projectInputMaxErr = true;
    } else {
      this.taskmanagerService.createProject(projectName).subscribe(
        data => {
          this.toastr.successToastr('New Project Successfully Created', null, {toastTimeout: 3000, maxShown: 1} );
          this.router.navigate([this.taskboardUrl + data.project.id]);
          this.modalService.dismissAll();
          this.loading = false;
          this.disableCreateProject = false;
        },
        errorRes => {
          this.toastr.errorToastr(errorRes, null, {toastTimeout: 3000, maxShown: 1} );
          this.submitting = false;
          this.disableCreateProject = false;
        }
      );
    }
    return false;
  }

  submitEditForm() {
    this.submitting = true;
    const projectName = this.f.projectName.value;
    this.disableBtn = true;
    const updatedFields: string[] = this.checkForUpdates;
    if (projectName && projectName.length <= 2) {
      this.projectInputMaxErr = true;
    } else {
      this.taskmanagerService.editProject(projectName, this.selectedProject.id, updatedFields).subscribe(
        data => {
          this.toastr.successToastr('Successful', null, {toastTimeout: 3000, maxShown: 1} );
          this.fetchProject();
          this.modalService.dismissAll();
          this.submitting = false;
        },
        errorRes => {
          this.toastr.errorToastr(errorRes, null, {toastTimeout: 3000, maxShown: 1} );
          this.submitting = false;
          this.disableBtn = false;
        }
      );
    }
    return false;
  }

  getAllUser() {
    this.taskmanagerService.getAllUser()
      .pipe(first())
      .subscribe(
        data => {
          this.Users = data.data;
          this.loading = false;
        },
        error => this.handleNetworkErrors(error));
  }

  submitDeleteForm() {
    this.submitting = true;

    this.taskmanagerService.deleteProject(this.selectedProject.id).subscribe(
      data => {
        this.toastr.successToastr('Successful', null, {toastTimeout: 3000, maxShown: 1} );
        this.modalService.dismissAll();
        this.loading = false;
        this.submitting = false;
        this.fetchProject();
      },
      errorRes => {
        this.toastr.errorToastr(errorRes, null, {toastTimeout: 3000, maxShown: 1} );
        this.submitting = false;
      }
    );
  }

  navigatetoprojectboard(row) {
    this.router.navigate([this.taskboardUrl + row.id]);
  }

  openedit(row, contentedit) {
    if (!this.auth.isAdmin) {
      return;
    }
    this.project_name = row.projectSecret.name;
    this.selectedProject = row;
    this.modalService.open(contentedit, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  opendelete(row, contentdelete) {
    if (!this.auth.isAdmin) {
      return;
    }
    this.project_name = row.projectSecret.name;
    this.selectedProject = row;
    this.modalService.open(contentdelete, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openadduser(row, contentadduser) {
    this.selectedProject = row;
    this.modalService.open(contentadduser, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  addusertorole() {
    this.submitting = true;
    if (this.userinview && this.roleinview) {
      this.taskmanagerService.addUserToProject(this.selectedProject.id, this.userinview, this.roleinview).subscribe(
        data => {
          this.toastr.successToastr('Successful', null, {toastTimeout: 3000, maxShown: 1} );
          this.modalService.dismissAll();
          this.submitting = false;
          this.fetchProject();
        },
        errorRes => {
          this.toastr.errorToastr(errorRes, null, {toastTimeout: 3000, maxShown: 1} );
          this.submitting = false;
        }
      );
    } else {
      this.submitting = false;
      this.toastr.errorToastr('Please select a user and a role', null, {toastTimeout: 3000, maxShown: 1} );
    }
  }

  projectSettings(row) {
    this.router.navigate([`/taskmanager/project/settings/` + row.id]);
  }

}
