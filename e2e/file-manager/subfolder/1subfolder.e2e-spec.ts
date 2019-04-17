
import { browser, by, Key } from 'protractor';
import utils from '../../utils';
import { FileUtils } from '../file-manager-utils';

describe('Sub Folders', () => {
    let fileUtils: FileUtils;
    const navbarSelector = 'nav[aria-label=breadcrumb]';
    const folderName = 'Game Of Throne';
    const actionBtns = ['Open Folder', 'Rename', 'Share', 'Delete', 'Detail'];
    let date;
    beforeAll(() => {
        fileUtils = new FileUtils();
        date = fileUtils.getDate();
        utils.navigateTo('/filemanager/myfile');
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
    it('it should success message', () => {
        browser.sleep(2000);
        fileUtils.getToastNotify('folder created', 'success');
    });
    it('expect new files uploaded with dropdown icons', () => {
        const fileArray = [
            { name: folderName, date: date, sharing: 'PRIVATE', size: '' },
        ];
        fileUtils.getDriveDetail(fileArray, actionBtns, 'folder');
    });
    it('it should expect open folder icon', () => {
        const openFolderButton = fileUtils.getAllElements('#openFolderBtn').get(0);
        expect(openFolderButton.getText()).toContain('Open Folder');
    });
    it('it should open folder to view what inside', () => {
        const openFolderButton = fileUtils.getAllElements('#openFolderBtn').get(0);
        openFolderButton.click();
        browser.sleep(3000);
    });
    it('it should expect a navigate bar at the top', () => {
        const navbar = fileUtils.getElement(navbarSelector);
        expect(navbar.isDisplayed()).toBeTruthy();
    });
    it('it should show name of folder opened on navbar', () => {
        const navbarItem = [{ name: folderName, color: 'text-primary' }];
        fileUtils.getNavbarInSubFolder(navbarSelector, navbarItem);
    });
    it('its should display "My Drive" text beside mydrive icon', () => {
        const driveText = fileUtils.getAllElements(`${navbarSelector} .breadcrumb-item a`).get(0);
        expect(driveText.isDisplayed()).toBeTruthy();
    });
    it('mydrive should have text mydrive', () => {
        const driveText = fileUtils.getAllElements(`${navbarSelector} .breadcrumb-item a`).get(0);
        expect(driveText.getText()).toEqual('My Drive');
    });
    // empty state no folder and file
    it('expect folder icon and text "Folder Is Empty"', () => {
        fileUtils.getEmptyState('#noSubFiles', 'fa-folder-minus', null, 'Folder Is Empty');
    });

});
