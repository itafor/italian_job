import { browser, by, element, Key } from 'protractor';

export class Event {

    navigateTo(link: string) {
        return browser.get(link);
    }

    employeeList() {
        return element(by.css('h5#no-employee-id')).getText();
    }


    getElement(selector: string) {
        return element(by.css(selector));
    }


    getTableHeader() {
        return element.all(by.css('.datatable-header-cell-label')).getText();
    }

    getTableBody() {
        return element.all(by.css('.datatable-body-cell.sort-active')).getText();
    }

    getActionToolTip(selector, text) {
        expect(this.getElement(selector).isDisplayed()).toBeTruthy();
        const elementSelector = this.getElement(selector);
        browser.actions().mouseMove(elementSelector).perform();
        expect(element(by.css(selector)).getAttribute('ngbTooltip')).toEqual(text);
    }

    getActionButton(btnid, btnclass, iconclass, text) {
        expect(this.getElement(`${btnid}`).getText()).toEqual(text);
        expect(this.getElement(`${btnid}${btnclass}`).isDisplayed()).toBeTruthy();
        expect(this.getElement(`${iconclass}`).isDisplayed()).toBeTruthy();
    }

    toasterSuccess() {
        return element(by.css('div .toastr-success')).getText();
    }


}

