
import { browser, element, Key, } from 'protractor';
import utils from '../../utils';
import { FileUtils } from '../file-manager-utils';

describe('Rename Folder', () => {
    let fileUtils: FileUtils;
    const fileName = 'Game Of Throne';
    const newFileName = 'new folder';
    const tableRow = 'table tbody tr';
    beforeAll(() => {
        fileUtils = new FileUtils();
        utils.navigateTo('/filemanager/myfile');
    });
    it('it should open rename folder modal', () => {
        browser.sleep(2000);
        fileUtils.getModalToOpen('#renameFolder', 'Rename');
    });
    it('rename folder  modal should have a heading title', () => {
        fileUtils.getModalHeader(`Rename Folder`);
    });
    it('rename folder modal should have a close button', () => {
        fileUtils.getModalCloseBtn();
    });
    it('rename folder modal should have rename button', () => {
        const renameBtn = fileUtils.getElement('#renameSubmitBtn');
        expect(renameBtn.getText()).toEqual('Rename');
    });
    it('rename button should have class bg-blue', () => {
        const renameBtn = fileUtils.getElement('#renameSubmitBtn');
        expect(renameBtn.getAttribute('class')).toContain('bg-blue');
    });
    it('rename folder modal should expect input field type to be text', () => {
        fileUtils.getInputFieldType('text');
    });
    it('rename folder input field should have name of folder by default', () => {
        const inputField = fileUtils.getInputField('rename');
        expect(inputField.getAttribute('value')).toEqual(fileName);
    });
    it('it should rename folder name', () => {
        const renameBtn = fileUtils.getElement('#renameSubmitBtn');
        const inputField = fileUtils.getInputField('rename');
        inputField.clear();
        inputField.sendKeys(newFileName);
        renameBtn.click();
    });
    it('it should success display message', () => {
        fileUtils.getToastNotify('folder renamed', 'success');
    });
    it('it should dismis modal if new folder is created', () => {
        fileUtils.getModalDismissed();
    });
    it('expect folder name to change to "new folder"', () => {
        const filename = fileUtils.getAllElements(`${tableRow} td.name span.actualspace`).get(0);
        expect(filename.getText()).toEqual(newFileName);
    });
});
