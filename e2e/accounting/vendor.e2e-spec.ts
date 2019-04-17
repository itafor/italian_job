import { Accounting } from './accounting.po';
import { browser, by, element, until, protractor, Key } from 'protractor';
import utils from '../utils';
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

const testValue = {
    name: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 9),
    
};
const validCreateFormInput = {
    name: {
        value: testValue.name,
    },
    phone: {
        value: '08183839393',
    },
    email: {
        value: 'john.doe@quabbly.com',
    },
    address: {
        value: 'Quabbly Head Quaters',
    },
};

describe('Accounting', () => {
    let page: Accounting;

    beforeAll(() => {
        utils.navigateTo('/');
    });

    beforeEach(() => {
        page = new Accounting();
    });

    it('NOW TESTING VENDOR', () => {
        page.navigateTo('/accounting/vendor');
    });

    it('should display a tabset that has a label "Vendors"',() => {
        browser.sleep(500);
        expect(page.getElementLabel('viewVendor')).toEqual('Vendors');        
    });
    it('should display "Create Vendor" button with the correct attribute', () => {
        page.getActionButton('#create-vendor', `${btn}${btnprimary}`, `#createvendorplusicon${faviconclass}${addbutton}`, 'Create Vendor');
    });

    //Create Vendor Test
    it('should click on Create Vendor Button and assert that the create tab is displayed', () => {
        page.getClickButton('create-vendor');
        browser.sleep(500);
        expect(page.getInitialTab('tab-id-0')).toEqual('New Vendor   ×');
    });

    it('should test that the create form has the right header, section name, label and input type', () => {
        expect(page.getElement('#createvendorheader').isDisplayed()).toBeTruthy();
        expect(page.getElement('#createvendorheader').getText()).toEqual('New Vendor');    
        Object.keys(createFormAttribute).map(field => {
            expect(page.getElement(`#${field}-label`).isDisplayed()).toBeTruthy();
            expect(page.getElement(`#${field}-label`).getText()).toEqual(createFormAttribute[field].label);
            expect(page.getElement(`#${field}-input`).getAttribute('type')).toEqual(createFormAttribute[field].inputtype);
        });
    });

    it('should test that the Create Vendor Button is Disabled', () => {
        expect(page.getElement('#createVendorBtn').getAttribute('disabled')).toBeTruthy();
    });

    it('should display error message below the text input field values are invalid', () => {
        Object.keys(invalidInput).map(field => {
            Object.keys(invalidInput[field]).map(datas => {
                page.getElement(`#${field}-input`).sendKeys(invalidInput[field][datas].input);
                page.getElement(`#createvendorheader`).click();
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

    it('should test that the Create Vendor Button is Enabled when all valid input are inserted', () => {
        expect(page.getElement('#createVendorBtn').getAttribute('disabled')).toBeFalsy();
    });

    it('should test that the Create Vendor Button has the correct attribute and when the Create Vendor Button is clicked after valid input there is a success', () => {
        page.getActionButton('#createVendorBtn', `${btn}${btnprimary}`, '', 'Create');
        page.getClickButton('createVendorBtn');
        expect(page.toasterNotify('success')).toEqual('Vendor created successfully');
    });

    //List Vendor Test
    it('should show labels of the form with the correct title when the List Vendor Tab is clicked', () => {
        page.getClickButton('viewVendor');
        browser.sleep(100);
        expect(page.getLabelTitle()).toEqual(['Name', 'Phone Number', 'Email', 'Total Transaction', 'Balance Payment', 'Date Created', 'Action']);
    });

    it('should test that the action button for vendor is visible with the correct tooltip', () => {
        expect(page.getElement('#deleteVendor.icon.fa.fa-trash.text-danger').isDisplayed()).toBeTruthy();
        page.getActionToolTip('#deleteVendor.icon.fa.fa-trash.text-danger', 'Delete Vendor');
        expect(page.getElement('#editVendor.icon.fa.fa-pencil.text-info').isDisplayed()).toBeTruthy();
        page.getActionToolTip('#editVendor.icon.fa.fa-pencil.text-info', 'Edit Vendor');
        expect(page.getElement('#suspendVendor.icon.fa.fa-unlock.text-primary').isDisplayed()).toBeTruthy();
        page.getActionToolTip('#suspendVendor.icon.fa.fa-unlock.text-primary', 'Suspend Vendor');
    });

    it('should test vendor list is displayed and after suspending of vendor unsuspend button and the record is grayed out', () => {
        page.getClickButton('viewVendor');
        browser.sleep(100);
        page.getClickButton('suspendVendor');
        page.getAlertInfoAndAccept('Are you sure you want to suspend the selected vendor?');
        browser.sleep(1000);
        expect(page.toasterNotify('success')).toEqual('Vendor Suspended');
        expect(page.getElement('h6.InactiveVendor').isDisplayed()).toBeTruthy();
    });
});