import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(expenses: any, term?: any): any {
   if(term ===undefined) {
    return expenses;
   }else{
    return expenses.filter(function(expense){
     let filteramountPaidViaBank = '';
     let filtercreditAmount = '';
     let filtercashPaid = '';
     let Createddate = new Date(expense.createdAt);
     let filtercreatetAt = Createddate.toDateString().toString().toLowerCase().includes(term);
     let expensedate = new Date(expense.expenseDate);
     let filterExpensDate= expensedate.toDateString().toString().toLowerCase().includes(term);
     const filterPaymentType = expense.secret.paymentType.toString().toLowerCase().includes(term.toLowerCase());
     const filteredExpenseDec =  expense.secret.expenseDescription.toLowerCase().includes(term.toLowerCase()) 
     if(expense.secret.amountPaidViaBank) {
        filteramountPaidViaBank =  expense.secret.amountPaidViaBank.toString().toLowerCase().includes(term.toLowerCase()) 
     } else if( expense.secret.creditAmount) {
        filtercreditAmount =  expense.secret.creditAmount.toString().toLowerCase().includes(term.toLowerCase());
     } else if( expense.secret.cashPaid) {
      filtercashPaid =  expense.secret.cashPaid.toString().toLowerCase().includes(term.toLowerCase());
   }  
      return filteredExpenseDec || filteramountPaidViaBank 
      || filtercreatetAt || filterExpensDate || filtercreditAmount 
      || filtercashPaid || filterPaymentType 
      
    })
   }
   
  }
  
}
