import { Role } from './role.po';
import { browser } from 'protractor';
import utils from '../../utils';
const path = require('path');


const roleCreateForm = {
    name: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 9)
}

const roleUpdateForm = {
    name: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 9)
}


const addDocForm = {

    token: {
        safeValue: path.resolve(__dirname, './invoice.pdf')
    },
    description: {
        safeValue: 'Invoice Document'
    }
};

const addPayslipForm = {
    payslip: {
        safeValue: path.resolve(__dirname, './invoice.pdf')
    },
    payslipmonth: {
        safeValue: 'February'
    },

    payslipyear: {
        safeValue: '2019'
    }
};

const assignLeaveDaysForm = {
    safeValue: 20
}



const addbutton = '.fa-plus';
const btn = '.btn';
const btnprimary = '.btn-primary';
const faviconclass = '.fa';


describe('Quabbly HR | ROLE', () => {
    let page: Role;

    beforeEach(() => {
        page = new Role();
    });

    it('should display an empty list with text "No Roles", if no role has been created', () => {
        page.navigateTo('/hr/roles');
        expect(page.roleList()).toEqual('No Roles');
        browser.sleep(2000);
    });

    it('should display an initial static tab with title Roles on page load', () => {
        browser.sleep(2000);
        expect(page.getInitialTab('roles')).toEqual('Roles');
    });

    it('should have a button with a title Create Employee, a plus icon and class btn-primary', () => {
        page.getActionButton('#createRoleButton', `${btn}${btnprimary}`, `#icon-create-role${faviconclass}${addbutton}`, 'Create Role');
    });

    it('on click of the Create Button, a new tab titled "New Role" should be shown', () => {
        page.getButtonIcon().click();
        browser.sleep(1000);
        expect(page.getInitialTab('tab-id-0')).toEqual('New Role   ×');

    });

    it('should display a form with a title "New Role" ', () => {
        expect(page.getElement('#newRoleHeader').getText()).toEqual('New Role');
    });


    it('should show label of the form with the correct title', () => {
        expect(page.getElement('#input-title').getText()).toEqual('Name');
    });


    it('should have a button with a title "Submit" and class btn-primary, and disabled', () => {
        expect(page.getElement('#create-role-submit-button').getText()).toEqual('Submit');
        expect(page.getElement(`#create-role-submit-button${btn}${btnprimary}`).isDisplayed()).toBeTruthy();
        expect(page.getElement('#create-role-submit-button').getAttribute('disabled')).toBeTruthy();
    });


    it('should display a text field on the form', () => {
        expect(page.getElement('#createrole').isDisplayed()).toBeTruthy();
    });

    it('should enable submit button when text is entered', () => {
        page.getElement('#createrole').sendKeys('     ');
        page.getElement('#createrole').clear();
    });

    it('should display a toaster success on successful creation if required field is correctly entered', () => {
        page.getElement('#createrole').sendKeys(roleCreateForm.name);
        page.getElement('#create-role-submit-button').click();
        expect(page.toasterSuccess()).toEqual('Role Created Successfully');
    });


    it('should display a table with header text titled - Roles, Date Created, Time Created, and Action, on successful creation', () => {
        expect(page.getTableHeader()).toEqual(['Roles', 'Date Created', 'Time Created', 'Action']);
    });

    it('should display an alert error message if role name already exists', () => {
        page.getButtonIcon().click();
        page.getElement('#createrole').sendKeys(roleCreateForm.name);
        page.getElement('#create-role-submit-button').click();
        expect(page.errorAlert()).toEqual('role already exists');
        page.closeTab();
    });

    it(`should be able to click on the "Update Role"  and a new tab with text Updating ${roleCreateForm.name} should be shown `, () => {
        page.getElement('#drop-list').click().then(() => {
            page.getElement('#edit-role').click();
        });
        expect(page.getInitialTab('tab-id-0')).toEqual(`Updating ${roleCreateForm.name}   ×`);
    });

    it(`should display a form with a header text Updating ${roleCreateForm.name}`, () => {
        expect(page.getElement('#role-update-header-text').getText()).toEqual(`Updating ${roleCreateForm.name}`);
    });

    it('should show label of the form with the correct title', () => {
        expect(page.getElement('#input-title').getText()).toEqual('Name');
    });


    it('should have a button with a title "Update" and class btn-primary, and the button should be enabled', () => {
        expect(page.getElement('#update-role-submit-btn').getText()).toEqual('Update');
        expect(page.getElement(`#update-role-submit-btn${btn}${btnprimary}`).isDisplayed()).toBeTruthy();
        expect(page.getElement('#update-role-submit-btn').getAttribute('disabled')).toBeFalsy();
    });


    it('should display a text field on the form', () => {
        expect(page.getElement('#roleupdate').isDisplayed()).toBeTruthy();
    });

    it('textfield should already be prefilled with role info to be updated', () => {
        expect(page.getElement('#roleupdate').getAttribute('value')).toEqual(roleCreateForm.name)
    });


    it('should be able to update a role if the text is present to be updated', () => {
        page.getElement('#roleupdate').clear();
        page.getElement('#roleupdate').sendKeys(roleUpdateForm.name);
        page.getElement('#update-role-submit-btn').click();
        expect(page.toasterSuccess()).toEqual('Role Updated');
    });

    // ########################## Navigate To Employees ###########################

    it('should navigate back to employees', () => {
        page.navigateTo('/hr/employees');
    });

    it('should be able to view an employee in a new tab if the view employee is selected from the drop-down list', () => {
        page.getElement('#drop-view').click().then(() => {
            page.getElement('#view-employee').click();
        });
        expect(page.getElement('#tab-id-0').isDisplayed()).toBeTruthy();
    });

    it('should be able to assign a department if department exists', () => {
        page.getElement('#add-department-plus-icon').click();
        browser.sleep(500);
        page.getElement('#assigned-department-id').click();
        page.getElement('#department-list-0').click().then(() => {
            page.getElement('#assign-department-submit').click();
            browser.sleep(1000);
        });
        expect(page.getElement('#department-added').isPresent()).toBeTruthy();
        expect(page.toasterSuccess()).toEqual('Department Assigned');

    });

    it('should be able to assign a role if role exists', () => {
        page.getElement('#add-role-plus-icon').click();
        browser.sleep(1000);
        page.getElement('#assigned-role-id').click();
        page.getElement('#role-list-0').click().then(() => {
            page.getElement('#assign-role-submit').click();

        });
        browser.sleep(1000);
        expect(page.getElement('#role-added').isPresent()).toBeTruthy();
        expect(page.toasterSuccess()).toEqual('Role Assigned');
    });


    it('should be able to assign leave days to an employee', () => {
        page.getElement('#add-leavedays-plus-icon').click();
        page.getElement('#assigned-numberOfLeaveDays-id').sendKeys(assignLeaveDaysForm.safeValue).then(() => {
            page.getElement('#assign-leavedays-submit').click();

        });
        browser.sleep(500);
        expect(page.getElement('#leavedays-added').getText()).toEqual(`${assignLeaveDaysForm.safeValue} Days`)
        expect(page.toasterSuccess()).toEqual('Leave Days Assigned');
    });

    it('should be able to upload a document', () => {
        page.getElement('#add-document-plus-icon').click();
        browser.sleep(500);
        Object.keys(addDocForm).map(field => {
            page.getElement(`#document-upload-${field}`).sendKeys(addDocForm[field].safeValue);
            page.getElement('#document-upload-submit').click();

        });
        browser.sleep(1000);
        expect(page.getElement('#attachment-added').isPresent()).toBeTruthy();
        expect(page.toasterSuccess()).toEqual('Document Added Successfully');
    });

    it('should be able to upload a payslip', () => {
        page.getElement('#add-payslip-plus-icon').click();
        browser.sleep(500);
        Object.keys(addPayslipForm).map(field => {
            page.getElement(`#payslip-upload-${field}`).sendKeys(addPayslipForm[field].safeValue);
            page.getElement('#add-payslip-submit').click();

        });
        browser.sleep(1000);
        expect(page.getElement('#payslip-added').isPresent()).toBeTruthy();
        expect(page.toasterSuccess()).toEqual('Payslip Added Successfully');
    });


});
