import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { UserManagementService } from './usermanagement.service';

@Component({
  selector: 'app-usermanagement',
  templateUrl: './usermanagement.component.html',
  styleUrls: ['./usermanagement.component.scss']
})

export class UserManagementComponent implements OnInit {
  
  public form: FormGroup;
  public changePasswordForm: FormGroup;
  disableBtn;
  closeResult: string;
  submitting = false;
  loading =false;
  userList = [];

  constructor(
    private usermanagementService: UserManagementService,
    private modalService: NgbModal,
    private router: Router,
    public toastr: ToastrManager,
    private fb: FormBuilder
    ) {}
    
  rows = [];
  count = 0;
  offset = 0;
  limit = 100;

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openChangePass(changepass) {
    this.modalService.open(changepass, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
   
  ngOnInit() {
    
    this.fetchUsers();

    this.form = this.fb.group({
      firstname: [null, Validators.compose([Validators.required])],
      lastname: [null, Validators.compose([Validators.required])],
      email: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required])]
    });

    this.changePasswordForm = this.fb.group({
      oldPassword: [null, Validators.compose([Validators.required])],
      newPassword: [null, Validators.compose([Validators.required])],
      confirmPassword: [null, Validators.compose([Validators.required])]
    });
  }

  fetchUsers(){
    this.usermanagementService.fetchUsers().subscribe(
      data => {
        if(data){
          this.userList = data.data;
        }
        this.onPage(this.offset, this.limit);
      },
      error => {
        console.log(error);
      }
    );
  }

  onPage(offset, limit) {
    this.count = this.userList.length;
    const start = this.offset * this.limit;
    const end = start + this.limit;
    this.rows = this.userList;
    console.log('Page Results', start, end, this.rows);
  }

  get f() { return this.form.controls; }

  get changePassf() { return this.changePasswordForm.controls; }

  submitForm() {
    this.submitting = true;

    const firstname = this.f.firstname.value;
    const lastname = this.f.lastname.value;
    const email = this.f.email.value;
    const password = this.f.password.value;
    
    this.usermanagementService.createUser(firstname, lastname, email, password).subscribe(
      data => {
        this.toastr.successToastr('Successful', null, {toastTimeout: 3000} );
        this.modalService.dismissAll();
        this.loading = false;
        this.fetchUsers();
      },  
      error => {
        this.toastr.errorToastr(error, null, {toastTimeout: 3000} );
        this.submitting = false;
      }
    );
    return false;
  }

  submitChangePasswordForm() { 
    this.submitting = true;

    const oldPassword = this.changePassf.oldPassword.value;
    const newPassword = this.changePassf.newPassword.value;
    const confirmPassword = this.changePassf.confirmPassword.value;
    
    this.usermanagementService.updatePassword(oldPassword, newPassword, confirmPassword).subscribe(
      data => {
        this.toastr.successToastr('Successful', null, {toastTimeout: 3000} );
        this.modalService.dismissAll();
        this.loading = false;
        this.fetchUsers();
      },  
      error => {
        this.toastr.errorToastr(error, null, {toastTimeout: 3000} );
        this.submitting = false;
      }
    );
    return false;
  }

}