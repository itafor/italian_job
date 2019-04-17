import { browser, by, element } from 'protractor';

export class Role {

    navigateTo(link: string) {
        return browser.get(link);
    }


    roleList() {
        return element(by.css('h5#no-role-id')).getText();
    }

    getInitialTab(id: string) {
        return element(by.css(`a#${id}`)).getText();
    }

    getActionButton(btnid, btnclass, iconclass, text) {
        expect(this.getElement(`${btnid}`).getText()).toEqual(text);
        expect(this.getElement(`${btnid}${btnclass}`).isDisplayed()).toBeTruthy();
        expect(this.getElement(`${iconclass}`).isDisplayed()).toBeTruthy();
    }

    getButtonIcon() {
        return element(by.css('button#createRoleButton'));
    }

    toasterSuccess() {
        return element(by.css('div .toastr-success')).getText();
    }

    loaderDisplay() {
        return element(by.css('.fa fa-spinner fa-spin'));
    }

    getTableHeader() {
        return element.all(by.css('.datatable-header-cell-label')).getText();
    }

    getActionToolTip(selector, text) {
        const elementSelector = this.getElement(selector);
        browser.actions().mouseMove(elementSelector).perform();
        browser.sleep(2000);
        expect(element(by.css(selector)).getAttribute('ngbTooltip')).toEqual(text);
    }

    errorAlert() {
        return element(by.css('div .alert-danger')).getText();
    }

    closeTab() {
        return element(by.css('.indicate--danger')).click();
    }

    getElement(selector: string) {
        return element(by.css(selector));
    }


}
