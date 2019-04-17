import { Component } from '@angular/core';
import { MenuService } from './menu.service';
import { AuthenticationService } from '../../account/account.authentication';

import { TranslateService } from '@ngx-translate/core';
/* tslint:disable:max-line-length */
@Component({
  selector: 'app-menu',
  templateUrl: 'menu.component.html',
  providers: [MenuService]
})
export class MenuComponent {
  currentLang = 'en';
  currentChildren = [];
  allMenus = [
    {
      name: 'Dasboard', icon: 'ion-android-apps', state: 'dashboard',
      sub: [{ name: 'Dashboard', state: '' }]
    },
    {
      name: 'User', icon: 'ion-ios-person', state: 'user',
      sub: [{ name: 'Users', state: 'users' }, { name: 'Leaves', state: 'leaves' }]
    },
    {
      name: 'Task Manager', icon: 'ion-android-clipboard', state: 'taskmanager',
      sub: this.subMenusVisibleForTaskManager()
    },
    {
      name: 'File Manager', icon: 'ion-ios-albums-outline', state: 'filemanager',
      sub: [{ name: 'My Files', state: 'myfile' }, { name: 'Shared WIth Me', state: 'sharedwithme' },]
    },
    {
      name: 'HR', icon: 'ion-ios-person', state: 'hr',
      sub: [{ name: 'Employees', state: 'employees' }, { name: 'Departments', state: 'departments' },
        { name: 'Roles', state: 'roles' }, { name: 'Events', state: 'events' }, { name: 'Leave Type', state: 'leave' }]
    },
    {
      name: 'Mailbox', icon: 'ion-android-mail', state: 'email',
      sub: [{ name: 'Your Mails', state: '' }, { name: 'Sent Mails', state: 'sent' }, { name: 'Trash', state: 'trash' }],
    },
    {
      name: 'Accounting', icon: 'ion-android-clipboard', state: 'accounting',
      sub: [{ name: 'Settings', state:'settings'},{ name: 'Invoice', state: 'invoice' }, { name: 'Vendor', state: 'vendor' },
      { name: 'Customer', state: 'customer' },{ name: 'Cash Account', state: 'cash-account' },
      { name: 'Sales', state: 'sales' }, { name: 'Bank', state: 'bank' },
      { name: 'Expense Category', state: 'expense-category' },
      { name: 'Income Category', state: 'income-category' },
      { name: 'Expenses', state: 'expenses' },
      { name: 'Audit Trail', state: 'audittrail' },
      { name: 'Card', state: 'card' },
      { name: 'Inventory', state: 'inventory' },
      { name: 'Inventory Category', state: 'inventory-category' }
    ]
    },
    {
      name: 'Surveys & Assessments', icon: 'ion-android-clipboard', state: 'quiz',
      sub: [{ name: 'List', state: 'list' }]
    },
    {
      name: 'OMS', icon: 'ion-android-cart', state: 'oms',
      sub: [{ name: 'Orders', state: 'orders' }]
    }
  ];
  constructor(
    public menuService: MenuService,
    private authService: AuthenticationService,
    public translate: TranslateService
  ) { }

  subMenusVisibleForTaskManager() {
    const tmSubMenus = [{ name: 'Projects', state: 'projects' }];
    if (this.authService.isAdmin) {
      return [ { name: 'Role', state: 'roles' },  ...tmSubMenus];
    }
    return tmSubMenus;
  }

  displayChildren(key) {
    this.currentChildren = this.menuService.getChildren(key);
  }

  allObjects() {
    return [...this.currentChildren, ...this.menuService.getAll()];
  }

  fullUrl(parentUrl: string, childUrl: string): string[] {
    const routerLinkOptions: string[] = ['/', parentUrl];
    if (childUrl !== '') {
      routerLinkOptions.push(childUrl);
    }
    return routerLinkOptions;
  }
}
