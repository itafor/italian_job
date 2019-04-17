import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class FileManagerService {
  user;
  private baseUrl = environment.fileManagerUrl;

  constructor(private http: HttpClient) {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
  }
  upload(file, parentId?) {
    const fd = new FormData();
      for (const key in file) {
    if (file.hasOwnProperty(key)) {
      const element = file[key];
      fd.append('file', element, element.name);
    }
  }
      if (parentId) {
        fd.append('folderId', parentId);
      }
        return this.http.post(`${this.baseUrl}/user/upload_file`, fd);
  }
  rename(id, name, type) {
    if (type === 'folder') {
      return this.http.put(`${this.baseUrl}/user/rename_folder/${id}`, {
        folderName: name
      });
    } else {
      return this.http.put(`${this.baseUrl}/user/rename_file/${id}`, {
        originalFileName: name
      });
    }
  }
  shareFile(id, detail: any, shareFolderFile: string) {
      let body;
      if (detail.comment) {
         body = {shared_with: detail.emails, baseUrl: detail.baseUrl,
                      shareType: detail.shareType, comment: detail.comment};
      } else {
        body = {shared_with: detail.emails, baseUrl: detail.baseUrl,
          shareType: detail.shareType};
      }
      if (shareFolderFile === 'file') {
        return this.http.put(`${this.baseUrl}/user/share_file/${id}`, body);
      }
      if (shareFolderFile === 'folder') {
        return this.http.put(`${this.baseUrl}/user/share_folder/${id}`, body);
      }

  }

  downloadSharedWithMe(fileId, parentId) {
    if (parentId) {
      return this.http.get(`${this.baseUrl}/user/download_file/${fileId}`, {
        responseType: 'blob'
      });
    } else {
      return this.http.get(`${this.baseUrl}/user/download_shared_file/${fileId}`, {
        responseType: 'blob'
      });
    }
  }
  createFolder(name, parentId?) {
    let body;
    if (parentId) {
      body = {folderName: name, parentFolderId: parentId};
    } else {
      body = { folderName: name };
    }
      return this.http.post(`${this.baseUrl}/user/create_folder`, body);
  }
  downloadFile(fileId, type?) {
    if (type === 'folder') {
      return this.http.get(`${this.baseUrl}/user/download_folder/${fileId}`, {
        responseType: 'blob'
      });
    } else {
      return this.http.get(`${this.baseUrl}/user/download_file/${fileId}`, {
        responseType: 'blob'
      });
    }

  }
  viewFile(fileId) {
    return this.http.get(`${this.baseUrl}/user/view_file/${fileId}`, {
      responseType: 'blob'
    });
  }
  fetchFiles() {
      return this.http.get(`${this.baseUrl}/user/list_files`);
  }
  fetchFolders() {
      return this.http.get(`${this.baseUrl}/user/list_folders`);
  }
  viewFolders(id: string) {
      return this.http.get(`${this.baseUrl}/user/list_folders?id=${id}`);
  }
  viewFiles(id: string) {
      return this.http.get(`${this.baseUrl}/user/list_files?id=${id}`);
  }
  sharedWithMeFile() {
    return this.http.get(`${this.baseUrl}/user/file_shared_with_me/all`);
  }
  sharedWithMeFolder() {
    return this.http.get(`${this.baseUrl}/user/folder_shared_with_me/all`);
  }
  viewSharedFileInFolder(id) {
    return this.http.get(`${this.baseUrl}/user/file_shared_with_me/${id}`);
  }
  viewSharedFolderInFolder(id) {
    return this.http.get(`${this.baseUrl}/user/folder_shared_with_me/${id}`);
  }
  delete(id, type?) {
    if (type === 'file' ) {
      return this.http.delete(`${this.baseUrl}/user/delete_file/${id}`);
    } else {
      return this.http.delete(`${this.baseUrl}/user/delete_folder/${id}`);
    }
  }

}
