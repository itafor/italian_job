import { browser, by, element } from 'protractor';

const btnprimary = '.btn-primary';
const btnCreateProject = {
    color:'rgba(204, 204, 204, 1)',
    Background: 'rgba(255, 255, 255, 1)'
}
const faviconclass = {
    color: 'rgba(2, 160, 36, 1)',
    iconClass: '.fa.fa-plus-circle'
}

export class ProjectSettings {

    navigateTo(link: string) {
        return browser.get(link);
    }


    getElement(selector: string) {
        return element(by.css(selector));
    }

    getActionButton(btnid, btnclass, iconclass, text) {
        expect(this.getElement(`${btnid}`).getText()).toEqual(text);
        expect(this.getElement(`${btnid}${btnclass}`).isDisplayed()).toBeTruthy();
        expect(this.getElement(`${btnid}${btnclass}`).getCssValue('color')).toEqual(btnCreateProject.color);
        expect(this.getElement(`${btnid}${btnclass}`).getCssValue('background-color')).toEqual(btnCreateProject.Background);
        expect(this.getElement(`${iconclass}`).isDisplayed()).toBeTruthy();
        expect(this.getElement(`${iconclass}`).getCssValue('color')).toEqual(faviconclass.color);
      
    }

    getActionButton_two(btnid, btnclass, iconclass, text) {
        expect(this.getElement(`${btnid}`).getText()).toEqual(text);
        expect(this.getElement(`${btnid}${btnclass}`).isDisplayed()).toBeTruthy();
        expect(this.getElement(`${iconclass}`).isDisplayed()).toBeTruthy();
    }


    ProjectDescriptionSubmitBtn(btnid, btnclass, text) {
        expect(this.getElement(`${btnid}`).getText()).toEqual(text);
        expect(this.getElement(`${btnid}${btnclass}`).isDisplayed()).toBeTruthy();
    }

    getPlusCircle(iconId, iconclass) {
        expect(this.getElement(`${iconId}`).isDisplayed()).toBeTruthy();
        expect(this.getElement(`${iconclass}`).isDisplayed()).toBeTruthy();
    }

    getActionToolTip(selector, text) {
        expect(this.getElement(selector).isDisplayed()).toBeTruthy();
        const elementSelector = this.getElement(selector);
        browser.actions().mouseMove(elementSelector).perform();
        expect(element(by.css(selector)).getAttribute('ngbTooltip')).toEqual(text);
    }



    toasterSuccess() {
        return element(by.css('div .toastr-success')).getText();
    }

}
