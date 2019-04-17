
import { browser, element, } from 'protractor';
import utils from '../../utils';
import { FileUtils } from '../file-manager-utils';

describe('Delete Folder', () => {
    let fileUtils: FileUtils;
    const folderName = 'new folder';
    beforeAll(() => {
        fileUtils = new FileUtils();
        utils.navigateTo('/filemanager/myfile');
    });
    it('it should open delete folder modal', () => {
        browser.sleep(3000);
        fileUtils.getModalToOpen('#deleteFolder', 'Delete');
    });
    it('delete folder  modal should have a heading title', () => {
        fileUtils.getModalHeader(`Delete Folder`);
    });
    it('delete folder modal should have a close button', () => {
        fileUtils.getModalCloseBtn();
    });
    it('delete folder modal should have delete button', () => {
        expect(fileUtils.getSUbmitBtn().getText()).toEqual('Delete');
    });
    it('delete folder modal should have close button', () => {
        expect(fileUtils.getActBtn().getText()).toEqual('Close');
    });
    it('delete button should have class btn-danger', () => {
        expect(fileUtils.getSUbmitBtn().getAttribute('class')).toContain('btn-danger');
    });
    it('delete folder modal should expect warning text before deleting folder', () => {
        fileUtils.getDeleteModalText(folderName, 'My Drive');
    });
    it('expect cancel button to dismis modal', () => {
        const cancelBtn = fileUtils.getElement('.modal-footer button.btn-secondary');
        cancelBtn.click();
        fileUtils.getModalDismissed();
    });
    it('it should reopen delete folder modal when delete folder icon is clicked', () => {
        fileUtils.getModalToOpen('#deleteFolder', 'Delete');
    });
    it('expect delete button to delete folder ', () => {
        const deleteBtn = fileUtils.getElement('.modal-footer button.btn-danger');
        deleteBtn.click();
    });
    it('it should display success message', () => {
        fileUtils.getToastNotify('folder deleted', 'success');
    });
    it('folder deleted is removed from table', () => {
        const tableData = fileUtils.getAllElements('table tbody tr #deleteFolder').get(0);
        expect(tableData.isPresent()).toBeFalsy();
    });


});
