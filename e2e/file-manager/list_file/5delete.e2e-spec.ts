
import { browser, element, } from 'protractor';
import utils from '../../utils';
import { FileUtils } from '../file-manager-utils';

describe('Delete Files', () => {
    let fileUtils: FileUtils;
    const fileName = 'new file.jpg';
    beforeAll(() => {
        fileUtils = new FileUtils();
        utils.navigateTo('/filemanager/myfile');
        browser.sleep(5000);
    });
    it('it should open delete file modal', () => {
        fileUtils.getModalToOpen('#delete', 'Delete');
    });
    it('delete file  modal should have a heading title', () => {
        fileUtils.getModalHeader(`Delete File`);
    });
    it('delete file modal should have a close button', () => {
        fileUtils.getModalCloseBtn();
    });
    it('delete file modal should have delete button', () => {
        expect(fileUtils.getSUbmitBtn().getText()).toEqual('Delete');
    });
    it('delete file modal should have close button', () => {
        expect(fileUtils.getActBtn().getText()).toEqual('Close');
    });
    it('delete button should have class btn-danger', () => {
        expect(fileUtils.getSUbmitBtn().getAttribute('class')).toContain('btn-danger');
    });
    it('delete file modal should expect warning text before deleting file', () => {
        fileUtils.getDeleteModalText(fileName, 'My Drive');
    });
    it('expect cancel button to dismis modal', () => {
        const cancelBtn = fileUtils.getElement('.modal-footer button.btn-secondary');
        cancelBtn.click();
        fileUtils.getModalDismissed();
    });
    it('it should reopen delete file modal when delete file icon is clicked', () => {
        fileUtils.getModalToOpen('#delete', 'Delete');
    });
    it('expect delete button to delete file ', () => {
        const deleteBtn = fileUtils.getElement('.modal-footer button.btn-danger');
        deleteBtn.click();
    });
    it('it should display success message', () => {
        browser.sleep(2000);
        fileUtils.getToastNotify('file deleted', 'success');
    });
    it('file deleted is removed from table', () => {
        const tableData = fileUtils.getAllElements('table tbody tr').get(0);
        expect(tableData.isPresent()).toBeFalsy();
    });


});
