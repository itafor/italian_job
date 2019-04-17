import { by, element } from 'protractor';

export class LoginPage {
  getAllElements(selector: string) {
    return element.all(by.css(selector));
  }

  getElementByClass(selector: string) {
    return element(by.className(selector));
  }

  // function to help submit the form
  submit() {
    return this.getButton().click();
  }

  getInputField(id: string) {
    return element(by.css(`#form-login-${id}`));
  }

  // get the button
  getButton() {
    return element(by.css('button.btn.btn-primary'));
  }

}
