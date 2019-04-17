import { environment } from './../../../../environments/environment';
import { text_truncate, fileSize, getFileProgressRate, getNavShortPathFunc } from './../../functions/function';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import { pdfExt, ImgExt, getFileIcon, mp3Ext, getNewFileIcon } from '../../functions/ext';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { sortByDateCreated } from '../../functions/function';
import { DomSanitizer } from '@angular/platform-browser';
import { FileManagerService } from '../../services/file-manager.service';
import { FileResponseI, FileI } from '../../model/file.model';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { AuthenticationService } from 'src/app/account/account.authentication';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-myfile',
  templateUrl: './myfile.component.html',
  styleUrls: ['./myfile.component.scss']
})
export class MyFileComponent implements OnInit {
  fileList: FileI[]; folderList: any[]; driveList;
  parentFolder: any[]; parentFile: any[]; subDriveList;
  fileUploadStatus = false;
  driveType = 'file';
  mainViewSize = 'col-sm-9'; driveDetail = false;
  driveDetailInfo: any = '';
  showCreateFolderInput = false; folderName = '';
  fileUploadProgress = 30; setTimeProgress;
  shareComment = ''; accessTo = 'private';
  shareToPeople = []; shareErrMsg;
  shareWithAllCheck = true;
  closeResult: string;
  driveName = 'drivename'; driveInfo: any;
  selectedFile: File = null;
  isOpened = true;
  disableBtn = false; loading = false;
  invalidEmailError = false;
  subFolder = false; mainFIleFolder = true;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  fileBlogUrl;

  breadCumList = [
    { name: 'My Drive', link: '/filemanager', id: null },
  ];

  constructor(
    public toastr: ToastrManager,
    private modalService: NgbModal,
    private authService: AuthenticationService,
    public sanitizer: DomSanitizer,
    private filemangerSrv: FileManagerService) {
  }

  privateEmailsForm = new FormGroup({
    privateEmail: new FormControl('')
  });
  get privateEmail() {
    return this.privateEmailsForm.get('privateEmail');
  }
  getPdfExt(ext) { return pdfExt(ext); }
  getImgExt(ext) { return ImgExt(ext); }
  getFileIcon(ext) { return getFileIcon(ext); }
  getMp3Ext(ext) { return mp3Ext(ext); }
  getShortName(fileName: string, type: string) { return text_truncate(fileName, type);  }
  getPathShortName(fileName: string, type: string, length?) { return text_truncate(fileName, type, length); }
  getFileSize(size) { return fileSize(size); }
  getNavShortPath(array)  {return getNavShortPathFunc(array); }

  ngOnInit() {
    this.fetchFiles();
    if (!this.authService.detailsOfPeopleInMyOrg.length) {
      this.authService.populateEmailsOfPeopleInMyOrganization();
    }
  }
  showContacts(item): boolean {
    return (item.length > 2);
  }

  populateSuggestions(cond: string ): string[] {
      return this.authService.detailsOfPeopleInMyOrg().filter((contact => this.existsIn(contact.email, cond)))
      .map(detail => detail.email)
      .slice(0, 10);
  }

  existsIn(base: string, term: string): boolean {
    return base.toLowerCase().indexOf(term.toLowerCase()) > -1;
  }

  suggestContacts = (mails$: Observable<string>) => mails$.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    map(currentTerm => this.showContacts(currentTerm) ? this.populateSuggestions(currentTerm) : [])
  )
  fetchFiles() {
    this.filemangerSrv.fetchFiles().subscribe((files: FileResponseI) => {
      if (files) {
        this.fileList = files.data;
        this.fileList.sort(sortByDateCreated);
        this.fetchFolder();
      }
    });
  }
  fetchFolder() {
    this.filemangerSrv.fetchFolders().subscribe((folder: any) => {
      if (folder) {
        this.folderList = folder.data;
        this.folderList.sort(sortByDateCreated);
        this.fetchDrive();
      }
    });
  }
  fetchDrive() {
    this.driveList = this.folderList.concat(this.fileList);
  }
  getNewFileIcon(ext) {
    return getNewFileIcon(ext);
  }
  getIsShared(drive) {
    if (drive && drive.shared_with && drive.shared_with.length > 0) {
      return drive.shared_with.length;
    }
    return false;
  }
  getIsSharedClass(drive) {
    if (drive && drive.shared_with && drive.shared_with.length > 0) {
      return 'text-success';
    }
    return 'text-primary';
  }

  // modals
  open(content, drive?, type?, placeHolder?) {
    this.driveType = placeHolder;
    this.modalSetting(content, drive);
  }
  openPreviewFile(content, file) {
    this.closeDetail();
    const size = 'lg';
    this.modalSetting(content, file, size);
    this.fileBlogUrl = null;
    this.filemangerSrv.viewFile(file._id).subscribe(
      data => {
        const b: Blob = new Blob([data], { type: file.secret.fileExtension });
        this.createFileFromBlob(b);
      }, err => {
        this.isError(err);
      }
    );
  }
  private modalSetting(content, drive?, size?) {
    if (drive) {
      this.driveInfo = drive;
      this.driveName = drive.secret.originalFileName || drive.secret.folderName;
    }
    this.modalService.open(content, { size: size }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any) {
    this.reInitializeAllField();
  }

  // preview file
  createFileFromBlob(file: Blob) {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.fileBlogUrl = reader.result;
    }, false);
    if (file) {
      reader.readAsDataURL(file);
    }
  }
  // details
  showDetail(driveDetail) {
    this.driveDetailInfo = driveDetail;
    this.mainViewSize = 'col-sm-6';
    this.driveDetail = true;
  }
  closeDetail() {
    this.mainViewSize = 'col-sm-9';
    this.driveDetail = false;
  }
    // rename
    renameLogic(name) {
      const value = name.value.trim();
      if (value.length) {
        const parentId = this.ParentId;
        this.disableBtnLoading(true);
        this.responseFromService(this.filemangerSrv.rename(this.driveInfo._id, name.value, this.driveType ),
          parentId, `${this.driveType} renamed`);
      } else {
        this.toastr.errorToastr('File length must be more than 1.', null, {toastTimeout: 5000} );
      }
    }
  // share
  addEmailForSharing(event, input?) {
    const keyCode = event.keyCode;
    const value = event.target.value;
    if ((keyCode === 188) || (keyCode === 186) || (keyCode === 13)) {
      this.getSplitEmail(value, keyCode);
      this.shareErrMsg = null;
    }
  }
  private getSplitEmail(value, keyCode?) {
    this.invalidEmailError = false;
    value.split(/[ ,;]+/).map(val => val.trim()).forEach(trimmed => {
      if (this.ValidateEmail(trimmed)) {
        this.invalidEmailError = false;
        this.add(trimmed);
        const emailInputField = document.getElementById('emailField');
        (emailInputField as HTMLInputElement).value = '';
      } else {
       if (keyCode === 13) {
        this.invalidEmailError = true;
       }
      }
    });
  }

  ValidateEmail(inputText) {
    const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (inputText.match(mailformat)) {
      return true;
  } else {
    return false;
  }
}
remove(name) {
  this.shareToPeople.splice(this.shareToPeople.indexOf(name), 1);
  this.invalidEmailError = false;
  this.shareErrMsg = null;
}
private add(name) {
  const found = this.shareToPeople.some(function (el) {
    return el.email === name;
  });
  if (!found && name.trim().length) {
    this.shareToPeople.push({ email: name });
    return true;
  } else {
    return false;
  }
}
filterEmailUnderTenant(emails: any[]) {
  const userUderTenant = []; const userNotUnderTenant = [];
  this.authService.detailsOfPeopleInMyOrg().map(user => userUderTenant.push(user.email));
  if (userUderTenant.length) {
    emails.forEach(email => {
      if (!userUderTenant.includes(email)) {
        userNotUnderTenant.push(email);
      }
    });
  }
  return userNotUnderTenant;
}
sendToAllUser(event) {
  const input = document.getElementById('showInputField');
  input.style.display = event.target.checked ? 'none' : 'block';
  this.shareWithAllCheck = event.target.checked ? false : true;
}


  shareFileFunc(email) {
    if ((email.value.length >= 1)) {
      this.invalidEmailError = false;
      this.getSplitEmail(email.value);
    } else {
      this.invalidEmailError = true;
    }
    this.shareToPeople = !this.shareWithAllCheck ? [{email: 'allUsersUnderTenant'}] : this.shareToPeople;
    if ((this.shareToPeople.length >= 1)) {
      const parentId = this.ParentId;
      this.invalidEmailError = false;
      const listOfEmails = [];
      this.shareToPeople.forEach(element => {
        listOfEmails.push(element.email);
      });
      const id = this.driveInfo._id;
      const baseUrl = environment.baseUrl + '/filemanager';
      const comment = this.shareComment;
      const access = this.accessTo;
      const emails = this.shareWithAllCheck ? listOfEmails :  ['allUsersUnderTenant'];
      const shareInfo = {
        baseUrl: baseUrl, shareType: access,
        emails: emails, comment: comment
      };
      this.disableBtnLoading(true);
      this.responseFromService(this.filemangerSrv.shareFile(id, shareInfo, this.driveType), parentId,
      `${this.driveType} shared`, 'share');
    } else {
      this.invalidEmailError = true;
    }
  }

  // uploading file
  onFileSelected(event) {
    this.selectedFile = <File>event.target.files;
    this.uploadFile();
  }
  uploadFile() {
    if (this.selectedFile) {
      const parentId = this.ParentId;
      this.fileUploadStatus = true;
      this.getUploadingProgress(this.selectedFile);
      this.responseFromService(this.filemangerSrv.upload(this.selectedFile, parentId), parentId, 'file uploaded');
    }
  }
  getUploadingProgress(files) {
   this.setTimeProgress = setInterval(() => {
      if (this.fileUploadProgress < 90) {
        this.fileUploadProgress = this.fileUploadProgress + getFileProgressRate(files);
      }
    }, 1000);
  }
  // create folder
  creatFolderLogic() {
    this.showCreateFolderInput = true;
  }
  hideCreateFolderInput() {
    this.showCreateFolderInput = false;
    this.folderName = '';
  }
  createNewFolder(foldername) {
    if (foldername.valid) {
      const parentId = this.ParentId;
      this.disableBtnLoading(true);
      this.responseFromService(this.filemangerSrv.createFolder(foldername.value, parentId), parentId,
      'folder created');
    }
  }

  downloadFile(fileId, driveType?) {
    this.filemangerSrv.downloadFile(fileId._id, driveType).subscribe((data: any) => {
      const b: Blob = new Blob([data], { type: fileId.secret.fileExtension });
      const url = window.URL.createObjectURL(b);
      window.open(url, '_blank');
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', fileId.secret.originalFileName);
      link.click();
    }, err => {
      this.isError('Sorry you can not download file');
    });
  }
  deleteLogic() {
    const parentId = this.ParentId;
    this.disableBtnLoading(true);
    this.responseFromService(this.filemangerSrv.delete(this.driveInfo._id, this.driveType), parentId,
      `${this.driveType} deleted`, 'delete');
  }
  // open subfolder
  get ParentId() {
    return this.breadCumList[this.breadCumList.length - 1].id;
  }
  showMain(breadcum) {
    this.fetchFiles();
    setTimeout(() => {
      this.mainFIleFolder = true;
    }, 2000);
    setTimeout(() => {
      this.subFolder = false;
    }, 2000);
    this.goBack(breadcum);
    this.reInstailizePfilefolder();
  }
  openFolder(folder) {
    this.closeDetail();
    this.mainFIleFolder = false;
    this.subFolder = true;
    const name = folder.secret.folderName;
    const id = folder._id;
    this.reInstailizePfilefolder();
    this.fetchPfolderPfile(id, 'openfolder', name);
  }
  goBack(breadcum) {
    this.reInitializeAllField();
    if (breadcum.id) {
      this.fetchPfolderPfile(breadcum.id, 'goback', null, breadcum);
    } else {
      this.breadCumList.splice(this.breadCumList.indexOf(breadcum) + 1);
    }
  }
  private fetchPfolderPfile(folderparentId, action?, name?, breadcum?) {
    if (folderparentId) {
      this.filemangerSrv.viewFiles(folderparentId).subscribe((data: any) => {
        this.parentFile = data.data;
        this.fetchSubDrive();
      });
      this.filemangerSrv.viewFolders(folderparentId).subscribe((data: any) => {
        this.parentFolder = data.data;
        this.fetchSubDrive();
        if (action === 'openfolder') {
          this.breadCumList.push({ name: name, link: '', id: folderparentId });
        }
        if (action === 'goback') {
          this.breadCumList.splice(this.breadCumList.indexOf(breadcum) + 1);
        }
      });
    }
  }
  fetchSubDrive() {
    if (this.parentFile && this.parentFolder) {
      this.subDriveList = this.parentFolder.concat(this.parentFile);
    }
  }
  private reInstailizePfilefolder() {
    this.parentFile = null;
    this.parentFolder = null;
    this.subDriveList = null;
    this.reInitializeAllField();
  }
  private responseFromService(service, parentId, sucesMsg, resType?) {
    service.subscribe(
      data => {
        this.isSuccess(sucesMsg);
        this.closeDetail();
        if (parentId) {
          this.parentFile = null; this.parentFolder = null;
          this.fetchPfolderPfile(parentId);
        }
      }, err => {
        console.log(err);
        if (err[0].includes('recipient')) {
          this.shareErrMsg = err[0];
          this.disableBtnLoading(false);
        } else {
          this.shareErrMsg = null;
          this.isError(err);
        }
      });
  }
  private reInitializeAllField() {
    this.invalidEmailError = false;
    this.shareToPeople = []; this.shareComment = ''; this.shareErrMsg = null;
    this.accessTo = 'private';  this.shareWithAllCheck = true;
    this.selectedFile = null;
    this.disableBtnLoading(false); this.driveType = null;
    this.hideCreateFolderInput();
    this.closeDetail();
  }
  private disableBtnLoading(value: boolean) {
    this.loading = value; this.disableBtn = value;
  }
  private isSuccess(toastrMsg: string) {
    this.disableBtnLoading(false);
    this.fileUploadStatus = false;
    this.toastr.successToastr(toastrMsg, null, { toastTimeout: 3000, maxCount: 1 });
    this.fetchFiles();
    this.fetchFolder();
    this.hideCreateFolderInput();
    this.fileUploadProgress = 30; clearInterval(this.setTimeProgress);
    this.modalService.dismissAll();
  }
  private isError(toastrMsg) {
    this.toastr.errorToastr(toastrMsg, null, { toastTimeout: 5000 ,  maxCount: 1});
    this.disableBtnLoading(false);
    this.fileUploadStatus = false;
  }

}
