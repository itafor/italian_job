import { browser, Key } from 'protractor';
import utils from '../../utils';
import { FileUtils } from '../file-manager-utils';

describe('Create And List Folders', () => {
    let fileUtils: FileUtils;
    const folderName = 'Game Of Throne';
    const actionBtns = ['Open Folder', 'Rename', 'Share', 'Delete', 'Detail'];
    let date;
    beforeAll(() => {
        fileUtils = new FileUtils();
        date = fileUtils.getDate();
    });
    it('should expect button to create new folder', () => {
        fileUtils.getCreateFolderBtn();
    });
    it('display input to create folder', () => {
        const btn = fileUtils.getCreateFolderBtn();
        btn.click();
        const inputField = fileUtils.getElement('#create-folder-input input');
        expect(inputField.isDisplayed()).toBeTruthy();
    });
    it('create folder input should have placeholder "Folder Name" and type "text"', () => {
        const inputField = fileUtils.getElement('#create-folder-input input');
        expect(inputField.getAttribute('type')).toEqual('text');
        expect(inputField.getAttribute('placeholder')).toEqual('Folder Name');
    });
    it('create folder input field should have cancel button', () => {
        const closeBtn = fileUtils.getElement('#create-folder-input #closeCreateFolder');
        expect(closeBtn.isDisplayed()).toBeTruthy();
        expect(closeBtn.getAttribute('class')).toContain('fa-times');
        expect(closeBtn.getCssValue('color')).toContain('rgba(238, 82, 79, 1)');
    });
    it('should input a name for create folder ', () => {
        const inputField = fileUtils.getElement('#create-folder-input input');
        inputField.sendKeys(folderName);
        browser.actions().sendKeys(Key.ENTER).perform();
    });
    it('it should display success message', () => {
        browser.sleep(2000);
        fileUtils.getToastNotify('folder created', 'success');
    });
    it('expect new files uploaded with dropdown icons', () => {
        const fileArray = [
            { name: folderName, date: date, sharing: 'PRIVATE', size: '' },
        ];
        fileUtils.getDriveDetail(fileArray, actionBtns, 'folder');
    });
});
