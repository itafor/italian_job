import { OnwardActions } from '../../src/app/email/enums';
import { element, by, browser, ElementFinder, promise } from 'protractor';
import { TemplateFieldsDataAttr, MailCreationPageObject } from './mail-creation.po';
import utils from '../utils';

export class ForwardingHelpers {
  getMailAction(mail: ElementFinder, actionType: OnwardActions) {
      return mail.$(`app-email-actions a[data-action='${actionType}']`);
  }

  getOnwardMailForm(mail: ElementFinder) {
    return mail.$('app-create-email');
  }

  getFormValue(form: ElementFinder, attrAsData: TemplateFieldsDataAttr): promise.Promise<string> {
    if (attrAsData === TemplateFieldsDataAttr.Content) {
      return browser.executeScript(
        `return document.querySelector('app-email-view app-create-email editor[data-name="content"] iframe')
        .contentWindow.document.children[0].querySelector('body').innerHTML`).then((pureValue: string) => {
           return pureValue.replace(MailCreationPageObject.rtEditorPlaceHolder, '').trim();
         });
    }
    return form.$(` input[data-name=${attrAsData}]`).getAttribute('value');
  }
}

