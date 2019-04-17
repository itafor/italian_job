
import { browser } from 'protractor';
import { FileUtils } from '../file-manager-utils';
import utils from '../../utils';

describe('View and Dowload Files', () => {
    let fileUtils: FileUtils;
    const fileName = 'img.jpg';
    const closeViewFileBtn = '#closeViewFileModalBtn';

    beforeAll(() => {
        fileUtils = new FileUtils();
        utils.navigateTo('/filemanager/myfile');
    });
    it('it should open preview file modal', () => {
        browser.sleep(3000);
        fileUtils.getModalToOpen('#previewFile', 'Preview');
    });
    it('preview file modal should have a heading title', () => {
        fileUtils.getModalHeader(`${fileName}`);
    });
    it('preview file modal should have a close button', () => {
        fileUtils.getModalCloseBtn();
    });
    it('preview file modal should have preview button', () => {
        const downloadBtn = fileUtils.getElement('#downloadFileBtn');
        expect(downloadBtn.getText()).toEqual('Download');
    });

    it('download button should have class btn-dark', () => {
        const downloadBtn = fileUtils.getElement('#downloadFileBtn');
        expect(downloadBtn.getAttribute('class')).toContain('btn-dark');
    });
    it('should be able to close view file modal', () => {
        const closeModal = fileUtils.getElement(closeViewFileBtn);
        closeModal.click();
    });
    it('should close modal when close button is clicked', () => {
        const closeModal = fileUtils.getElement(closeViewFileBtn);
        expect(closeModal.isPresent()).toBeFalsy();
    });
    it('it should download a file ', () => {
        fileUtils.getModalToOpen('#previewFile', 'Preview');
        const downloadBtn = fileUtils.getElement('#downloadFileBtn');
        downloadBtn.click();
    });
});
