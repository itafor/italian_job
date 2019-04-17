import { browser } from 'protractor';

import utils from '../../utils';
import { FileUtils } from '../file-manager-utils';

describe('File Manager Landing Page', () => {
  let fileUtils: FileUtils;
  const arryNav = [{name: 'My Drive', icon: 'ion-ios-browsers-outline', active: true},
  {name: 'Shared With Me', icon: 'fa-user-friends', active: false}];
  const arrayBtn = [
    {name: 'Upload File', bgColor: 'bg-teal', icon: 'fa-cloud-upload-alt'},
    {name: 'New Folder', bgColor: 'bg-blue', icon: 'fa-plus'},
  ];
  beforeAll(() => {
    fileUtils = new FileUtils();
    utils.navigateTo('/?test');
    utils.handleAuth();
    utils.navigateTo('/filemanager/myfile');
  });
  it('should expect page name on header to be "File Manager" ', () => {
    browser.sleep(5000);
    expect(fileUtils.getElement('app-header span.navbar-heading').getText()).toEqual('File Manager');
  });
  it('expect heading on page "My Drive"', () => {
    fileUtils.getPageHeading('My Drive');
  });
  it('should expect search input field and search icon', () => {
    fileUtils.getSearchBar();
  });

  it('should expect file icon and  "No File Found" text '  , () => {
    fileUtils.getEmptyState('#noFiles', 'fa-file', 'No File Found', 'Use the "Upload File" button');
  });
  it('should expect upload file and create folder button with icons '  , () => {
    fileUtils.getSideBarActionBtn(arrayBtn);
  });
  it('should expect "File Menu"  text on sidebar '  , () => {
    const filemenuText = fileUtils.getElement('.sidebar .list-group span');
    expect(filemenuText.getText()).toEqual('FILE MENU');
  });
  it('should expect sidebar menu '  , () => {
    fileUtils.getSideBarNav(arryNav);
  });
});
