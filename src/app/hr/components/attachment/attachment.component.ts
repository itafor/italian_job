import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { EmployeeService } from '../employees/employees.service';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AlertService } from 'src/app/components/alert/alert.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface EmployeeResponse {
  employee: any[];
}


@Component({
  selector: 'app-attachment',
  templateUrl: './attachment.component.html',
  styleUrls: ['./attachment.component.scss']
})
export class AttachmentComponent implements OnInit {


  @ViewChild('labelImport')
  labelImport: ElementRef;

  form: FormGroup;
  fileToUpload: File = null;
  attachmentDescription;

  constructor(private employeeService: EmployeeService, public toastr: ToastrManager, private fb: FormBuilder) { }

  submitting = false;
  employeeInfo;
  toastrTimer = 6000;

  @Input() employeeData;
  @Output() addDocumentSuccessfulEvent = new EventEmitter();

  ngOnInit() {
    this.form = this.fb.group({
      token: [null, Validators.compose([Validators.required])],
      description: [null, Validators.compose([Validators.required])]

    });
  }

  fetchEmployeeData() {
    this.employeeService.fetchEmployee(this.employeeData.id).subscribe((data: EmployeeResponse) => {
      if (data) {
        this.employeeInfo = data.employee;
      }
      this.employeeInfo;
    })
  }

  get f() {
    return this.form.controls;
  }

  isBtnDisabled() {
    return this.form.invalid || this.submitting;
  }

  onFileChange(files: FileList) {
    this.labelImport.nativeElement.innerText = Array.from(files)
      .map(f => f.name)
      .join(', ');
    this.fileToUpload = files.item(0);
  }

  onChangeAttachmentDescription(event) {
    this.attachmentDescription = event.srcElement.value;
  }


  uploadDocument(evt: Event) {
    evt.preventDefault();
    this.submitting = true;
    let attachmentFormData = new FormData();
    let gotfile = <File>this.fileToUpload;
    if (gotfile && gotfile.size < 1000000) {
      attachmentFormData.append('files', gotfile, this.attachmentDescription);
      this.processUploadFile(attachmentFormData);
    } else {
      this.toastr.errorToastr('Attachment File Size Too Large: Max (1MB) Allowed', null, { toastTimeout: this.toastrTimer, maxShown: 1 });
      this.submitting = false;
    }
  }

  processUploadFile(file) {
    this.employeeService.uploadAttachment(file)
      .pipe()
      .subscribe(
        data => {
          if (data.data.token) {
            this.saveAttachment(this.employeeData.id, data.data.token, this.attachmentDescription);
          }
        },
        error => {
          this.submitting = false;
          this.toastr.errorToastr(error, null, { toastTimeout: this.toastrTimer });
        });
  }

  saveAttachment(employeeDataId, token, attachmentDescription) {
    this.employeeService.saveAttachment(employeeDataId, token, attachmentDescription)
      .pipe()
      .subscribe(
        data => {
          this.fetchEmployeeData();
          this.toastr.successToastr('Document Added Successfully', null, { toastTimeout: this.toastrTimer,  maxShown: 1 });
          this.addDocumentSuccessfulEvent.emit(data['employeeData']);

        },
        error => {
          this.submitting = false;
          this.toastr.errorToastr(error, null, { toastTimeout: this.toastrTimer });
        });
  }
}
