
import { browser } from 'protractor';
import utils from '../../utils';
import { FileUtils } from '../file-manager-utils';
const path = require('path');

describe('Upload File In Sub Folder', () => {
    let fileUtils: FileUtils;
    const fileName = 'img.jpg';
    const arrayBtn = [{name: 'Upload File', bgColor: 'bg-teal', icon: 'fa-cloud-upload-alt'}];
    const actionBtns = ['Preview', 'Rename', 'Share', 'Download', 'Delete', 'Detail'];
    let date;
    beforeAll(() => {
        fileUtils = new FileUtils();
        date = fileUtils.getDate();

    });
    it('it should expect icon to upload file', () => {
        fileUtils.getSideBarActionBtn(arrayBtn);
    });
    it('should upload a file ', () => {
        const fileUpload = fileUtils.getFileUpload();
        const absolutePath = path.resolve(__dirname, `./files/${fileName}`);
        fileUpload.sendKeys(absolutePath);
    });
    it('it should display success message', () => {
        browser.sleep(2000);
        fileUtils.getToastNotify('file uploaded', 'success');
    });
    it('it display table header ["Name", "Last Modified", "Sharing", "Size", "Action" ]', () => {
        fileUtils.getTableHeaderDetail();
    });
    it('expect new file uploaded with dropdown icon', () => {
        const fileArray = [{name: 'img.jpg', date: date, sharing: 'PRIVATE', size: '10.00 KB'}];
        fileUtils.getDriveDetail(fileArray, actionBtns, 'file');
    });

});
