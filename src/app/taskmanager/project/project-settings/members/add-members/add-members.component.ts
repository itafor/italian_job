import { Component, OnInit, ViewChild, EventEmitter, Output  } from '@angular/core';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { TaskManagerService } from 'src/app/taskmanager/taskmanager.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AlertService } from 'src/app/components/alert/alert.service';
import { GetService } from 'src/app/file-manager/services/get.service';
import { first } from 'rxjs/operators';

interface MembersResponse {
  data: any[]
}

interface RoleResponse {
  roleList: any[]
}

interface UsersResponse {
  data: any[]
}



@Component({
  selector: 'app-add-members',
  templateUrl: './add-members.component.html',
  styleUrls: ['./add-members.component.scss']
})
export class AddMembersComponent implements OnInit {
  memberList: any[] = [];
  roleList;
  userIdList = [];
  projectID;
  loading = false;
  userHasError = true;
  roleHasError = true;
  userinview = '';
  roleinview = '';
  Users;

  @Output() membersCreatedSuccessfulEvent = new EventEmitter();

  constructor(private taskmanagerService: TaskManagerService,
    private getService: GetService,
    private route: ActivatedRoute, public toastr: ToastrManager, private alertService: AlertService) { }

 
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.projectID = params['id'];
    });
    this.fetchRole();
    this.getAllUser();
  }

  isBtnDisabled() {
    return this.userHasError || this.roleHasError  || this.loading;
  }

  fetchmembers() {
    this.taskmanagerService.fetchMembers(this.projectID).subscribe((data: MembersResponse) => {
      if (data) {
        this.memberList = data.data;
      }
    })
  }

  fetchRole() {
    this.taskmanagerService.fetchRole().subscribe((data: any) => {
      if (data) {
        this.roleList = data.roleList;
      }
    });
  }


  getAllUser() {
    this.taskmanagerService.getAllUser()
      .pipe(first())
      .subscribe(
        data => {
          this.Users = data.data;
        },
        error => {
          this.alertService.error(error, true);
        });
  }


  addMembersForm(event: Event) {
    event.preventDefault();
    
    this.loading = true;
    this.taskmanagerService.addUserToProject(this.projectID, this.userinview, this.roleinview).subscribe(
      successRes => {
        this.fetchmembers();
        this.toastr.successToastr('Member Added Successfully', null, { maxShown: 1 });
        this.membersCreatedSuccessfulEvent.emit(successRes['members']);
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

  validateUser(value) {
    if (value === 'default') {
      this.userHasError = true;
      this.isBtnDisabled();
    }
    else {
      this.userHasError = false;
      this.loading = false;
    }
  }

  validateRole(value) {
    if (value === 'default') {
      this.roleHasError = true;
      this.isBtnDisabled();
    }
    else {
      this.roleHasError = false;
      this.loading = false;
    }
  }

}
