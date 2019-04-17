import { browser, by, element, Key } from 'protractor';
import utils from '../utils';
const path = require('path');
const allOnoverShowBtnFile = [
  {name: 'Open', icon: 'fa-external-link-alt', bgColor: 'btn-primary'},
  {name: 'Share', icon: 'fa-share', bgColor: 'btn-info'},
  {name: 'Download', icon: 'fa-download', bgColor: 'btn-secondary'},
  {name: 'More', icon: 'fa-download', bgColor: 'dropdown-toggle'},
  {name: 'Rename', icon: 'fa-pencil-square', bgColor: 'dropdown-item'},
 ];
 const deleteModalBtns = [{name: 'Cancel', bgColor: 'btn-secondary'}, {name: 'Yes', bgColor: 'btn-danger'}];
const tableHeaders = ['Name', 'Last Modified', 'Sharing', 'Size', 'Actions' ];
const SharedWithMetableHeaders = ['Name', 'Shared Date', 'Size', 'Actions' ];
const mainSection = '#home .main';
export class FileUtils {

  navigateTo(link: string) {
    return browser.get(link);
  }
  getAllElements(selector: string) {
    return element.all(by.css(selector));
  }
  getText(selector: string) {
    return element(by.css(selector)).getText();
  }
  getElement(selector: string) {
    return element(by.css(selector));
  }
  getDate() {
    const newDate = new Date().getDate();
    const newYear = new Date().getFullYear();
    let newMonth: any = new Date().getUTCMonth();
    let date;
    const monthArray = this.getShortMonthName();
    newMonth = monthArray[newMonth];
    date = `${newMonth} ${newDate}, ${newYear}`;
    return date;
  }
  getPageHeading(text) {
    const header = this.getElement(`${mainSection} #heading`);
    expect(header.isDisplayed()).toBeTruthy();
    expect(header.getText()).toEqual(text);
    expect(header.getTagName()).toEqual('h1');
    expect(header.getAttribute('class')).toContain('display-3');
  }
  getSearchBar() {
    const searchBar = this.getElement(`${mainSection}  form input`);
    const searchBarIcon = this.getElement(`${mainSection} form i`);
    expect(searchBar.isDisplayed()).toBeTruthy();
    expect(searchBar.getAttribute('type')).toEqual('search');
    expect(searchBar.getAttribute('class')).toEqual('bg-none form-control');
    expect(searchBar.getAttribute('placeholder')).toEqual('Search My Files');
    expect(searchBarIcon.isDisplayed()).toBeTruthy();
    expect(searchBarIcon.getAttribute('class')).toContain('fas fa-search form-control-feedback');
  }
  getSideBarNav(arryNav) {
    arryNav.forEach((item, index) => {
      const nav = this.getAllElements('.sidebar .list-group a').get(index);
      const navIcon = this.getAllElements('.sidebar .list-group i').get(index);
      expect(nav.getText()).toEqual(item.name);
      expect(navIcon.getAttribute('class')).toContain(item.icon);
      if (item.active) {
        expect(nav.getAttribute('class')).toContain('active');
      }
    });
  }
  getEmptyState(id, icon,  span, paragraph?) {
    const iconTag = this.getElement(`${id} i`);
    const spanTag = this.getElement(`${id} .d-block span`);
    expect(iconTag.getAttribute('class')).toContain(`fas ${icon} fa-8x text-secondary mb-3`);
    if (span) {
      expect(spanTag.getText()).toEqual(span);
    }
    if (paragraph) {
      const paragraphTag = this.getElement(`${id} .d-block p`);
      expect(paragraphTag.getText()).toEqual(paragraph);
    }
  }
  getSideBarActionBtn(arrayBtn) {
    const btnSection =  '.sidebar .action-buttons';
    arrayBtn.forEach((item, index) => {
      const btnLabel = this.getAllElements(`${btnSection} .btn`).get(index);
      const btnIcon = this.getAllElements(`${btnSection} i`);
      expect(btnIcon.getAttribute('class')).toContain(`fas ${item.icon} position-left-10`);
      expect(btnLabel.getText()).toContain(item.name);
      expect(btnLabel.getAttribute('class')).toContain(item.bgColor);
    });
  }
  getFileUpload() {
    const fileUpload = this.getElement('input[name=fileToBeupload]');
    expect(fileUpload.getAttribute('type')).toEqual('file');
    return fileUpload;
  }
  getTableHeaderDetail() {
    tableHeaders.forEach((item, index) => {
      const tableHead = this.getAllElements('table tr th').get(index);
      expect(tableHead.getText()).toEqual(item);
    });
    const tableHead = this.getAllElements('table tr th').get(0);
    expect(tableHead.getText()).toEqual('Name');
  }
  getTableHeaderDetailInSharedWithMe() {
    SharedWithMetableHeaders.forEach((item, index) => {
      const tableHead = this.getAllElements('table tr th').get(index);
      expect(tableHead.getText()).toEqual(item);
    });
    const tableHead = this.getAllElements('table tr th').get(0);
    expect(tableHead.getText()).toEqual('Name');
  }
  getDriveDetail(array, btn, type, link?) {
    const tableRow = 'table tbody tr';
    array.forEach((item, index) => {
      const name = this.getAllElements(`${tableRow} td.name`).get(index);
      const icon = this.getAllElements(`${tableRow} td.name i`).get(index);
      const date = this.getAllElements(`${tableRow} td.date`).get(index);
      const sharing = this.getAllElements(`${tableRow} td.sharing span.badge`).get(index);
      if (!link) {
        if (sharing) {
          expect(sharing.getText()).toEqual(item.sharing);
          let bgColor = 'badge-primary';
          if (item.sharing === 'PUBLIC') {
            bgColor = 'badge-success';
          }
          expect(sharing.getAttribute('class')).toContain(bgColor);
        }
      }
      expect(name.getText()).toEqual(item.name);
      expect(icon.getAttribute('class')).toContain(this.getFileIcon(item.name, type));
      expect(date.getText()).toEqual(item.date);
    });
    this.getTableDataAction(btn);
  }
  getTableDataAction(btn) {
    const tableRow = 'table tbody tr';
    const option = this.getAllElements(`${tableRow} td.actions div.dropdown button`).get(0);
    option.click();
    btn.forEach((item, index) => {
      const actionBtn = this.getAllElements(`${tableRow} td.actions .dropdown-item`).get(index);
      expect(actionBtn.getText()).toEqual(item);
    });
  }
  getModalToOpen(selector, text?) {
    const tableRow = 'table tbody tr';
    const option = this.getAllElements(`${tableRow} td.actions div.dropdown button`).get(0);
    option.click().then(() => {
        const actionBtn = this.getAllElements(`${tableRow} td.actions ${selector}`).get(0);
        expect(actionBtn.isDisplayed()).toBeTruthy();
        if (text) {
          expect(actionBtn.getText()).toEqual(text);
        }
        actionBtn.click();
    });
    // const optionBtn = this.getAllElements('.actions .dropdown').get(0);
    // optionBtn.click();
    // const selected = this.getAllElements(`.dropdown-menu ${selector}`).get(0);
    // if (text) {
    //   expect(selected.getText()).toEqual(text);
    // }
    // selected.click();
  }
  getTopActionIconAttribute(iconClass, iconColor, iconSize) {
    expect(this.getElement(`.icon.fas${iconClass}`).isDisplayed()).toBeTruthy();
    expect(this.getElement(iconClass).getCssValue('color')).toEqual(iconColor);
    expect(this.getElement(iconClass).getCssValue('font-size')).toEqual(iconSize);
  }
  getFileMangerHeader() {
    return element(by.css('app-header span.navbar-heading')).getText();
  }
  getLoader() {
    return element(by.css('#loadingfileFolder')).getAttribute('alt');
  }
  getSectionHeading(headerId, text) {
    expect(element(by.css(headerId)).getTagName()).toEqual('h5');
    expect(element(by.css(headerId)).getText()).toEqual(text);
    expect(element(by.css(headerId)).getCssValue('color')).toEqual('rgba(0, 0, 0, 0.87)');
  }
  getSectionEmptyState(typeClass, className , noTitleId, text, btnText) {
    expect(element(by.css(`.fa${className}.fa-7x.text-secondary`)).isPresent()).toBeTruthy();
    expect(element(by.css(`.${typeClass} ${noTitleId}`)).getText()).toEqual(text);
    expect(element(by.css(`.${typeClass} button`)).getText()).toEqual(btnText);
    expect(element(by.css(`${typeClass}list`)).isPresent()).toBeFalsy();
  }
  getHoverToolTip(selector, text) {
   const elementSelector =  this.getElement(selector);
   browser.actions().mouseMove(selector).perform();
   browser.sleep(2000);
   expect(selector.getAttribute('ngbTooltip')).toEqual(text);
  }
  getModalOpen(selector) {
    const selected = this.getAllElements(selector).get(0);
    selected.click();
    expect(element(by.className('close')).getAttribute('aria-label')).toEqual('Close');
  }
  getModalDismissed() {
    const modal = this.getElement('.close');
    expect(modal.isPresent()).toBeFalsy();
  }
  getModalHeader(text) {
    expect(element(by.className('modal-title')).getText()).toEqual(text);
  }
  getModalCloseBtn() {
    expect(element(by.className('close')).getAttribute('aria-label')).toEqual('Close');
    expect(this.getElement('button span').getAttribute('aria-hidden')).toEqual('true');
  }
  getModalInputField(inputName) {
    const field = this.getElement(`input[name=${inputName}]`);
    expect(field.isDisplayed()).toBeTruthy();
  }
  getInputField(inputName) {
    return this.getElement(`input[name=${inputName}]`);
  }
  getInputFieldType(inputType) {
    const field = this.getAllElements('.input-group input').get(0);
    expect(field.getAttribute('type')).toEqual(inputType);
  }
  getSUbmitBtn() {
    const btn = this.getElement('.modal-footer button[type=submit]');
    return btn;
  }
  getActBtn() {
    const btn = this.getElement('.modal-footer button[type=button]');
    return btn;
  }
  getLoadingState(selector: string) {
   return browser.driver.findElement(by.css(selector));
  }
  getToastNotify(message, type) {
    const toastr = this.getElement(`div#toastr-container .toastr-${type}`);
    if (type === 'success') {
      expect(toastr.getCssValue('background-color')).toEqual('rgba(81, 163, 81, 1)');
    }
    if (type === 'error') {
      expect(toastr.getCssValue('background-color')).toEqual('rgba(217, 83, 79, 1)');
    }
    expect(toastr.getCssValue('color')).toEqual('rgba(255, 255, 255, 1)');
    expect(toastr.getText()).toContain(message);
  }
  getTableHeader(tableheads: string[], type: string) {
    const table = `table.${type}-table`;
    const tableHead = `${table} thead`;
    const arr = tableheads;
    arr.forEach((item, index) => {
      const firstTableRow = this.getAllElements(`${tableHead} tr th`).get(index);
      expect(firstTableRow.getText()).toEqual(item);
    });
  }
  getEmail() {
    let user;
    utils.LocalStorageInterface('getItem', 'currentUser').then(value => {
      user = value;
    });
    return user;
  }
  getFilePath(filePath) {
    const absolutePath = path.resolve(__dirname, filePath);
    return absolutePath;
  }
  getShortMonthName() {
    const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return month;
  }
  getTableInfoData(sectionType, data, icon , arrays, type) {
    const tableData = sectionType + ' tbody .table-row td';
    const newDataIcon =  this.getAllElements(`${tableData} span i${icon}`).get(0);
    const fileSize = this.getAllElements(`${tableData} span p`).get(2);
    if (type === 'file') {
      expect(fileSize.isDisplayed()).toBeTruthy();
    }
    data.forEach((item, index) => {
      const newDataParagraph =  this.getAllElements(`${tableData} span p`).get(index);
      const newdata =  this.getAllElements(tableData).get(index);
      expect(newdata.isDisplayed()).toBeTruthy();
      expect(newDataParagraph.getText()).toEqual(item);
      expect(newDataIcon.isDisplayed()).toBeTruthy();
    });
    this.getAllReusableBtn(arrays, type);
  }


  getTableInfoDataMultiple(sectionType, data,  icon , arrays, type) {
    const tableData = sectionType + ' tbody .table-row';
    let files;
    let item;
    for (let index = 0; index < 2; index++) {
      files = this.getAllElements(`${tableData}`).get(index);
    }
    for (let index = 0; index < data.length; index++) {
      item = data[index];
    }
    files.getText().then(value => console.log(value));
    console.log(item);
  }
  getAllReusableBtn(arrays, type) {
    const hoveronBtn = '.hide-on-hover';
    const show = this.getElement(`.${type}-table ${hoveronBtn}`);
    browser.actions().mouseMove(show).perform();
    arrays.forEach((item, index) => {
      const hideBtn = this.getAllElements(`.${type}-table ${hoveronBtn} button`).get(index);
      const hideBtnIcon = this.getAllElements(`.${type}-table ${hoveronBtn} button  i`).get(index);
      expect(hideBtn.isDisplayed()).toBeTruthy();
      expect(hideBtn.getText()).toEqual(item.name);
      expect(hideBtn.getAttribute('class')).toContain(item.bgColor);
      if (index <= 2 && item.name !== 'More') {
        expect(hideBtnIcon.getAttribute('class')).toContain(item.icon);
      } else if (item.name === 'More') {
        hideBtn.click();
      } else  {
        const subIconBtn = this.getAllElements(`.${type}-table ${hoveronBtn} button i`).get(index - 1);
        expect(subIconBtn.getAttribute('class')).toContain(item.icon);
      }
    });
  }
  getSubFolderEmptyState() {
    const emptySubFolderIcon = 'fa-folder-minus';
    const emptySubFolder = this.getAllElements('div.row .col-12 i').get(0);
    const emptySubFolderHeader = this.getAllElements('div.row .col-12 h6').get(0);
    expect(emptySubFolder.isDisplayed()).toBeTruthy();
    expect(emptySubFolder.getAttribute('class')).toContain(emptySubFolderIcon);
    expect(emptySubFolder.getAttribute('class')).toContain('text-secondary');
    expect(emptySubFolderHeader.getText()).toEqual('folder is empty');
    const array = [{name: 'upload file', icon: 'fa-upload'},
                  {name: 'create folder', icon: 'fa-folder-plus'}];
    array.forEach((item, index) => {
      const emptyBtn = this.getAllElements('div.row .col-12 button').get(index);
      const emptyBtnIcon = this.getAllElements('div.row .col-12 button i').get(index);
      expect(emptyBtn.getText()).toEqual(item.name);
      expect(emptyBtnIcon.getAttribute('class')).toContain(item.icon);
      expect(emptyBtn.getAttribute('class')).toContain('btn-link');
    });
  }

  getNavbarInSubFolder(navbarSelector, navbarArray: any[]) {
    const navbar = this.getElement(navbarSelector);
    const childNavbar = this.getElement(`${navbarSelector} ol.breadcrumb`);
    const defaultIcon = this.getAllElements(`${navbarSelector} .breadcrumb-item i`).get(0);

    const driveText = this.getAllElements(`${navbarSelector} .breadcrumb-item a`).get(0);

    expect(navbar.getAttribute('class')).toContain('bredcum');
    expect(childNavbar.isDisplayed()).toBeTruthy();
    expect(defaultIcon.isDisplayed()).toBeTruthy();
    expect(defaultIcon.getAttribute('class')).toContain('fa-hdd-o');

    navbarArray.forEach((item, index) => {
      const navbarItem = this.getAllElements(`${navbarSelector} .breadcrumb-item a`).get(index);
      expect(navbarItem.isDisplayed()).toBeTruthy();
    });
  }
  getFileIcon(fileName, type) {
    if (type === 'folder') {
      return 'fa-folder';
    }
    let fileIcon = 'fa-file-alt';
    const ext = fileName.slice(-3);
    if (ext === 'pdf') {
      fileIcon = 'fa-file-pdf-o';
    } else if (ext === 'jpg') {
      fileIcon = 'fa-image';
    } else if (ext === 'rtf') {
      fileIcon = 'fa-file-word-o';
    } else if (ext === 'lsx') {
      fileIcon = 'fa-file-excel-o';
    }
    return fileIcon;
  }
  getShareRadioBtn() {
    const radioBtn = [
      {name : 'private', icon: 'fa-edit', id: '#privateShare'},
      {name : 'public', icon: 'fa-eye', id: '#publicShare'}
    ];
    radioBtn.forEach(item => {
      const radioBtnItem = this.getElement(`input[value=${item.name}]`);
      const radioLabelItem = this.getElement(`${item.id} label`);
      const iconItem = this.getElement(`${item.id} i`);
      expect(radioBtnItem.isDisplayed()).toBeTruthy();
      expect(radioBtnItem.getAttribute('type')).toEqual('radio');
      expect(radioLabelItem.getText()).toEqual(item.name);
      expect(iconItem.getAttribute('class')).toContain(item.icon);
    });
  }
  getShareEmailInputField() {
    const inputField =  this.getElement('input[name=shareEmail]');
    expect(inputField.getAttribute('class')).toContain('form-control');
    expect(inputField.getAttribute('required')).toEqual('true');
  }
  getShareEmailInputError() {
    const inputField =  this.getElement('input[name=shareEmail]');
    const error = this.getElement('div.text-danger span');
    inputField.sendKeys('notemail');
    browser.actions().sendKeys(Key.ENTER).perform();
    expect(error.getText()).toContain('invalid email');
    expect(error.getCssValue('color')).toContain('rgba(206, 73, 70, 1)');
  }
  getshareEmailAddBtn() {
    const addMail = this.getElement('#addToPublicList');
    const addMailIcon = this.getElement('#addToPublicList i');
    expect(addMail.isDisplayed()).toBeTruthy();
    expect(addMail.getAttribute('class')).toContain('btn-primary');
    expect(addMailIcon.getAttribute('class')).toContain('fa-plus');
  }
  getShareEmailComment() {
    const commentBox = this.getElement('textarea[name=comment]');
    expect(commentBox.isDisplayed()).toBeTruthy();
    expect(commentBox.getAttribute('placeholder')).toContain('Add a message (optional)');
    expect(commentBox.getAttribute('class')).toContain('form-control');
    commentBox.sendKeys('this is the file oo');
  }
  getDeleteModalBtn() {
      deleteModalBtns.forEach(item => {
        const btn = this.getElement(`.modal-footer button.${item.bgColor}`);
        expect(btn.isDisplayed()).toBeTruthy();
        expect(btn.getText()).toEqual(item.name);
        expect(btn.getAttribute('class')).toContain(item.bgColor);
    });
  }
  getDeleteModalText(fileName, directory) {
    const text = `Are you sure you want to delete\n${fileName}`;
    const textElemnt = this.getElement('.modal-body div');
    expect(textElemnt.getText()).toEqual(text);
  }
  getCreateFolderBtn() {
    const btn = this.getElement('#createNewFolderBtn');
    expect(btn.getText()).toEqual('New Folder');
    expect(btn.getAttribute('class')).toContain('bg-blue');
    expect(btn.getAttribute('type')).toContain('button');
    return btn;
  }

}
