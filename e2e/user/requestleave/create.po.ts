import { browser, by, element, ElementFinder, promise, Locator } from 'protractor';

export class Create {

    navigateTo(link: string) {
        return browser.get(link);
    }

    leaveList() {
        return element(by.css('h5#no-leaves-id')).getText();
    }

    getElement(selector: string) {
        return element(by.css(selector));
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

    getCalendar(selector: string) {
        return element.all(by.css(selector));
    }

    closeTab() {
        return element(by.css('.indicate--danger')).click();
    }


}

