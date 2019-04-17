

import { browser } from 'protractor';
import utils from '../../utils';
import { FileUtils } from '../file-manager-utils';
const path = require('path');

describe('Mutiple File Upload', () => {
    let fileUtils: FileUtils;
    const fileName = 'img.jpg';
    const fileName2 = 'text.txt';
    const arrayBtn = [{name: 'Upload File', bgColor: 'bg-teal', icon: 'fa-cloud-upload-alt'}];
    const actionBtns = ['Preview', 'Rename', 'Share', 'Download', 'Delete'];
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
        const secondFile = path.resolve(__dirname, `./files/${fileName2}`);
        fileUpload.sendKeys(`${absolutePath}\n${secondFile}`);
    });
    it('it should display success message', () => {
        fileUtils.getToastNotify('file uploaded', 'success');
    });
    it('it display table header ["Name", "Last Modified", "Sharing", "Size", "Action" ]', () => {
        fileUtils.getTableHeaderDetail();
    });
    it('expect new file created with dropdown icons', () => {
        const fileArray = [
            {name: fileName2, date: date, sharing: 'PRIVATE', size: '10.00 KB'},
            {name: fileName, date: date, sharing: 'PRIVATE', size: '1.13 KB'},
        ];
        fileUtils.getDriveDetail(fileArray, actionBtns, 'file');
    });

});
