import { SharedwithmeComponent } from './components/sharedwithme/sharedwithme.component';
import { MyFileComponent } from './components/myfile/myfile.component';
import { Routes } from '@angular/router';

export const FileMangerRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'myfile',
        component: MyFileComponent,
        data: {
          heading: 'File Manager'
        },
      },
      {
        path: 'sharedwithme',
        component: SharedwithmeComponent,
        data: {
          heading: 'Shared With Me'
        },
      },
      {
        path: '',
        redirectTo: 'myfile',
        pathMatch: 'full'
      }
    ]
  },

];
