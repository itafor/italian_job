import { Routes } from '@angular/router';
import { VendorComponent } from './spend-money/vendor/vendor.component';
import { ExpenseCategoryComponent } from './spend-money/expenses/expense-category/expense-category.component';
import { CustomerComponent } from './receive-money/customer/customer.component';
import { ExpenseComponent } from './expense-component/expense/expense.component';
import { SalesComponent } from './sales-component/sales/sales.component';
import { BankComponent } from './bank-component/bank/bank.component';
import { InvoiceComponent } from './invoice-component/invoice/invoice.component';
import { IncomeComponent } from './income-component/income/income.component';
import { PaymentComponent } from './payments-component/payment/payment.component';
import { AuditTrailComponent } from './auditTrail-component/audit-trail/audit-trail.component';
import { InventoryCategoryComponent } from './inventory-component/inventory-category/inventory-category.component';
import { InventoryComponent } from './inventory-component/inventory/inventory.component';
import { ViewExpenseComponent } from './expense-component/view-expense/view-expense.component';
import { CardComponent } from './card-component/card/card.component';
import { SettingsComponent } from './setting-component/settings/settings.component';
import { CashComponent } from './cash-component/cash/cash.component';
import { ViewSalesComponent } from './sales-component/view-sales/view-sales.component';

export const AccountingRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'spend-money',
        children: [
          {
            path: 'vendor',
            component: VendorComponent
          },
          {
            path: 'expense-category',
            component: ExpenseCategoryComponent
          },
          {
            path: 'customer',
            component: CustomerComponent
          }
        ]
      },
      {
        path: 'vendor',
        component: VendorComponent
      },
      {
        path: 'expense-category',
        component: ExpenseCategoryComponent
      },
      {
        path: 'income-category',
        component: IncomeComponent
      },
      {
        path: 'customer',
        component: CustomerComponent
      },
      {
        path: 'expenses',
        component: ExpenseComponent,
        data:{
          heading: 'Expenses'
        }
      },
      {
        path: 'sales',
        component: SalesComponent
      },
      {
        path: 'bank',
        component: BankComponent
      },
      {
        path: 'invoice',
        component: InvoiceComponent
      },
      {
        path: 'payment',
        component: PaymentComponent
      },
      {
        path: 'audittrail',
        component: AuditTrailComponent
      },
      {
        path: 'inventory',
        component: InventoryComponent
      },
      {
        path: 'inventory-category',
        component: InventoryCategoryComponent
      },
      {
        path: 'card',
        component: CardComponent
      },
      {
        path: 'view-expense',
        component: ViewExpenseComponent
      },
      {
        path: 'view-sales',
        component: ViewSalesComponent
      },
      {
        path: 'settings',
        component: SettingsComponent
      },
      {
        path: 'cash-account',
        component: CashComponent
      }
    ]
  }
];
