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

const yesLabels = {
  yes: {
    yesLabel: 'Yes'
  }
};

const noLabels = {
  no: {
    noLabel: 'No'
  }
};

const checkRadiButton = {
  checkTrue: ''
};

const settingInput = {
  requisitionApproversInput: {
    value: 'mary@photizz.com,Joan@photizzo.com,Luke@photizzo.com,Paul@photizzo.com',
  },
  procurementApprovalEmailsInput: {
    value: 'tina@photizzo.com,john@photizzo.com,david@photizzo.com'
  }
};

const warningLabels = {
  procurementApprovalEmails: {
    label: 'Procurement Approval Emails should be separated with a comma'
  },
  requisitionApprovalEmails: {
    label: 'Requisition Approval Emails should be separated with a comma'
  },
  transferFeeExpenseCategory: {
    label: 'Transfer Fee Expense Category'
  }
};

describe('Accounting | Settings', () => {
  let page: Accounting;

  beforeAll(() => {
    utils.navigateTo('/');
    utils.handleAuth();
  });

  beforeEach(() => {
    page = new Accounting();
  });

  it('should display a tabset that has a label "Settings"', () => {
    page.navigateTo('/accounting/settings');
    expect(page.getElementLabel('viewSettings')).toEqual('Settings');
  });
  it('should display a label titled: "Enable Requisition Approval"', () => {
    expect(page.getElementLabel('EnableRequisitionApproval')).toEqual(
      'Enable Requisition Approval'
    );
  });

  it('should display a label titled: "Enable Approval For Procurement"', () => {
    expect(page.getElementLabel('EnableApprovalForProcurement')).toEqual(
      'Enable Approval For Procurement'
    );
  });

  it('should display a label titled: "Enable Bank Transfer Fee"', () => {
    expect(page.getElementLabel('EnableBankTransferFee')).toEqual(
      'Enable Bank Transfer Fee'
    );
  });
  it('should display a label titled: "Default Currency"', () => {
    expect(page.getElementLabel('DefaultCurrency')).toEqual('Default Currency:');
  });

  it('should display all labels titled "Yes" in settings', () => {
    Object.keys(yesLabels).map(field => {
      expect(page.getElementLabel(field)).toEqual(yesLabels[field].yesLabel);
    });
  });

  it('should display all labels titled "No" in settings', () => {
    Object.keys(noLabels).map(field => {
      expect(page.getElementLabel(field)).toEqual(noLabels[field].noLabel);
    });
  });

 

  it('should display all warning labels in settings after  checking all radio buttons', () => {
        page.getElement('#checkTrueProcurement').click();
        page.getElement('#checkTrueRequisition').click();
        page.getElement('#checkTrueBank').click();
  });

  it('should clear all emails in requisitionApprovers and procurementApprovalEmails Input fields ', () => {
    Object.keys(settingInput).map(val => {
      page.getElement(`#${val}`).clear();
    });
  });

  it('should input new emails in requisitionApprovals and procurementApprovalEmails  fields, should also have a button named: "Submit" ', () => {
    Object.keys(settingInput).map(val => {
      page.getElement(`#${val}`).sendKeys(settingInput[val].value);
    });
    page.getSaleInputField('#transferfee').click();
    page.getElement('#transfee-0').click()
    expect(page.getElementLabel('updateSettingsBtn')).toEqual('Submit');
    browser.sleep(2000)
  });

  it('Should select "NGN" as default currency ', () => {
    page.getSaleInputField('#DefaultCurrencyInput').click();
    page.getElement('#currency-0').click();
    browser.sleep(500);
    // page.selectDropDownValue('NGN');
  });

  it('Should update settings after filling appropriate fields ', () => {
    expect(page.getElementLabel('updateSettingsBtn')).toEqual('Submit');
    page.getElement('#updateSettingsBtn').click();
    browser.sleep(500)
  });
});
