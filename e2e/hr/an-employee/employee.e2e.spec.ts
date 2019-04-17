import { Employee } from './employee.po';
import { browser } from 'protractor';
import utils from '../../utils';
import hrUtils from '../hrUtils';

const path = require('path');
const testValue = {
    firstname: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 9),
    lastname: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 8),
    middlename: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 9),
    address: `${Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 7)} victoria city, nigeria`,
    phoneone: `${hrUtils.getRandomPhone(11)}`,
    phonetwo: `${hrUtils.getRandomPhone(11)}`

};

const employeeCreateForm = {
    firstname: {
        placeholder: 'Firstname',
        safeValue: testValue.firstname
    },
    middlename: {
        placeholder: 'Middlename',
        safeValue: testValue.lastname
    },
    lastname: {
        placeholder: 'Lastname',
        safeValue: testValue.middlename
    },
    personalemail: {
        placeholder: '',
        safeValue: `${testValue.firstname}.${testValue.lastname}@test.quabbly.com`,
    },
    companyemail: {
        placeholder: '',
        safeValue: `${testValue.firstname}.${testValue.lastname}@test.quabbly.com`,
    },
    houseaddress: {
        placeholder: '',
        safeValue: testValue.address
    },
    phoneone: {
        placeholder: 'Phone One',
        safeValue: testValue.phoneone
    },
    phonetwo: {
        placeholder: 'Phone Two',
        safeValue: testValue.phonetwo,
    },
};

const employeeEditForm = {
    firstname: {
        placeholder: 'Firstname',
        safeValue: 'Smithson'
    },
    middlename: {
        placeholder: 'Middlename',
        safeValue: 'Fredson'
    },
    lastname: {
        placeholder: 'Lastname',
        safeValue: 'Johnson'
    },
    personalemail: {
        placeholder: '',
        safeValue: 'smith@test.quabbly.com'
    },
    companyemail: {
        placeholder: '',
        safeValue: 'smith@test.quabbly.com'
    },
    houseaddress: {
        placeholder: '',
        safeValue: '15, West View Street, New York.'
    },
    phoneone: {
        placeholder: 'Phone One',
        safeValue: '08010000000'
    },
    phonetwo: {
        placeholder: 'Phone Two',
        safeValue: '08020000000'
    },

};

const formUpdateInfo = {
    header: {
        en: `${employeeCreateForm.firstname.safeValue}`
    }
}

const invalidTest = {
    firstname: {
        emptyChar: {
            input: '',
            msg: 'Firstname is required.'
        },
        minChar: {
            input: 'Go',
            msg: 'Firstname must be 3 charactors or more.'
        },
        maxChar: {
            input: 'Antimonopologeographicationalisminternalizationalism',
            msg: 'Firstname must not exceed 50 characters.'
        }
    },
    lastname: {
        emptyChar: {
            input: '',
            msg: 'Lastname is required.'
        },
        minChar: {
            input: 'Go',
            msg: 'Lastname must be 3 charactors or more.'
        },
        maxChar: {
            input: 'Antimonopologeographicationalisminternalizationalism',
            msg: 'Lastname must not exceed 50 characters.'
        }
    },
    companyemail: {
        invalidInput: {
            input: 'smith#yahoo.com',
            msg: 'Company Email is not valid'
        }
    },
    personalemail: {
        emptyChar: {
            input: '',
            msg: 'Personal Email is required'
        },
        invalidInput: {
            input: 'smith#yahoo.com',
            msg: 'Personal Email is not valid'
        }
    },
    houseaddress: {
        emptyChar: {
            input: '',
            msg: 'House address is required.'
        }
    },
    phoneone: {
        emptyChar: {
            input: '',
            msg: 'Telephone is required.'
        },
        minChar: {
            input: '09',
            msg: 'Phone number can not be less than 11 characters.'
        },
        maxChar: {
            input: '0909900000000',
            msg: 'Phone number can not be more than 11 characters.'
        },
        validnumber: {
            input: 'dhdkdjddlff',
            msg: 'Phone number must be a valid number.'
        }
    },
    phonetwo: {
        minChar: {
            input: '09',
            msg: 'Phone number can not be less than 11 characters.'
        },
        maxChar: {
            input: '0909900000000',
            msg: 'Phone number can not be more than 11 characters.'
        },
        validnumber: {
            input: 'dhdkdjddlff',
            msg: 'Phone number must be a valid number.'
        }
    }
};

const linkingUserForm = {
    employee: {
        title: 'Employee',
        input: employeeCreateForm.firstname.safeValue
    },
    user: {
        title: 'User',
        input: utils.credentials.email
    }
}

const addAttachmentForm = {
    token: {
        type: 'file',
        placeholder: ''

    },
    description: {
        type: 'text',
        placeholder: 'Description'
    },
    submit: {
        type: 'submit'
    }
}


const employeeExtraData = {
    department: {
        header: 'DEPARTMENT',
        empty: 'Unassigned',
        tooltip: 'Assign Department',
        notavailablemsg: 'No Department'
    },
    role: {
        header: 'ROLE',
        empty: 'Unassigned',
        tooltip: 'Assign Role',
        notavailablemsg: 'No Role'
    },
    leavedays: {
        header: 'LEAVE DAYS',
        empty: 'Unassigned',
        tooltip: 'Assign Leave Days',
    },
    document: {
        header: 'DOCUMENT',
        empty: 'No Attachment',
        tooltip: 'Add Attachment'
    },
    payslip: {
        header: 'PAYSLIPS',
        empty: 'No Payslips',
        tooltip: 'Add Payslip'
    }
}

const addbutton = '.fa-plus';
const editbutton = '.fa-edit';
const btn = '.btn';
const btnprimary = '.btn-primary';
const faviconclass = '.fa';

describe('Quabbly| EMPLOYEE', () => {
    let page: Employee;

    beforeAll(() => {
        utils.navigateTo('/');
        utils.handleAuth();
    });

    beforeEach(() => {
        page = new Employee();
    });

    it('should display an empty list with text "No Employee", if no Employee has been created', () => {
        page.navigateTo('/hr/employees');
        expect(page.employeeList()).toEqual('No Employee');
        browser.sleep(2000);
    });

    it('should display an initial static tab with the title "Employees" on page load', () => {
        browser.sleep(2000);
        expect(page.getInitialTab('employees')).toEqual('Employees');
    });

    it('should have a button with a title Create Employee, a plus icon and class btn-primary', () => {
        page.getActionButton('#createEmployeeButton', `${btn}${btnprimary}`, `#icon-create-employee${faviconclass}${addbutton}`, 'Create Employee');
    });

    it('on click of the Create Button, a new tab titled New Employee should be shown', () => {
        page.getButtonIcon().click();
        browser.sleep(1000);
        expect(page.getInitialTab('tab-id-0')).toEqual('New Employee   ×');

    });

    it('should display a form with a title New Employee', () => {
        expect(page.getElement('#newEmployeeHeader').getText()).toEqual('New Employee');
    });

    it('should show labels of the form with the correct title', () => {
        expect(page.getLabelTitle()).toEqual(['Names', 'Company Email', 'Personal Email', 'House Address', 'Telephone']);
    });

    it('should show form input fields with the correct placeholders', () => {
        Object.keys(employeeCreateForm).map(field => {
            expect(page.getElement(`#create-employee-${field}`).getAttribute('placeholder')).toEqual(employeeCreateForm[field].placeholder);
        });
    });

    it('should have a button with a title Create Account and class btn-primary, and the button should be disabled', () => {
        expect(page.getElement('#createBtn').getText()).toEqual('Create Account');
        expect(page.getElement(`#createBtn${btn}${btnprimary}`).isDisplayed()).toBeTruthy();
        expect(page.getElement('#createBtn').getAttribute('disabled')).toBeTruthy();
    });

    it('should display error mesage below the text input field values are invalid', () => {
        Object.keys(invalidTest).map(field => {
            Object.keys(invalidTest[field]).map(datas => {
                page.getElement(`#create-employee-${field}`).sendKeys(invalidTest[field][datas].input);
                page.getElement(`#newEmployeeHeader`).click();
                expect(page.getElement(`.err${field}`).isDisplayed()).toBeTruthy();
                expect(page.getElement(`.err${field}`).getText()).toEqual(invalidTest[field][datas].msg);
                page.getElement(`#create-employee-${field}`).clear();
            });
        });
    });

    it('should allow text input', () => {
        Object.keys(employeeCreateForm).map(field => {
            page.getElement(`#create-employee-${field}`).sendKeys(employeeCreateForm[field].safeValue);
            expect(page.getElement(`#create-employee-${field}`).getAttribute('value')).toEqual(employeeCreateForm[field].safeValue);
            page.getElement(`#create-employee-${field}`).clear();
        });
    });

    it('should display a toaster success on successful creation if all required fields are correctly entered', () => {
        Object.keys(employeeCreateForm).map(field => {
            page.getElement(`#create-employee-${field}`).sendKeys(employeeCreateForm[field].safeValue);
        });
        page.submit();
        expect(page.toasterSuccess()).toEqual('Employee Created Successfully');
    });

    it('should display a table with header text titled - Firstname, Lastname, Personal Email,  Department, Role, Action, on successful creation', () => {
        expect(page.getTableHeader()).toEqual(['Firstname', 'Lastname', 'Personal Email', 'Department', 'Role', 'Action']);
    });

    it('should display a table with body text of employee info, on successful creation', () => {
        expect(page.getTableBody()).toEqual([employeeCreateForm.firstname.safeValue, employeeCreateForm.lastname.safeValue, employeeCreateForm.personalemail.safeValue, 'Unassigned', 'Unassigned', '']);
    });


    it(`should be able to select the "Link User" form the drop-down list and a new tab should be displayed with title Linking To ${employeeCreateForm.firstname.safeValue}`, () => {
        page.getElement('#drop-view').click().then(() => {
            page.getElement('#linking-user').click();
        });
        expect(page.getElement('#tab-id-0').getText()).toEqual(`Linking To ${employeeCreateForm.firstname.safeValue}   ×`);

    });

    it(`should display a form with a title Linking To ${employeeCreateForm.firstname.safeValue} ${employeeCreateForm.lastname.safeValue}`, () => {
        expect(page.getElement('#assign-user-id').getText()).toEqual(`Linking To ${employeeCreateForm.firstname.safeValue} ${employeeCreateForm.lastname.safeValue}`);
    });

    it('should show labels of the form with the correct title', () => {
        Object.keys(linkingUserForm).map(field => {
            expect(page.getElement(`#${field}-input-title`).getText()).toEqual(linkingUserForm[field].title);
        });
    });

    it('form fields should already be prefilled with employee info  and user email to be linked', () => {
        expect(page.getElement(`#employee-id`).getAttribute('value')).toEqual(linkingUserForm.employee.input);
        page.getElement('#linked-user-id').click().then(() => {
           expect(page.getElement(`#user-list-0`).getText()).toContain(linkingUserForm.user.input);
       });
    });

    it('should have a button with a title Link and class btn-primary, and the button should be disabled', () => {
        expect(page.getElement('#link-user-submit').getText()).toEqual('Link');
        expect(page.getElement(`#link-user-submit${btn}${btnprimary}`).isDisplayed()).toBeTruthy();
        expect(page.getElement('#link-user-submit').getAttribute('disabled')).toBeTruthy();
    });


    it('should display a toaster success on successful linking if user email is selected', () => {
        page.getElement('#linked-user-id').click();
        page.getElement('#user-list-0').click().then(() => {
            page.getElement('#link-user-submit').click();
            browser.sleep(1000);
        });
        expect(page.toasterSuccess()).toEqual('Employee Successfully Linked');

    });


    it('should be able to view an employee in a new tab if the view employee is selected', () => {
        page.getElement('#drop-view').click().then(() => {
            page.getElement('#view-employee').click();
        });
        expect(page.getElement('#tab-id-0').getText()).toEqual(`${employeeCreateForm.firstname.safeValue} ${employeeCreateForm.lastname.safeValue}   ×`);
    });

    it('should be able to upload a passport successfully', () => {
        let filepath = path.resolve(__dirname, './test_image_e2e.png');
        page.uploadEmployeePassport().sendKeys(filepath);
        browser.sleep(2000);
    })


    it('on the view employee page, a user avatar for passport should be shown and an upload camera icon should be shown on the it with a tooltip titled "Change Passport"', () => {
        browser.sleep(1000);
        expect(page.getElement('#passport-avatar').isDisplayed()).toBeTruthy();
        page.getActionToolTip('#camera-upload', 'Change Passport')
    });

    it('should display correct employee detail on view page', () => {
        Object.keys(employeeCreateForm).map(field => {
            expect(page.getElement(`#employee-info-${field}`).getText()).toEqual(employeeCreateForm[field].safeValue);
        });
    });

    it('should display a text (Unassigned) below the employee name if no role as been assigned', () => {
        expect(page.getElement('#empty-role-tag-text-sm').getText()).toEqual('(Unassigned)');
    });


    it('on the view employee page, a Department, Role,Leave Days, Document, Payslip headers text should be shown', () => {
        Object.keys(employeeExtraData).map(field => {
            expect(page.getElement(`#${field}-tag-text`).getText()).toEqual(employeeExtraData[field].header);
        });
    });

    it('on the view employee page, a Department, Role,Leave Days, Document, Payslip description text should be shown', () => {
        Object.keys(employeeExtraData).map(field => {
            expect(page.getElement(`#empty-${field}-tag-text`).getText()).toEqual(employeeExtraData[field].empty);
        });
    });

    it('on the view employee page, a Department, Role, Leave Days, Document, Payslip plus icon should be shown', () => {
        Object.keys(employeeExtraData).map(field => {
            expect(page.getElement(`#add-${field}-plus-icon`).isDisplayed()).toBeTruthy();
        });
    });

    it('on the view employee page, a Department, Role, Leave Days, Document, Payslip tooltip should be shown', () => {
        Object.keys(employeeExtraData).map(field => {
            page.getActionToolTip(`#add-${field}-plus-icon`, employeeExtraData[field].tooltip);
        });
    });

    it('should have a button with a title Edit Info, a plus icon and class btn-primary', () => {
        page.getActionButton('#view-control-edit-info', `${btn}${btnprimary}`, `#edit-tag-icon${faviconclass}${editbutton}`, 'Edit Info');
    });

    it('should be able to get tooltip of close icon and close the section', () => {
        browser.sleep(1000);
        Object.keys(employeeExtraData).map(field => {
            browser.sleep(500);
            page.getElement(`#add-${field}-plus-icon`).click();
            expect(page.getElement(`#add-${field}-close-icon`).isDisplayed()).toBeTruthy();
            page.getActionToolTip(`#add-${field}-close-icon`, 'Close');
        });
    });

    it('should be able to click on plus icons for department and role and get required message for no available data', () => {
        Object.keys(employeeExtraData).map(field => {
            page.getElement(`#add-${field}-plus-icon`).click();
            if (field == 'department' || field == 'role') {
                browser.sleep(500);
                expect(page.getElement(`#no-assigned-${field}`).getText()).toEqual(employeeExtraData[field].notavailablemsg);
            }
        });
    });

    it('on click of the "add attachment", it should show a form with the correct fields', () => {
        page.getElement(`#add-document-plus-icon`).click();
        Object.keys(addAttachmentForm).map(field => {
            expect(page.getElement(`#document-upload-${field}`).getAttribute('type')).toEqual(addAttachmentForm[field].type);
        });
    });

    it('should have a button with a title "Add" and class btn-primary, and the button should be disabled', () => {
        expect(page.getElement('#document-upload-submit').getText()).toEqual('Add');
        expect(page.getElement(`#document-upload-submit${btn}${btnprimary}`).isDisplayed()).toBeTruthy();
        expect(page.getElement('#document-upload-submit').getAttribute('disabled')).toBeTruthy();
    });


    it('should be able to see an employee edit form in a new tab if Edit Info button is clicked', () => {
        browser.sleep(2000);
        page.getElement('#view-control-edit-info').click();
    });


    it('tab should contain employee fistname and lastname', () => {
        expect(page.getInitialTab('tab-id-1')).toEqual(`Updating ${employeeCreateForm.firstname.safeValue} ${employeeCreateForm.lastname.safeValue}   ×`);
    });

    it(`should display a form with a title Updating ${formUpdateInfo.header.en}`, () => {
        expect(page.getElement('#editEmployeeHeader').getText()).toEqual(`Updating ${formUpdateInfo.header.en}`);
    });

    it('should show labels of the form with the correct title', () => {
        expect(page.getLabelTitle()).toEqual(['Names', 'Company Email', 'Personal Email', 'House Address', 'Telephone']);
    });

    it('form fields should already be prefilled with employee info to be updated', () => {
        Object.keys(employeeCreateForm).map(field => {
            expect(page.getElement(`#edit-employee-${field}`).getAttribute('value')).toEqual(employeeCreateForm[field].safeValue)
        });
    });

    it('should have a button with a title "Update" and class btn-primary, and the button should be enabled', () => {
        expect(page.getElement('#editBtn').getText()).toEqual('Update');
        expect(page.getElement(`#editBtn${btn}${btnprimary}`).isDisplayed()).toBeTruthy();
        expect(page.getElement('#editBtn').getAttribute('disabled')).toBeFalsy();
    });

    it('should display a toaster success on successful update if all required fields are correctly entered', () => {
        Object.keys(employeeEditForm).map(field => {
            page.getElement(`#edit-employee-${field}`).clear().then(() => {
                page.getElement(`#edit-employee-${field}`).sendKeys(employeeEditForm[field].safeValue);
            })
        });
        page.employeeUpdateAccBtn('editBtn').click();
        browser.sleep(2000);
        expect(page.toasterSuccess()).toEqual('Employee Updated Successfully');
    });

});
