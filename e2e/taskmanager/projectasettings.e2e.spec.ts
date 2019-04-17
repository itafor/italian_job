import { ProjectSettings } from './project-settings.po';
import { ProjectBoard, ToastrTypes } from './projectboard.po';
import { browser, Key } from 'protractor';
import utils from '../utils';


const addbutton = '.fa-plus';
const editbutton = '.fa-edit';
const btn = '.btn';
const btnprimary = '.btn-primary';
const addCirclePlus = '.fa.fa-plus-circle';
const faviconclass = '.fa.fa-plus-circle';
const faviconClass = '.fa.fa-plus';
const modalclose = '.close';
const modalsubmitbtn = '.modal-footer button';

const date = new Date();
let todayDate: any = date.getDate();
if (todayDate.toString().length === 1) {
    todayDate = `0${todayDate }`;
} else {
    todayDate = todayDate - 3;
}
const newnameofproject = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 8);
const testValue = {
    name: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 9),
    description: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 8),
    startDate: `${date.getMonth() + 2}-${todayDate}-${date.getFullYear()}`,
    stopDate: `${date.getMonth() + 3}-${todayDate}-${date.getFullYear()}`,
};

const creatModalForm = {
    header: {
        text: 'Create New Project'
    },
    label: {
        text: 'Name'
    },
    input: {
        text: ''
    },
    submit: {
        text: 'Create'
    }
};

const projectName = {
    name: `${Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 9)}`
};

const projectSettingsMenu = {
    general: {
        text: 'GENERAL',
        bgColor: 'rgba(238, 238, 238, 1)',
        projectTitle: projectName.name.toUpperCase(),
        projectDescription: 'ADD DESCRIPTION',
        safeValue: `${Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 9)}`

    },
    goals: {
        text: 'GOALS',
        bgColor: 'rgba(0, 0, 0, 0)',
        activeBgColor: 'rgba(238, 238, 238, 1)' ,
        tabIndex: 'Goals',
        emptyGoal: 'No Goals'
    },
    fields: {
        text: 'FIELDS',
        bgColor: 'rgba(0, 0, 0, 0)',
        activeBgColor: 'rgba(238, 238, 238, 1)' ,
        tabIndex: 'Fields',
        emptyField: 'No Fields'
    },
    members: {
        text: 'MEMBERS',
        bgColor: 'rgba(0, 0, 0, 0)',
        activeBgColor: 'rgba(238, 238, 238, 1)' ,
        tabIndex: 'Members',
        emptyMember: 'No Members'
    }
};

const goalCreateTopFields = {
    name: {
        placeholder: 'Name',
        safeValue: testValue.name
    },
    description: {
        placeholder: 'Description',
        safeValue: testValue.description
    }
};

const goalCreateBottomFields = {
    startDate: {
        placeholder: 'Start Date',
        label: 'Goal Start Date',
        safeDate: testValue.startDate,
        actualValue: `${date.getFullYear()}-0${date.getMonth() + 2}-${todayDate}`
    },
    stopDate: {
        placeholder: 'Stop Date',
        label: 'Goal Stop Date',
        safeDate: testValue.stopDate,
        actualValue: `${date.getFullYear()}-0${date.getMonth() + 3}-${todayDate}`
    }

};


const goalUpdateTopFields = {
    name: {
        safeValue: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 9),
    },
    description: {
        safeValue: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 9),
    },
};
const goalUpdateBottomFields = {

    startDate: {
        placeholder: 'Start Date',
        safeDate: `0${date.getMonth() + 3}-${todayDate}-${date.getFullYear()}`,
    },
    stopDate: {
        placeholder: 'Stop Date',
        safeDate: `0${date.getMonth() + 4}-${todayDate}-${date.getFullYear()}`,

    }
};

const invalidTest = {
    name: {
        emptyChar: {
            input: '',
            msg: 'Please enter goal name'
        }
    },
    description: {
        emptyChar: {
            input: '',
            msg: 'Please enter goal description'
        }
    },
    startDate: {
        emptyChar: {
            input: '',
            msg: 'Please enter goal start date'
        }
    },
    stopDate: {
        emptyChar: {
            input: '',
            msg: 'Please enter goal stop date'
        }
    }
};

const invalidTestField = {
    name: {
        emptyChar: {
            input: '',
            msg: 'Please enter field name'
        }
    },
    description: {
        emptyChar: {
            input: '',
            msg: 'Please enter field description'
        }
    },
    type: {
        emptyChar: {
            input: '',
            msg: 'Please enter field type'
        }
    },

};


const fieldCreateFormFields = {
    name: {
        placeholder: 'Name',
        safeValue: testValue.name
    },
    description: {
        placeholder: 'Description',
        safeValue: testValue.description
    },
    type: {
        placeholder: 'Enter Type',
        label: 'Field Type',
        safeValue: 'TEXT'
    }
};


const fieldUpdateFormFields = {
    name: {
        safeValue: testValue.name
    },
    description: {
        safeValue: testValue.description
    },
};

const memberCreateFormFields = {
    role: {
        text: 'Role Name',
        invalidBorderColor: 'rgba(239, 83, 80)'
    },
    user: {
        text: 'User',
        invalidBorderColor: 'rgba(208, 146, 166)'
    }
};


describe('Quabbly| PROJECT SETTINGS', () => {
    let page: ProjectSettings;
    let pbo = new ProjectBoard();

    beforeEach(() => {
        page = new ProjectSettings();
    });

    it('should display a button titled "Create New Project", with a plus icon and class btn-primary, and an empty list titled "No Projects" if no project has been created', () => {
        page.navigateTo('/taskmanager/projects');
        page.getActionButton('#addproject', `${btn}`, `#icon-create-project${faviconclass}`, 'Create Project');
        expect(page.getElement('#empty-project-list').getText()).toEqual('No Projects');
    });


    it('on click of the button, a modal should  open with form having appropriate text content, a disabled button with class btn-primary, and modal should have a close button', () => {
        page.getElement('#addproject').click().then(() => {
            Object.keys(creatModalForm).map(field => {
                expect(page.getElement(`#${field}-create-project`).getText()).toEqual(creatModalForm[field].text);
                expect(page.getElement(`#submit-create-project${btn}${btnprimary}`).isDisplayed()).toBeTruthy();
                expect(page.getElement('#submit-create-project').getAttribute('disabled')).toBeTruthy();
                expect(page.getElement('#close-create-project-modal').getAttribute('aria-label')).toEqual('Close');
            });
        });
    });


    it('on enter input value, Create Button should be active', () => {
        page.getElement('#input-create-project').sendKeys(projectName.name);
        expect(page.getElement('#submit-create-project').isEnabled()).toBeTruthy();
        page.getElement(`#input-create-project`).clear();
    });


    it('should display a toaster success on successful creation and route to projects', () => {
        page.getElement('#input-create-project').sendKeys(projectSettingsMenu.general.projectTitle);
        page.getElement('#submit-create-project').click();
        expect(page.toasterSuccess()).toEqual('New Project Successfully Created');
        page.navigateTo('/taskmanager/projects');
    });

    it('should display admin actions on project when I click on "more"  ', async () => {
        // more CTA
        const details = await (utils.getElements(ProjectBoard.projectDetailsCard.selector));
        const dropdown = pbo.getDropdownCtaForElem(details[0]);
        const responses = await Promise.all([dropdown.isPresent(), dropdown.isDisplayed()]);
        expect(responses).toEqual([true, true]);

        await dropdown.click();
        pbo.assertDropdownOpenForElem(details[0]);
        // on click modal appears
    });

    it('should have expected actions - edit, delete settings', async () => {
        const details = await (utils.getElements(ProjectBoard.projectDetailsCard.selector));
        const dropdowns = await pbo.dropdownMenus(details[0]);
        expect(dropdowns.length).toBe(3);
        const menuNames = await (pbo.dropdownMenu(details[0]).getText());
        ['Edit', 'Delete', 'Settings'].map(item => expect(menuNames.trim()).toContain(item));
    });

    it('menu items should have the expected icons', async () => {
        const expectedIconClasses = ['fa fa-edit fa-1.5x text-secondary', 'fa fa-cog fa-1.5x text-secondary',
            'fa fa-trash fa-1.5x text-secondary'];
        const details = await (utils.getElements(ProjectBoard.projectDetailsCard.selector));
        const dropdowns = await pbo.dropdownMenus(details[0]);
        Promise
            .all([dropdowns[0].$('i').getAttribute('class'),
            dropdowns[1].$('i').getAttribute('class'), dropdowns[2].$('i').getAttribute('class')])
            .then(iconClasses => expect(iconClasses).toEqual(expectedIconClasses));
    });

  

    it('should be able to click the project settings from project card menu', async () => {
        let details = await (utils.getElements(ProjectBoard.projectDetailsCard.selector));
        let dropdowns = await pbo.dropdownMenus(details[0]);
        expect(dropdowns.length).toBe(3);
        await dropdowns[1].click();
      
    })


    it('should display appropriate menu content on project settings page and background color of active menu', () => {
        Object.keys(projectSettingsMenu).map(field => {
            expect(page.getElement(`#${field}-project-menu`).getText()).toEqual(projectSettingsMenu[field].text);
            expect(page.getElement(`#${field}-project-menu`).getCssValue('background-color')).toEqual(projectSettingsMenu[field].bgColor);
        });
    });

    it('should display appropriate content on General Page', () => {
        const pro = newnameofproject[0].toUpperCase().concat(newnameofproject.substr(1));
        expect(page.getElement(`#project-title`).getText()).toEqual(projectSettingsMenu.general.projectTitle);
        expect(page.getElement(`#project-uniquekey`).isPresent()).toBeTruthy();
        expect(page.getElement(`#project-description-tag`).getText()).toEqual(projectSettingsMenu.general.projectDescription);
        expect(page.getPlusCircle('#project-description-plus-icon', `#project-description-plus-icon${faviconclass}${addCirclePlus}`));
        expect(page.getElement(`#project-created-date`).isPresent()).toBeTruthy();
        expect(page.getElement(`#project-created-by`).isPresent()).toBeTruthy();
    });

    it('should be able to see the following if the description plus icon is clicked: a close Icon, a form with textarea field and a button titled "Add, button should have a class btn-primary', () => {
        page.getActionToolTip(`#project-description-plus-icon`, 'Add');
        page.getElement(`#project-description-plus-icon`).click();
        page.getActionToolTip(`#project-description-close-icon`, 'Close');
        expect(page.getElement(`#project-description-textarea`).isPresent()).toBeTruthy();
        page.ProjectDescriptionSubmitBtn('#add-description-submit', `${btn}${btnprimary}`, 'Add');
        page.getElement(`#project-description-close-icon`).click();
    });

    it('should be able to add a description and display a toaster success', () => {
        page.getElement(`#project-description-plus-icon`).click();
        page.getElement(`#project-description-textarea`).sendKeys(projectSettingsMenu.general.safeValue);
        page.getElement('#add-description-submit').click();
        expect(page.toasterSuccess()).toEqual('Description Added');
        expect(page.getElement('#addedDescription').isDisplayed()).toBeTruthy();
    });

    it('should be able to click the "Goals" menu and set bgColor to active, and also display appropriate content of goals if any', () => {
        page.getElement(`#goals-project-menu`).click();

        expect(page.getElement(`#goals-project-menu`).getCssValue('background-color')).toEqual(projectSettingsMenu.goals.activeBgColor);
        expect(page.getElement('#goals').getText()).toEqual(projectSettingsMenu.goals.tabIndex);
        expect(page.getElement('#no-goal-id').getText()).toEqual(projectSettingsMenu.goals.emptyGoal);
        page.getActionButton_two('#createGoalButton', `${btn}${btnprimary}`, `#icon-create-goals${faviconClass}`, 'Create Goals');

    });

    it('on click of the Create Goal button, a new tab titled New Goal should be shown', () => {
        page.getElement('#createGoalButton').click();
        expect(page.getElement('#tab-id-0').getText()).toEqual('New Goal   ×');

    });

    it('should display a form with a title New Goal', () => {
        expect(page.getElement('#newGoalHeader').getText()).toEqual('New Goal');
    });

    it('should show form input fields with the correct placeholders and label', () => {
        Object.keys(goalCreateTopFields).map(field => {
            expect(page.getElement(`#goal-${field}`).getAttribute('placeholder')).toEqual(goalCreateTopFields[field].placeholder);
        });

        Object.keys(goalCreateBottomFields).map(field => {
            expect(page.getElement(`#goal-${field}`).getAttribute('placeholder')).toEqual(goalCreateBottomFields[field].placeholder);
            expect(page.getElement(`#goal-${field}-label`).getText()).toEqual(goalCreateBottomFields[field].label);
        });
    });

    it('should have a button with a title Create Goal and class btn-primary, and the button should be disabled', () => {
        expect(page.getElement('#create-goal-submit').getText()).toEqual('Create Goal');
        expect(page.getElement(`#create-goal-submit${btn}${btnprimary}`).isDisplayed()).toBeTruthy();
        expect(page.getElement('#create-goal-submit').getAttribute('disabled')).toBeTruthy();
    });

    it('should display error message below the text input field values if invalid', () => {
        Object.keys(invalidTest).map(field => {
            Object.keys(invalidTest[field]).map(datas => {
                page.getElement(`#goal-${field}`).sendKeys(invalidTest[field][datas].input);
                page.getElement(`#newGoalHeader`).click();
                expect(page.getElement(`.err${field}`).isDisplayed()).toBeTruthy();
                expect(page.getElement(`.err${field}`).getText()).toEqual(invalidTest[field][datas].msg);
                page.getElement(`#goal-${field}`).clear();
            });
        });
    });

    it('should allow valid text input', () => {

        Object.keys(goalCreateTopFields).map(field => {
            page.getElement(`#goal-${field}`).sendKeys(goalCreateTopFields[field].safeValue);
            expect(page.getElement(`#goal-${field}`).getAttribute('value')).toEqual(goalCreateTopFields[field].safeValue);
            page.getElement(`#goal-${field}`).clear();
        });
        Object.keys(goalCreateBottomFields).map(field => {
            page.getElement(`#goal-${field}`).sendKeys(goalCreateBottomFields[field].safeDate).then(() => {
                    expect(page.getElement(`#goal-${field}`).getAttribute('value')).toEqual(goalCreateBottomFields[field].actualValue);
                    page.getElement(`#goal-${field}`).clear();
            });
        });
    });

    it('should display a toaster success on successful creation if all required fields are correctly entered', () => {
        Object.keys(goalCreateTopFields).map(field => {
            page.getElement(`#goal-${field}`).sendKeys(goalCreateTopFields[field].safeValue);
        });
        Object.keys(goalCreateBottomFields).map(field => {
            page.getElement(`#goal-${field}`).sendKeys(goalCreateBottomFields[field].safeDate).then(() => {
                
            });
        });
        page.getElement('#create-goal-submit').click();
        expect(page.toasterSuccess()).toEqual('Goal Created Successfully');
    });

    it(`should be able to click on the "Update Goal" from the drop-down list and a new tab with text Updating ${goalCreateTopFields.name.safeValue} should be shown `, () => {
        page.getElement('#drop-view').click().then(() => {
            page.getElement('#update-goal').click();
        });
        expect(page.getElement('#tab-id-0').getText()).toEqual(`Updating ${goalCreateTopFields.name.safeValue}   ×`);
    });

    it(`should display a form with a header text Updating ${goalCreateTopFields.name.safeValue}}`, () => {
        expect(page.getElement('#goal-update-header-text').getText()).toEqual(`Updating ${goalCreateTopFields.name.safeValue}`);
    });

    it('should show form input fields with the correct label', () => {
        Object.keys(goalCreateBottomFields).map(field => {
            expect(page.getElement(`#update-${field}-label`).getText()).toEqual(goalCreateBottomFields[field].label);
        });
    });

    it('should have a button with a title Update Goal and class btn-primary, and the button should be enabled', () => {
        expect(page.getElement('#goal-submit-update').getText()).toEqual('Update Goal');
        expect(page.getElement(`#goal-submit-update${btn}${btnprimary}`).isDisplayed()).toBeTruthy();
        expect(page.getElement('#goal-submit-update').getAttribute('disabled')).toBeFalsy();
    });


    it('should have already prefilled values on the form', () => {

        Object.keys(goalCreateTopFields).map(field => {
            expect(page.getElement(`#goal-${field}-update`).getAttribute('value')).toEqual(goalCreateTopFields[field].safeValue);
        });
        Object.keys(goalCreateBottomFields).map(field => {
            expect(page.getElement(`#goal-${field}-update`).getAttribute('value')).toEqual(goalCreateBottomFields[field].actualValue);
        });
    });

    it('should display a toaster success on successful update if all required fields are correctly entered', () => {
        Object.keys(goalUpdateTopFields).map(field => {
            page.getElement(`#goal-${field}-update`).clear();
            page.getElement(`#goal-${field}-update`).sendKeys(goalUpdateTopFields[field].safeValue);
        });
        Object.keys(goalUpdateBottomFields).map(field => {
            page.getElement(`#goal-${field}-update`).clear();
            page.getElement(`#goal-${field}-update`).sendKeys(goalUpdateBottomFields[field].safeDate).then(() => {
            });
        });
        page.getElement('#goal-submit-update').click();
        expect(page.getElement('.toastr-success').getText()).toEqual('Goal Updated Successfully');
    });

    it('should be able to click the "Fields" menu and set bgColor to active, and also display appropriate content of fields if any', () => {
        page.getElement(`#fields-project-menu`).click();

        expect(page.getElement(`#fields-project-menu`).getCssValue('background-color')).toEqual(projectSettingsMenu.fields.activeBgColor);
        expect(page.getElement('#fields').getText()).toEqual(projectSettingsMenu.fields.tabIndex);
        expect(page.getElement('#no-field-id').getText()).toEqual(projectSettingsMenu.fields.emptyField);
        page.getActionButton_two('#createFieldButton', `${btn}${btnprimary}`, `#icon-create-fields${faviconClass}`, 'Create Fields');

    });

    it('on click of the Create Field button, a new tab titled New Field should be shown', () => {
        page.getElement('#createFieldButton').click();
        expect(page.getElement('#tab-id-0').getText()).toEqual('New Field   ×');

    });

    it('should display a form with a title New Field', () => {
        expect(page.getElement('#newFieldHeader').getText()).toEqual('New Field');
    });


    it('should show form input fields with the correct placeholders and label', () => {
        Object.keys(fieldCreateFormFields).map(field => {
            expect(page.getElement(`#field-${field}`).getAttribute('placeholder')).toEqual(fieldCreateFormFields[field].placeholder);
            expect(page.getElement(`#field-type-label`).getText()).toEqual(fieldCreateFormFields.type.label);
        });
    });

    it('should have a button with a title Create Field and class btn-primary, and the button should be disabled', () => {
        expect(page.getElement('#create-field-submit').getText()).toEqual('Create Field');
        expect(page.getElement(`#create-field-submit${btn}${btnprimary}`).isDisplayed()).toBeTruthy();
        expect(page.getElement('#create-field-submit').getAttribute('disabled')).toBeTruthy();
    });


    it('should display error message below the text input field values if invalid', () => {
        Object.keys(invalidTestField).map(field => {
            Object.keys(invalidTestField[field]).map(datas => {
                page.getElement(`#field-${field}`).sendKeys(invalidTestField[field][datas].input);
                page.getElement(`#newFieldHeader`).click();
                expect(page.getElement(`.err${field}`).isDisplayed()).toBeTruthy();
                expect(page.getElement(`.err${field}`).getText()).toEqual(invalidTestField[field][datas].msg);
                page.getElement(`#field-name`).clear();
                page.getElement(`#field-description`).clear();
            });
        });
    });

    it('should display a toaster success on successful creation if all required fields are correctly entered', () => {
        page.getElement(`#field-name`).sendKeys(fieldCreateFormFields.name.safeValue);
        page.getElement(`#field-description`).sendKeys(fieldCreateFormFields.description.safeValue);
        page.getElement(`#field-type`).click();
            page.getElement('#type-list-3').click().then(() => {
                page.getElement('#create-field-submit').click();

            });
        expect(page.toasterSuccess()).toEqual('Field Created Successfully');

    });


    it(`should be able to click on the "Update Field" from the drop-down list and a new tab with text Updating ${fieldCreateFormFields.name.safeValue} should be shown `, () => {
        page.getElement('#drop-list').click().then(() => {
            page.getElement('#edit-field').click();
        });
        expect(page.getElement('#tab-id-0').getText()).toEqual(`Updating ${fieldCreateFormFields.name.safeValue}   ×`);
    });

    it(`should display a form with a header text Updating ${fieldCreateFormFields.name.safeValue}}`, () => {
        expect(page.getElement('#updateFieldHeader').getText()).toEqual(`Updating ${fieldCreateFormFields.name.safeValue}`);
    });

    it('should have already prefilled values on the form', () => {

        Object.keys(fieldCreateFormFields).map(field => {
            expect(page.getElement(`#field-${field}-update`).getAttribute('value')).toContain(fieldCreateFormFields[field].safeValue);
        });
     
    });


    it('should have a button with a title Update Field and class btn-primary, and the button should be enabled', () => {
        expect(page.getElement('#update-field-submit').getText()).toEqual('Update Field');
        expect(page.getElement(`#update-field-submit${btn}${btnprimary}`).isDisplayed()).toBeTruthy();
        expect(page.getElement('#update-field-submit').getAttribute('disabled')).toBeFalsy();
    });


    it('should display a toaster success on successful update if all required fields are correctly entered', () => {
        page.getElement(`#field-name-update`).sendKeys(fieldUpdateFormFields.name.safeValue);
        page.getElement(`#field-description-update`).sendKeys(fieldUpdateFormFields.description.safeValue);
        page.getElement(`#field-type-update`).click();
        page.getElement('#type-list-0-update').click().then(() => {
            page.getElement('#update-field-submit').click();

        });
        expect(page.toasterSuccess()).toEqual('Field Updated Successfully');
    });


    it('should be able to click the "Members" menu and set bgColor to active, and also display appropriate content of members if any', () => {
        page.getElement(`#members-project-menu`).click();
        expect(page.getElement(`#members-project-menu`).getCssValue('background-color')).toEqual(projectSettingsMenu.members.activeBgColor);
        expect(page.getElement('#members').getText()).toEqual(projectSettingsMenu.members.tabIndex);
        expect(page.getElement('#no-member-id').getText()).toEqual(projectSettingsMenu.members.emptyMember);
        page.getActionButton_two('#createMembersButton', `${btn}${btnprimary}`, `#icon-create-members${faviconClass}`, 'Add Members');

    });

    it('on click of the Create Members button, a new tab titled New Member should be shown', () => {
        page.getElement('#createMembersButton').click();
        expect(page.getElement('#tab-id-0').getText()).toEqual('New Member   ×');

    });

    it('should display a form with a title New Member', () => {
        expect(page.getElement('#newMemberHeader').getText()).toEqual('New Member');
    });


    it('should show form option fields with the correct label', () => {
        Object.keys(memberCreateFormFields).map(field => {
            expect(page.getElement(`#${field}-create-label`).getText()).toEqual(memberCreateFormFields[field].text);
        });
    });

    it('should have a button with a title Add and class btn-primary, and the button should be disabled', () => {
        expect(page.getElement('#add-member-submit').getText()).toEqual('Add');
        expect(page.getElement(`#add-member-submit${btn}${btnprimary}`).isDisplayed()).toBeTruthy();
        expect(page.getElement('#add-member-submit').getAttribute('disabled')).toBeTruthy();
    });

    it('should be able to add a member  if role and user is selected from the option list', () => {
        Object.keys(memberCreateFormFields).map(field => {
           page.getElement(`#${field}-id`).click();
           page.getElement(`#${field}-list-0`).click().then(() => {
               page.getElement('#add-member-submit').click();
           });
       });
        expect(page.toasterSuccess()).toEqual('Member Added Successfully');
    });

     it('should be able to delete a project if the delete menu is clicked from project card menu', async () => {
        page.navigateTo('/taskmanager/projects');
        await utils.navigateTo(ProjectBoard.projectsUrl);
        await utils.waitForPage(1000);
        const details = await (utils.getElements(ProjectBoard.projectDetailsCard.selector));
        await (pbo.getDropdownCtaForElem(details[0])).click();
        const dropdowns = await pbo.dropdownMenus(details[0]);
        expect(dropdowns.length).toBe(3);
        await dropdowns[2].click();
        expect(pbo.getElement('.modal-content').isPresent()).toBeTruthy();
    });

    it('open modal should have a header text titled "Deleting Project" ', () => {
        expect(pbo.getElement('.modal-title').getText()).toEqual('Deleting Project');
        expect(pbo.getElement('.modal-title').getTagName()).toEqual('h4');
    });

    it('open modal should have label text', () => {
        expect(pbo.getElement('h3').getText()).toContain(`Are you sure you want to delete`);
        expect(pbo.getElement(newnameofproject)).toBeTruthy();
    });

    it('on clicking the edit icon with class "fa-trash" a modal with buttons "No and Yes" be present', () => {
        expect(pbo.getAllElements(modalsubmitbtn).get(0).getText()).toEqual('No');
        expect(pbo.getAllElements(modalsubmitbtn).get(1).getText()).toEqual('Yes');
    });

    it('should expect the background color of the yes button to be red', () => {
        expect(pbo.getAllElements(modalsubmitbtn).get(1).getCssValue('background-color')).toEqual('rgba(239, 83, 80, 1)');
    });

    it('on clicking No button, the modal should be dismissed', () => {
        pbo.getAllElements(modalsubmitbtn).get(0).click().then(() => {
            expect(pbo.getElement('.modal-content').isPresent()).toBeFalsy();
        });
    });


    it('on successful deletion there should be a success toaster message and the modal should be dismissed', async () => {
        const details = await (utils.getElements(ProjectBoard.projectDetailsCard.selector));
        await (pbo.getDropdownCtaForElem(details[0])).click();
        const dropdowns = await pbo.dropdownMenus(details[0]);
        expect(dropdowns.length).toBe(3);
        await dropdowns[2].click();
        await utils.getElement('.modal-footer button[type="submit"]').click();
        utils.waitForPage(300).then(() => {
            expect(pbo.toastrOfTypePresent(ToastrTypes.ERROR)).toBeTruthy();
        }).catch(err => {
            if (err.name === 'NoSuchElementError') {
                expect(pbo.toastrOfTypePresent(ToastrTypes.SUCCESS)).toBeTruthy();
            }
        });
        expect(pbo.getElement('.modal-content').isPresent()).toBeFalsy();
    });

});

