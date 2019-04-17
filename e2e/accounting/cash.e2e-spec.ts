import { Accounting } from './accounting.po';
import { browser, by, element, until, protractor } from 'protractor';
import utils from '../utils';
import { Alert } from 'selenium-webdriver';
const path = require('path');


const newcashaccount = {
    name: {
        label: 'Full Name*',
        inputtype: 'text'
    },
    currency: {
        label: 'Currency',
        inputtype: 'select-one'
    },

};
const updateincomeCatCreateForm = {
    name: {
        label: 'Full Name*',
        inputtype: 'text'
    },

};
const validcashacctname = {
    name: {
        value: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10),
    }
};
const newvalidcashacctname = {
    name: {
        value: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 15),
    }
};
const updatecashaccountname = {
    name: {
        value: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 16),
    }
};



const addbutton = '.fa-plus';
const btn = '.btn';
const btnprimary = '.btn-primary';
const faviconclass = '.fa';
const spinner = '.fa.fa-spinner.fa-spin';


describe('Now testing cash account', () => {
    let page: Accounting;

    beforeAll(() => {
        utils.navigateTo('/');
        utils.handleAuth();
    });

    beforeEach(() => {
        page = new Accounting();
    });

    //Now testing cash account

    it('Now Testing Create Cash Account', () => {
        page.navigateTo('/accounting/cash-account');
        browser.sleep(2000)
    });

    it('should display angry face and "No cash account" where there is no cash account', () => {
        page.getEmptyListAttr('.fa.fa-frown-o.fa-2x.text-secondary', 'nocashaccount', 'No Cash Account');
    });

    it('should display "Create cash account" button with the correct attribute', () => {
        page.getActionButton('#createCashAcct', `${btn}${btnprimary}`, `#createcashacctplusicon${faviconclass}${addbutton}`, 'Create Cash Account  ');
    });

     //Create cash account Test
     it('should click on Create cash account Button and assert that the create tab is displayed', () => {
        page.getClickButton('createCashAcct');
        browser.sleep(500);
        expect(page.getInitialTab('tab-id-0')).toEqual('New Cash Account   ×');
    });

    it('should display form titled:"New cash account" to create new cash account and Create Cash Account form should have the following labels: "Name, and cash account only"', () => {
        expect(page.getElement('#newCashAcct').isDisplayed()).toBeTruthy();
        expect(page.getElement('#newCashAcct').getText()).toEqual('New Cash Account');
        Object.keys(newcashaccount).map(field => {
                expect(page.getElement(`#${field}-label`).isDisplayed()).toBeTruthy();
                expect(page.getElement(`#${field}-label`).getText()).toEqual(newcashaccount[field].label);
                expect(page.getElement(`#${field}-input`).getAttribute('type')).toEqual(newcashaccount[field].inputtype);         
        });
    });

    it('should test that the Create cash account Button is Disabled', () => {
        expect(page.getElement('#createCashAcctBtn').getAttribute('disabled')).toBeTruthy();
    });

    it('should input a new category name', () => {
        Object.keys(validcashacctname).map(field => {
            page.getElement(`#${field}-input`).sendKeys(validcashacctname[field].value);
        });
    });

    it('should be able to select a currency', () => {
        page.getElement('#currency-input').click();
        page.getElement('#currency-0').click()
    });

    it('should test that the Create cash account Button is Enabled after all inputs have been filled', () => {
        expect(page.getElement('#createCashAcctBtn').getAttribute('disabled')).toBeFalsy();
    });

    it('should test that the Create cash account Button has the correct attribute and when the Create cash account Button is clicked after valid input there is a success', () => {
        page.getActionButton('#createCashAcctBtn', `${btn}${btnprimary}`, '', 'Create');
        page.getClickButton('createCashAcctBtn');
        browser.sleep(1000);
        expect(page.toasterNotify('success')).toEqual('Cash account created successfully');
    });

     //List Cash Account Test
    //  it('should show labels of the form with the correct title when the cash account List Tab is clicked', () => {
    //     page.getClickButton('viewCashAccount');
    //     browser.sleep(100);
    //     expect(page.getLabelTitle()).toEqual(['Account Name', 'Date Created', 'Action']);
    //     //Test the content of what was created that they are in alignment with what was sent
    // });

    // it('should test that the action buttons for cash account are visible with the correct tooltips', () => {
    //     expect(page.getElement('#editCashAccount.icon.fa.fa-pencil.text-info').isDisplayed()).toBeTruthy();
    //     page.getActionToolTip('#editCashAccount.icon.fa.fa-pencil.text-info', 'Edit account');
    //     expect(page.getElement('#deleteCashAccount.icon.fa.fa-trash.text-danger').isDisplayed()).toBeTruthy();
    //     page.getActionToolTip('#deleteCashAccount.icon.fa.fa-trash.text-danger', 'Delete account');
    // });

    // it('should test that when you click edit the tab name is "Edit cash account" and all the previous data are populated', () => {
    //     page.getFirstButton('editCashAccount');
    //     browser.sleep(500);
    //     expect(page.getInitialTab('tab-id-0')).toEqual('Edit Cash Account   ×');
    //     Object.keys(validcashacctname).map(field => {
    //         expect(page.getElement(`#${field}-input`).getAttribute('value')).toEqual(validcashacctname[field].value);
    //     });  
    // });

    // it('should test that the update form has the right header, label and input type', () => {
    //     expect(page.getElement('#updateCashAccount').isDisplayed()).toBeTruthy();
    //     expect(page.getElement('#updateCashAccount').getText()).toEqual('Update Cash Account');    
    //     Object.keys(updateincomeCatCreateForm).map(field => {
    //         expect(page.getElement(`#${field}-label`).isDisplayed()).toBeTruthy();
    //         expect(page.getElement(`#${field}-label`).getText()).toEqual(updateincomeCatCreateForm[field].label);
    //         expect(page.getElement(`#${field}-input`).getAttribute('type')).toEqual(updateincomeCatCreateForm[field].inputtype);
    //     });
    // });

    // it('should be able to update name', () => {
    //     Object.keys(updatecashaccountname).map(field => {
    //         page.getElement(`#${field}-input`).clear();
    //         page.getElement(`#${field}-input`).sendKeys(updatecashaccountname[field].value);
    //     });
    // });

    // it('should display "Update" button with the correct attribute and clicking on it should successfully update the cash account', () => {
    //     page.getActionButton('#updateCashAcctBtn', `${btn}${btnprimary}`, '', 'Update');
    //     page.getClickButton('updateCashAcctBtn');
    //     browser.sleep(2000);
    //     expect(page.toasterNotify('success')).toEqual('Selected Account Updated successfully');
    // });
    // it('should be able to delete an cash account', () => {
    //     page.getFirstButton('deleteCashAccount');
    //     let ale:Alert = browser.switchTo().alert();
    //     expect(ale.getText()).toMatch('Are you sure you want to permanently delete the selected  account?')
	// 	// clicks 'OK' button
	// 	ale.accept();
    //     expect(page.toasterNotify('success')).toEqual('Account deleted successfully');
    // });
    


});