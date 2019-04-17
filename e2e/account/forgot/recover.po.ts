import { by, element } from 'protractor';

export class RecoverPasswordPage {
  recoverHeadText() {
    return element(by.css('app-forgot h3')).getText();
  }

  getInputField() {
    return element(by.css('input.form-control'));
  }

  getSignupLink() {
    return element(by.css('a#register_link'));
  }

  getResetBtn() {
    return element(by.css('button.btn.btn-primary'));
  }

  getEmailTextbox() {
    return element(by.css('#form-recover-email'));
  }

  getSubmitButton() {
    return element(by.css('button.btn.btn-primary'));
  }

  getForm() {
    return element(by.css('app-forgot form'));
  }
}
