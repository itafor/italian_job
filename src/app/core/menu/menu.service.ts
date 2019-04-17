import { ChildrenItems } from './menu.service';
import { Injectable } from '@angular/core';

export interface BadgeItem {
  type: string;
  value: string;
}

export interface ChildrenItems {
  state: string;
  name: string;
  type?: string;
}

export interface SalesMenuItems {
  state: string;
  name: string;
  type?: string;
}

export interface Menu {
  state?: string;
  name?: string;
  type: string;
  icon?: string;
  badge?: BadgeItem[];
  children?: ChildrenItems[];
  salesMenu?: SalesMenuItems[];
}

const MENUITEMS = [
  // {
  //   type: 'title',
  //   name: 'Email'
  // },
  // {
  //   state: 'email',
  //   name: 'Inbox',
  //   type: 'link',
  //   icon: 'ion-ios-email',
  //   badge: [
  //     {
  //       type: 'success',
  //       value: '5'
  //     }
  //   ]
  // },
  // {
  //   name: 'Sent Items',
  //   type: 'link',
  //   icon: 'ion-ios-paper',
  //   badge: [
  //     {
  //       type: 'success',
  //       value: '5'
  //     }
  //   ]
  // },
  // {
  //   name: 'Drafts',
  //   type: 'link',
  //   icon: 'ion-ios-email',
  //   badge: [
  //     {
  //       type: 'success',
  //       value: '5'
  //     }
  //   ]
  // },
  // {
  //   name: 'Spam',
  //   type: 'link',
  //   icon: 'ion-ios-albums',
  //   badge: [
  //     {
  //       type: 'danger',
  //       value: '5'
  //     }
  //   ]
  // },
  // {
  //   type: 'divider'
  // },
  // {
  //   type: 'title',
  //   name: 'Human Resources'
  // },
  // {
  //   state: 'hr',
  //   name: 'HR',
  //   type: 'sub',
  //   icon: 'ion-ios-box',
  //   children: [
  //     {
  //       state: 'employees',
  //       name: 'Employees'
  //     }
  //   ]
  // },
  {
    type: 'title',
    name: 'Mailbox'
  },
  {
    state: 'inbox',
    name: 'inbox',
    type: 'link',
    icon: 'ion-ios-box',
  },
  {
    state: 'sent',
    name: 'sent',
    type: 'link',
    icon: 'ion-ios-box'
  },
  {
    type: 'divider'
  },
  {
    type: 'title',
    name: 'HR'
  },
  {
    state: 'employees',
    name: 'Employees',
    type: 'link'
  },
  {
    state: 'appraisal',
    name: 'Appraisal',
    type: 'link'
  },
  {
    type: 'divider'
  },
  {
    state: 'task-manager',
    name: 'Task Manger',
    type: 'sub',
    icon: 'ion-ios-box',
    children: [
      {
        state: 'submenu1',
        name: 'Submenu1',
        type: 'link'
      },
      {
        state: 'submene2',
        name: 'Submenu2',
        type: 'link'
      }
    ]
  },
  {
    type: 'divider'
  },
  {
    type: 'title',
    name: 'Accounting',
    icon: 'ion-ios-box'
  },
  {
    state: 'receive-money',
    name: 'Receive Money',
    type: 'sub',
    icon: 'ion-ios-box',
    children: [
      {
        state: 'Invoice',
        name: 'Invoice',
        type: 'link',
        baselink: 'accounting'
      },
      {
        state: 'customer',
        name: 'Customer',
        type: 'link',
        baselink: 'accounting'
      },
      {
        state: 'credit-payment',
        name: 'Credit Payment',
        type: 'link',
        baselink: 'accounting'
      },
      {
        state: 'loan',
        name: 'Loan',
        type: 'link',
        baselink: 'accounting'
      },
      {
        state: 'sales',
        name: 'Sales',
        type: 'sub',
        icon: 'ion-ios-box',
        children: [
          {
            state: 'credit-sales',
            name: 'Credit sales',
            type: 'link'
          },
          {
            state: 'cash-sales',
            name: 'Cash sales',
            type: 'link'
          },
          {
            state: 'bank-deposit',
            name: 'Bank deposit',
            type: 'link'
          }
        ]
      },
      {
        state: 'other-sales',
        name: 'Other Sales',
        type: 'link',
        baselink: 'accounting'
      },
    ]
  },
  {
    state: 'spend-money',
    name: 'Spend Money',
    type: 'sub',
    icon: 'ion-ios-box',
    children: [
      {
        state: 'repay-loans',
        name: 'Repay loans',
        type: 'link'
      },
      {
        state: 'vendor',
        name: 'Vendor',
        type: 'link',
        baselink: 'accounting'
      },
      {
        state: 'Drawings',
        name: 'Drawings',
        type: 'link',
        baselink: 'accounting'

      },
      {
        state: 'debt-repayment',
        name: 'Debt Repayment',
        type: 'link',
        baselink: 'accounting'

      },
      {
        state: 'Expenses',
        name: 'Expenses',
        type: 'sub',
        icon: 'ion-ios-box',
        children: [
          {
            state: 'credit-expenses',
            name: 'Credit expenses',
            type: 'link',
            baselink: 'accounting'
          },
          {
            state: 'cash-expenses',
            name: 'Cash expenses',
            type: 'link',
            baselink: 'accounting'
          },
          {
            state: 'bank-transfer',
            name: 'Bank transfer',
            type: 'link',
            baselink: 'accounting'
          }
        ]
      },
      {
        state: 'other-expenses',
        name: 'Other Expenses',
        type: 'link'
      },
      {
        state: 'expense-category',
        name: 'Expense Category',
        type: 'link',
        baselink: 'accounting'
      },
    ]
  },
  {
    state: 'manage-accounts',
    name: 'Manage accounts',
    type: 'sub',
    icon: 'ion-ios-box',
    children: [
      {
        state: 'bank-account',
        name: 'Bank account',
        type: 'link'
      },
      {
        state: 'cash-account',
        name: 'Cash account',
        type: 'link'
      },
      {
        state: 'move-cash-between-accounts',
        name: 'Move cash between accounts',
        type: 'link'
      }
    ]
  },
  {
    state: 'Reports',
    name: 'Reports',
    type: 'sub',
    icon: 'ion-ios-box',
    children: [
      {
        state: 'Simple',
        name: 'Simple',
        type: 'link'
      },
      {
        state: 'Advanced',
        name: 'Advanced',
        type: 'link'
      }
    ]
  },
  {
    type: 'divider'
  },
  {
    name: 'File Manager',
    type: 'title'
  },
  {
    state: 'submenu1',
    name: 'Submenu1',
    type: 'link',
    icon: 'ion-ios-albums-outline'
  },
  {
    state: 'submene2',
    name: 'Submenu2',
    type: 'link',
    icon: 'ion-ios-albums-outline'
  },
  {
    type: 'divider'
  },
  {
    state: 'quiz',
    name: 'Quiz Manager',
    type: 'sub',
    icon: 'ion-ios-box',
    children: [
      {
        state: 'submenu1',
        name: 'Submenu1',
        type: 'link'
      },
      {
        state: 'submene2',
        name: 'Submenu2',
        type: 'link'
      }
    ]
  },
  {
    state: 'inventory',
    name: 'Inventory',
    type: 'sub',
    icon: 'ion-ios-box',
    children: [
      {
        state: 'submenu1',
        name: 'Submenu1',
        type: 'link'
      },
      {
        state: 'submene2',
        name: 'Submenu2',
        type: 'link'
      }
    ]
  },
  {
    state: 'web-creator',
    name: 'Web Creator',
    type: 'sub',
    icon: 'ion-ios-box',
    children: [
      {
        state: 'submenu1',
        name: 'Submenu1',
        type: 'link'
      },
      {
        state: 'submene2',
        name: 'Submenu2',
        type: 'link'
      }
    ]
  },
  {
    state: 'crm',
    name: 'CRM',
    type: 'sub',
    icon: 'ion-ios-box',
    children: [
      {
        state: 'submenu1',
        name: 'Submenu1',
        type: 'link'
      },
      {
        state: 'submene2',
        name: 'Submenu2',
        type: 'link'
      }
    ]
  },
];

@Injectable()
export class MenuService {
  getAll(): Menu[] {
    return MENUITEMS;
  }

  getChildren(menuKey: string): any {
    let childLinks = [];
    MENUITEMS.map(item => {
      if (item.state === menuKey) {
        childLinks = item.children;
      }
    });
    return childLinks;
  }

  getOpenNavigatonItem() { }
}
