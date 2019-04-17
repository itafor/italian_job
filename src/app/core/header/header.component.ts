import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/account/account.authentication';
import { AlertService } from 'src/app/components/alert/alert.service';
import { UserManagementService } from '../../usermanagement/usermanagement.service';
// import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit  {
  @Input()
  heading: string;
  @Output()
  toggleSidenav = new EventEmitter<void>();
  user = JSON.parse(localStorage.getItem('currentUser'));
  firstname;
  lastname;
  firstLetterFirstname;
  firstLetterLastname;
  closeResult;
  oldPassword;
  newPassword;
  confirmPassword;
  submitting;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    // public toastr: ToastrManager,
    private usermanagementService: UserManagementService
    ) {

  }

  logout() {
    if (this.authenticationService.currentUserValue) {
      this.authenticationService.logout();
    }
    this.alertService.success('You have successfully logged out', true);
    this.router.navigate(['/account/signin']);
  }

  dashboard() {
    this.router.navigate(['/dashboard']);
  }

  ngOnInit() {
    this.firstname = this.user.firstName;
    this.lastname = this.user.lastName;
    this.firstLetterFirstname = this.user.firstName.charAt(0);
    this.firstLetterLastname = this.user.lastName.charAt(0);
  }

  submitChangePassword() {
    this.usermanagementService.updatePassword(this.oldPassword, this.newPassword, this.confirmPassword).subscribe(
      data => {
        // this.toastr.successToastr('Successful', null, {toastTimeout: 3000} );
        this.modalService.dismissAll();
        this.submitting = true;
      },
      error => {
        // this.toastr.errorToastr(error, null, {toastTimeout: 3000} );
        this.submitting = false;
      }
    );
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
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
      return `with: ${reason}`;
    }
  }

}

