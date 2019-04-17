import { Leave } from './leave.po';
import { browser } from 'protractor';
import utils from '../../utils';


const testValue = {

    leavename: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 9),
    leavedays: Math.floor(Math.random() * 1000)


};

const leaveCreateFormFields = {
    leavename: {
        placeholder: 'Name',
        safeValue: testValue.leavename,
        label: 'Leave Type'
    },
    leavedays: {
        placeholder: 'Number of Days',
        safeValue: testValue.leavedays,
        label: 'Number of Days'
    }
};


const leaveUpdateFormFields = {
    leavename: {
        placeholder: 'Name',
        safeValue: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 9),
        label: 'Leave Type'
    },
    leavedays: {
        placeholder: 'Number of Days',
        safeValue: Math.floor(Math.random() * 1000),
        label: 'Number of Days'
    }
}


const invalidTest = {
    leavename: {
        emptyChar: {
            input: '',
            msg: 'Please enter leave type'
        }
    },
    leavedays: {
        emptyChar: {
            input: '',
            msg: 'Please enter number of days'
        }
    }
};


const addbutton = '.fa-plus';
const btn = '.btn';
const btnprimary = '.btn-primary';
const faviconclass = '.fa';

describe('Quabbly HR | Leave Type', () => {
    let page: Leave;

    beforeEach(() => {
        page = new Leave();
    });
    it('should display an initial static tab with the title "Leaves", and an empty list with text "No Leaves", if no Leave has been created', () => {
        page.navigateTo('/hr/leave');
        expect(page.getElement('#leaves').getText()).toEqual('Leave Type');
        expect(page.getElement('#no-leave-id').getText()).toEqual('No Leave Type');
    });

    it('should have a button with a title Create Leave Type, a plus icon and class btn-primary', () => {
        page.getActionButton('#createLeaveButton', `${btn}${btnprimary}`, `#icon-create-leave${faviconclass}${addbutton}`, 'Create Leave Type');
    });

    it('on click of the Create Button, a new tab titled New Leave Type should be shown', () => {
        page.getElement('#createLeaveButton').click();
        browser.sleep(1000);
        expect(page.getElement('#tab-id-0').getText()).toEqual('New Leave Type   ×');

    });

    it('should display a form with a title New Leave Type', () => {
        expect(page.getElement('#newLeaveHeader').getText()).toEqual('New Leave Type');
    });


    it('should show form input fields with the correct placeholders and label', () => {
        Object.keys(leaveCreateFormFields).map(field => {
            expect(page.getElement(`#${field}`).getAttribute('placeholder')).toEqual(leaveCreateFormFields[field].placeholder);
            expect(page.getElement(`#${field}-label`).getText()).toEqual(leaveCreateFormFields[field].label);
        });
    });

    it('should have a button with a title Create and class btn-primary, and the button should be disabled', () => {
        expect(page.getElement('#create-leave-submit').getText()).toEqual('Create');
        expect(page.getElement(`#create-leave-submit${btn}${btnprimary}`).isDisplayed()).toBeTruthy();
        expect(page.getElement('#create-leave-submit').getAttribute('disabled')).toBeTruthy();
    });

    it('should display error message below the text input field values are invalid', () => {
        Object.keys(invalidTest).map(field => {
            Object.keys(invalidTest[field]).map(datas => {
                page.getElement(`#${field}`).sendKeys(invalidTest[field][datas].input);
                page.getElement(`#newLeaveHeader`).click();
                expect(page.getElement(`.err${field}`).isDisplayed()).toBeTruthy();
                expect(page.getElement(`.err${field}`).getText()).toEqual(invalidTest[field][datas].msg);
                page.getElement(`#${field}`).clear();
            });
        });
    });

    it('should allow valid text input', () => {
        Object.keys(leaveCreateFormFields).map(field => {
            page.getElement(`#${field}`).sendKeys(leaveCreateFormFields[field].safeValue);
            expect(page.getElement(`#${field}`).getAttribute('value')).toContain(leaveCreateFormFields[field].safeValue);
            page.getElement(`#${field}`).clear();
        });
    });

    it('should display a toaster success on successful creation if all required fields are correctly entered', () => {
        Object.keys(leaveCreateFormFields).map(field => {
            page.getElement(`#${field}`).sendKeys(leaveCreateFormFields[field].safeValue);
        });
        page.getElement("#create-leave-submit").click();
        expect(page.toasterSuccess()).toEqual('Leave Type Created Successfully');
    });


    it('should display a table with header text titled - Leave Type, Number of Days, Date Created, and Action, on successful creation', () => {
        expect(page.getTableHeader()).toEqual(['Leave Type', 'Number of Days', 'Date Created', 'Action']);
    });

    it('should display newly created item in datatable', () => {
        Object.keys(leaveCreateFormFields).map(field => {
            expect(page.getElement(`.${field}`).getText()).toContain(leaveCreateFormFields[field].safeValue);
        });
    });

    it(`should be able to click on the "Update Leave Type" from the drop-down list and a new tab with text Updating ${leaveCreateFormFields.leavename.safeValue} should be shown `, () => {
        page.getElement('#drop-view').click().then(() => {
            page.getElement('#update-leave').click();
        });
        expect(page.getElement('#tab-id-0').getText()).toEqual(`Updating ${leaveCreateFormFields.leavename.safeValue}   ×`);
    });

    it(`should display a form with a header text Updating ${leaveCreateFormFields.leavename.safeValue}}`, () => {
        expect(page.getElement('#updateLeaveHeader').getText()).toEqual(`Updating ${leaveCreateFormFields.leavename.safeValue}`);
    });

    it('should show form input fields with the correct placeholders and label', () => {
        Object.keys(leaveUpdateFormFields).map(field => {
            expect(page.getElement(`#${field}-update`).getAttribute('placeholder')).toEqual(leaveUpdateFormFields[field].placeholder);
            expect(page.getElement(`#${field}-label-update`).getText()).toEqual(leaveUpdateFormFields[field].label);
        });
    });

    it('should have a button with a title Update and class btn-primary, and the button should be enabled', () => {
        expect(page.getElement('#update-leave-submit').getText()).toEqual('Update');
        expect(page.getElement(`#update-leave-submit${btn}${btnprimary}`).isDisplayed()).toBeTruthy();
        expect(page.getElement('#update-leave-submit').getAttribute('disabled')).toBeFalsy();
    });


    it('should have already prefilled values on the form', () => {

        Object.keys(leaveCreateFormFields).map(field => {
            expect(page.getElement(`#${field}-update`).getAttribute('value')).toContain(leaveCreateFormFields[field].safeValue);
        });
    });

    it('should display a toaster success on successful update if all required fields are correctly entered', () => {
        Object.keys(leaveUpdateFormFields).map(field => {
            page.getElement(`#${field}-update`).clear();
            page.getElement(`#${field}-update`).sendKeys(leaveUpdateFormFields[field].safeValue);
        });
        page.getElement("#update-leave-submit").click();
        expect(page.getElement('.toastr-success').getText()).toEqual('Leave Type Updated Successfully');
    });

    xit('should be able to click "Delete Leave Type" from the drop-down list and display a toaster success on successful delete', () => {
        page.getElement('#drop-view').click().then(() => {
            page.getElement("#delete-leave").click();
        });
        expect(page.getElement('.toastr-success').getText()).toEqual('Leave Type Deleted');
        expect(page.getElement('#no-leave-id').getText()).toEqual('No Leave Type');
    });

});