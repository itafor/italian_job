import { Accounting } from './accounting.po';
import { browser, by, element, until, protractor } from 'protractor';
import utils from '../utils';
import { Alert } from 'selenium-webdriver';
const path = require('path');


const firstexpenseCatCreateForm = {
    name: {
        label: 'Name*',
        inputtype: 'text'
    },
    categoryType: {
        label: 'Category Type',
        inputtype: 'select-one'
    },

};
const anotherexpenseCatCreateForm = {
    name: {
        label: 'Name*',
        inputtype: 'text'
    },
    categoryType: {
        label: 'Category Type',
        inputtype: 'select-one'
    },
    parentCategory: {
        label: 'Parent Category',
        inputtype: 'select-one'
    },

};
const updateexpenseCatCreateForm = {
    name: {
        label: 'Name*',
        inputtype: 'text'
    },
    categoryType: {
        label: 'Category Type*',
        inputtype: 'select-one'
    },
    parentCategory: {
        label: 'Parent Category',
        inputtype: 'select-one'
    },

};
const validCreateFormInput = {
    name: {
        value: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10),
    }
};
const nameval = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 15)

const newvalidCreateFormInput = {
    name: {
        value: nameval,
    }
};
const updateexpenseCategoryname = {
    name: {
        value: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 16),
    }
};



const addbutton = '.fa-plus';
const btn = '.btn';
const btnprimary = '.btn-primary';
const faviconclass = '.fa';
const spinner = '.fa.fa-spinner.fa-spin';


describe('Now testing expense category', () => {
    let page: Accounting;

    beforeAll(() => {
        utils.navigateTo('/');
        utils.handleAuth();
    });

    beforeEach(() => {
        page = new Accounting();
    });

    //Now testing expense category

    it('Now Testing Create expense Category', () => {
        page.navigateTo('/accounting/expense-category');
    });

    it('should display angry face and "No expense Category" where there is no expense category', () => {
        page.getEmptyListAttr('.fa.fa-frown-o.fa-2x.text-secondary', 'no-expensecategory', 'No Expense Category');
    });

    it('should display "Create expense Category" button with the correct attribute', () => {
        page.getActionButton('#createexpensecategory', `${btn}${btnprimary}`, `#createexpensecategoryplusicon${faviconclass}${addbutton}`, 'Create Expense Category');
    });

     //Create expense category Test
     it('should click on Create expense Category Button and assert that the create tab is displayed', () => {
        page.getClickButton('createexpensecategory');
        browser.sleep(500);
        expect(page.getInitialTab('tab-id-0')).toEqual('New Expense Category   ×');
    });

    it('should display form titled:"New expense Category" to create new expense Category and Create expense Cateory form should have the following labels: "Name, and expense Category only"', () => {
        expect(page.getElement('#createexpensecategoryheader').isDisplayed()).toBeTruthy();
        expect(page.getElement('#createexpensecategoryheader').getText()).toEqual('New Expense Category');
        Object.keys(firstexpenseCatCreateForm).map(field => {
                expect(page.getElement(`#${field}-label`).isDisplayed()).toBeTruthy();
                expect(page.getElement(`#${field}-label`).getText()).toEqual(firstexpenseCatCreateForm[field].label);
                expect(page.getElement(`#${field}-input`).getAttribute('type')).toEqual(firstexpenseCatCreateForm[field].inputtype);         
        });
    });

    it('should test that the Create expense Category Button is Disabled', () => {
        expect(page.getElement('#createexpensecategoryBtn').getAttribute('disabled')).toBeTruthy();
    });

    it('should input a new category name', () => {
        Object.keys(validCreateFormInput).map(field => {
            page.getElement(`#${field}-input`).sendKeys(validCreateFormInput[field].value);
        });
    });

    it('should be able to select a category type', () => {
        page.getElement('#categoryType-input').click();
        page.getElement('#each-category-type-0').click()
    });

    it('should test that the Create expense Category Button is Enabled after all inputs have been filled', () => {
        expect(page.getElement('#createexpensecategoryBtn').getAttribute('disabled')).toBeFalsy();
    });

    it('should test that the Create expense Category Button has the correct attribute and when the Create expense Category Button is clicked after valid input there is a success', () => {
        page.getActionButton('#createexpensecategoryBtn', `${btn}${btnprimary}`, '', 'Create');
        page.getClickButton('createexpensecategoryBtn');
        browser.sleep(500);
        expect(page.toasterNotify('success')).toEqual('Expense Category Created Successfully');
    });

    // it('Create another expense category', () => {
    //     page.getClickButton('createexpensecategory');
    //     browser.sleep(500);
    // });

    // it('Create expense Cateory form should have the following labels: "Name, and expense Category and Parent Category now', () => {
    //     expect(page.getElement('#createexpensecategoryheader').isDisplayed()).toBeTruthy();
    //     expect(page.getElement('#createexpensecategoryheader').getText()).toEqual('New Expense Category');
    //     Object.keys(anotherexpenseCatCreateForm).map(field => {
    //             expect(page.getElement(`#${field}-label`).isDisplayed()).toBeTruthy();
    //             expect(page.getElement(`#${field}-label`).getText()).toEqual(anotherexpenseCatCreateForm[field].label);
    //             expect(page.getElement(`#${field}-input`).getAttribute('type')).toEqual(anotherexpenseCatCreateForm[field].inputtype);         
    //     });
    // });
    // it('should input a new category name entry', () => {
    //     Object.keys(newvalidCreateFormInput).map(field => {
    //         page.getElement(`#${field}-input`).sendKeys(newvalidCreateFormInput[field].value);
    //     });
    // });
    // it('should be able to select a category type', () => {
    //     page.getElement('#categoryType-input').click();
    //     page.getElement('#each-category-type-1').click()
    // });
    // it('should be able to select a parent category now', () => {
    //     page.getElement('#parentCategory-input').click();
    //     page.getElement('#parentCategory-0').click()
    // });

    // it('should test that the Create expense Category Button is Enabled now', () => {
    //     expect(page.getElement('#createexpensecategoryBtn').getAttribute('disabled')).toBeFalsy();
    // });

    // it('should test that the Create expense Category Button has the correct attribute and when the Create expense Category Button is clicked after valid input there is a success', () => {
    //     page.getActionButton('#createexpensecategoryBtn', `${btn}${btnprimary}`, '', 'Create');
    //     page.getClickButton('createexpensecategoryBtn');
    //     browser.sleep(1000);
    //     expect(page.toasterNotify('success')).toEqual('Expense Category Created Successfully');
    // });

    //  //List expense Category Test
    //  it('should show labels of the form with the correct title when the expense Category List Tab is clicked', () => {
    //     page.getClickButton('viewexpensecategory');
    //     browser.sleep(100);
    //     expect(page.getLabelTitle()).toEqual(['Name', 'Category Type', 'Parent Category', 'Date Created', 'Action']);
    //     //Test the content of what was created that they are in alignment with what was sent
    // });

    // it('should test that the action buttons for expense Category are visible with the correct tooltips', () => {
    //     expect(page.getElement('#editexpenseCategory.icon.fa.fa-pencil.text-info').isDisplayed()).toBeTruthy();
    //     page.getActionToolTip('#editexpenseCategory.icon.fa.fa-pencil.text-info', 'Edit Expense Category');
    //     expect(page.getElement('#deleteexpenseCat.icon.fa.fa-trash.text-danger').isDisplayed()).toBeTruthy();
    //     page.getActionToolTip('#deleteexpenseCat.icon.fa.fa-trash.text-danger', 'Delete Expense Category');
    // });

    // it('should test that when you click edit the tab name is "Edit Expense Category" and all the previous data are populated', () => {
    //     page.getFirstButton('editexpenseCategory');
    //     browser.sleep(500);
    //     expect(page.getInitialTab('tab-id-0')).toEqual('Edit Expense Cateory   ×');
    //     Object.keys(validCreateFormInput).map(field => {
    //         expect(page.getElement(`#${field}-input`).getAttribute('value')).toEqual(validCreateFormInput[field].value);
    //     });  
    // });

    // it('should test that the update form has the right header, section name, label and input type', () => {
    //     expect(page.getElement('#updateexpenseCategory').isDisplayed()).toBeTruthy();
    //     expect(page.getElement('#updateexpenseCategory').getText()).toEqual('Update Expense Cateory');    
    //     Object.keys(updateexpenseCatCreateForm).map(field => {
    //         expect(page.getElement(`#${field}-label`).isDisplayed()).toBeTruthy();
    //         expect(page.getElement(`#${field}-label`).getText()).toEqual(updateexpenseCatCreateForm[field].label);
    //         expect(page.getElement(`#${field}-input`).getAttribute('type')).toEqual(updateexpenseCatCreateForm[field].inputtype);
    //     });
    // });

    // it('should be able to update name', () => {
    //     Object.keys(updateexpenseCategoryname).map(field => {
    //         page.getElement(`#${field}-input`).clear();
    //         page.getElement(`#${field}-input`).sendKeys(updateexpenseCategoryname[field].value);
    //     });
    // });

    // it('should be able to update a category', () => {
    //     page.getElement('#categoryType-input').click();
    //     page.getElement('#each-category-type-1').click()
    // });
    // it('should show error if I assign same parent category to itself', () => {
    //     page.getElement('#parentCategory-input').click();
    //     page.getElement('#parentCategory-0').click()
    // });

    // it('should show error if I assign same parent category to itself', () => {
    //     page.getClickButton('updateExpenseCatBtn');
    //     expect(page.toasterNotify('error')).toEqual('cannot set a category as parent of itself');
    // });

    // it('select another parent category', () => {
    //     page.getElement('#parentCategory-input').click();
    //     page.getElement('#parentCategory-1').click()
    // });

    // it('should display "Update" button with the correct attribute and clicking on it should successfully update the expense category', () => {
    //     page.getActionButton('#updateExpenseCatBtn', `${btn}${btnprimary}`, '', 'Update');
    //     page.getClickButton('updateExpenseCatBtn');
    //     browser.sleep(500);
    //     expect(page.toasterNotify('success')).toEqual('Selected expense category Updated successfully');
    // });
    // it('should be able to delete an expense category', () => {
    //     page.getFirstButton('deleteexpenseCat');
    //     let ale:Alert = browser.switchTo().alert();
    //     expect(ale.getText()).toMatch('Are you sure you want to permanently delete the selected expense category?')
	// 	// clicks 'OK' button
	// 	ale.accept();
    //     expect(page.toasterNotify('success')).toEqual('Selected expense category deleted successfully');
    // });

    });
    



