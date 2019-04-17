import { browser, by, element } from 'protractor';

export class ProjectRole {

    navigateTo(link: string) {
        return browser.get(link);
    }
    getElement(selector: string) {
        return element(by.css(selector));
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