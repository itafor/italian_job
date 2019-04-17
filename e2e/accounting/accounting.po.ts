import { browser, by, element, Key } from 'protractor';

export class Accounting {
  navigateTo(link: string) {
    return browser.get(link);
  }

  getRandomAccNumber(length) {
    return Math.floor(
      Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1)
    );
  }
  getElement(selector: string) {
    return element(by.css(selector));
  }
  getTab(selector: string) {
    return element(by.css(selector)).getText();
  }
  selectdropdown() {
    return browser
      .actions()
      .sendKeys(Key.ARROW_DOWN)
      .perform()
      .then(() => {
        browser
          .actions()
          .sendKeys(Key.ENTER)
          .perform();
      });
  }
  getElementLabel(id: string) {
    return element(by.css(`#${id}`)).getText();
  }
  getInitialTab(id: string) {
    return element(by.css(`a#${id}`)).getText();
  }
  getEmptyListAttr(iconclass, noteid, notetext) {
    expect(this.getElement(iconclass).isDisplayed()).toBeTruthy();
    expect(this.getElement(`#${noteid}`).getText()).toEqual(notetext);
  }
  getClickButton(btnid) {
    this.getElement(`#${btnid}`).click();
  }
  getFirstButton(btnid) {
    this.getAllElements(`#${btnid}`)
      .get(0)
      .click();
  }
  getRandomText() {
    return Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, '')
      .substr(0, 9);
  }
  getRandomPhone(length) {
    return Math.floor(
      Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1)
    );
  }
  getLoadingState() {
    return browser.driver.findElement(by.css('.fa.fa-spinner.fa-spin'));
  }
  toasterNotify(selector: string) {
    return element(by.css(`div .toastr-${selector}`)).getText();
  }

  toasterSuccess(selector: string) {
    return element(by.css(selector)).getText();
  }
  getLabelTitle() {
    return element.all(by.css('.datatable-header-cell-label')).getText();
  }
  getActionToolTip(selector, text) {
    expect(this.getElement(selector).isDisplayed()).toBeTruthy();
    const elementSelector = this.getElement(selector);
    browser
      .actions()
      .mouseMove(elementSelector)
      .perform();
    expect(element(by.css(selector)).getAttribute('ngbTooltip')).toEqual(text);
  }
  getTableBody() {
    return element.all(by.css('.datatable-body-cell.sort-active')).getText();
  }
  getAlertInfoAndAccept(info) {
    browser.driver
      .switchTo()
      .alert()
      .then(function(alert) {
        expect(alert.getText()).toEqual(info);
        alert.accept();
      });
  }
  getActionToolTipVendor(selector) {
    browser
      .actions()
      .mouseMove(selector)
      .perform();
  }
  getActionButton(btnid, btnclass, iconclass, text) {
    expect(this.getElement(`${btnid}`).getText()).toEqual(text);
    expect(this.getElement(`${btnid}${btnclass}`).isDisplayed()).toBeTruthy();
    if (iconclass) {
      expect(this.getElement(`${iconclass}`).isDisplayed()).toBeTruthy();
    }
  }

  displayFormHeader(selector: string) {
    return element(by.css(selector)).getText();
  }
  displayFulHeader(selector: string) {
    return element.all(by.css(selector)).getText();
  }
  getButton(selector: string) {
    return element(by.css(selector));
  }

  getInputField(id: string) {
    return element(by.css(`#create-vendor-${id}`));
  }
  getElementByClass(id: string) {
    return element(by.className(id));
  }
  getSaleInputField(id: string) {
    return element(by.css(`${id}`));
  }

  getInvoiceInputField(id: string) {
    return element(by.css(`${id}`));
  }
  updateSaleInputField(id: string) {
    return element(by.css(`#${id}`));
  }
  getLabels(id: string) {
    return element(by.css(`#label-${id}`));
  }
  paymentTypeOption(id: string) {
    return element(by.css(`#Checkbox-${id}`));
  }
  selectDropDownValue(id: string) {
    return element(by.cssContainingText('option', `${id}`)).click();
  }
  getCustomerInputField(id: string) {
    return element(by.css(`#create-customer-${id}`));
  }

  getExpCatInputField(id: string) {
    return element(by.css(`#create-expCat-${id}`));
  }
  getIncomeCatInputField(id: string) {
    return element(by.css(`#create-income-${id}`));
  }
  getBankInput(id: string) {
    return element(by.css(`#bank-${id}`));
  }
  disabledButton(selector) {
    return element(by.css(selector));
  }

  uploadLoadFile(id: string) {
    return element(by.css(`${id}`));
  }

  getAllElements(selector: string) {
    return element.all(by.css(selector));
  }
  getText(selector: string) {
    return element(by.css(selector)).getText();
  }
}
