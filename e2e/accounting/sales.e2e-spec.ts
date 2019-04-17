import { Accounting } from './accounting.po';
import { browser, by, element, until, protractor } from 'protractor';
import utils from '../utils';
import { Alert } from 'selenium-webdriver';
const path = require('path');
const addbutton = '.fa-plus';
const viewbutton = '.fa-eye';
const btn = '.btn';
const btnprimary = '.btn-primary';
const faviconclass = '.fa';
const text = Math.random()
  .toString(36)
  .replace(/[^a-z]+/g, '')
  .substr(0, 7);
describe('NOW TESTING SALES', () => {
  let page: Accounting;
  beforeAll(() => {
    utils.navigateTo('/');
    utils.handleAuth();
  });
  beforeEach(() => {
    page = new Accounting();
  });
  const newsalesaccount = {
    saleDescription: {
      label: 'Sales Description',
      inputtype: 'textarea'
    },
    category: {
      label: 'Category',
      inputtype: 'select-one'
    },
    customer: {
      label: 'Customer',
      inputtype: 'select-one'
    },
    salesDate: {
      label: 'Sales Date',
      inputtype: 'date'
    },
    receipt: {
      label: 'Receipts',
      inputtype: 'file'
    }
  };
  const updatesalesaccount = {
    saleDescription: {
      label: 'Sales Description',
      inputtype: 'textarea'
    },
    category: {
      label: 'Category',
      inputtype: 'select-one'
    },
    customer: {
      label: 'Customer',
      inputtype: 'select-one'
    },
    creditAmount: {
      label: 'Credit Amount',
      inputtype: 'number'
    },
    salesDate: {
      label: 'Sales Date',
      inputtype: 'date'
    },
    receipt: {
      label: 'Receipts',
      inputtype: 'file'
    }
  };
  const viewsalesaccount = {
    saleDescription: {
      label: 'Sales Description'
    },
    category: {
      label: 'Category'
    },
    customer: {
      label: 'Customer'
    },

    creditAmount: {
      label: 'Credit Amount'
    },
    salesDate: {
      label: 'Sales Date'
    }
  };
  const validSalesAcct = {
    saleDescription: {
      value: 'This is a test description'
    },

    salesDate: {
      value: '08-04-2018'
    }
  };
  const validUpdateSalesAcct = {
    saleDescription: {
      value: 'This is another test description'
    },
    salesDate: {
      value: '05-06-2019'
    },
    creditAmount: {
      value: '10000'
    }
  };
  const createIncomeCatForm = {
    name: {
      label: 'Name*',
      inputtype: 'text'
    },
    categoryType: {
      label: 'Category Type',
      inputtype: 'select-one'
    }
  };
  const categoryFormInput = {
    name: {
      value: Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, '')
        .substr(0, 10)
    }
  };
  const createCustomerForm = {
    name: {
      label: 'Name*',
      inputtype: 'text'
    },
    email: {
      label: 'Email',
      inputtype: 'email'
    },
    phone: {
      label: 'Phone Number',
      inputtype: 'text'
    },
    address: {
      label: 'Address',
      inputtype: 'text'
    }
  };
  const validcustomerFormInput = {
    name: {
      value: Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, '')
        .substr(0, 10)
    },
    phone: {
      value: '08183839393'
    },
    email: {
      value: 'john.doe@quabbly.com'
    },
    address: {
      value: 'Quabbly Head Quaters'
    }
  };  

  it('Now Testing Create Sales', () => {
    // page.navigateTo('/accounting/expense-category');
    // page.navigateTo('/accounting/settings');
    // page.navigateTo('/accounting/bank');
    // page.navigateTo('/accounting/incomeCategory');
    // page.navigateTo('/accounting/customer');
    page.navigateTo('/accounting/sales');
    browser.sleep(500);
  });

  it('should display angry face and "No Sales" where there is no Sales', () => {
    page.getEmptyListAttr(
      '.fa.fa-frown-o.fa-2x.text-secondary',
      'nosales',
      'No Sales'
    );
  });

  it('should display "Create Sales" button with the correct attribute', () => {
    page.getActionButton(
      '#create-sale',
      `${btn}${btnprimary}`,
      `#createsaleplusicon${faviconclass}${addbutton}`,
      'Create Sales  '
    );
  });

  it('should click on Create Sale Button and assert that the create tab is displayed', () => {
    page.getClickButton('create-sale');
    browser.sleep(500);
    expect(page.getInitialTab('tab-id-0')).toEqual('New Sales   ×');
  });

  it('should display form titled:"New Sale" to create new Sale and Create Sale form should have the appropriate labels', () => {
    expect(page.getElement('#newSales').isDisplayed()).toBeTruthy();
    expect(page.getElement('#newSales').getText()).toEqual('New Sales');
    expect(page.getElement('#addIncomecatbtn').isDisplayed()).toBeTruthy();
    expect(page.getElement('#add-customerbtn').isDisplayed()).toBeTruthy();
    Object.keys(newsalesaccount).map(field => {
      expect(page.getElement(`#${field}-label`).isDisplayed()).toBeTruthy();
      expect(page.getElement(`#${field}-label`).getText()).toEqual(
        newsalesaccount[field].label
      );
      expect(page.getElement(`#${field}-input`).getAttribute('type')).toEqual(
        newsalesaccount[field].inputtype
      );
    });
  });

  it('should test that the Create Sales Button is Disabled', () => {
    expect(
      page.getElement('#createSaleBtn').getAttribute('disabled')
    ).toBeTruthy();
  });
  it('should input a new sales description and sales date', () => {
    Object.keys(validSalesAcct).map(field => {
      page.getElement(`#${field}-input`).sendKeys(validSalesAcct[field].value);
    });
  });
  it('should click on create income category button and display modal with a form titled:"New Income Category" to create new Income Category and Create Income Cateory form should have the following labels: "Name*, and Category Type"', () => {
    page.getElement('#addIncomecatbtn').click();
    expect(page.getElement('#createIncomeCat').isDisplayed()).toBeTruthy();
    expect(page.getElement('#createIncomeCat').getText()).toEqual(
      'Create Income Category'
    );
    Object.keys(createIncomeCatForm).map(field => {
      expect(page.getElement(`#${field}-label`).isDisplayed()).toBeTruthy();
      expect(page.getElement(`#${field}-label`).getText()).toEqual(
        createIncomeCatForm[field].label
      );
      expect(page.getElement(`#${field}-input`).getAttribute('type')).toEqual(
        createIncomeCatForm[field].inputtype
      );
    });
  });

  it('should test that the Create Income Category Button is Disabled', () => {
    expect(
      page.getElement('#createIncomecatbtn').getAttribute('disabled')
    ).toBeTruthy();
  });

  it('should be able to  select a income category type', () => {
    page.getElement('#name-input').sendKeys(text);
    page.getElement('#categoryType-input').click();
    page.getElement('#each-category-type-0').click();
  });
  it('should test that the Create Income Category Button is Enabled after all inputs have been filled', () => {
    expect(
      page.getElement('#createIncomecatbtn').getAttribute('disabled')
    ).toBeFalsy();
  });
  it('should test that the Create Income Category Button has the correct attribute and when the Create Income Category Button is clicked after valid input there is a success', () => {
    const creatCatergoryBtn = page.getElement('#createIncomecatbtn');
    creatCatergoryBtn.click();
    expect(page.toasterNotify('success')).toEqual(
      'Income Category Created Successfully'
    );
  });

  it('should click on create customner button and display modal with a title Create Customer and that the create form has the right header, labels and input types', () => {
    page.getElement('#add-customerbtn').click();
    expect(page.getElement('#createCustomer').isDisplayed()).toBeTruthy();
    expect(page.getElement('#createCustomer').getText()).toEqual(
      'Create Customer'
    );
    Object.keys(createCustomerForm).map(field => {
      expect(page.getElement(`#${field}-label`).isDisplayed()).toBeTruthy();
      expect(page.getElement(`#${field}-label`).getText()).toEqual(
        createCustomerForm[field].label
      );
      expect(page.getElement(`#${field}-input`).getAttribute('type')).toEqual(
        createCustomerForm[field].inputtype
      );
    });
  });
  it('should test that the Create Customer Button is Disabled initially', () => {
    expect(
      page.getElement('#createCustomerBtn').getAttribute('disabled')
    ).toBeTruthy();
  });
  it('should test that all valid input is entered', () => {
    Object.keys(validcustomerFormInput).map(field => {
      page
        .getElement(`#${field}-input`)
        .sendKeys(validcustomerFormInput[field].value);
    });
  });
  it('should test that the Create Customer Button is Enabled when all valid input are inserted', () => {
    expect(
      page.getElement('#createCustomerBtn').getAttribute('disabled')
    ).toBeFalsy();
  });
  it('should test that the Create Customer Button has the correct attribute and when the Create Customer Button is clicked after valid input there is a success', () => {
    page.getActionButton(
      '#createCustomerBtn',
      `${btn}${btnprimary}`,
      '',
      'Create'
    );
    page.getClickButton('createCustomerBtn');
    browser.sleep(500);
    expect(page.toasterNotify('success')).toEqual(
      'Customer Created Successfully'
    );
  });
  it('should be able to select an income category and a customer now', () => {
    page.getSaleInputField('#category-input').click();
    page.getElement('#category-0').click();
    browser.sleep(2000);
    page.getSaleInputField('#customer-input').click();
    page.getElement('#customer-0').click();
  });
  // it('should select bank as payment type , ', () => {
  //   page.getButton('#Checkbox-bank').click();
   // page.getSaleInputField('#bankAccount-input').click();
   // browser.sleep(2000);
   // page.getElement('#bank-0').click();
    //browser.sleep(2000);
   // page.getElement('#amountReceivedViaBankinput').sendKeys('5000');  
  //});
  it('should select cash as payment type , ', () => {
    page.getButton('#Checkbox-cash').click();
    page.getElement('#cashPaid').sendKeys('5000');
    browser.sleep(2000);
    page.getSaleInputField('#cashAccount-input').click();
    page.getElement('#cash-0').click();
  });
  it('should select credit as payment type , ', () => {
    page.getButton('#Checkbox-credit').click();
    expect(page.getElement('#creditAmount-input').isDisplayed()).toBeTruthy();
    page.getElement('#creditAmount-input').sendKeys('5000');
  });
  it('should submit sales form, if all form inputs are valid', () => {
    page.getButton('button#createSaleBtn').click();
    browser.sleep(500);
  });

  // List and view sales
  it('should show labels of the form with the correct title when the Income Category List Tab is clicked', () => {
    page.getClickButton('viewSales');
    expect(page.getLabelTitle()).toEqual([
      'Sales Description',
      'Payment Type',
      'Amount',
      'Sales Date',
      'Date Created',
      'Action'
    ]);
    //Test the content of what was created that they are in alignment with what was sent
  });

  it('should test that the action buttons for Income Category are visible with the correct tooltips', () => {
    expect(
      page.getElement('#edit_sale.icon.fa.fa-pencil.text-info').isDisplayed()
    ).toBeTruthy();
    page.getActionToolTip(
      '#edit_sale.icon.fa.fa-pencil.text-info',
      'Edit Sale'
    );
    expect(
      page.getElement('#view_sale.icon.fa.fa-eye.text-info').isDisplayed()
    ).toBeTruthy();
    page.getActionToolTip('#view_sale.icon.fa.fa-eye.text-info', 'View Sale');
    expect(
      page.getElement('#deleteSale.icon.fa.fa-trash.text-danger').isDisplayed()
    ).toBeTruthy();
    page.getActionToolTip(
      '#deleteSale.icon.fa.fa-trash.text-danger',
      'Delete Sale'
    );
  });

  it('should test clicking on view icon opens a tab and that the view sales tab has the right header, section name, label and input type', () => {
    page.getFirstButton('view_sale');
    expect(page.getInitialTab('tab-id-0')).toEqual('View Sales   ×');
    expect(page.getElement('#viewSalesHeader').isDisplayed()).toBeTruthy();
    expect(page.getElement('#viewSalesHeader').getText()).toEqual('View Sales');
    Object.keys(viewsalesaccount).map(field => {
      expect(page.getElement(`#${field}-label`).isDisplayed()).toBeTruthy();
      expect(page.getElement(`#${field}-label`).getText()).toEqual(
        viewsalesaccount[field].label
      );
    });
    page.navigateTo('/accounting/sales');
  });

  it('should test clicking on edit icon opens a tab and that the edit sales tab has the right header, section name, label and input type', () => {
    page.getFirstButton('edit_sale');
    browser.sleep(500);
    expect(page.getInitialTab('tab-id-0')).toEqual('Edit Sales   ×');
    expect(page.getElement('.modal-title').isDisplayed()).toBeTruthy();
    expect(page.getElement('.modal-title').getText()).toEqual('Update Sales');
    Object.keys(updatesalesaccount).map(field => {
      expect(page.getElement(`#${field}-label`).isDisplayed()).toBeTruthy();
      expect(page.getElement(`#${field}-label`).getText()).toEqual(
        updatesalesaccount[field].label
      );
      expect(page.getElement(`#${field}-input`).getAttribute('type')).toEqual(
        updatesalesaccount[field].inputtype
      );
    });
  });

  it('should input a new description and new sales date and credit amount', () => {
    Object.keys(validUpdateSalesAcct).map(field => {
      page
        .getElement(`#${field}-input`)
        .sendKeys(validUpdateSalesAcct[field].value);
    });
  });

  it('should be able to select a new category and a new customer', () => {
    page.getSaleInputField('#category-input').click();
    page.getElement('#category-1').click();
    browser.sleep(200);
    page.getSaleInputField('#customer-input').click();
    page.getElement('#customer-1').click();
  });

  it('should display "Update" button with the correct attribute and clicking on it should successfully update the cash account', () => {
    page.getActionButton(
      '#updateSaleBtn',
      `${btn}${btnprimary}`,
      '',
      'Update Sales'
    );
    page.getClickButton('updateSaleBtn');
    browser.sleep(2000);
    expect(page.toasterNotify('success')).toEqual('Sales updated successfully');
  });

  it('should be able to delete a sale record', () => {
    page.getFirstButton('deleteSale');
    let ale: Alert = browser.switchTo().alert();
    expect(ale.getText()).toMatch(
      'Are you sure you want to permanently delete the selected  sales?'
    );
    ale.accept();
    expect(page.toasterNotify('success')).toEqual(
      'Selected Sale Category Deleted Successfully'
    );
  });
});
