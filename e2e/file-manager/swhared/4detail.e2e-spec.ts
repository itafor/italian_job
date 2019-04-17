
// import { browser } from 'protractor';
// import { FileUtils } from '../file-manager-utils';
// import utils from '../../utils';

// describe('File Details In Shared With Me', () => {
//     let fileUtils: FileUtils;
//     const fileName = 'text.txt';
//     let date;

//     beforeAll(() => {
//         fileUtils = new FileUtils();
//         date = fileUtils.getDate();
//         utils.navigateTo('/filemanager/sharedwithme');
//     });
//     it('it should open file detail', () => {
//         const optionBtn = fileUtils.getAllElements('.actions .dropdown button').get(0);
//         optionBtn.click();
//         const selected = fileUtils.getAllElements(`.dropdown-menu #details`).get(0);
//         selected.click();
//     });
//     it('expect file name in detail view', () => {
//         const fileDetailName = fileUtils.getElement('.detailInfo #filename');
//         expect(fileDetailName.isDisplayed()).toBeTruthy();
//         expect(fileDetailName.getText()).toEqual(fileName);
//     });
//     it('expect icon beside file name', () => {
//         const fileIcon = fileUtils.getElement('.detailInfo #filename i');
//         expect(fileIcon.getAttribute('class')).toContain(fileUtils.getFileIcon(fileName, 'file'));
//     });
//     it('expect close button', () => {
//         const closeBtn = fileUtils.getElement('.detailInfo .closeBtn i');
//         expect(closeBtn.isDisplayed()).toBeTruthy();
//         expect(closeBtn.getAttribute('class')).toContain('fa-times');
//     });
//     it('it should expect label ["Type", "Location", "Size", "Created", "Modified"]', () => {
//         const labelArray = ['Type:', 'Location:', 'Size:', 'Created:', 'Modified:'];
//         labelArray.forEach((label, index) => {
//             const allLabel = fileUtils.getAllElements('.detailInfo .detail-label h6').get(index);
//             expect(allLabel.isDisplayed()).toBeTruthy();
//             expect(allLabel.getText()).toEqual(label);
//         });
//     });
//     it('expect file details input ["File", "Shared With Me", "10.00 KB", "date", "date"]', () => {
//         const inputArray = ['File', 'Shared With Me', '1.13 KB' , date , date];
//         inputArray.forEach((input, index) => {
//             const allInput = fileUtils.getAllElements('.detailInfo .detail-input h6').get(index);
//             expect(allInput.isDisplayed()).toBeTruthy();
//             expect(allInput.getText()).toEqual(input);
//         });


//     });

// });
