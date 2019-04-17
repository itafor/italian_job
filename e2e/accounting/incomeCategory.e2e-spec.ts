import { Accounting } from './accounting.po';
import { browser, by, element, until, protractor } from 'protractor';
import utils from '../utils';
import { Alert } from 'selenium-webdriver';
const path = require('path');


const firstincomeCatCreateForm = {
    name: {
        label: 'Name*',
        inputtype: 'text'
    },
    categoryType: {
        label: 'Category Type',
        inputtype: 'select-one'
    },

};
const anotherincomeCatCreateForm = {
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
const updateincomeCatCreateForm = {
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
const newvalidCreateFormInput = {
    name: {
        value: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 15),
    }
};
const updateIncomeCategoryname = {
    name: {
        value: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 16),
    }
};



const addbutton = '.fa-plus';
const btn = '.btn';
const btnprimary = '.btn-primary';
const faviconclass = '.fa';
const spinner = '.fa.fa-spinner.fa-spin';


describe('Now testing income category', () => {
    let page: Accounting;

    beforeAll(() => {
        utils.navigateTo('/');
        utils.handleAuth();
    });

    beforeEach(() => {
        page = new Accounting();
    });

    //Now testing income category

    it('Now Testing Create Income Category', () => {
        page.navigateTo('/accounting/income-category');
    });

    it('should display angry face and "No Income Category" where there is no income category', () => {
        page.getEmptyListAttr('.fa.fa-frown-o.fa-2x.text-secondary', 'no-income-cat', 'No Income Cateory');
    });

    it('should display "Create Income Category" button with the correct attribute', () => {
        page.getActionButton('#createIncomeCat', `${btn}${btnprimary}`, `#createincomecategoryplusicon${faviconclass}${addbutton}`, 'Create Income Category  ');
    });

     //Create income category Test
     it('should click on Create Income Category Button and assert that the create tab is displayed', () => {
        page.getClickButton('createIncomeCat');
        expect(page.getInitialTab('tab-id-0')).toEqual('New Income Category   ×');
    });

    it('should display form titled:"New Income Category" to create new Income Category and Create Income Cateory form should have the following labels: "Name, and Income Category only"', () => {
        expect(page.getElement('#newIncomeCat').isDisplayed()).toBeTruthy();
        expect(page.getElement('#newIncomeCat').getText()).toEqual('New Income Category');
        Object.keys(firstincomeCatCreateForm).map(field => {
                expect(page.getElement(`#${field}-label`).isDisplayed()).toBeTruthy();
                expect(page.getElement(`#${field}-label`).getText()).toEqual(firstincomeCatCreateForm[field].label);
                expect(page.getElement(`#${field}-input`).getAttribute('type')).toEqual(firstincomeCatCreateForm[field].inputtype);         
        });
    });

    it('should test that the Create Income Category Button is Disabled', () => {
        expect(page.getElement('#createIncomeCatBtn').getAttribute('disabled')).toBeTruthy();
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

    it('should test that the Create Income Category Button is Enabled after all inputs have been filled', () => {
        expect(page.getElement('#createIncomeCatBtn').getAttribute('disabled')).toBeFalsy();
    });

    it('should test that the Create Income Category Button has the correct attribute and when the Create Income Category Button is clicked after valid input there is a success', () => {
        page.getActionButton('#createIncomeCatBtn', `${btn}${btnprimary}`, '', 'Create');
        page.getClickButton('createIncomeCatBtn');
        expect(page.toasterNotify('success')).toEqual('Income Category created successfully');
    });

    it('Create another income category', () => {
        page.getClickButton('createIncomeCat');
    });

    it('Create Income Cateory form should have the following labels: "Name, and Income Category and Parent Category now', () => {
        expect(page.getElement('#newIncomeCat').isDisplayed()).toBeTruthy();
        expect(page.getElement('#newIncomeCat').getText()).toEqual('New Income Category');
        Object.keys(anotherincomeCatCreateForm).map(field => {
                expect(page.getElement(`#${field}-label`).isDisplayed()).toBeTruthy();
                expect(page.getElement(`#${field}-label`).getText()).toEqual(anotherincomeCatCreateForm[field].label);
                expect(page.getElement(`#${field}-input`).getAttribute('type')).toEqual(anotherincomeCatCreateForm[field].inputtype);         
        });
    });
    it('should input a new category name entry', () => {
        Object.keys(newvalidCreateFormInput).map(field => {
            page.getElement(`#${field}-input`).sendKeys(newvalidCreateFormInput[field].value);
        });
    });
    it('should be able to select a category type', () => {
        page.getElement('#categoryType-input').click();
        page.getElement('#each-category-type-1').click()
    });
    it('should be able to select a parent category now', () => {
        page.getElement('#parentCategory-input').click();
        page.getElement('#parentCategory-0').click()
    });

    it('should test that the Create Income Category Button is Enabled now', () => {
        expect(page.getElement('#createIncomeCatBtn').getAttribute('disabled')).toBeFalsy();
    });

    it('should test that the Create Income Category Button has the correct attribute and when the Create Income Category Button is clicked after valid input there is a success', () => {
        page.getActionButton('#createIncomeCatBtn', `${btn}${btnprimary}`, '', 'Create');
        page.getClickButton('createIncomeCatBtn');
        expect(page.toasterNotify('success')).toEqual('Income Category created successfully');
    });

     //List Income Category Test
    //  it('should show labels of the form with the correct title when the Income Category List Tab is clicked', () => {
    //     page.getClickButton('viewIncomeCategory');
    //     expect(page.getLabelTitle()).toEqual(['Category Name', 'Category Type', 'Parent Category', 'Date Created', 'Action']);
    //     //Test the content of what was created that they are in alignment with what was sent
    // });

    // it('should test that the action buttons for Income Category are visible with the correct tooltips', () => {
    //     expect(page.getElement('#editIncomeCategory.icon.fa.fa-pencil.text-info').isDisplayed()).toBeTruthy();
    //     page.getActionToolTip('#editIncomeCategory.icon.fa.fa-pencil.text-info', 'Edit income category');
    //     expect(page.getElement('#deleteIncomeCat.icon.fa.fa-trash.text-danger').isDisplayed()).toBeTruthy();
    //     page.getActionToolTip('#deleteIncomeCat.icon.fa.fa-trash.text-danger', 'Delete income category');
    // });

    // it('should test that when you click edit the tab name is "Edit Income category" and all the previous data are populated', () => {
    //     page.getFirstButton('editIncomeCategory');
    //     expect(page.getInitialTab('tab-id-0')).toEqual('Edit Income Category   ×');
    //     Object.keys(validCreateFormInput).map(field => {
    //         expect(page.getElement(`#${field}-input`).getAttribute('value')).toEqual(validCreateFormInput[field].value);
    //     });  
    // });

    // it('should test that the update form has the right header, section name, label and input type', () => {
    //     expect(page.getElement('#updateIncomeCategory').isDisplayed()).toBeTruthy();
    //     expect(page.getElement('#updateIncomeCategory').getText()).toEqual('Update Income Category');    
    //     Object.keys(updateincomeCatCreateForm).map(field => {
    //         expect(page.getElement(`#${field}-label`).isDisplayed()).toBeTruthy();
    //         expect(page.getElement(`#${field}-label`).getText()).toEqual(updateincomeCatCreateForm[field].label);
    //         expect(page.getElement(`#${field}-input`).getAttribute('type')).toEqual(updateincomeCatCreateForm[field].inputtype);
    //     });
    // });

    // it('should be able to update name', () => {
    //     Object.keys(updateIncomeCategoryname).map(field => {
    //         page.getElement(`#${field}-input`).clear();
    //         page.getElement(`#${field}-input`).sendKeys(updateIncomeCategoryname[field].value);
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
    //     page.getClickButton('updateIncomeCatBtn');
    //     expect(page.toasterNotify('error')).toEqual('cannot set a category as parent of itself');
    // });

    // it('select another parent category', () => {
    //     page.getElement('#parentCategory-input').click();
    //     page.getElement('#parentCategory-1').click()
    // });

    // it('should display "Update" button with the correct attribute and clicking on it should successfully update the income category', () => {
    //     page.getActionButton('#updateIncomeCatBtn', `${btn}${btnprimary}`, '', 'Update');
    //     page.getClickButton('updateIncomeCatBtn');
    //     expect(page.toasterNotify('success')).toEqual('Selected Income category Updated successfully');
    // });
    // it('should be able to delete an income category', () => {
    //     page.getFirstButton('deleteIncomeCat');
    //     let ale:Alert = browser.switchTo().alert();
    //     expect(ale.getText()).toMatch('Are you sure you want to permanently delete the selected  income category?')
	// 	// clicks 'OK' button
	// 	ale.accept();
    //     expect(page.toasterNotify('success')).toEqual('Selected income category deleted successfully');
    // });
    


});


