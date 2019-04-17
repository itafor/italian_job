import { browser, by, element } from 'protractor';
export class Department {
    navigateTo(link: string) {
        return browser.get(link);
    }
    deptList() {
        return element(by.css('h5#no-dept-id')).getText();
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
        return element(by.css('button#createDepartmentButton'));
    }

    toasterSuccess() {
        return element(by.css('div .toastr-success')).getText();
    }

    getElement(selector: string) {
        return element(by.css(selector));
    }

    displayFormHeader(id: string) {
        return element(by.css(`${id}`));
    }

    getTableHeader() {
        return element.all(by.css('.datatable-header-cell-label')).getText();
    }

    getTableBody() {
        return element.all(by.css('.datatable-body-cell.sort-active')).getText();
    }

    errorAlert() {
        return element(by.css('div .alert-danger')).getText();
    }
    closeTab() {
        return element(by.css('.indicate--danger')).click();
    }
    getActionToolTip(selector, text) {
        const elementSelector = this.getElement(selector);
        browser.actions().mouseMove(elementSelector).perform();
        browser.sleep(1000);
        expect(element(by.css(selector)).getAttribute('ngbTooltip')).toEqual(text);

    }


}