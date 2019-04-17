import { Department } from './department.po';
import { browser } from 'protractor';
import utils from '../../utils';


const departmentCreateForm = {
    name: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 9)
}

const departmentUpdateForm = {
    name: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 9)
}


const addbutton = '.fa-plus';
const btn = '.btn';
const btnprimary = '.btn-primary';
const faviconclass = '.fa';


describe('Quabbly HR | DEPARTMENT', () => {
    let page: Department;

    beforeEach(() => {
        page = new Department();
    });

    it('should display an empty list with text "No Department", if no department has been created', () => {
        page.navigateTo('/hr/departments');
        expect(page.deptList()).toEqual('No Department');
        browser.sleep(2000);
    });

    it('should display an initial static tab with title Departments on page load', () => {
        browser.sleep(2000);
        expect(page.getInitialTab('departments')).toEqual('Departments');
    });

    it('should have a button with a title "Create Department", a plus icon and class btn-primary', () => {
        page.getActionButton('#createDepartmentButton', `${btn}${btnprimary}`, `#icon-create-department${faviconclass}${addbutton}`, 'Create Department');
    });

    it('on click of the Create Button, a new tab titled "New Department" should be shown', () => {
        page.getButtonIcon().click();
        browser.sleep(1000);
        expect(page.getInitialTab('tab-id-0')).toEqual('New Department   ×');

    });

    it('should display a form with a title "New Department" ', () => {
        expect(page.getElement('#newDepartmentHeader').getText()).toEqual('New Department');
    });


    it('should show label of the form with the correct input title', () => {
        expect(page.getElement('#input-title').getText()).toEqual('Name');
    });


    it('should have a button with a title "Submit" and class btn-primary, and the button should be disabled', () => {
        expect(page.getElement('#create-department-submit').getText()).toEqual('Submit');
        expect(page.getElement(`#create-department-submit${btn}${btnprimary}`).isDisplayed()).toBeTruthy();
        expect(page.getElement('#create-department-submit').getAttribute('disabled')).toBeTruthy();
    });


    it('should display a text field on the form', () => {
        expect(page.getElement('#create-department').isDisplayed()).toBeTruthy();
    });

    it('should enable submit button when text is entered', () => {
        page.getElement('#create-department').sendKeys(departmentCreateForm.name);
        page.getElement('#create-department').clear();
    });

    it('should display a toaster success on successful creation if required field is correctly entered', () => {
        page.getElement('#create-department').sendKeys(departmentCreateForm.name);
        page.getElement('#create-department-submit').click();
        expect(page.toasterSuccess()).toEqual('Department Created Successfully');
    });

    it('should display a table with header text titled - Departments, Department Head, Parent Department, Action, on successful creation', () => {
        expect(page.getTableHeader()).toEqual(['Departments', 'Department Head', 'Parent Department', 'Action']);
    });


    it('should display an alert error message if department name already exists', () => {
        page.getButtonIcon().click();
        page.getElement('#create-department').sendKeys(departmentCreateForm.name);
        page.getElement('#create-department-submit').click();
        expect(page.errorAlert()).toEqual('name should not be a duplicate');
        page.closeTab();
    });

    it(`should be able to click on the "Update Department" in the drop-down button and a new tab with text Updating ${departmentCreateForm.name} should be shown `, () => {
        page.getElement('#drop-view').click()
        page.getElement('#edit-department').click();
        expect(page.getInitialTab('tab-id-0')).toEqual(`Updating ${departmentCreateForm.name}   ×`);
    });

    it(`should display a form with a header text Updating ${departmentCreateForm.name}`, () => {
        expect(page.getElement('#update-header-text-id').getText()).toEqual(`Updating ${departmentCreateForm.name}`);
    });

    it('should show label of the form with the correct input title', () => {
        expect(page.getElement('#input-title').getText()).toEqual('Name');
    });


    it('should have a button with a title "Update" and class btn-primary, and the button should be enabled', () => {
        expect(page.getElement('#update-department-submit').getText()).toEqual('Update');
        expect(page.getElement(`#update-department-submit${btn}${btnprimary}`).isDisplayed()).toBeTruthy();
        expect(page.getElement('#update-department-submit').getAttribute('disabled')).toBeFalsy();
    });


    it('should display a text field on the form', () => {
        expect(page.getElement('#department-update-id').isDisplayed()).toBeTruthy();
    });

    it('textfield should already be prefilled with department info to be updated', () => {
        expect(page.getElement('#department-update-id').getAttribute('value')).toEqual(departmentCreateForm.name)
    });

    it('should be able to update a department if there are no errors', () => {
        page.getElement('#department-update-id').clear();
        page.getElement('#department-update-id').sendKeys(departmentUpdateForm.name);
        page.getElement('#update-department-submit').click();
        expect(page.toasterSuccess()).toEqual('Department Updated');
    });


    it('should display updated department in table body', () => {
        expect(page.getTableBody()).toEqual([departmentUpdateForm.name, 'Unassigned', 'Unassigned', '']);
    });

    it(`should be able to click the Assign Parent Department in the drop-down list and a new tab with text Assigning To ${departmentUpdateForm.name} should be shown`, () => {
        page.getElement('#drop-view').click().then(() => {
            page.getElement('#assign-parent-department').click();
        });
        expect(page.getInitialTab('tab-id-0')).toEqual(`Assigning To ${departmentUpdateForm.name}   ×`);
    });
    it(`should display a form with a header text Assigning To ${departmentUpdateForm.name}`, () => {
        expect(page.getElement('#assign-to-dept-id').getText()).toEqual(`Assigning To ${departmentUpdateForm.name}`);
    });
    it('should show labels of the form with the correct title', () => {
        expect(page.getElement('#department-input-title').getText()).toEqual('Department');
        expect(page.getElement('#departments-input-title').getText()).toEqual('Parent Department');
    });


    it('should have a button with a title "Assign" and class btn-primary, and the button should be disabled', () => {
        expect(page.getElement('#assign-parent-submit').getText()).toEqual('Assign');
        expect(page.getElement(`#assign-parent-submit${btn}${btnprimary}`).isDisplayed()).toBeTruthy();
        expect(page.getElement('#assign-parent-submit').getAttribute('disabled')).toBeTruthy();
    });


    it('should display a text and select field on the form', () => {
        expect(page.getElement('#department-id').isDisplayed()).toBeTruthy();
        expect(page.getElement('#assigned-parent-id').isDisplayed()).toBeTruthy();
    });

    it('textfield should already be prefilled with department info to be assigned to', () => {
        expect(page.getElement('#department-id').getAttribute('value')).toEqual(departmentUpdateForm.name)
    });

    it('should be able to assign a parent department if there are no errors', () => {
        page.getElement('#assigned-parent-id').click();
        page.getElement('#department-list-0').click().then(() => {
            page.getElement('#assign-parent-submit').click();
        });
        expect(page.toasterSuccess()).toEqual('Parent Department Assigned');
    });


    it('should display a table with body text of assigned parent info, on successful update', () => {
        expect(page.getTableBody()).toEqual([departmentUpdateForm.name, 'Unassigned', departmentUpdateForm.name, '']);
    });

    it(`should be able to click the Assign Department Head in the drop-downlist and  a new tab with text Assigning ${departmentUpdateForm.name} Head should be shown`, () => {
        page.getElement('#drop-view').click().then(() => {
            page.getElement('#assign-department-lead').click();
        });
        expect(page.getInitialTab('tab-id-0')).toEqual(`Assigning ${departmentUpdateForm.name} Head   ×`);
    });

    it('should display a form with a header text Assign Department Head', () => {
        expect(page.getElement('#newDepartmentHeader').getText()).toEqual('Assign Department Head');
    });

    it('should show labels of the form with the correct title', () => {
        expect(page.getElement('#department-input-title').getText()).toEqual('Department');
        expect(page.getElement('#employee-input-title').getText()).toEqual('Employee');
    });


    it('should have a button with a title "Assign" and class btn-primary, and the button should be disabled', () => {
        expect(page.getElement('#assign-lead-submit').getText()).toEqual('Assign');
        expect(page.getElement(`#assign-lead-submit${btn}${btnprimary}`).isDisplayed()).toBeTruthy();
        expect(page.getElement('#assign-lead-submit').getAttribute('disabled')).toBeTruthy();
    });


    it('should display a text and select field on the form', () => {
        expect(page.getElement('#department-lead-id').isDisplayed()).toBeTruthy();
        expect(page.getElement('#assigned-lead-id').isDisplayed()).toBeTruthy();
    });

    it('textfield should already be prefilled with department info to be assigned to', () => {
        expect(page.getElement('#department-lead-id').getAttribute('value')).toEqual(departmentUpdateForm.name)
    });

    it('should be able to assign a department lead if there are no errors', () => {
        page.getElement('#assigned-lead-id').click();
        page.getElement('#employee-list-0').click().then(() => {
            page.getElement('#assign-lead-submit').click();
        });
        expect(page.toasterSuccess()).toEqual('Deparment Lead Assigned');
    });

    it('should be able to Suspend a department if the suspend department is selected from the drop-down list', () => {
        page.getElement('#drop-view').click().then(() => {
            page.getElement('#suspend-department').click();
        });
        browser.sleep(1000);
        expect(page.toasterSuccess()).toEqual('Department Suspended');
    });

    it('should be able to Unsuspend a department if the unsuspend department is selected from the drop-downlist', () => {
        browser.sleep(1000);
        page.getElement('#drop-view').click().then(() => {
            page.getElement('#unsuspend-department').click();
        });
        expect(page.toasterSuccess()).toEqual('Department Unsuspended');
    });
    browser.sleep(1000);

});
