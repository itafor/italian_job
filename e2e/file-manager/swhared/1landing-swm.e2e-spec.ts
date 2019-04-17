
// import utils from '../../utils';
// import { FileUtils } from '../file-manager-utils';

// describe('Shared With Me Landing Page', () => {
//   let fileUtils: FileUtils;
//   beforeAll(() => {
//     fileUtils = new FileUtils();
//     utils.navigateTo('/filemanager/sharedwithme');
//   });
//   it('should expect page name on header to be "Shared With Me" ', () => {
//     expect(fileUtils.getElement('app-header span.navbar-heading').getText()).toEqual('Shared With Me');
//   });
//   it('expect heading on page "Shared With Me"', () => {
//     fileUtils.getPageHeading('Shared With Me');
//   });
//   it('should expect search input field and search icon', () => {
//     fileUtils.getSearchBar();
//   });
//   it('should expect file icon and  "No File Found" text '  , () => {
//     fileUtils.getEmptyState('#noFiles', 'fa-file', 'No File Found', null);
//   });
//   it('should expect "File Menu"  text on sidebar '  , () => {
//     const filemenuText = fileUtils.getElement('.sidebar-x span.list-group-item ');
//     expect(filemenuText.getText()).toEqual('FILE MENU');
//   });
// });
