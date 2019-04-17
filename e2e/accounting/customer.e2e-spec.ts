import { Accounting } from './accounting.po';
import { browser, by, element, until, protractor, Key } from 'protractor';
import utils from '../utils';
import { Alert } from 'selenium-webdriver';
const path = require('path');
let page: Accounting;

const addbutton = '.fa-plus';
const editbutton = '.fa-edit';
const btn = '.btn';
const btnprimary = '.btn-primary';
const faviconclass = '.fa';
const today = new Date();
const tomorrow = new Date();
tomorrow.setDate(today.getDate()+1);
const name1 = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
const name2 = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 6);

const createFormAttribute = {
    name: {
        label: 'Name*',
        inputtype: 'text',
    },
    email: {
        label: 'Email',
        inputtype: 'email',
    },
    phone: {
        label: 'Phone Number',
        inputtype: 'text',
    },
    address: {
        label: 'Address',
        inputtype: 'textarea',
    },
};

const invalidInput = {
    name: {
        emptyChar: {
            input: '',
            msg: 'Name is required.'
        },
        minChar: {
            input: 'Go',
            msg: 'Name must be between 3 and 100 characters.'
        },
        maxChar: {
            input: 'AntimonopologeographicationalisminternalizationalismAntimonopologeographicationalisminternalizationalism',
            msg: 'Name must be between 3 and 100 characters.'
        }
    },
    email: {
        invalidInput: {
            input: 'smith#yahoo.com',
            msg: 'Enter a valid Email.'
        }
    },
    phone: {
        minChar: {
            input: '097',
            msg: 'Phone Number must be 11 characters.'
        },
        maxChar: {
            input: '0929292220202020202020',
            msg: 'Phone Number must be 11 characters.'
        },
        //Test for invalid number
    }
};

const validCreateFormInput = {
    name: {
        value: `${name1} ${name2}`,
    },
    phone: {
        value: `080${Math.floor(10000000 + Math.random() * 90000000)}`,
    },
    email: {
        value: `${name1}.${name2}@quabbly.com`,
    },
    address: {
        value: 'Quabbly Head Quaters',
    },
};

const updateCustomerFormInput = {
    name: {
        value: `${name2} ${name1}`,
    },
    phone: {
        value: `081${Math.floor(10000000 + Math.random() * 90000000)}`,
    },
    email: {
        value: `${name2}.${name1}@quably.com`,
    },
    address: {
        value: 'Quabbly Head Branch',
    },
};

describe('Accounting', () => {
    let page: Accounting;

    beforeAll(() => {
        utils.navigateTo('/');
        utils.handleAuth();
    });

    beforeEach(() => {
        page = new Accounting();
    });

    it('NOW TESTING CUSTOMER', () => {
        page.navigateTo('/accounting/customer');
    });

    it('should display a tabset that has a label "Customers"',() => {
        browser.sleep(500);
        expect(page.getInitialTab('viewCustomer')).toEqual('Customers');        
    });

    it('should display angry face and "No Customer" where there is no customer', () => {
        page.getEmptyListAttr('.fa.fa-frown-o.fa-2x.text-secondary', 'no-customer', 'No Customer');
    });

    it('should display "Create Customer" button with the correct attribute', () => {
        page.getActionButton('#create-customer', `${btn}${btnprimary}`, `#createcustomerplusicon${faviconclass}${addbutton}`, 'Create Customer');
    });

    //Create customer Test
    it('should click on Create Customer Button and assert that the create tab is displayed', () => {
        page.getClickButton('create-customer');
        browser.sleep(500);
        expect(page.getInitialTab('tab-id-0')).toEqual('New Customer   ×');
    });

    it('should test that the create form has the right header, label and input type', () => {
        expect(page.getElement('#createcustomerheader').isDisplayed()).toBeTruthy();
        expect(page.getElement('#createcustomerheader').getText()).toEqual('New Customer');    
        Object.keys(createFormAttribute).map(field => {
            expect(page.getElement(`#${field}-label`).isDisplayed()).toBeTruthy();
            expect(page.getElement(`#${field}-label`).getText()).toEqual(createFormAttribute[field].label);
            expect(page.getElement(`#${field}-input`).getAttribute('type')).toEqual(createFormAttribute[field].inputtype);
        });
    });

    it('should test that the Create Customer Button is Disabled', () => {
        expect(page.getElement('#createCustomerBtn').getAttribute('disabled')).toBeTruthy();
    });

    it('should display error message below the text input field values are invalid', () => {
        Object.keys(invalidInput).map(field => {
            Object.keys(invalidInput[field]).map(datas => {
                page.getElement(`#${field}-input`).sendKeys(invalidInput[field][datas].input);
                page.getElement(`#createcustomerheader`).click();
                expect(page.getElement(`.err${field}`).isDisplayed()).toBeTruthy();
                expect(page.getElement(`.err${field}`).getText()).toEqual(invalidInput[field][datas].msg);
                page.getElement(`#${field}-input`).clear();
            });
        });
    });

    it('should test that all valid input is inputed', () => {
        Object.keys(validCreateFormInput).map(field => {
            page.getElement(`#${field}-input`).sendKeys(validCreateFormInput[field].value);
        });
    });

    it('should test that the Create Customer Button is Enabled when all valid input are inserted', () => {
        expect(page.getElement('#createCustomerBtn').getAttribute('disabled')).toBeFalsy();
    });

    it('should test that the Create Customer Button has the correct attribute and when the Create Customer Button is clicked after valid input there is a success', () => {
        page.getActionButton('#createCustomerBtn', `${btn}${btnprimary}`, '', 'Create');
        page.getClickButton('createCustomerBtn');
        browser.sleep(2000);
        expect(page.toasterNotify('success')).toEqual('Customer Created Successfully');
    });

    //List customer Test
    it('should show labels of the form with the correct title when the List Customer Tab is clicked', () => {
        page.getClickButton('viewCustomer');
        browser.sleep(100);
        expect(page.getLabelTitle()).toEqual(['Name', 'Phone Number', 'Email', 'Total Transaction', 'Balance Payment', 'Date Created', 'Action']);
        //Test the content of what was created that they are in alignment with what was sent
    });

    it('should test that the action button for customer is visible with the correct tooltip', () => {
        expect(page.getElement('#deleteCustomer.icon.fa.fa-trash.text-danger').isDisplayed()).toBeTruthy();
        page.getActionToolTip('#deleteCustomer.icon.fa.fa-trash.text-danger', 'Delete Customer');
        expect(page.getElement('#editCustomer.icon.fa.fa-pencil.text-info').isDisplayed()).toBeTruthy();
        page.getActionToolTip('#editCustomer.icon.fa.fa-pencil.text-info', 'Edit Customer');
        expect(page.getElement('#suspendCustomer.icon.fa.fa-unlock.text-primary').isDisplayed()).toBeTruthy();
        page.getActionToolTip('#suspendCustomer.icon.fa.fa-unlock.text-primary', 'Suspend Customer');
    });

    it('should test that when you click edit the tab name is "Edit Customer" and all the previous data are populated', () => {
        page.getActionToolTip('#editCustomer.icon.fa.fa-pencil.text-info', 'Edit Customer');
        page.getFirstButton('editCustomer');
        browser.sleep(500);
        expect(page.getInitialTab('tab-id-0')).toEqual('Edit Customer   ×');
        Object.keys(validCreateFormInput).map(field => {
            expect(page.getElement(`#${field}-input`).getAttribute('value')).toEqual(validCreateFormInput[field].value);
        });    
    });

    it('should test that the update form has the right header, label and input type', () => {
        expect(page.getElement('#updateCustomerHeader').isDisplayed()).toBeTruthy();
        expect(page.getElement('#updateCustomerHeader').getText()).toEqual('Update Customer');    
        Object.keys(createFormAttribute).map(field => {
            expect(page.getElement(`#${field}-label`).isDisplayed()).toBeTruthy();
            expect(page.getElement(`#${field}-label`).getText()).toEqual(createFormAttribute[field].label);
            expect(page.getElement(`#${field}-input`).getAttribute('type')).toEqual(createFormAttribute[field].inputtype);
        });
    });

    it('should be able to update values', () => {
        Object.keys(updateCustomerFormInput).map(field => {
            page.getElement(`#${field}-input`).clear();
            page.getElement(`#${field}-input`).sendKeys(updateCustomerFormInput[field].value);
        });
    });

    it('should display "Update Customer" button with the correct attribute and clicking on it should successfully update the customer', () => {
        page.getActionButton('#updateCustomerBtn', `${btn}${btnprimary}`, '', 'Update');
        page.getClickButton('updateCustomerBtn');
        browser.sleep(2000);
        expect(page.toasterNotify('success')).toEqual('Selected Customer Updated successfully');
    });
    
    //suspend, unsuspend and delete customer
    it('should test customer list is displayed and after suspending of customer unsuspend button and the record is grayed out', () => {
        page.getClickButton('viewCustomer');
        browser.sleep(100);
        page.getClickButton('suspendCustomer');
        let ale:Alert = browser.switchTo().alert();
        expect(ale.getText()).toMatch('Are you sure you want to suspend the selected customer?')
		ale.accept();
        browser.sleep(500);
        expect(page.toasterNotify('success')).toEqual('Customer Suspended Successfully');
        expect(page.getElement('h6.InactiveCustomer').isDisplayed()).toBeTruthy();
    });

    it('should test that after unsuspending of customer suspend button and the record is not grayed out', () => {
        expect(page.getElement('#unsuspendCustomer.icon.fa.fa-lock.text-danger').isDisplayed()).toBeTruthy();
        page.getActionToolTip('#unsuspendCustomer.icon.fa.fa-lock.text-danger', 'Unsuspend Customer');
        page.getClickButton('unsuspendCustomer');
        let ale:Alert = browser.switchTo().alert();
        expect(ale.getText()).toMatch('Are you sure you want to unsuspend the selected customer?')
		ale.accept();
        browser.sleep(500);
        expect(page.toasterNotify('success')).toEqual('Customer Unsuspended Successfully');
    });

    it('should test that deleted record is successful', () => {
        page.getActionToolTip('#deleteCustomer.icon.fa.fa-trash.text-danger', 'Delete Customer');
        page.getClickButton('deleteCustomer');
        let ale:Alert = browser.switchTo().alert();
        expect(ale.getText()).toMatch('Are you sure you want to permanently delete the selected customer?')
		ale.accept();
        browser.sleep(500);
        expect(page.toasterNotify('success')).toEqual('Selected Customer Deleted Successfully');
    });

});
