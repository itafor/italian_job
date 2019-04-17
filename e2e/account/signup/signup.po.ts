import { by, element } from 'protractor';

export class RegisterPage {
  getInputField(id: string) {
    return element(by.css(`#form-register-${id}`));
  }

  // function to help submit the form
  submit() {
    return this.getButton().click();
  }

  // get the button
  getButton() {
    return element(by.css('button.btn.btn-primary'));
  }
}
