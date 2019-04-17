import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { TaskManagerService } from '../taskmanager.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-taskmanager-role',
  templateUrl: './taskmanager-role.component.html',
  styleUrls: ['./taskmanager-role.component.scss']
})

export class TaskManagerRoleComponent implements OnInit {

  public form: FormGroup;
  closeResult: string;
  submitting = false;
  selectedRole;
  projectInputMaxErr = false;
  roleloader = true;
  roleList = [];
  capabilityList = [];
  role_name = '';
  capabilityArray = [];

  selectedPrivateEmail = [];

  rowsCapablity = [];

  constructor(
    private taskmanagerService: TaskManagerService,
    private modalService: NgbModal,
    private router: Router,
    public toastr: ToastrManager,
    private fb: FormBuilder
  ) { }

  rows = [];
  count = 0;
  offset = 0;
  limit = 100;

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.role_name = "";
  }

  private getDismissReason(reason: any): string {
    this.capabilityArray = [];
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  ngOnInit() {
    this.form = this.fb.group({
      roleName: [null, Validators.compose([Validators.required, Validators.minLength(2)])]
    });
    this.fetchCapabilities();
    this.fetchRole();
  }

  get f() { return this.form.controls; }

  fetchCapabilities() {
    this.taskmanagerService.fetchCapabilities().subscribe((data: any) => {
      if (data) {
        this.capabilityList = data.capabilities;
      }
    });
  }

  fetchRole() {
    this.taskmanagerService.fetchRole().subscribe((data: any) => {
      if (data) {
        this.roleList = data.roleList;
        this.roleloader = false;
      }
      this.onPage(this.offset, this.limit);
    });
  }

  onPage(offset, limit) {
    this.count = this.roleList.length;
    const start = this.offset * this.limit;
    const end = start + this.limit;
    this.rows = this.roleList;
  }

  submitForm() {
    this.role_name = '';
    this.submitting = true;

    const roleName = this.f.roleName.value;
    //const capabilityName = this.f.capabilityName.value;
    if (this.rowsCapablity.length > 0) {
      this.taskmanagerService.createRole(roleName, this.rowsCapablity).subscribe(
        data => {
          this.toastr.successToastr('New Role Successfully Created', null, { toastTimeout: 3000 });
          this.modalService.dismissAll();
          this.submitting = false;
          this.fetchRole();
          this.rowsCapablity = [];
        },
        errorRes => {
          this.toastr.errorToastr(errorRes, null, { toastTimeout: 3000 });
          this.submitting = false;
        }
      );
    } else {
      this.toastr.errorToastr('Please select a capability', null, { toastTimeout: 3000 });
      this.submitting = false;
    }
  }

  submitEditForm() {
    this.submitting = true;
    const roleName = this.f.roleName.value;
    // this.disableBtn = true;

    if (roleName && roleName.length <= 2) {
      this.projectInputMaxErr = true;
    } else {
      this.taskmanagerService.editRole(roleName, this.rowsCapablity, this.selectedRole.id).subscribe(
        data => {
          this.toastr.successToastr('Successful', null, { toastTimeout: 3000, maxShown: 1 });
          this.fetchRole();
          this.modalService.dismissAll();
          this.submitting = false;
        },
        errorRes => {
          this.toastr.errorToastr(errorRes, null, { toastTimeout: 3000, maxShown: 1 });
          this.submitting = false;
          // this.disableBtn = false;
        }
      );
    }
    return false;
  }

  // ttoggleCapability(event){
  //   if(event.explicitOriginalTarget.checked){
  //     this.capabilityArray.push(event.explicitOriginalTarget.value);
  //     console.log(event)
  //   }else{
  //     var index = this.capabilityArray.indexOf(event.explicitOriginalTarget.value);
  //     if (index > -1) {
  //       this.capabilityArray.splice(index, 1);
  //     }
  //   }
  // }

  toggleCapability($event: Event) {
    const { target } = $event;
    const id = (target as HTMLInputElement).getAttribute('data-value');
    if ((target as HTMLInputElement).checked) {
      this.rowsCapablity.push(id);
    } else {
      const index = this.rowsCapablity.indexOf(id);
      if (index > -1) {
        this.rowsCapablity.splice(index, 1);
      }
    }
  }


  editarole(row, editrole) {
    this.role_name = row.roleSecret.name;
    this.form.controls['roleName'].setValue(row.roleSecret.name);
    this.rowsCapablity = row.roleSecret.capabilities;
    this.selectedRole = row;
    this.modalService.open(editrole, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  opendelete(row, contentdelete) {
    this.role_name = row.roleSecret.name;
    this.selectedRole = row;
    this.modalService.open(contentdelete, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


}
