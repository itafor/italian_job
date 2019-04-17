import { text_truncate, fileSize, sortByDateCreated, getNavShortPathFunc } from './../../functions/function';
import { Component, OnInit } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { pdfExt, ImgExt, getFileIcon, mp3Ext, getNewFileIcon } from '../../functions/ext';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GetService } from '../../services/get.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FileManagerService } from '../../services/file-manager.service';
import { FileResponseI, FileI } from '../../model/file.model';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { AuthenticationService } from 'src/app/account/account.authentication';

@Component({
  selector: 'app-sharedwithme',
  templateUrl: './sharedwithme.component.html',
  styleUrls: ['./sharedwithme.component.scss']
})
export class SharedwithmeComponent implements OnInit {
  fileList: FileI[]; folderList: any[]; driveList;
  parentFolder: any[]; parentFile: any[]; subDriveList;
  mainFIleFolder = true; subFolder = false;
  driveType = 'file';
  closeResult: string;
  driveName = 'driveName'; driveInfo: any;
  isOpened = true;
  mainViewSize = 'col-md-9'; driveDetail = false; driveDetailInfo: any = '';

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  fileBlogUrl;

  fileUploadStatus = false; loading = false; disableBtn = false;

  folderName =  '';
  showCreateFolderInput = false;

  fileToBeupload: string; selectedFile: File = null;

  breadCumList = [
    { name: 'Shared With Me', link: '/filemanager', id: null },
  ];

  constructor(
    public toastr: ToastrManager,
    private modalService: NgbModal,
    private authService: AuthenticationService,
    private getSrv: GetService,
    public sanitizer: DomSanitizer,
    private filemangerSrv: FileManagerService) {
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
  fetchFiles() {
    this.filemangerSrv.sharedWithMeFile().subscribe((files: FileResponseI) => {
      if (files) {
        this.fileList = files.data;
        this.fileList.sort(sortByDateCreated);
        this.fetchFolder();
      }
    });
  }
  fetchFolder() {
    this.filemangerSrv.sharedWithMeFolder().subscribe((folder: any) => {
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
    if (type === 'share') {
    }
    this.modalSetting(content, drive);
  }
  openPreviewFile(content, file) {
    const size = 'lg';
    this.modalSetting(content, file, size);
    this.fileBlogUrl = null;
    this.filemangerSrv.downloadSharedWithMe(file._id, this.ParentId).subscribe(
      data => {
        const b: Blob = new Blob([data], { type: file.secret.fileExtension });
        this.createFileFromBlob(b);
      }, err => {
        this.isError(err);
      }
    );
  }
  private modalSetting(content, file?, size?) {
    if (file) {
      this.driveInfo = file;
      this.driveName = file.secret.originalFileName || file.secret.folderName;
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
  downloadFile(fileId) {
    const parentId = this.ParentId;
    this.filemangerSrv.downloadSharedWithMe(fileId._id, parentId).subscribe((data: any) => {
      const b: Blob = new Blob([data], { type: fileId.secret.fileExtension });
      const url = window.URL.createObjectURL(b);
      window.open(url, '_blank');
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', fileId.secret.originalFileName);
      link.click();
    });
  }
  // upload file
  onFileSelected(event) {
    this.selectedFile = <File>event.target.files;
    this.uploadFile();
  }
  uploadFile() {
    if (this.selectedFile) {
      const parentId = this.ParentId;
      this.fileUploadStatus = true;
      this.responseFromService(this.filemangerSrv.upload(this.selectedFile, parentId), parentId, 'uploaded successful',
        'err uploading', 'file already exist');
    }
  }
  deleteLogic() {
    const parentId = this.ParentId;
    this.disableBtnLoading(true);
    this.responseFromService(this.filemangerSrv.delete(this.driveInfo._id, this.driveType), parentId,
      `${this.driveType} deleted`, 'delete');
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
        'folder created successfully', 'Err renaming.', 'folder name already exist');
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
    this.mainFIleFolder = false;
    this.subFolder = true;
    const name = folder.secret.folderName;
    const id = folder._id;
    this.reInstailizePfilefolder();
    this.fetchPfolderPfile(id, 'openfolder', name);
  }
  goBack(breadcum) {
    this.reInstailizePfilefolder();
    if (breadcum.id) {
      this.fetchPfolderPfile(breadcum.id, 'goback', null, breadcum);
    } else {
      this.breadCumList.splice(this.breadCumList.indexOf(breadcum) + 1);
    }
  }
  private fetchPfolderPfile(folderparentId, action?, name?, breadcum?) {
    if (folderparentId) {
      this.filemangerSrv.viewSharedFileInFolder(folderparentId).subscribe((data: any) => {
        this.parentFile = data.data;
        this.fetchSubDrive();
      });
      this.filemangerSrv.viewSharedFolderInFolder(folderparentId).subscribe((data: any) => {
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
    this.hideCreateFolderInput();
    this.closeDetail();
  }
  private reInitializeAllField() {
     this.driveType = null;
  }
  private responseFromService(service, parentId, sucesMsg, errMsg, wrnMsg?) {
    service.subscribe(
      data => {
        this.isSuccess(sucesMsg);
        if (parentId) {
          this.parentFile = null; this.parentFolder = null;
          this.fetchPfolderPfile(parentId);
        }
      }, err => {
        this.isError(err);
      });
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
    this.modalService.dismissAll();
    this.closeDetail();
  }

  private isError(toastrMsg) {
    this.toastr.errorToastr(toastrMsg, null, { toastTimeout: 3000 ,  maxCount: 1});
    this.disableBtnLoading(false);
    this.fileUploadStatus = false;
  }

}
