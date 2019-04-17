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
tomorrow.setDate(today.getDate() + 1);

const createFormAttribute = {
  bankname: {
    label: 'Bank Name*',
    inputtype: 'text'
  },
  accountname: {
    label: 'Account Name*',
    inputtype: 'text'
  },
  accountnumber: {
    label: 'Account Number*',
    inputtype: 'text'
  },
  branch: {
    label: 'Branch',
    inputtype: 'text'
  }
};

const invalidInput = {
  bankname: {
    emptyChar: {
      input: '',
      msg: 'Bank Name is required.'
    }
  },
  accountname: {
    emptyChar: {
      input: '',
      msg: 'Account Name is required.'
    }
  }
  //Test for account number three validation
};

const testValue = {
    bankname: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 9),
    accName: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 8),
    accounNo: Math.floor(Math.random() * 10000000000)
};

const validCreateFormInput = {
    bankname: {
        value: testValue.bankname,
    },
    accountname: {
        value: testValue.accName,
    },
    accountnumber: {
        value: '2123451234',
    },
    branch: {
        value: 'Quabbly Head Quaters',
    },
};

describe('Accounting | Bank', () => {
    let page: Accounting;

    beforeAll(() => {
        utils.navigateTo('/');
        utils.handleAuth();
    });

    beforeEach(() => {
        page = new Accounting();
    });

    it('NOW TESTING BANK', () => {
        page.navigateTo('/accounting/bank');
    });

    it('should display a tabset that has a label "Banks"',() => {
        browser.sleep(500);
        expect(page.getInitialTab('viewBank')).toEqual('Banks');        
    });

    it('should display angry face and "No Bank" where there is no bank', () => {
        page.getEmptyListAttr('.fa.fa-frown-o.fa-2x.text-secondary', 'no-bank', 'No Bank');
    });

    it('should display "Create Bank" button with the correct attribute', () => {
        page.getActionButton('#create-bank', `${btn}${btnprimary}`, `#createbankplusicon${faviconclass}${addbutton}`, 'Create Bank');
    });

    //Create bank Test
    it('should click on Create Bank Button and assert that the create tab is displayed', () => {
        page.getClickButton('create-bank');
        browser.sleep(500);
        expect(page.getInitialTab('tab-id-0')).toEqual('New Bank   ×');
    });

    it('should test that the create form has the right header, section name, label and input type', () => {
        expect(page.getElement('#createbankheader').isDisplayed()).toBeTruthy();
        expect(page.getElement('#createbankheader').getText()).toEqual('New Bank');    
        Object.keys(createFormAttribute).map(field => {
            expect(page.getElement(`#${field}-label`).isDisplayed()).toBeTruthy();
            expect(page.getElement(`#${field}-label`).getText()).toEqual(createFormAttribute[field].label);
            expect(page.getElement(`#${field}-input`).getAttribute('type')).toEqual(createFormAttribute[field].inputtype);
        });
    });


    it('should display error message below the text input field values are invalid', () => {
        Object.keys(invalidInput).map(field => {
            Object.keys(invalidInput[field]).map(datas => {
                page.getElement(`#${field}-input`).sendKeys(invalidInput[field][datas].input);
                page.getElement(`#createbankheader`).click();
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
        page.getSaleInputField('#DefaultCurrencyInput').click();
        page.getElement('#currency-0').click();
        browser.sleep(500);
    });

    it('should test that the Create Bank Button has the correct attribute and when the Create Bank Button is clicked after valid input there is a success', () => {
        page.getActionButton('#createBankBtn', `${btn}${btnprimary}`, '', 'Create');
        page.getClickButton('createBankBtn');
        browser.sleep(500);
        expect(page.toasterNotify('success')).toEqual('Bank Created Successfully');
    });

    //List bank Test
    it('should show labels of the form with the correct title when the List bank Tab is clicked', () => {
        page.getClickButton('viewBank');
        browser.sleep(100);
        expect(page.getLabelTitle()).toEqual(['Bank Name', 'Account Name', 'Account Number', 'Branch', 'Date Created', 'Action']);
    });

    it('should test that the action button for bank is visible with the correct tooltip', () => {
        expect(page.getElement('#deleteBank.icon.fa.fa-trash.text-danger').isDisplayed()).toBeTruthy();
        page.getActionToolTip('#deleteBank.icon.fa.fa-trash.text-danger', 'Delete Bank');
        expect(page.getElement('#editBank.icon.fa.fa-pencil.text-info').isDisplayed()).toBeTruthy();
        page.getActionToolTip('#editBank.icon.fa.fa-pencil.text-info', 'Edit Bank');
    });

    it('should test that when you click edit the tab name is "Edit Bank" and all the previous data are populated', () => {
        page.getClickButton('editBank');
        browser.sleep(500);
        expect(page.getInitialTab('tab-id-0')).toEqual('Edit Bank   ×');
        Object.keys(validCreateFormInput).map(field => {
            expect(page.getElement(`#${field}-input`).getAttribute('value')).toEqual(validCreateFormInput[field].value);
        });    
    });

    it('should test that the update form has the right header, section name, label and input type', () => {
        expect(page.getElement('#updateBankHeader').isDisplayed()).toBeTruthy();
        expect(page.getElement('#updateBankHeader').getText()).toEqual('Update Bank');    
        Object.keys(createFormAttribute).map(field => {
            expect(page.getElement(`#${field}-label`).isDisplayed()).toBeTruthy();
            expect(page.getElement(`#${field}-label`).getText()).toEqual(createFormAttribute[field].label);
            expect(page.getElement(`#${field}-input`).getAttribute('type')).toEqual(createFormAttribute[field].inputtype);
        });
    });


    it('should display "Update Bank" button with the correct attribute and clicking on it should successfully update the bank', () => {
        page.getActionButton('#updateBankBtn', `${btn}${btnprimary}`, '', 'Update');
        page.getClickButton('updateBankBtn');
        expect(page.toasterNotify('success')).toEqual('Selected Bank Updated Successfully');
    });

    it('should test that deleted record is successful', () => {
        page.getClickButton('deleteBank');
        page.getAlertInfoAndAccept('Are you sure you want to permanently delete the selected bank?');
        browser.sleep(1000);
        expect(page.toasterNotify('success')).toEqual('Selected Bank Deleted Successfully');
    });

});
