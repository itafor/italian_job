import { Accounting } from './accounting.po';
import { browser, by, element, until, protractor, Key } from 'protractor';
import utils from '../utils';
const path = require('path');
let page: Accounting;

const addbutton = '.fa-plus';
const editbutton = '.fa-edit';
const btn = '.btn';
const btnprimary = '.btn-primary';
const faviconclass = '.fa';

const createFormAttribute = {
    name: {
        label: 'Name*',
        inputtype: 'text',
    },
    description: {
        label: 'Description',
        inputtype: 'textarea',
    },
    parentcategory: {
        label: 'Parent Category',
        inputtype: 'select-one',
    },
};

const invalidInput = {
    itemdescription: {
        emptyChar: {
            input: '',
            msg: 'description is required.'
        },
        minChar: {
            input: 'Go',
            msg: 'item description must be between 3 and 100 characters.'
        },
        maxChar: {
            input: 'AntimonopologeographicationalisminternalizationalismAntimonopologeographicationalisminternalizationalism',
            msg: 'item description must be between 3 and 100 characters.'
        }
    },
};

const validCreateFormInput = {
    name: {
        value: 'Component',
    },
    description: {
        value: 'Electrical Component',
    }
};
const newvalidCreateFormInput = {
    name: {
        value: 'Component',
    },
    description: {
        value: 'Electrical Component',
    }
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

    it('NOW TESTING INVENTORY', () => {
        page.navigateTo('/accounting/inventory-category');
    });

    it('should display a tabset that has a label "Inventory"',() => {
        expect(page.getInitialTab('viewInventoryCategory')).toEqual('Inventory Category');        
    });

    it('should display angry face and "No Inventory Category" where there is no inventory', () => {
        page.getEmptyListAttr('.fa.fa-frown-o.fa-2x.text-secondary', 'no-inventory', 'No Inventory Category');
    });

    it('should display "Add Inventory Category" button with the correct attribute', () => {
        page.getActionButton('#createinventorycategory', `${btn}${btnprimary}`, `#createinventorycategoryplusicon${faviconclass}${addbutton}`, 'Add Inventory Category  ');
    });

    //Create Inventory Category Test
    it('should click on Create Inventory Button and assert that the create tab is displayed', () => {
        page.getClickButton('createinventorycategory');
        expect(page.getInitialTab('tab-id-0')).toEqual('New Inventory Category   ×');
    });

    it('should test that the create form has the right header, section name, label and input type before creating any inventory', () => {
        expect(page.getElement('#createinventorycategoryheader').isDisplayed()).toBeTruthy();
        expect(page.getElement('#createinventorycategoryheader').getText()).toEqual('New Inventory Category');
        Object.keys(createFormAttribute).map(field => {
                expect(page.getElement(`#${field}-label`).isDisplayed()).toBeTruthy();
                expect(page.getElement(`#${field}-label`).getText()).toEqual(createFormAttribute[field].label);
                expect(page.getElement(`#${field}-input`).getAttribute('type')).toEqual(createFormAttribute[field].inputtype);         
        });
    });

    it('should test that all valid input is inputed', () => {
        Object.keys(validCreateFormInput).map(field => {
            page.getElement(`#${field}-input`).sendKeys(validCreateFormInput[field].value);
        });
    });

    

    it('should test that the Create Inventory Category Button has the correct attribute and when the Create Inventory Button is clicked after valid input there is a success', () => {
        page.getActionButton('#CategoryInventoryCategoryBtn', `${btn}${btnprimary}`, '', 'Create Category');
        page.getClickButton('CategoryInventoryCategoryBtn');
        expect(page.toasterNotify('success')).toEqual('Inventory Category created successfully');
    });

    //List Inventory Category Test
    it('should show labels of the form with the correct title when the List Inventory Tab is clicked', () => {
        page.getClickButton('viewInventoryCategory');
        expect(page.getLabelTitle()).toEqual(['Category Name', 'Parent Category', 'Description', 'Date Created', 'Action']);
        //Test the content of what was created that they are in alignment with what was sent
    });

    it('should test that the action button for Inventory is visible with the correct tooltip', () => {
        expect(page.getElement('#editInventoryCategory.icon.fa.fa-pencil.text-info').isDisplayed()).toBeTruthy();
        page.getActionToolTip('#editInventoryCategory.icon.fa.fa-pencil.text-info', 'Edit Category');
    });

    it('should test that when you click edit the tab name is "Update Inventory" and all the previous data are populated', () => {
        page.getClickButton('editInventoryCategory');
        expect(page.getInitialTab('tab-id-0')).toEqual('Edit Inventory Category   ×');
        Object.keys(newvalidCreateFormInput).map(field => {
            expect(page.getElement(`#${field}-input`).getAttribute('value')).toEqual(newvalidCreateFormInput[field].value);
        });    
    });

    it('should test that the update form has the right header, section name, label and input type', () => {
        expect(page.getElement('#updateInventoryCategoryHeader').isDisplayed()).toBeTruthy();
        expect(page.getElement('#updateInventoryCategoryHeader').getText()).toEqual('Update Inventory Category');    
        Object.keys(createFormAttribute).map(field => {
            expect(page.getElement(`#${field}-label`).isDisplayed()).toBeTruthy();
            expect(page.getElement(`#${field}-label`).getText()).toEqual(createFormAttribute[field].label);
            expect(page.getElement(`#${field}-input`).getAttribute('type')).toEqual(createFormAttribute[field].inputtype);
        });
    });
    it('select dropdown', () => {
        page.getElement('#parentcategory-input').click().then(()=> {
            browser.actions().sendKeys(Key.ARROW_DOWN).perform().then(()=>{
                browser.actions().sendKeys(Key.ENTER).perform();
            }); 
        })
    });

});
