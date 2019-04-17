import { Accounting } from './accounting.po';
import { browser, by, element, until, protractor } from 'protractor';
import utils from '../utils';
const path = require('path');
const createForm = {
    name: {
        label: 'Name*',
        safeValue: 'Bassey Emeka I',
        inputtype: 'text',
    },
    email: {
        label: 'Email',
        safeValue: 'bolse31321@gmail.com',
        inputtype: 'email',
    },
    phoneNumber: {
        label: 'Phone Number',
        safeValue: '08022234567',
        inputtype: 'text',
    },
    address: {
        label: 'Address',
        safeValue: 'smith124@23, berger RD. Lagos',
        inputtype: 'text',
    }
};
const testValue = {
    name: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 9),
}
const validCreateFormInput = {
    name: {
        label: 'Name*',
        value: testValue.name,
    },
    email: {
        label: 'Email',
        value: 'bolse31321@gmail.com',
    },
    phoneNumber: {
        label: 'Phone Number',
        value: '08022234567',
    },
    address: {
        label: 'Address',
        value: 'smith124@23, berger RD. Lagos',
    }
};
const createVendorformHeaderLabel = {
    title: {
        en: 'New Vendor'
    },
    button: {
        en: 'Create Vendor'
    }
};
const vendorTooltip = {
    delete_vendor: {
        icon: '.icon.fa.fa-trash.fa-1.5x.text-danger',
        toolTip: 'Delete vendor'
    },
    edit_vendor: {
        icon: '.icon.fa.fa-pencil.fa-1.5x.text-info',
        toolTip: 'Edit vendor'
    },
}
const wrontInput = {
    name: {
        placeholder: 'Name',
        wrong: 'Joseph Baaaaaaaaaaaa',
    },
    phoneNumber: {
        placeholder: 'Phone Number',
        wrong: '+23455667777776j8',
    },
    email: {
        placeholder: 'email',
        wrong: '+bassey.gmailcom',
    },
};
const wrongExpCatCreateForm = {
    name: {
        placeholder: 'Name',
        safeValue: 'Table'
    },
    parentCategory: {
        placeholder: 'description',
        safeValue: 'Parent Category'
    },
    categoryType: {
        placeholder: 'categoryType',
        safeValue: 'Furnitures'
    }
};
const expCatCreateForm = {
    name: {
        placeholder: 'Name',
        labelValue: 'Name*',
        safeValue: 'Dew Laptop'
    },
    parentCategory: {
        placeholder: 'description',
        labelValue: 'Parent Category',
        safeValue: 'Computers'
    },
    categoryType: {
        placeholder: 'categoryType',
        labelValue: 'Category Type',
        safeValue: 'Laptop'
    },
};
const incomeCatCreateForm = {
    name: {
        placeholder: 'Name',
        labelValue: 'Name*',
        safeValue: 'Laravel'
    },
    parentCategory: {
        placeholder: 'description',
        labelValue: 'Parent Category',
        safeValue: 'learning programming'
    },
    incomeCategory: {
        placeholder: 'categoryType',
        labelValue: 'Income Category',
        safeValue: 'Programming Language'
    },
};
const updateExpense = {
    expenseDescription: {
        safeValue: 'January Transport fair Expense',
        labelValue: 'Expense Description*'
    },
    expenseCategory: {
        safeValue: 'Transportation',
        labelValue: 'Expense Category'
    },
    bankAccount: {
        safeValue: 'UBA',
        labelValue: 'Bank Account'
    },
    paymentType: {
        safeValue: 'cash',
        labelValue: 'Payment Type'
    },
    cashPaid: {
        safeValue: '2000000',
        labelValue: 'Cash Paid'
    },
    creditAccount: {
        safeValue: '400000',
        labelValue: 'Credit Account'
    },
    amountPaidViaBank: {
        safeValue: '30000',
        labelValue: 'AMT Paid Via Bank'
    },
    vendor: {
        safeValue: 'Mr Francis',
        labelValue: 'vendor'
    }
};
const text = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 7);
const addbutton = '.fa-plus';
const removebutton = '.fa-remove';
const editbutton = '.fa-pencil';
const viewbutton = '.fa-eye';
const deletebutton = '.fa-trash';
const btn = '.btn';
const btnprimary = '.btn-primary';
const faviconclass = '.fa';
const spinner = '.fa.fa-spinner.fa-spin';
const vendorHeaderLabel = 'datatable-header-cell-label';
describe('Accounting | Expense', () => {
    let page: Accounting;
    beforeAll(() => {
        utils.navigateTo('/');
        utils.handleAuth();
    });
    beforeEach(() => {
        page = new Accounting();
    });
    // NOW TESTING Expense
    const expenseLabel = {
        saleDescription: {
            value: 'Expense Description'
        },
        category: {
            value: 'Category*'
        },
        PaymentType: {
            value: 'Payment Type*'
        },
        bank: {
            value: 'Bank'
        },
        credit: {
            value: 'Credit'
        },
        cash: {
            value: 'Cash'
        },
        BankAccount: {
            value: 'Bank Account'
        },
        CashReceived: {
            value: ' Cash Received'
        },
        CreditAmount: {
            value: 'Credit Amount'
        },
        receipts: {
            value: 'Receipts'
        },
        customer: {
            value: 'Customer'
        }
    };
    const selectExpBank = {
        bank: {
            value: 'bank',
        },
        cash: {
            value: 'cash'
        },
        credit: {
            value: 'credit'
        }
    }
    it('should display a frown face, if no Expense exist', () => {
        page.navigateTo('/accounting/expenses');
        expect(page.getElementByClass('.fa-frown-o')).toBeTruthy();
    });
    it('should display  "No Expense",if no expense exist', function () {
        page.getElement('h2#tableValue').getText().then(function (result) {
            if (result === 'hasNoValue') {
                expect(page.displayFormHeader('h5#no_expense-notice')).toEqual('No Expense');
            }
        })
    });
    it('should have a button named "Create Expense" ', () => {
        expect(page.displayFormHeader('button#create-expense')).toEqual('Create Expense  ');
    });
    it('should have add icon for the button named "Create Expense" ', () => {
        expect(page.getElement(`${faviconclass}${addbutton}`).isDisplayed()).toBeTruthy();
    });
    it('should have defined class for the button named "Create Expense" ', () => {
        expect(page.getElement(`${btn}${btnprimary}#create-expense`).isDisplayed()).toBeTruthy();
    });
   
    it('should display a form with a title New Expense', () => {
        page.getButton('button#create-expense').click();
        expect(page.displayFormHeader('h4#modal-basic-title')).toEqual('New Expense');
    });
    it('should show form input label called expense Description in create expense form', () => {
        expect(page.displayFormHeader('label#expensedescription-label')).toEqual(expenseLabel.saleDescription.value);
    });
    it('should show form input label called Category in create expense form', () => {
        expect(page.displayFormHeader('label#expense-category')).toEqual(expenseLabel.category.value);
    });
    it('should show form input label called payment Type in create expense form', () => {
        expect(page.displayFormHeader('legend#expense-paymentType')).toEqual(expenseLabel.PaymentType.value);
    });
    it('should show form input label called Bank in create expense form', () => {
        expect(page.displayFormHeader('label#expense-bank')).toEqual(expenseLabel.bank.value);
    });
    it('should show form input label called Credit in create expense form', () => {
        expect(page.displayFormHeader('label#expense-credit')).toEqual(expenseLabel.credit.value);
    });
    it('should show form input label called Cash in create expense form', () => {
        expect(page.displayFormHeader('label#expense-cash')).toEqual(expenseLabel.cash.value);
    });
    it('should show form input label called  Receipt in create expense form', () => {
        expect(page.displayFormHeader('label#expense-receipt')).toEqual(expenseLabel.receipts.value);
    });
    
    it('should click on \'+\' sign to open a modal with title: \'Add new expense category\' to create a new expense category ', () => {
        page.getElement('#add-expense-cat').click();
    });
    it('should display a form with a title: \'Create expense category\'', () => {
        expect(page.displayFormHeader('h4#createExpenseCatTitle')).toEqual('Create Expense Category');
    });
    it('should display an \'Expense Category*\' Label for category Type ', () => {
        expect(page.displayFormHeader('label#expCatLabel')).toEqual('Category Type');
    });
    it('should display a \'Name\' Label for Name', () => {
        expect(page.displayFormHeader('label#nameLabel')).toEqual('Name*');
    });
    it('should display a \'Create\' button, to create new expense category if form is valid', () => {
        expect(page.displayFormHeader('button#createExpenseCategoryBtn')).toEqual('Create');
    });
    it('should enter invalid inputs into name input field', () => {
        page.getSaleInputField('#expenseCat-name').sendKeys('it');
    });
    it('should not submit expense category form, if form inputs are invalid', () => {
        page.getButton('button#createExpenseCategoryBtn').click();
    });
    it('should click on the star symbol at the top right corner of the modal to close it', () => {
        page.getButton('button#close_modal').click();
    });
    it('should display \'Add new expense category\' form ', () => {
        page.getElement('#add-expense-cat').click();
    });
    
    it('should enter valid inputs into name input field', () => {
        page.getSaleInputField('#expenseCat-name').sendKeys(text);
    });
    it('should be able to select a category', () => {
        page.getElement('#expenseCat-categoryType').click();
        page.getElement('#each-category-type-0').click()
    });
    it('should submit expense category form, if form inputs are valid', () => {
        page.getButton('button#createExpenseCategoryBtn').click();
    });
    // add a vendor 
    it('should click on \'+\' sign to open a modal with title: \'Add new expense category\' to create a new expense category ', () => {
        page.getElement('#add-vendor').click();
    });
    it('should test that the update form has the right header, section name, label and input type', () => {
        expect(page.getElement('#createVendor').isDisplayed()).toBeTruthy();
        expect(page.getElement('#createVendor').getText()).toEqual('Create Vendor');
        Object.keys(createForm).map(field => {
            expect(page.getElement(`#${field}-label`).isDisplayed()).toBeTruthy();
            expect(page.getElement(`#${field}-label`).getText()).toEqual(createForm[field].label);
            expect(page.getElement(`#${field}-input`).getAttribute('type')).toEqual(createForm[field].inputtype);
        });
    });
    it('should display a \'Create\' button, to create new vendor if form is valid', () => {
        expect(page.displayFormHeader('button#createVendorBtn')).toEqual('Create');
    });
    
    it('should populate create vandor forms', () => {
        Object.keys(validCreateFormInput).map(field => {
            page.getElement(`#${field}-input`).sendKeys(validCreateFormInput[field].value);
        });
    });
    it('should click new vendor button to submit', () => {
        page.getButton('button#createVendorBtn').click();
    });
    it('should add expense description', () => {
        page.getElement('#expensedescription-input').sendKeys('An Electrical Component');
    });
    
    it('should select a date', () => {
        page.getElement('#inputexpensedate').sendKeys('2019-03-03')
    });
    
    it('Expense\'s Table  header label should contain: "Expense Description,Payment Type, Expense Date, Expense Date and Action" ', function () {
        page.getElement('h2#tableValue').getText().then(function (result) {
            if (result === 'hasValue') {
                expect(page.displayFulHeader('.datatable-header-cell-label')).toEqual(['Expense Description', 'Payment Type', 'Expense Date', 'Expense Date', 'Action']);
            } else if (result === 'hasNoValue') {
            }
        })
    });
    it('should display "Pencil Edit Icon" beside each  Expense list, if expense exist ', function () {
        page.getElement('h2#tableValue').getText().then(function (result) {
            if (result === 'hasValue') {
                expect(page.getElement(`${faviconclass}${editbutton}`).isDisplayed()).toBeTruthy();
            }
        })
    });
    it('should display "Delete expense" tooltip when hover over delete icon, and a delete Button to delete existing expense', function () {
        page.getElement('h2#tableValue').getText().then(function (result) {
            if (result === 'hasValue') {
                browser.actions().mouseMove(element(by.css("#delete_expense"))).perform().then(() => {
                    expect(page.getElement("#delete_expense").getAttribute("ngbTooltip")).toEqual('Delete expense')
                })
                expect(page.getElement("#delete_expense").isDisplayed()).toBeTruthy();
            }
        })
    });
    
    it('should display " Expenses" link to view expenses list', () => {
        expect(page.displayFormHeader('#viewExpense')).toEqual('Expenses');
    });
    
    it('should display a form with a title Update Expense on click of update button', function () {
        page.getElement('h2#tableValue').getText().then(function (result) {
            if (result === 'hasValue') {
                page.getElement('#edit_expense').click();
                expect(page.displayFormHeader('h4#modal-basic-title')).toEqual('Update Expense');
            }
        })
    });
   
    it('should show form input label called expense Description in create expense form', () => {
        expect(page.displayFormHeader('label#expensedescription-label')).toEqual(expenseLabel.saleDescription.value);
    });
    it('should show form input label called Category in create expense form', () => {
        expect(page.displayFormHeader('label#expense-category')).toEqual(expenseLabel.category.value);
    });
    it('should show form input label called payment Type in create expense form', () => {
        expect(page.displayFormHeader('legend#expense-paymentType')).toEqual(expenseLabel.PaymentType.value);
    });
    it('should show form input label called Bank in create expense form', () => {
        expect(page.displayFormHeader('label#expense-bank')).toEqual(expenseLabel.bank.value);
    });
    it('should show form input label called Credit in create expense form', () => {
        expect(page.displayFormHeader('label#expense-credit')).toEqual(expenseLabel.credit.value);
    });
    it('should show form input label called Cash in create expense form', () => {
        expect(page.displayFormHeader('label#expense-cash')).toEqual(expenseLabel.cash.value);
    });
    it('should show form input label called  Receipt in create expense form', () => {
        expect(page.displayFormHeader('label#expense-receipt')).toEqual(expenseLabel.receipts.value);
    });
});
