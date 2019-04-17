
import { browser, element, Key, } from 'protractor';
import utils from '../../utils';
import { FileUtils } from '../file-manager-utils';

describe('Rename Files', () => {
    let fileUtils: FileUtils;
    const fileName = 'img.jpg';
    const newFileName = 'new file.jpg';
    const tableRow = 'table tbody tr';
    beforeAll(() => {
        fileUtils = new FileUtils();
    });
    it('it should open rename file modal', () => {
        utils.navigateTo('/filemanager/myfile').then(() => {
            browser.sleep(10000).then(() => {
                fileUtils.getModalToOpen('#renameFile', 'Rename');
            });
        });
    });
    it('rename file  modal should have a heading title', () => {
        fileUtils.getModalHeader(`Rename File`);
    });
    it('rename file modal should have a close button', () => {
        fileUtils.getModalCloseBtn();
    });
    it('rename file modal should have rename button', () => {
        const renameBtn = fileUtils.getElement('#renameSubmitBtn');
        expect(renameBtn.getText()).toEqual('Rename');
    });
    it('rename button should have class bg-blue', () => {
        const renameBtn = fileUtils.getElement('#renameSubmitBtn');
        expect(renameBtn.getAttribute('class')).toContain('bg-blue');
    });
    it('rename file modal should expect input field type to be text', () => {
        fileUtils.getInputFieldType('text');
    });
    it('rename file input field should have name of file by default', () => {
        const inputField = fileUtils.getInputField('rename');
        expect(inputField.getAttribute('value')).toEqual(fileName);
    });
    it('it should rename file name', () => {
        const renameBtn = fileUtils.getElement('#renameSubmitBtn');
        const inputField = fileUtils.getInputField('rename');
        inputField.clear();
        inputField.sendKeys(newFileName);
        renameBtn.click();
    });
    it('it should success message', () => {
        fileUtils.getToastNotify('file renamed', 'success');
    });
    it('it should dismis modal if new folder is created', () => {
        fileUtils.getModalDismissed();
    });
    it('expect file name to change to "new file.jpg"', () => {
        const filename = fileUtils.getAllElements(`${tableRow} td.name span.actualspace`).get(0);
        expect(filename.getText()).toEqual(newFileName);
    });
});
