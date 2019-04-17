import { Create } from './create.po';
import { browser } from 'protractor';
import utils from '../../utils';

const date = new Date();
let todayDate: any = date.getDate();
if (todayDate.toString().length === 1) {
    todayDate = `0${todayDate}`
}

let monthValue = date.getMonth() + 1
let futureDate = date.getDate();
let jsDate = new Date().toString();
let errMsg = 'Start Date Can Not Be Weekend';
if (futureDate === 1) {
    futureDate = futureDate + 1;
}
else if (futureDate > 1) {
    futureDate = futureDate + 3;
}

const testValue = {
    date: `${date.getMonth() + 3}-${todayDate}-${date.getFullYear()}`,
    numberOfDays: Math.floor(Math.random() * 31),
    comment: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 8),
    weekendDate: errMsg,

};

const radioButtons = {
    openPaid: {
        text: "Paid",
        default: {
            backgroundcolor: 'rgba(0, 0, 0, 0)',
            border: 'rgba(0, 0, 0, 0.87)'
        },
        checked: {
            color: 'rgb(92, 107, 192)',
        },
    },
    openUnpaid: {
        text: "Unpaid",
        default: {
            backgroundcolor: 'rgba(0, 0, 0, 0)',
            border: 'rgba(0, 0, 0, 0.87)'
        },
        checked: {
            color: 'rgb(92, 107, 192)',
        },

    }
}


const userCreatePaidForm = {
    numberOfDays: {
        placeholder: 'Number of days e.g(12)',
        safeValue: testValue.numberOfDays
    },
    date: {
        placeholder: '',
        safeValue: testValue.date
    },
    errMsg: testValue.weekendDate,
    label: 'Start Date'
 
};

const userCreateUnpaidForm = {
    comment: {
        placeholder: 'Comment(optional)',
        safeValue: testValue.comment
    },
    numberOfDays: {
        placeholder: 'Number of days e.g(12)',
        safeValue: 5
    },
    date: {
        placeholder: '',
        safeValue: testValue.date
    },
    errMsg: testValue.weekendDate,
    label: 'Start Date'

};


const pluscircle = '.fa-plus-circle'
const editbutton = '.fa-edit';
const btn = '.btn';
const btnprimary = '.btn-primary';
const faviconclass = '.fa';

describe('Quabbly| USER', () => {
    let page: Create;

    beforeAll(() => {
        utils.navigateTo('/');
        utils.handleAuth();
    });

    beforeEach(() => {
        page = new Create();
    });

    it('should display an initial static tab with the title "Leaves" ', () => {
        page.navigateTo('/user/leaves');
        expect(page.getElement('#leaves').getText()).toEqual('Leaves');
    });


    it('should have a button with a title "Request Leave", button should have a plus-circle icon and class btn-primary', () => {
        page.getActionButton('#createRequestLeave', `${btn}${btnprimary}`, `#icon-create-btn${faviconclass}${pluscircle}`, 'Request Leave');
    });

  
    it('on click of the Create Button, a new tab titled New Request Leave should be shown', () => {
        browser.sleep(1000);
        page.getElement('#createRequestLeave').click();
        expect(page.getElement('#tab-id-0').getText()).toEqual('New Request Leave   ×');

    });

    it('should display a form with a title "New Request" Leave and sub title "Choose Leave Category" ', () => {
        expect(page.getElement('#newRequestLeaveHeader').getText()).toEqual('New Request Leave');
        expect(page.getElement('#leavecategoryheader').getText()).toEqual('Choose Leave Category');
    });

    it('should display two radio buttons with title "Paid" and "Unpaid", and their default state should be unchecked', () => {
        Object.keys(radioButtons).map(field => {
            expect(page.getElement(`#${field}`).getText()).toEqual(radioButtons[field].text);
            expect(page.getElement(`#${field}`).getCssValue('background-color')).toEqual(radioButtons[field].default.backgroundcolor);
            expect(page.getElement(`#${field}`).getCssValue('border-color')).toEqual(radioButtons[field].default.border);

        });
    });
    
    it('on click of the "Paid" radio button, it should display the valid checked color ', () => {
        page.getElement('#openPaid').click();
        browser.actions().mouseMove(page.getElement('#checkedPaid')).perform();
        browser.executeScript("return window.getComputedStyle(document.querySelector('#checkedPaid.custom-control-label'), '::after')['color']")
            .then(res => expect(res).toEqual(radioButtons.openPaid.checked.color));
    });

    it('on the paid form, an input field with the appropriate placeholder, a label, a date picker, and a disbled button titled "Request" should be shown', () => {
        expect(page.getElement('#paid-days').isDisplayed()).toBeTruthy();
        expect(page.getElement(`#paid-days`).getAttribute('placeholder')).toEqual(userCreatePaidForm.numberOfDays.placeholder);
        expect(page.getElement(`#label-paid`).getText()).toEqual(userCreatePaidForm.label);
        expect(page.getElement('#paid-date-picker').isDisplayed()).toBeTruthy();
        expect(page.getElement('#paid-btn-submit').getText()).toEqual('Request');
        expect(page.getElement(`#paid-btn-submit${btn}${btnprimary}`).isDisplayed()).toBeTruthy();
        expect(page.getElement('#paid-btn-submit').getAttribute('disabled')).toBeTruthy();
    });

    it('it should display error message above the form if a weekend date is selected', () => {
        page.getCalendar(`div[ng-reflect-current-month="${monthValue}"]`).then(r => r[futureDate].click());
        if (jsDate.includes('Sat') || jsDate.includes('Sun')) {
            expect(page.getElement('#paid-btn-submit').getAttribute('disabled')).toBeTruthy();
            expect(page.getElement('#alert-msg').isDisplayed()).toBeTruthy();
            expect(page.getElement('#alert-msg').getText()).toEqual(userCreatePaidForm.errMsg);
        } else if (jsDate.includes('Mon') || jsDate.includes('Tue') || jsDate.includes('Wed') || jsDate.includes('Thu') || jsDate.includes('Fri')){
            expect(page.getElement('#paid-btn-submit').getAttribute('disabled')).toBeTruthy();

        }
    });

    it('it should submit form if day selected date is weekday and number of days is entered', () => {
       page.getElement('#paid-days').sendKeys(testValue.numberOfDays);
        page.getCalendar(`div[ng-reflect-current-month="${monthValue}"]`).then(r => r[futureDate].click());

        if (jsDate.includes('Mon') || jsDate.includes('Tue') || jsDate.includes('Wed') || jsDate.includes('Thu') || jsDate.includes('Fri')) {
            page.getElement('#paid-btn-submit').click();
            browser.sleep(1000);
            expect(page.toasterSuccess()).toEqual('Leave Request Successful');
        }
        else {
            page.closeTab();
            expect(page.getElement('#paid-days').isPresent()).toBeFalsy();
            expect(page.getElement('#paid-date-picker').isPresent()).toBeFalsy();
        }
    });

    it('on click of the "Unpaid" radio button, it should display the valid checked color ', () => {
        page.getElement('#createRequestLeave').click();
        page.getElement('#openUnpaid').click();
        browser.actions().mouseMove(page.getElement('#checkedUnPaid')).perform();
        browser.executeScript("return window.getComputedStyle(document.querySelector('#checkedUnPaid.custom-control-label'), '::after')['color']")
            .then(res => expect(res).toEqual(radioButtons.openUnpaid.checked.color));
    });

    it('on the Unpaid form, a select-option field, an input field, a textarea field, a lebel, a date picker, and a disabled button should be shown', () => {
        expect(page.getElement('#unpaid-select-field').isDisplayed()).toBeTruthy();
        expect(page.getElement('#numberOfDays-unpaid').isDisplayed()).toBeTruthy();
        expect(page.getElement(`#numberOfDays-unpaid`).getAttribute('placeholder')).toEqual(userCreateUnpaidForm.numberOfDays.placeholder);
        expect(page.getElement('#comment-unpaid').isDisplayed()).toBeTruthy();
        expect(page.getElement(`#comment-unpaid`).getAttribute('placeholder')).toEqual(userCreateUnpaidForm.comment.placeholder);
        expect(page.getElement(`#label-unpaid`).getText()).toEqual(userCreateUnpaidForm.label);
        expect(page.getElement('#unpaid-date-picker').isDisplayed()).toBeTruthy();
        expect(page.getElement('#unpaid-btn-submit').isDisplayed()).toBeTruthy();
        expect(page.getElement('#unpaid-btn-submit').getAttribute('disabled')).toBeTruthy();
    });

    it('it should display error message above the form if a weekend date is selected', () => {
        page.getCalendar(`div[ng-reflect-current-month="${monthValue}"]`).then(r => r[futureDate].click());
       
        if (jsDate.includes('Sat') || jsDate.includes('Sun')) {
            expect(page.getElement('#unpaid-btn-submit').getAttribute('disabled')).toBeTruthy();
            expect(page.getElement('#alert-msg').isDisplayed()).toBeTruthy();
            expect(page.getElement('#alert-msg').getText()).toEqual(userCreateUnpaidForm.errMsg);
            
        } 
        else if (jsDate.includes('Mon') || jsDate.includes('Tue') || jsDate.includes('Wed') || jsDate.includes('Thu') || jsDate.includes('Fri')) {
            expect(page.getElement('#paid-btn-submit').getAttribute('disabled')).toBeTruthy();

    }
    });

    it('it should submit form if leavetype has been created by hr, number of days is entered, and selected date is weekday', () => {
        page.getCalendar(`div[ng-reflect-current-month="${monthValue}"]`).then(r => r[futureDate].click());

        if (jsDate.includes('Mon') || jsDate.includes('Tue') || jsDate.includes('Wed') || jsDate.includes('Thu') || jsDate.includes('Fri')) {
            page.getElement('#unpaid-select-field').click().then(() => {
                page.getElement('#leavetypeslist-0').click();
                page.getElement('#numberOfDays-unpaid').sendKeys(userCreateUnpaidForm.numberOfDays.safeValue);
                page.getElement('#unpaid-btn-submit').click();
            });
            browser.sleep(1000);
            expect(page.toasterSuccess()).toEqual('Leave Request Successful');
        }
        else {
            page.closeTab();
            browser.sleep(1000);
            expect(page.getElement('#unpaid-select-field').isPresent()).toBeFalsy();
            expect(page.getElement('#numberOfDays-unpaid').isPresent()).toBeFalsy();
            expect(page.getElement('#paid-date-picker').isPresent()).toBeFalsy();
        }
    });



});
