import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AccountingRoutes } from './accounting-routing.module';
import { AlertModule } from '../components/alert/alert.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ng6-toastr-notifications';
import { VendorComponent } from './spend-money/vendor/vendor.component';
import { CustomerComponent } from './receive-money/customer/customer.component';
import { AccountingService } from './service/accounting.service';
import { ExpenseCategoryComponent } from './spend-money/expenses/expense-category/expense-category.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CreateVendorComponent } from './spend-money/create-vendor/create-vendor.component';
import { ListVendorComponent } from './spend-money/list-vendor/list-vendor.component';
import { CreateCustomerComponent } from './receive-money/create-customer/create-customer.component';
import { ListCustomerComponent } from './receive-money/list-customer/list-customer.component';
import { CreateExpenseCategoryComponent } from './spend-money/create-expense-category/create-expense-category.component';
import { ListExpenseCategoryComponent } from './spend-money/list-expense-category/list-expense-category.component';
import { ExpenseComponent } from './expense-component/expense/expense.component';
import { CreateExpenseComponent } from './expense-component/create-expense/create-expense.component';
import { ListExpenseComponent } from './expense-component/list-expense/list-expense.component';
import { SalesComponent } from './sales-component/sales/sales.component';
import { CreateSalesComponent } from './sales-component/create-sales/create-sales.component';
import { ListSalesComponent } from './sales-component/list-sales/list-sales.component';
import { BankComponent } from './bank-component/bank/bank.component';
import { CreateBankComponent } from './bank-component/create-bank/create-bank.component';
import { ListBankComponent } from './bank-component/list-bank/list-bank.component';
import { InvoiceComponent } from './invoice-component/invoice/invoice.component';
import { CreateInvoiceComponent } from './invoice-component/create-invoice/create-invoice.component';
import { ListInvoiceComponent } from './invoice-component/list-invoice/list-invoice.component';
import { CustomFormsModule } from 'ng2-validation';
import { IncomeComponent } from './income-component/income/income.component';
import { ListIncomeComponent } from './income-component/list-income/list-income.component';
import { CreateIncomeComponent } from './income-component/create-income/create-income.component';
// import { ReceivablesComponent } from './Receivables-Component/receivables///receivables.component';
import { CreateReceivableComponent } from './receivables-component/create-receivable/create-receivable.component';
import { ReceivableComponent } from './receivables-component/receivable/receivable.component';
import { ListReceivableComponent } from './receivables-component/list-receivable/list-receivable.component';
import { CardComponent } from './card-component/card/card.component';
import { ListCardComponent } from './card-component/list-card/list-card.component';
import { CreateCardComponent } from './card-component/create-card/create-card.component';
import { PaymentComponent } from './payments-component/payment/payment.component';
import { CreatePaymentComponent } from './payments-component/create-payment/create-payment.component';
import { ListPaymentComponent } from './payments-component/list-payment/list-payment.component';
import { AuditTrailComponent } from './auditTrail-component/audit-trail/audit-trail.component';
import { ListAuditTrailComponent } from './auditTrail-component/list-audit-trail/list-audit-trail.component';
import { CreateInventoryComponent } from './inventory-component/create-inventory/create-inventory.component';
import { InventoryComponent } from './inventory-component/inventory/inventory.component';
import { CreateInventoryCategoryComponent } from './inventory-component/create-inventory-category/create-inventory-category.component';
import { InventoryCategoryComponent } from './inventory-component/inventory-category/inventory-category.component';
import { DataTablesModule } from 'angular-datatables';
import { ViewExpenseComponent } from './expense-component/view-expense/view-expense.component';
import { SettingsComponent } from './setting-component/settings/settings.component';
import { CreateCashComponent } from './cash-component/create-cash/create-cash.component';
import { CashComponent } from './cash-component/cash/cash.component';
import { ViewSalesComponent } from './sales-component/view-sales/view-sales.component';
import { FilterPipe } from './expense-component/expense/filter.pipe';
//import {NgxPaginationModule} from 'ngx-pagination';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AccountingRoutes),
    AlertModule,
    NgbModule,
    FormsModule,
    CustomFormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    NgxDatatableModule,
    AlertModule,
    DataTablesModule
    // NgxPaginationModule
  ],
  entryComponents: [],
  declarations: [
    VendorComponent,
    ExpenseCategoryComponent,
    CustomerComponent,
    CreateVendorComponent,
    ListVendorComponent,
    CreateCustomerComponent,
    ListCustomerComponent,
    CreateExpenseCategoryComponent,
    ListExpenseCategoryComponent,
    ExpenseComponent,
    CreateExpenseComponent,
    ListExpenseComponent,
    SalesComponent,
    CreateSalesComponent,
    ListSalesComponent,
    BankComponent,
    CreateBankComponent,
    ListBankComponent,
    InvoiceComponent,
    CreateInvoiceComponent,
    ListInvoiceComponent,
    IncomeComponent,
    ListIncomeComponent,
    CreateIncomeComponent,
    CreateIncomeComponent,
    ReceivableComponent,
    CreateReceivableComponent,
    ListReceivableComponent,
    CardComponent,
    ListCardComponent,
    CreateCardComponent,
    PaymentComponent,
    CreatePaymentComponent,
    ListPaymentComponent,
    AuditTrailComponent,
    ListAuditTrailComponent,
    CreateInventoryComponent,
    InventoryComponent,
    InventoryCategoryComponent,
    CreateInventoryCategoryComponent,
    ViewExpenseComponent,
    SettingsComponent,
    CreateCashComponent,
    CashComponent,
    ViewSalesComponent,
    FilterPipe
  ],
  providers: [AccountingService]
})
export class AccountingModule {}
