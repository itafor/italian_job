
// import { browser } from 'protractor';
// import utils from '../../utils';
// import { FileUtils } from '../file-manager-utils';
// const path = require('path');

// describe('View File And Download In Shared With Me', () => {
//     let fileUtils: FileUtils;
//     const fileName = 'text.txt';
//     const actionBtns = ['Preview', 'Download'];
//     const closeViewFileBtn = '#closeViewFileModalBtn';
//     let date;
//     beforeAll(() => {
//         fileUtils = new FileUtils();
//         utils.navigateTo('/filemanager/sharedwithme');
//         date = fileUtils.getDate();
//     });
//     it('it display table header ["Name", "Shared Date", "Size", "Actions"]', () => {
//         fileUtils.getTableHeaderDetailInSharedWithMe();
//     });
//     it('expect new file shared with dropdown icon', () => {
//         const fileArray = [{ name: fileName, date: date, sharing: 'PUBLIC', size: '10.00 KB' }];
//         fileUtils.getDriveDetail(fileArray, actionBtns, 'file', 'sharedwithme');
//     });
//     it('it should open preview file modal', () => {
//         browser.sleep(2000);
//         const selected = fileUtils.getAllElements(`.dropdown-menu #previewFile`).get(0);
//         selected.click();
//     });
//     it('preview file modal should have a heading title', () => {
//         fileUtils.getModalHeader(`${fileName}`);
//     });
//     it('preview file modal should have a close button', () => {
//         fileUtils.getModalCloseBtn();
//     });
//     it('preview file modal should have preview button', () => {
//         const downloadBtn = fileUtils.getElement('#downloadFileBtn');
//         expect(downloadBtn.getText()).toEqual('Download');
//     });
//     it('download button should have class btn-dark', () => {
//         const downloadBtn = fileUtils.getElement('#downloadFileBtn');
//         expect(downloadBtn.getAttribute('class')).toContain('btn-dark');
//     });
//     it('it should download a file ', () => {
//         const downloadBtn = fileUtils.getElement('#downloadFileBtn');
//         downloadBtn.click();
//     });

// });
