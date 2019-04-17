import { RegisterPage } from './signup.po';
import utils from '../../utils';

const VALIDFORM = {
  firstname: {
    placeholder: 'Firstname',
    safeValue: 'testFIRSTNAME'
  },
  lastname: {
    placeholder: 'Lastname',
    safeValue: 'testLASTNAME'
  },
  email: {
    placeholder: 'Email',
    safeValue: 'test@email.me'
  },
  company_name: {
    placeholder: 'Company Name',
    safeValue: 'testCOMPANYNAME'
  },
  password: {
    placeholder: 'Password',
    safeValue: 'testPassword'
  },
  password_confirm: {
    placeholder: 'Confirm Password',
    safeValue: 'testPassword'
  }
};

const PAGETEXT = {
  header: {
    en: 'Create your account'
  },

  alternativeAuth: {
    en: 'Already have an account? Login Now!',
    link: {
      url: '/account/signin',
      text: {
        en: 'Login Now!'
      }
    }
  },

  button: {
    en: 'Create account'
  }
};

describe('Quabbly Register page', () => {
  const page: RegisterPage = new RegisterPage();

  beforeAll(() => {
    utils.navigateTo(utils.SIGNUPLINK + '?test');
  });

  it('should allow you navigate to sign up ', () => {
    utils.waitForPage(1000).then(() => {
      utils.urlContains('/account/signup').then(areWeOnRoute => expect(areWeOnRoute).toBeTruthy());
    });
  });

  it('the form should have a header describing form', () => {
    utils.waitForPage(1000).then(() => {
      expect(utils.getText('h3.text-success')).toEqual(PAGETEXT.header.en);
    });
  });

  // check if inputs exists

  // TODO
  // test page title when its implemented
  // test placeholders
  it('its input fields should have the correct placeholders', () => {
    Object.keys(VALIDFORM).map(field => {
      expect(page.getInputField(field).getAttribute('placeholder')).toEqual(VALIDFORM[field].placeholder);
    });
  });
  // test internationalization - on all page elements
  // test the 'Already have an account - Login now'
  it('it should show alternative method for gaining access to application', () => {
    expect(utils.getText('#form-register-alternative-auth p')).toEqual(PAGETEXT.alternativeAuth.en);
  });

  // check the link
  it('it should show alternative method for gaining access to application with a link', () => {
    const link = utils.getElement('#form-register-alternative-auth p').$('a');
    link.getAttribute('href').then(value => expect(utils.isLink(value, PAGETEXT.alternativeAuth.link.url)).toBeTruthy());
    expect(link.getText()).toEqual(PAGETEXT.alternativeAuth.link.text.en);
  });
  // test trimming - confirm from OSita first though

  // fill inputs
  it('should allow for filling inputs', () => {
    page.getInputField('firstname').sendKeys(VALIDFORM.firstname.safeValue);
    expect(page.getInputField('firstname').getAttribute('value')).toEqual(VALIDFORM.firstname.safeValue);
    page.getInputField('firstname').clear();
  });

  it('should disabled the button if form is invalid', () => {
    expect(page.getButton().getAttribute('disabled')).toBeTruthy();
  });


  it('the button should display the correct text', () => {
    expect(page.getButton().getText()).toEqual(PAGETEXT.button.en);
  });

  it('should allow you to register if all fields are filled', () => {
    Object.keys(VALIDFORM).map(field => {
      page.getInputField(field).sendKeys(VALIDFORM[field].safeValue);
    });
    expect(page.getButton().getAttribute('disabled')).toBeFalsy();
    page.submit();
  });
});
