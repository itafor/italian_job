import { Routes } from '@angular/router';

import { AdminLayoutComponent } from './core';
import { AuthLayoutComponent } from './core';
import { AuthGuard } from './core/guard/auth.guard';
import { HomeComponent } from './home/home.component';

export const AppRoutes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: '',
    component: AdminLayoutComponent,

    children: [
      {
        path: 'dashboard',
        loadChildren: './dashboard/dashboard.module#DashboardModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'user',
        loadChildren:
          './usermanagement/usermanagement.module#UserManagementModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'quiz',
        loadChildren: './quiz/quiz.module#QuizModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'accounting',
        loadChildren: './accounting/accounting.module#AccountingModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'taskmanager',
        loadChildren: './taskmanager/taskmanager.module#TaskManagerModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'filemanager',
        loadChildren: './file-manager/file-manager.module#FileManagerModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'email',
        loadChildren: './email/email.module#EmailModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'hr',
        loadChildren: './hr/hr.module#HRModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'accounting',
        loadChildren: './accounting/accounting.module#AccountingModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'oms',
        loadChildren: './oms/oms.module#OmsModule',
        canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'account',
        loadChildren: './account/account.module#AccountModule'
      },
      {
        path: 'error',
        loadChildren: './error/error.module#ErrorModule'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'error/404'
  }
];
 