
import { browser } from 'protractor';
import { FileUtils } from '../file-manager-utils';
import utils from '../../utils';

describe('Folder Details', () => {
    let fileUtils: FileUtils;
    const fileName = 'Game Of Throne';
    let date;

    beforeAll(() => {
        fileUtils = new FileUtils();
        date = fileUtils.getDate();
        utils.navigateTo('/filemanager/myfile');
    });
    it('it should open  folder detail', () => {
        browser.sleep(2000);
        fileUtils.getModalToOpen('#detailInfo', 'Detail');
    });
    it('expect folder name in detail view', () => {
        const fileDetailName = fileUtils.getElement('.detailInfo #filename');
        expect(fileDetailName.isDisplayed()).toBeTruthy();
        expect(fileDetailName.getText()).toEqual(fileName);
    });
    it('expect icon beside folder name', () => {
        const fileIcon = fileUtils.getElement('.detailInfo #filename i');
        expect(fileIcon.getAttribute('class')).toContain(fileUtils.getFileIcon(fileName, 'folder'));
    });
    it('expect close button', () => {
        const closeBtn = fileUtils.getElement('.detailInfo .closeBtn i');
        expect(closeBtn.isDisplayed()).toBeTruthy();
        expect(closeBtn.getAttribute('class')).toContain('fa-times');
    });
    it('it should expect label ["Type", "Location", "Size", "Created", "Modified"]', () => {
        const labelArray = ['Type:', 'Location:', 'Size:', 'Created:', 'Modified:'];
        labelArray.forEach((label, index) => {
            const allLabel = fileUtils.getAllElements('.detailInfo .detail-label h6').get(index);
            expect(allLabel.isDisplayed()).toBeTruthy();
            expect(allLabel.getText()).toEqual(label);
        });
    });
    it('expect folder details input ["folder", "My Drive", "10.00 KB", "date", "date"]', () => {
        const inputArray = ['Folder', 'My Drive', '--' , date , date];
        inputArray.forEach((input, index) => {
            const allInput = fileUtils.getAllElements('.detailInfo .detail-input h6').get(index);
            expect(allInput.isDisplayed()).toBeTruthy();
            expect(allInput.getText()).toEqual(input);
        });


    });

});
