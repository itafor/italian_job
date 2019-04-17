import { Accounting } from './accounting.po';
import { browser, by, element, until, protractor } from 'protractor';
import utils from '../utils';
const path = require('path');

const createCard = {
  description: {
    label: 'Description'
  },
  currency: {
    label: 'Currency'
  },
  OpeningBalance: {
    label: 'Opening Balance'
  }
};



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
const text = Math.random()
  .toString(36)
  .replace(/[^a-z]+/g, '')
  .substr(0, 7);
const text_customer = Math.random()
  .toString(36)
  .replace(/[^a-z]+/g, '')
  .substr(0, 7);

  // NOW TESTING Card TEMPLATE

  const updateCardLabel = {
    theopeningBalance: {
      label: 'Opening Balance'
    },
    thedescription: {
      label: 'Description'
    }
  };
  const createFormAttribute = {
    description: {
        label: 'Description',
        inputtype: 'text',
    },
    currency: {
        label: 'Currency',
        inputtype: 'text',
    },
    openingBalance: {
        label: 'Opening Balance',
        inputtype: 'text',
    },
};
const testValue = {
  desc: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 9),
};
const validCreateFormInput = {
  createCarddescription: {
      value: testValue.desc,
  },
  openingBalanceFigure: {
      value: '90000',
  },

};

describe('NOW TESTING CARD', () => {
  let page: Accounting;

  beforeAll(() => {
    utils.navigateTo('/');
    utils.handleAuth();
  });

  beforeEach(() => {
    page = new Accounting();
  });

  
  it('NOW TESTING Card', () => {
    page.navigateTo('/accounting/card');
});

it('should display a tabset that has a label "Credit Cards"',() => {
  browser.sleep(500);
  expect(page.getInitialTab('viewCard')).toEqual('Credit Cards');
});

it('should display angry face and "No Card" where there is no Card', () => {
  page.getEmptyListAttr('.fa.fa-frown-o.fa-2x.text-secondary', 'no_card-noticed', 'No credit card');
});

it('should display "Create Credit Card" button with the correct attribute', () => {
  page.getActionButton('#create-Card', `${btn}${btnprimary}`, `#createCardplusicon${faviconclass}${addbutton}`, 'Create Credit Card');
});


//Create Card Test
it('should click on Create Card Button and assert that the create tab is displayed', () => {
  page.getClickButton('create-Card');
  browser.sleep(500);
  expect(page.getInitialTab('tab-id-0')).toEqual('New Credit Card   ×');
});


it('should test that the create form has the right header, section name and label', () => {
  expect(page.getElement('#createCardheader').isDisplayed()).toBeTruthy();
  expect(page.getElement('#createCardheader').getText()).toEqual('New credit card');    
  Object.keys(createFormAttribute).map(field => {
      expect(page.getElement(`#${field}-label`).isDisplayed()).toBeTruthy();
      expect(page.getElement(`#${field}-label`).getText()).toEqual(createFormAttribute[field].label);
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

it('should test that the Create Card Button has the correct attribute and when the Create Card Button is clicked ', () => {
  page.getActionButton('#createCardBtn', `${btn}${btnprimary}`, '', 'Create');
  page.getClickButton('createCardBtn');
  browser.sleep(500);
});

 //List Credit Card Test
 it('should show labels of the form with the correct title when the List Credit Card Tab is clicked', () => {
  page.getClickButton('viewCard');
  browser.sleep(100);
  expect(page.getLabelTitle()).toEqual(['Description', 'Opening Balance', 'Action']);
});

it('should test that the action button for Card is visible with the correct tooltip', () => {
  expect(page.getElement('#edit-card.icon.fa.fa-pencil.text-info').isDisplayed()).toBeTruthy();
  page.getActionToolTip('#edit-card.icon.fa.fa-pencil.text-info', 'Edit credit card');
});

it('should test that when you click edit the tab name is "Edit Credit Card" and all the previous data are populated', () => {
  page.getClickButton('edit-card');
  browser.sleep(500);
  expect(page.getInitialTab('tab-id-0')).toEqual('Edit Credit Card   ×');
  Object.keys(validCreateFormInput).map(field => {
      expect(page.getElement(`#${field}-input`).getAttribute('value')).toEqual(validCreateFormInput[field].value);
  });    
});

it('should test that the update form has the right header and section name', () => {
  expect(page.getElement('#updateCardHeader').isDisplayed()).toBeTruthy();
  expect(page.getElement('#updateCardHeader').getText()).toEqual('Update credit card');    
  
});


it('should display "Update Credit Card" button with the correct attribute and clicking on it should successfully update the Card', () => {
  page.getActionButton('#updateCardBtn', `${btn}${btnprimary}`, '', 'Update');
  page.getClickButton('updateCardBtn');
  expect(page.toasterNotify('success')).toEqual('Selected credit card Updated successfully');
});


});
