import { browser, by, element } from 'protractor';

export class Employee {

    navigateTo(link: string) {
        return browser.get(link);
    }

    employeeList() {
        return element(by.css('h5#no-employee-id')).getText();
    }

    getInitialTab(id: string) {
        return element(by.css(`a#${id}`)).getText();
    }


    getButtonIcon() {
        return element(by.css('button#createEmployeeButton'));
    }


    getElement(selector: string) {
        return element(by.css(selector));
    }


    getViewEmployee(id: string) {
        return element(by.css(`${id}`)).click();

    }
    getLoadingState() {
        return browser.driver.findElement(by.css('.fa.fa-spin.fa-spinner'));
    }

    displayFormHeader(id: string) {
        return element(by.css(`${id}`));
    }

    getLabelTitle() {
        return element.all(by.css('.col-form-label')).getText();
    }

    getInputEditField(id: string) {
        return element(by.css(`#edit-employee-${id}`));
    }

    submit() {
        return this.getButton().click();
    }

    getButton() {
        return element(by.css('#createBtn'));
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

    employeeUpdateAccBtn(id: string) {
        return element(by.css(`#${id}`));
    }


    toasterSuccess() {
        return element(by.css('div .toastr-success')).getText();
    }

    actionIconSuspend() {
        return element.all(by.css('#suspend-employee')).get(0);
    }

    actionIconUnsuspend() {
        return element.all(by.css('#unsuspend-employee')).get(0);
    }

    actionIconDelete() {
        return element.all(by.css('#delete-employee')).get(0);
    }

    uploadEmployeePassport() {
        return element(by.css('#passportupload'));
    }

    viewControlEditButton() {
        return element(by.css('#view-control-edit-info'));
    }
}

