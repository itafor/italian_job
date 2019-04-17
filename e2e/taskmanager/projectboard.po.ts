import { browser, promise, by, element, ElementFinder, Key } from 'protractor';

import utils from '../utils';


export enum TemplateFieldsDataAttr {
    Content = 'content'
  }

  export const createMailTemplate = {
    content: {
      safeValue: {
        single: '<p>Hello there!!! &nbsp; <i>Italic Content</i><br><strong>More rich content</strong></p>',
      },

      emptyValue: ''
    }
  };

export class ProjectBoard {
    static baseSelector = 'app-taskmanager-task';
    static projectsUrl = '/taskmanager/projects';
    static classSelectors = {
      buttonPrimary: '.btn.btn-primary'
    };
    static createBtn = {
      color: 'rgba(204, 204, 204, 1)',
      iconClass: '.fa.fa-plus-circle'
    };
    static modalPrimaryCTA = '.modal-footer button.btn';
    static projectCount = '.taskboard-wrapper .project-badge-count';
    static projectDetailsCard = {
      selector: 'div[data-role="project_details_card"]',
    };
    static toastrTimeout = 6000;
    navigateTo(link: string) {
        return browser.get(link);
    }
    getElement(selector: string) {
        return element(by.css(selector));
    }
    public getAllElements(selector: string) {
        return element.all(by.css(selector));
    }
    getLoadingState(ClassName) {
        return browser.driver.findElement(by.css(`.fa${ClassName}`));
    }
    getToastNotify(message, type) {
        // let toastrType = type;
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
    getSUbmitBtn() {
        const createbtn = this.getElement('.modal-footer button');
        return createbtn;
    }
    addSpace() {
        browser.actions().sendKeys(Key.SPACE).perform();
    }
    forceUpdate() {
        return browser.executeScript(
          `return document.querySelectorAll('editor[data-name="content"] button')[4].click()`);
      }
    getTemplateField(fieldDataAttr): ElementFinder {
    if (fieldDataAttr === TemplateFieldsDataAttr.Content) {
        return utils.getElement(`${ProjectBoard.baseSelector} editor[data-name=${fieldDataAttr}]  iframe`);
    }
    return utils.getElement(`${ProjectBoard.baseSelector} input[data-name=${fieldDataAttr}]`);
    }
    fillTemplateField(fieldDataAttr: TemplateFieldsDataAttr, value: string): promise.Promise<void> {
    if (fieldDataAttr === TemplateFieldsDataAttr.Content) {
        return browser.executeScript(
        `return document.querySelector('editor[data-name="content"] iframe')
        .contentWindow.document.children[0].querySelector('body').innerHTML += `
        .concat(' " '  + value + ' " '  ));
    }
    return this.getTemplateField(fieldDataAttr).sendKeys(value);
    }
    toastrOfTypePresent(type: ToastrTypes): promise.Promise<boolean> {
        return utils.getElement(`div ${type}`).isDisplayed();
      }

  get createProjectButton(): ElementFinder {
    return utils.getElement('button#addproject');
  }

  async assertProjectDetails(card: ElementFinder) {
    const styles = ['background-color', 'width', 'height', 'color', 'text-transform'];
    const expectedStyles = ['rgba(2, 160, 36, 1)', '40px', '40px', 'rgba(255, 255, 255, 1)', 'capitalize'];
    const initials = card.$('span[role="initials"]');
    Promise.all([
      initials.isDisplayed(), initials.getText()
    ]).then(res => {
      expect(res[0]).toBeTruthy();
      expect(res[1].length).toBe(2);
    });

    Promise.all(styles.map(style => initials.getCssValue(style))).then(styleTests => expect(styleTests).toEqual(expectedStyles));

    const cardAndParagraph = [ card.$('.project-created-time').$('small'), card.$('.project-created-time').$('p') ]
      .map(visualItem => Promise.all([ visualItem.isPresent(), visualItem.isDisplayed(), visualItem.getText()]) );
    cardAndParagraph[0].then(small => {
      expect(small).toEqual([true, true, 'Created']);
    });
    cardAndParagraph[1].then(p => {
      expect(p[0]).toEqual(true);
      expect(p[1]).toEqual(true);
      expect(p[2].split(',').length).toEqual(3);
    });
  }

  getDropdownCtaForElem(elem: ElementFinder): ElementFinder {
    return elem.$('span.dropdown > button[type="button"]');
  }

  assertDropdownOpenForElem(elem: ElementFinder) {
    const dOpen = elem.$('span.dropdown-menu');
    Promise.all([  dOpen.isPresent(), dOpen.isDisplayed() ]).then(r => expect(r).toEqual([true, true]));
  }

  dropdownMenu(elem: ElementFinder) {
    return elem.$('.dropdown-menu.show');
  }

  dropdownMenus(elem: ElementFinder) {
    return elem.all(by.css('button.dropdown-item[type="button"]'));
  }
}

export enum ToastrTypes {
    INFO = '.toastr-info',
    ERROR = '.toastr-error',
    SUCCESS = '.toastr-success'
  }
