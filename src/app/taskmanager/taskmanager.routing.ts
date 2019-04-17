import { Routes } from '@angular/router';

import { TaskManagerTaskComponent } from './task/taskmanager.component';
import { TaskManagerProjectComponent } from './project/taskmanager-project.component';
import { ProjectSettingsComponent } from './project/project-settings/project-settings.component';
import { GeneralComponent } from './project/project-settings/general/general.component';
import { GoalsComponent } from './project/project-settings/goals/goals.component';
import { FieldsComponent } from './project/project-settings/fields/fields.component';
import { MembersComponent } from './project/project-settings/members/members.component';
import { TaskManagerRoleComponent } from './role/taskmanager-role.component';
import { TaskPageComponent } from './task-page/task-page.component';
import { AccessDeniedComponent } from './403.component';
import { AdminGuard } from '../core/guard/admin.guard';

export const TaskManagerRoutes: Routes = [
  {
    path: 'projects',
    component: TaskManagerProjectComponent
  },
  {
    path: 'project',
    children: [
      {
        path: ':id',
        component: TaskManagerTaskComponent,
        data: {
          heading: 'Tasks',
          removeFooter: true
        },
      },
      {
        path: 'settings/:id',
        component: ProjectSettingsComponent,
        data: {
          heading: 'Project Settings',
        },
        canActivate: [AdminGuard],
        canActivateChild: [AdminGuard],
        children: [
          {
            path: '',
            component: GeneralComponent,
            data: {
              heading: 'General'
            },
          },
          {
            path: 'goals/:id',
            component: GoalsComponent,
            data: {
              heading: 'Goals'
            },
          },
          {
            path: 'fields/:id',
            component: FieldsComponent,
            data: {
              heading: 'Fields'
            },
          },
          {
            path: 'members/:id',
            component: MembersComponent,
            data: {
              heading: 'Members'
            },
          }
        ]
      },
      {
        path: ':projectId/:taskId',
        component: TaskPageComponent,
        data: {
          removeFooter: true
        }
      },
    ]
  },
  {
    path: 'roles',
    component: TaskManagerRoleComponent,
    canActivate: [AdminGuard]
  },
  {
    path: '403',
    component: AccessDeniedComponent
  }
];
