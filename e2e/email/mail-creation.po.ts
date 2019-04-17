import { Email as BaseEmailPageObject } from './email.po';
import utils from '../utils';
import { promise, ElementFinder, browser, ElementArrayFinder, element, by } from 'protractor';
const path = require('path');

export const files = {
  folder: 'files',
  names: [
    'abstract observations.txt',
    'The Simpliest Way to Create Pure JavaScript Tabs.pdf',
    'tenmb.mp3',
    'twentymb.mp4',
    'thirtymb.mp4'
  ]
};


export enum TemplateFieldsDataAttr {
  TO = 'recipients',
  CC = 'cc',
  BCC = 'bcc',
  Subject = 'subject',
  Content = 'content'
}
export class MailCreationPageObject extends BaseEmailPageObject {
  static baseSelector = 'app-create-email';
  static modalSelector = 'ngb-modal-window';
  static promptSelector = 'app-email-prompt';
  static rtEditorPlaceHolder = `<p><br data-mce-bogus="1"></p>`;
  static sendButtonSpinnerClass = '.fa.fa-spin.fa-spinner';
  static sendButtonSendIconClass  = '.icon.ion-android-send';
  static attachmentCTADataAttr = 'attachmentCTA';
  static attachmentContainerClass = 'attachment__container';
  static attachmentTotalSize = 'span[data-function="totalSize"]';
  static attachmentViewSwitch = 'span[data-function="switchView"]';
  static POPUP = {
    header: {
      text: 'File(s) too large',
      accessor: 'h5.modal-title'
    },
    icon: {
      text: '',
      accessor: 'span.box--shadow__wrap > i.fa.fa-cloud-upload'
    },
    body: {
      text: 'Attachments greater than 25MB cannot be attached to mails at this point.',
      accessor: 'div.modal-body > p.lead'
    },
    size: {
      text: '25MB',
      accessor: 'p.lead > strong'
    },
    closeButton: {
      text: 'Ok, got it!!!',
      accessor: 'div.modal-footer > button.btn.btn-primary'
    },
    closeIcon: {
      text: '×',
      accessor: 'span[data-dismiss="modal"].close'
    }
  };

  static ATTACHMENTDETAILS = {
    // selectors will be namespaced by containerClass
    description: {
      'class': 'my-2 d-flex justify-content-around',
      'selector': 'h3'
    },

    viewToggle: {
      'class': 'cursor__pointer hover__dark-bg text-muted',
      'selector': 'h3 span'
    }
  };
  amIOnCreateMailTab(): Promise<boolean> {
    return this.getTabContent().then(currActiveTab => currActiveTab.$(MailCreationPageObject.baseSelector).isPresent());
  }

  initMailCreation(): promise.Promise<void> {
    return utils.getElement('.card > button.btn.btn-primary').click();
  }

  getTemplateField(fieldDataAttr): ElementFinder {
    if (fieldDataAttr === TemplateFieldsDataAttr.Content) {
      return utils.getElement(`${MailCreationPageObject.baseSelector} editor[data-name=${fieldDataAttr}]  iframe`);
    }
    return utils.getElement(`${MailCreationPageObject.baseSelector} input[data-name=${fieldDataAttr}]`);
  }

  templateFieldExists(fieldDataAttr: TemplateFieldsDataAttr): promise.Promise<boolean> {
    return this.getTemplateField(fieldDataAttr).isPresent().then(present => present);
  }

  get sendButton(): ElementFinder {
    return utils.getElement( MailCreationPageObject.baseSelector + ' button.btn.btn-primary');
  }

  sendButtonAvailable(): promise.Promise<boolean> {
    return this.sendButton.isPresent();
  }

  sendButtonSendIconDisplayed(): promise.Promise<boolean> {
    return this.sendButton.$(MailCreationPageObject.sendButtonSendIconClass).isPresent();
  }

  sendButtonSpinnerDisplayed(): promise.Promise<boolean> {
    return this.sendButton.$(MailCreationPageObject.sendButtonSpinnerClass).isPresent();
  }

  sendButtonDisabled(): promise.Promise<boolean> {
    return this.sendButton.isEnabled().then(enabled => !enabled);
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

  valueOfTemplateField(field: TemplateFieldsDataAttr): promise.Promise<string> {
    if (field === TemplateFieldsDataAttr.Content) {
      return browser.executeScript(
        `return document.querySelector('editor[data-name="content"] iframe')
        .contentWindow.document.children[0].querySelector('body').innerHTML`,
         this.getTemplateField(field)).then((pureValue: string) => {
           return pureValue.replace(MailCreationPageObject.rtEditorPlaceHolder, '').trim();
         });
    }
    return this.getTemplateField(field).getAttribute('value');
  }

  clickSendButton(): promise.Promise<void> {
    return browser.executeScript(`return arguments[0].click()`, this.sendButton);
  }

  clickSomewhereElseOnPage(): promise.Promise<void> {
    return utils.getElement(MailCreationPageObject.baseSelector + ' div.card-footer  span:last-child').click();
  }

  getTabHeaderOfActiveTab(): Promise<string> {
    return this.getTabContent().then(activeTab => {
      return activeTab.getAttribute('id').then(idOfActiveTab => idOfActiveTab.replace('-panel', ''));
    });
  }

  forceUpdate() {
    return browser.executeScript(
      `return document.querySelectorAll('editor[data-name="content"] button')[4].click()`);
  }

  toastrOfTypePresent(type: ToastrTypes): promise.Promise<boolean> {
    return utils.getElement(`div ${type}`).isDisplayed();
  }

  get allFileInputs(): promise.Promise<ElementArrayFinder> {
    return utils.getElements('input[type="file"]');
  }

  get fileURLs(): string[] {
    return files.names.map(filename => {
      return (path.resolve(__dirname, `${files.folder}/${filename}`) as string);
    });
  }

  get attachmentsDetailsContainer() {
    return utils.getElement(MailCreationPageObject.baseSelector + ' .' + MailCreationPageObject.attachmentContainerClass);
  }

  get attachmentDetails(): promise.Promise<ElementArrayFinder> {
    return utils.getElements(MailCreationPageObject.baseSelector + ' .'
    + MailCreationPageObject.attachmentContainerClass + ' .attachment');
  }

  get userPrompt(): ElementFinder {
    return utils.getElement(`${MailCreationPageObject.modalSelector} ${MailCreationPageObject.promptSelector}`);
  }

  promptTests() {
    (Object.keys(MailCreationPageObject.POPUP)).map(spec => {
      this.userPrompt.$(MailCreationPageObject.POPUP[spec].accessor).getText().then(text => {
        expect(text).toBe(MailCreationPageObject.POPUP[spec].text);
      });
    });
  }

  closePrompt(): promise.Promise<void> {
    return utils.getElement(`${MailCreationPageObject.modalSelector}
    ${MailCreationPageObject.promptSelector} ${MailCreationPageObject.POPUP.closeIcon.accessor}`).click();
  }

  get removeAttachmentCTA(): promise.Promise<ElementArrayFinder> {
    return utils.getElements(MailCreationPageObject.baseSelector + ' .' +
      MailCreationPageObject.attachmentContainerClass   + ' .attachment__meta .cursor__pointer.remove');
  }

  get viewSwitcher() {
    return utils.getElement(MailCreationPageObject.baseSelector + ' .' +
    MailCreationPageObject.attachmentContainerClass   + ' ' + MailCreationPageObject.attachmentViewSwitch);
  }
}


export const createMailTemplate = {
  recipients: {
    placeholder: {
      en: 'To'
    },

    safeValue: {
      single: 'sunday.idiakose@photizzo.com',
      multiple: 'sunday.idiakose@photizzo.com, sunday.idiakose2@photizzo.com'
    },

    emptyValue: ''
  },
  cc: {
    placeholder: {
      en: 'CC'
    },

    safeValue: {
      single: 'sunday.idiakose@photizzo.com',
      multiple: 'sunday.idiakose@photizzo.com, sunday.idiakose2@photizzo.com'
    },

    emptyValue: ''
  },

  bcc: {
    placeholder: {
      en: 'BCC'
    },

    safeValue: {
      single: 'sunday.idiakose@photizzo.com',
      multiple: 'sunday.idiakose@photizzo.com, sunday.idiakose2@photizzo.com'
    },

    emptyValue: ''
  },

  subject: {
    placeholder: {
      en: 'Subject'
    },

    safeValue: {
      single: 'Mail Subject',
    },

    emptyValue: ''
  },

  content: {
    safeValue: {
      single: '<p>Hello there!!! &nbsp; <i>Italic Content</i><br><strong>More rich content</strong></p>',
    },

    emptyValue: ''
  }
};


export enum ToastrTypes {
  INFO = '.toastr-info',
  ERROR = '.toastr-error',
  SUCCESS = '.toastr-success'
}

export enum AttachmentViews {
  EXPANDED = 'fa fa-compress',
  COLLAPSED = 'fa fa-expand'
}
