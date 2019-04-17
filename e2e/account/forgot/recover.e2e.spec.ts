import { RecoverPasswordPage } from './recover.po';
import utils from '../../utils';

const VALIDFORM = {
  email: {
    placeholder: 'Email',
    safeValue: 'andrew.wams@gmail.com'
  }
};

const PAGETEXT = {
  recoverPassword: {
    en: 'Recover your password'
  },

  resetPassword: {
    en: 'Reset password'
  }
};

describe('Quabbly Forgot Password page', () => {
  let recoverPwdPage: RecoverPasswordPage;

  beforeAll(() => {
    utils.navigateTo('/');
  });

  beforeEach(() => {
    recoverPwdPage = new RecoverPasswordPage();
  });


  it('should display a text: Recover your password ', () => {
    utils.navigateTo('/account/forgot?test');
    expect(recoverPwdPage.recoverHeadText()).toEqual(PAGETEXT.recoverPassword.en);
  });


  it('should display an input field', () => {
    expect(recoverPwdPage.getInputField()).toBeTruthy();
  });


  it('should display a button: Reset Password', () => {
    expect(recoverPwdPage.getResetBtn().getText()).toEqual(PAGETEXT.resetPassword.en);
  });


  it('should display a create an account link', () => {
    expect(recoverPwdPage.getSignupLink()).toBeTruthy();
  });

  it('Should allow form to be invalid if email is not entered', () => {
    expect(recoverPwdPage.getSubmitButton().getAttribute('disabled')).toBeTruthy();
  });

   it('should route link to Sign up page', () => {
      const signUpLink = recoverPwdPage.getSignupLink();
      expect(signUpLink).toBeTruthy();
      signUpLink.getAttribute('href').then(value => {
        expect(utils.isLink(value, utils.SIGNUPLINK));
      });
  });

  it('Should allow valid email address', () => {
    const emailField = recoverPwdPage.getEmailTextbox();
    const form = recoverPwdPage.getForm();
    emailField.sendKeys(VALIDFORM.email.safeValue);
    expect(emailField.getAttribute('disabled')).toBeFalsy();
    expect(form.getAttribute('class')).toContain('ng-valid');
    recoverPwdPage.getSubmitButton().click();
  });
});
