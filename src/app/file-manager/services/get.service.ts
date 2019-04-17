import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GetService {
  baseUrl = environment.authurl;
  constructor(private http: HttpClient) {
   }
  menu() {
    const menuArray = [
      { name: 'my drive', icon: 'fa-hdd'},
      { name: 'folders', link: 'folder', icon: 'fa-folder'},
      { name: 'files', link: 'files', icon: 'fa-file'},
      { name: 'shared with me', link: 'share-with-me', icon: 'fa-users'},
      { name: 'recent', link: 'recent', icon: 'fa-clock'},
      { name: 'favourite', link: 'favourite', icon: 'fa-star'},
      { name: 'trash', link: 'trash', icon: 'fa-trash'},
    ];
    return menuArray;
  }
  folders() {
   const folderArray = [
      { name: 'sodiqfilename', dateCreated: '02/01/2019' },
      { name: 'andrew', dateCreated: '03/01/2019'},
      { name: 'micheal',  dateCreated: '13/11/2018'}
    ];
    return folderArray;
  }
  files() {
    const  filesArray = [
      {name: 'thisfilesnameistoolongandverylong.pdf', type: 'pdf', fileSize: '10kb', dateCreated: '02/01/2019' },
      {name: 'tyfile3.doc', type: 'doc', fileSize: '20kb', dateCreated: '03/01/2019' },
      {name: 'cyfile2.xls', type: 'xls', fileSize: '12kb', dateCreated: '02/02/2019' },
      {name: 'hdjhjdhdfsfysyssydhdhdhdhdhdddddddd.jpg', type: 'jpg', fileSize: '310kb', dateCreated: '06/01/2019' },
      {name: 'byfile2.png', type: 'png', fileSize: '110kb', dateCreated: '02/03/2019' },
      {name: 'dummy.abc', type: '', fileSize: '110kb', dateCreated: '02/03/2019' },
      {name: 'fkan.mp3', type: 'mp3', fileSize: '1mb', dateCreated: '03/10/2018' },
      {name: 'akan.mp4', type: 'mp4', fileSize: '2mb', dateCreated: '13/11/2018' },
    ];
    return filesArray;
  }
  fetchUsers() {
    const url = this.baseUrl + '/users/all';
    return this.http.get<any>(url)
        .pipe(map(response => {
            return response;
        }));
  }

}
