import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { EmployeeService } from '../employees/employees.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface EmployeeResponse {
  employee: any[];
}
@Component({
  selector: 'app-view-employee',
  templateUrl: './view-employee.component.html',
  styleUrls: ['./view-employee.component.scss']
})
export class ViewEmployeeComponent implements OnInit {
  closeResult: string;
  assignDept = false;
  assignRole = false;
  assignLeave = false;
  addAttachment = false;
  addPayslip = false;
  unassignedDept;
  unassignedRole;
  unassignedLeaveDays;
  noAttachment;
  noPayslip;
  newAssignedRole;
  newAssignedDept;
  newAddedDocs;
  newAddedPayslip;
  newAddedLeaveDays;
  passportupload;
  processing;
  passportFile;
  toastrTimer = 6000;
  submitting = false;
  numberOfLeaveDaysHasError = true;



  @ViewChild('labelImport')
  labelImport: ElementRef;

  form: FormGroup;
  fileToUpload: File = null;
  payslipDescription;
  payslipMonth;
  payslipYear;

  @Input() employeeData: any;
  @Output() updateEmployeeEvent = new EventEmitter();

  constructor(private employeeService: EmployeeService, public toastr: ToastrManager, private fb: FormBuilder) { }
  employeeInfo;
  newNumberOfLeaveDays: any;
  ngOnInit() {
    this.fetchEmployeeData();
    this.form = this.fb.group({
      payslip: [null, Validators.compose([Validators.required])],
      payslipmonth: [null, Validators.compose([Validators.required])],
      payslipyear: [null, Validators.compose([Validators.required])],
    });

  }

  fetchEmployeeData() {
    this.employeeService.fetchEmployee(this.employeeData.id).subscribe((employeeInfo: EmployeeResponse) => {
      if (employeeInfo) {
        this.employeeInfo = employeeInfo.employee;
      }
      this.employeeRoleAssign();
      this.employeeDepartmentAssign();
      this.documentUpload();
      this.employeePayslip();
      this.employeeLeaveDaysAssign();
      this.employeeInfo;
    })
  }

  employeeRoleAssign() {
    if (this.employeeInfo) {
      this.newAssignedRole = this.employeeInfo.roles;
      if (this.newAssignedRole.length === 0) {
        this.unassignedRole = true;
      }
      else {
        this.unassignedRole = false;
        this.newAssignedRole;
      }
    }
  }

  employeeDepartmentAssign() {
    if (this.employeeInfo) {
      this.newAssignedDept = this.employeeInfo.departments
      if (this.newAssignedDept.length === 0) {
        this.unassignedDept = true;
      }
      else {
        this.unassignedDept = false;
        this.newAssignedDept;
      }
    }
  }

  documentUpload() {
    if (this.employeeInfo) {
      this.newAddedDocs = this.employeeInfo.employeeSecret.attachment
      if (this.newAddedDocs === null) {
        this.noAttachment = false;
      }
      else {
        this.noAttachment = true;
        this.newAddedDocs;
      }
    }
  }

  employeePayslip() {
    if (this.employeeInfo) {
      this.newAddedPayslip = this.employeeInfo.employeeSecret.payslipDetails
      if (this.newAddedPayslip === null) {
        this.noPayslip = false;
      }
      else {
        this.noPayslip = true;
        this.newAddedPayslip;
      }
    }
  }


  employeeLeaveDaysAssign() {
    if (this.employeeInfo) {
      this.newAddedLeaveDays = this.employeeInfo.employeeSecret.numberOfLeaveDays
      if (this.newAddedLeaveDays === null) {
        this.unassignedLeaveDays = true;
      }
      else {
        this.unassignedLeaveDays = false;
        this.newAddedLeaveDays;
      }
    }
  }


  addPassport() {
    document.getElementById('passportupload').click();
  }

  onChangeUploadPassport(event) {
    if (event) {
      this.processing = true;
      let avatar = event.target.files[0];
      let passportFormData = new FormData();
      let gotfile = <File>avatar;
      if (gotfile && gotfile.size < 1000000) {
        passportFormData.append('files', gotfile, gotfile.name);
        this.processPassportUpload(passportFormData);
      } else {
        this.toastr.errorToastr('Passport File Size Too Large: Max (1MB) Allowed', null, { toastTimeout: this.toastrTimer, maxShown: 1 });
        this.processing = false;
      }
    }
  }


  processPassportUpload(file) {
    this.employeeService.uploadAttachment(file)
      .pipe()
      .subscribe(
        data => {
          if (data.data.token) {
            this.changePassport(this.employeeData.id, data.data.token);
          }
        },
        error => {
          this.processing = false;
          this.toastr.errorToastr(error, null, { toastTimeout: this.toastrTimer });
        });
  }

  changePassport(employeeDataId, token) {
    this.employeeService.savePassport(employeeDataId, token)
      .pipe()
      .subscribe(
        data => {
          this.fetchEmployeeData();
          this.toastr.successToastr('Passport Uploaded Successfully', null, { toastTimeout: this.toastrTimer, maxShown: 1 });
          this.processing = false;

        },
        error => {
          this.processing = false;
          this.toastr.errorToastr(error, null, { toastTimeout: this.toastrTimer });
        });
  }

  isBtnDisabled() {
    return this.form.invalid || this.submitting;
  }


  get f() {
    return this.form.controls;
  }

  onChangePayslip(files: FileList) {
    this.labelImport.nativeElement.innerText = Array.from(files)
      .map(f => f.name)
      .join(', ');
    this.fileToUpload = files.item(0);
  }


  onChangePayslipMonth(event) {
    this.payslipMonth = event.srcElement.value;
  }

  onChangePayslipYear(event) {
    this.payslipYear = event.srcElement.value;
  }


  uploadPayslip(evt: Event) {
    evt.preventDefault();
    this.submitting = true;
    let payslipFormData = new FormData();
    let gotfile = <File>this.fileToUpload;
    if (gotfile && gotfile.size < 1000000) {
      payslipFormData.append('files', gotfile, gotfile.name);
      this.processPayslipFile(payslipFormData);
    } else {
      this.toastr.errorToastr('File Size Too Large: Max (1MB) Allowed', null, { toastTimeout: this.toastrTimer, maxShown: 1 });
      this.submitting = false;
    }
  }

  processPayslipFile(file) {

    this.employeeService.uploadAttachment(file)
      .pipe()
      .subscribe(
        data => {
          if (data.data.token) {
            this.savePayslip(this.employeeData.id, data.data.token, this.payslipMonth, this.payslipYear);
          }
        },
        error => {
          this.submitting = false;
          this.toastr.errorToastr(error, null, { toastTimeout: this.toastrTimer });
        });
  }

  savePayslip(employeeDataId, token, payslipMonth, payslipYear) {
    this.employeeService.savePayslip(employeeDataId, token, payslipMonth, payslipYear)
      .pipe()
      .subscribe(
        data => {
          this.fetchEmployeeData();
          this.toastr.successToastr('Payslip Added Successfully', null, { toastTimeout: this.toastrTimer, maxShown: 1 });
          this.closePayslipHandler();
          this.form.reset();
          this.submitting = false;
        },
        error => {
          this.submitting = false;
          this.toastr.errorToastr(error, null, { toastTimeout: this.toastrTimer });
        });
  }

  confirmBtnDisabled() {
    return !this.newNumberOfLeaveDays || this.submitting;
  }
  
  validateLeaveDaysNumber(event) {
    if (event === '') {
      this.numberOfLeaveDaysHasError = true;
      this.newNumberOfLeaveDays = event.srcElement.value;
      this.confirmBtnDisabled();
    }
    else {
      this.newNumberOfLeaveDays= event.srcElement.value;
      this.numberOfLeaveDaysHasError = false;
      this.submitting = false;
    }
  }

  submitForm(evt: Event) {
    evt.preventDefault();
    this.submitting = true;
    this.employeeService.assignLeaveDaysNumber(this.employeeData.id, this.newNumberOfLeaveDays).subscribe(
      successRes => {
        this.fetchEmployeeData();
        this.toastr.successToastr('Leave Days Assigned', null, { maxShown: 1 });
        this.closeLeaveDaysHandler();
      },
      errorRes => {
        // this.alertService.error(errorRes, true);
        this.submitting = false;
      },
      () => {
        this.submitting = false;
      }
    );
    return false;
  }



  assignDepartmentHandler() {
    this.assignDept = true;
  }

  closeDepartmentHandler() {
    this.assignDept = false;
    this.fetchEmployeeData();
  }

  assignRoleHandler() {
    this.assignRole = true;
  }

  closeRoleHandler() {
    this.assignRole = false;
    this.fetchEmployeeData();
  }

  addAttachmentHandler() {
    this.addAttachment = true;
  }

  closeAttachmentHandler() {
    this.addAttachment = false;
    this.fetchEmployeeData();
  }

  addPayslipHandler() {
    this.addPayslip = true;
  }

  closePayslipHandler() {
    this.addPayslip = false;
    this.fetchEmployeeData();
  }

  assignLeaveDaysHandler() {
    this.assignLeave = true;
  }

  closeLeaveDaysHandler() {
    this.assignLeave = false;
    this.fetchEmployeeData();
  }

  editEmployee(): void {
    this.updateEmployeeEvent.emit(this.employeeInfo);
    this.fetchEmployeeData();
  }

}
