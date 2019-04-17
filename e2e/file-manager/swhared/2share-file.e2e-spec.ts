
// import { browser, Key } from 'protractor';
// import utils from '../../utils';
// import { FileUtils } from '../file-manager-utils';

// describe('Share Another File', () => {
//   let fileUtils: FileUtils;
//   const fileName = 'text.txt';
//   let user;
//   beforeAll(() => {
//     fileUtils = new FileUtils();
//     utils.navigateTo('/filemanager/myfile');
//     utils.LocalStorageInterface('getItem', 'currentUser').then(value => {
//       user = value;
//     });
//   });
//   it('it should open share file modal', () => {
//       const moreOptionBtn = fileUtils.getAllElements('.actions .dropdown').get(1);
//       moreOptionBtn.click();
//       const shareBtn =  fileUtils.getAllElements('#share').get(0);
//       expect(shareBtn.getText()).toEqual('Share');
//       shareBtn.click();
//   });
//   it('share file modal should have a heading title', () => {
//     fileUtils.getModalHeader(`${fileName}`);
//   });
//   it('share file modal should have a close button', () => {
//     fileUtils.getModalCloseBtn();
//   });
//   it('share file modal should have share button', () => {
//     expect(fileUtils.getActBtn().getText()).toEqual('Share');
//   });
//   it('share file modal should have disabled share button by default', () => {
//     expect(fileUtils.getActBtn().getAttribute('disabled')).toEqual('true');
//   });

//   it('share  file modal should expect input field in  the share folder modal', () => {
//     fileUtils.getModalInputField('shareEmail');
//   });

//   it('error case for share to email input field', () => {
//    fileUtils.getShareEmailInputError();
//   });

//   it('error should disapper if input is type email', () => {
//     const inputField =  fileUtils.getElement('input[name=shareEmail]');
//     inputField.clear();
//     const email  =   JSON.parse(user).username;
//     inputField.sendKeys(email);
//     const invalidError = fileUtils.getElement('div.text-danger span');
//     browser.actions().sendKeys(Key.ENTER).perform();
//     expect(invalidError.isPresent()).toBeFalsy();
//   });
//   it('should add inputted email for  sharing', () => {
//     const oneMailAdded = fileUtils.getAllElements('button.emailBtn').get(0);
//     expect(oneMailAdded.isDisplayed()).toBeTruthy();
//   });
//   it('should be able to remove added email for public share', () => {
//     const removeEmail = fileUtils.getAllElements('#sharing #removeEmail').get(0);
//     removeEmail.click();
//   });
//   it('should expect comment textarea', () => {
//     fileUtils.getShareEmailComment();
//   });
//   it('should add an email for sharing', () => {
//     const inputField =  fileUtils.getElement('input[name=shareEmail]');
//     inputField.clear();
//     const email  =  JSON.parse(user).username;
//     inputField.sendKeys(email);
//     browser.actions().sendKeys(Key.ENTER).perform();
//   });

//   it('it should click share button to share file', () => {
//     const shareBtn = fileUtils.getActBtn();
//     shareBtn.click();
//   });
//   it('it should display success message', () => {
//     fileUtils.getToastNotify('file shared', 'success');
//   });
//   it('it should dismis modal if file is shared', () => {
//     fileUtils.getModalDismissed();
//   });

// });
