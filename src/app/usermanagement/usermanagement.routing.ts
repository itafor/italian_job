import { Routes } from '@angular/router';

import { UserManagementComponent } from './usermanagement.component';

import { CreateRequestleaveComponent } from './component/create-requestleave/create-requestleave.component';

export const UserManagementRoutes: Routes = [
  { 
    path: '', 
    children: [
      {
        path: 'users',
        component: UserManagementComponent,
        data: {
          heading: 'Users'
        }
      },
      {
        path: 'leaves',
        component: CreateRequestleaveComponent,
        data: {
          heading: 'Leaves'
        }
      }
    ]



    
  }
];
