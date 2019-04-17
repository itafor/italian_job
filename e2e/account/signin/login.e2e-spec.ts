import { LoginPage } from './login.po';
import utils from '../../utils';

const VALIDFORM = {
  username: {
    placeholder: 'Email',
    safeValue: 'test@email.me'
  },
  password: {
    placeholder: '********',
    safeValue: 'testPASSWORD'
  },
};

const PAGETEXT = {
  header: {
    en: 'Account login'
  },

  button: {
    en: 'Login'
  },

  recoverPassword: {
    en: 'Recover your password'
  },

  rememberMe: {
    en: 'Stay logged in'
  }
};



describe('Quabbly Login Page', () => {

  let loginPage: LoginPage;

  beforeAll(() => {
    utils.navigateTo('/');
  });

  beforeEach(() => {
    loginPage = new LoginPage();
  });

  it('should expect header text on the page', () => {
    utils.navigateTo(utils.SIGNINLINK + '?test');
    expect(utils.getText('app-signin h3')).toEqual(PAGETEXT.header.en);
  });
  it('should expect a form on the signin page', () => {
    expect(utils.getText('form')).toBeTruthy();
  });
  
  it('should have a link to signup page from sign in', () => {
    utils.navigateTo(utils.SIGNINLINK);
    const navlink = utils.getElement('#link-register');
    navlink.getAttribute('href').then(value => expect(utils.isLink(value, utils.SIGNUPLINK)).toBeTruthy());
  });
  it('should expect attributes in email field ', () => {
    const email = utils.getElement('#username');
    expect(email.getAttribute('placeholder')).toEqual(VALIDFORM.username.placeholder);
    // update to email field
    // expect(email.getAttribute('type')).toEqual('text');
  });
  it('should expect attributes in password field ', () => {
    const password = utils.getElement('#password');
    expect(password.getAttribute('placeholder')).toEqual(VALIDFORM.password.placeholder);
    expect(password.getAttribute('type')).toEqual('password');
  });
  it('should disabled the button if form is invalid', () => {
    utils.navigateTo(utils.SIGNINLINK);
    expect(loginPage.getButton().getAttribute('disabled')).toBeTruthy();
  });
  it('should have the correct button text', () => {
    expect(loginPage.getButton().getText()).toEqual(PAGETEXT.button.en);
  });

  /*
  // SAME

  it('should have a link to the forgot password page', () => {
    const navlink = utils.getElement('#forgetpassword');
    navlink.getAttribute('href').then(value => expect(utils.isLink(value, utils.PASSWORDRECOVERYLINK)).toBeTruthy());
    navlink.click();
    expect(utils.getText('h3')).toEqual(PAGETEXT.recoverPassword.en);
  });

  */
});
