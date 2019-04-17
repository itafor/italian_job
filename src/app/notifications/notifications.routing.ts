import { Routes } from '@angular/router';

import { ListTemplateComponent } from './template/list-template/list-template.component';
import { CreateTemplateComponent } from './template/create-template/create-template.component';
import { UpdateTemplateComponent } from './template/update-template/update-template.component';

export const NotificationsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list-template',
        component: ListTemplateComponent,
        data: {
          heading: 'List Template'
        }
      },
      {
        path: 'create-template',
        component: CreateTemplateComponent,
        data: {
          heading: 'Create Template'
        }
      },
      {
        path: 'update-template/:id',
        component: UpdateTemplateComponent,
        data: {
          heading: 'Update Template'
        }
      }
    ]
  }
];
