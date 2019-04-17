import { Accounting } from './accounting.po';
import { browser, by, element, until, protractor } from 'protractor';
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
const name1 = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
const name2 = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 6);
tomorrow.setDate(today.getDate()+1);


const createFormAttribute = {
    createddate: {
        label: 'Created Date',
        inputtype: 'date',
        placeholder: 'Created Date',
    },
    duedate: {
        label: 'Due Date',
        inputtype: 'date',
        placeholder: 'Due Date',
    },
    terms: {
        label: 'Terms and Condition',
        inputtype: 'textarea',
        placeholder: 'Terms and Condition',
    },
    sfullname: {
        label: 'Full Name',
        inputtype: 'text',
    },
    semail: {
        label: 'Email',
        inputtype: 'email',
    },
    saddress: {
        label: 'Address',
        inputtype: 'textarea',
    },
    sphone: {
        label: 'Phone Number',
        inputtype: 'text',
    },
    sbusphone: {
        label: 'Business Phone Number',
        inputtype: 'text',
    },
    rfullname: {
        label: 'Full Name',
        inputtype: 'text',
    },
    remail: {
        label: 'Email',
        inputtype: 'email',
    },
    raddress: {
        label: 'Address',
        inputtype: 'textarea',
    },
    rphone: {
        label: 'Phone Number',
        inputtype: 'text',
    },
    description: {
        label: 'Description',
        inputtype: 'text',
        placeholder: 'Item Description',
    },
    price: {
        label: 'Price (₦)',
        inputtype: 'number',
        placeholder: 'Price',
    },
    quantity: {
        label: 'Quantity',
        inputtype: 'number',
        placeholder: 'Quantity',
    },
    amount: {
        label: 'Amount (₦)',
        inputtype: 'number',
        placeholder: 'Amount',
    },
    tax: {
        label: 'Tax %',
        inputtype: 'number',
        placeholder: 'Tax',
    },
    amountpaid: {
        label: 'Amount Paid (₦)',
        inputtype: 'number',
        placeholder: 'Amount Paid',
    },
};
const viewInvoiceForm = {
    from: {
        th: 'From',
    },
    to: {
        th: 'To',
    },
    invDetail: {
        th: 'Invoice Details',
    },
    description: {
        th: 'Description',
    },
    price: {
        th: 'Price',
    },
    qty: {
        th: 'Qty',
    },
    amt: {
        th: 'Amount',
    },
};

const validCreateFormInput = {
    createddate: {
        value: '2019-02-03',
    },
    duedate: {
        value: '2019-03-10',
    },
    terms: {
        value: 'This is the Terms and Condition',
    },
    sfullname: {
        value: `${name1} ${name2}`,
    },
    semail: {
        value: `${name1}.${name2}@quabbly.com`,
    },
    saddress: {
        value: 'Quabbly Head Quaters',
    },
    sphone: {
        value: `080${Math.floor(10000000 + Math.random() * 90000000)}`,
    },
    sbusphone: {
        value: `080${Math.floor(10000000 + Math.random() * 90000000)}`,
    },
    rfullname: {
        value: `${name2} ${name1}`,
    },
    remail: {
        value: `${name2}.${name1}@quabbly.com`,
    },
    raddress: {
        value: 'Quabbly Branch',
    },
    rphone: {
        value: `080${Math.floor(10000000 + Math.random() * 90000000)}`,
    },
    description: {
        value: 'This is an honest description',
    },
    price: {
        value: Math.floor(100 + Math.random() * 900),
    },
    quantity: {
        value: '3',
    },
    tax: {
        value: '0.5',
    },
    amountpaid: {
        value: Math.floor(1000 + Math.random() * 9000),
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

    it('NOW TESTING INVOICE', () => {
        page.navigateTo('/accounting/invoice');
        browser.sleep(1000);
    });

    it('should display a tabset that has a label "Invoice"',() => {
        browser.sleep(500);
        expect(page.getInitialTab('viewInvoice')).toEqual('Invoice');        
    });

    it('should display angry face and "No Invoice" where there is no invoice', () => {
        page.getEmptyListAttr('.fa.fa-frown-o.fa-2x.text-secondary', 'no-invoice', 'No Invoice');
    });

    it('should display "Create Invoice" button with the correct attribute', () => {
        page.getActionButton('#create-invoice', `${btn}${btnprimary}`, `#createinvoiceplusicon${faviconclass}${addbutton}`, 'Create Invoice');
    });

    //Create Invoice Test
    it('should click on Create Invoice Button and assert that the create tab is displayed', () => {
        page.getClickButton('create-invoice');
        browser.sleep(500);
        expect(page.getInitialTab('tab-id-0')).toEqual('New Invoice   ×');
    });

    it('should test that the create form has the right header, section name, label, input type', () => {
        expect(page.getElement('#invoiceDetailheader').isDisplayed()).toBeTruthy();
        expect(page.getElement('#invoiceDetailheader').getText()).toEqual('New Invoice');
        expect(page.getElement('#senderInfoHeader').isDisplayed()).toBeTruthy();
        expect(page.getElement('#senderInfoHeader').getText()).toEqual('Sender\'s Info');
        expect(page.getElement('#receiverInfoHeader').isDisplayed()).toBeTruthy();
        expect(page.getElement('#receiverInfoHeader').getText()).toEqual('Receiver\'s Info');        
        Object.keys(createFormAttribute).map(field => {
            expect(page.getElement(`#${field}-label`).isDisplayed()).toBeTruthy();
            expect(page.getElement(`#${field}-label`).getText()).toEqual(createFormAttribute[field].label);
            expect(page.getElement(`#${field}-input`).getAttribute('type')).toEqual(createFormAttribute[field].inputtype);
        });
    });

    it('should test that the Create Invoice Button is Disabled', () => {
        expect(page.getElement('#createInvoiceBtn').getAttribute('disabled')).toBeTruthy();
    });

    it('should test that all valid input is inputed', () => {
        Object.keys(validCreateFormInput).map(field => {
            page.getElement(`#${field}-input`).sendKeys(validCreateFormInput[field].value);
        });
    });

    it('should test that the Create Invoice Button is Enabled when all valid input are inserted', () => {
        expect(page.getElement('#createInvoiceBtn').getAttribute('disabled')).toBeFalsy();
    });

    it('should test that when the Create Invoice Button is clicked after valid input there is a success', () => {
        page.getClickButton('createInvoiceBtn');
        browser.sleep(2000);
        expect(page.toasterNotify('success')).toEqual('Invoice Created Successfully');
    });

    //List and View Invoice Test
    it('should show labels of the form with the correct title when the List Invoice Tab is clicked', () => {
        page.getClickButton('viewInvoice');
        browser.sleep(100);
        expect(page.getLabelTitle()).toEqual(['Invoice Number', 'Invoice Date', 'Invoice Due Date', 'Receiver Name', 'Receiver Phone Number', 'Date Created', 'Action']);
    });

    it('should test that the view button for invoice is visible with the correct tooltip', () => {
        expect(page.getElement('#viewinvoiceicon.icon.fa.fa-eye.text-info').isDisplayed()).toBeTruthy();
        page.getActionToolTip('#viewinvoiceicon.icon.fa.fa-eye.text-info', 'View Invoice');
    });

    
    it('should test that the view invoice tab has the right header and the right tables with values', () => {
        page.getFirstButton('viewinvoiceicon');
        browser.sleep(500);
        expect(page.getInitialTab('tab-id-0')).toEqual('Show Invoice   ×');
        expect(page.getElement('#invoiceTab').isDisplayed()).toBeTruthy();
        expect(page.getElement('#invoiceTab').getText()).toEqual('Invoice');
        Object.keys(viewInvoiceForm).map(field => {
            expect(page.getElement(`#${field}-label`).isDisplayed()).toBeTruthy();
            expect(page.getElement(`#${field}-label`).getText()).toEqual(viewInvoiceForm[field].th);
        });
    });
    it('should be able to download the invoice', () => {
        expect(page.getElement('#downloadinvoice').isDisplayed()).toBeTruthy();
        page.getFirstButton('downloadinvoice');
    });

});