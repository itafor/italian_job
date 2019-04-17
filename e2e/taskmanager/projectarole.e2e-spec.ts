import { ProjectRole } from './project-role.po';
import { browser, Key } from 'protractor';
import utils from '../utils';



const addbutton = '.fa-plus';
const btn = '.btn';
const btnprimary = '.btn-primary';
const faviconclass = '.fa';

const creatModalForm = {
    header: {
        text: 'Create New Role'
    },
    labelname: {
        text: 'Name'
    },
    labelcapability: {
        text: 'Capability'
    },
    input: {
        text: ''
    },
    submit: {
        text: 'Create'
    }
}

const roleCheckList = {
    checklist: {
        text: ['GENERAL', 'REARRANGE_COLUMNS', 'RENAME_COLUMN', 'REARRANGE_TASKS', 'UPDATE_TASK', 'DELETE_COLUMN', 'DELETE_ATTACHMENT', 'DELETE_COMMENT']
    }
}

const roleName = {
    name: `${Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 9)}`
}

describe('Quabbly| PROJECT ROLE', () => {
    let page: ProjectRole = new ProjectRole();

    // beforeAll(async () => {
    //     await utils.navigateTo('/');
    //     utils.handleAuth();
    //     await utils.waitForPage(5000);
    // });

    // beforeEach(() => {
    //     page = new ProjectRole();
    // });

    beforeAll(() => {
        utils.navigateTo('/');
        utils.handleAuth();

    });

    it('should display a button titled "Create Role", with a plus icon and class btn-primary, and an empty list titled "No Roles" if no project has been created', () => {
        page.navigateTo('/taskmanager/roles');
        page.getActionButton('#createRole', `${btn}${btnprimary}`, `#icon-create-role${faviconclass}${addbutton}`, 'Create Role');
    });


    it('on click of the button, a modal should  open with form having appropriate text content, a disabled button with class btn-primary, and modal should have a close button', () => {
        page.getElement('#createRole').click().then(() => {
            Object.keys(creatModalForm).map(field => {
                expect(page.getElement(`#${field}-create-role`).getText()).toEqual(creatModalForm[field].text);
                expect(page.getElement(`#submit-create-role${btn}${btnprimary}`).isDisplayed()).toBeTruthy();
                expect(page.getElement('#submit-create-role').getAttribute('disabled')).toBeTruthy();
                expect(page.getElement('#close-create-role-modal').getAttribute('aria-label')).toEqual('Close');
            });

            for (let i = 0; i < 8; i++) {
                expect(page.getElement(`#checklist-create-role-${i}`).getText()).toEqual(roleCheckList.checklist.text[i]);
            }

        });
    });

    it('should display a toaster success on successful creation and route to projects', () => {
        page.getElement('#input-create-role').sendKeys(roleName.name);
        page.getElement(`#checklist-create-role-0`).click();
        page.getElement(`#checklist-create-role-4`).click();
        page.getElement(`#checklist-create-role-5`).click();
        page.getElement('#submit-create-role').click();
        expect(page.toasterSuccess()).toEqual('New Role Successfully Created');

    });

});
