import { QuizPage } from './quiz.po';
import { browser, by, element } from 'protractor';
import utils from '../utils';

//

const fullFormSpec = {
  one: {
    title: '',
    visibility: '',
    description: '',
    recipients: ''
  }
};

const VALIDFORM = {
  title: {
    label: 'Title*',
    safeValue: 'Demo Test 1',
    invalidValue: `
      hshhjjajajajauauauauauauaauauauauauauauauauauauauauauauauauaau
      uiauauauauaaauauauauauauauauauauauauauuauauauauuauauauaauauaau
      aauuauauauauauauauuauauauauauauauauauauuauauauauauauauuauauaua
      ayayayayayayayayayyayayayayyayayayayayayayayayyayayayayayaayyayaya
      auauauauauauauauauauauauauauauuauauauauuuuauauauuauuuauauaua
    `
  },

  description: {
    label: 'Description',
    invalidValue: '',
    safeValue: ''
  },

  isPublic: {
    type: 'radio',
    label: 'Visibility*'
  },

  isPublic_yes: {
    placeholder: 'Public',
    type: 'radio'
  },

  isPublic_no: {
    placeholder: 'Private',
    type: 'radio'
  },

  receipients: {
    label: 'Receipients',
    safeValue: '',
    invalidValue: ''
  }
};

const PAGETEXT = {
  header: {
    en: 'Create Quiz'
  },

  button: {
    en: 'Create Quiz'
  },

  title: {
    en: 'Quabbly | Create Quiz'
  }
};

const RADIOBUTTON = {
  description: {
    type: 'radio'
  }
};

describe('Quabbly Quiz Page', () => {
  let page: QuizPage;

  beforeAll(() => {
    utils.navigateTo('/');
    utils.handleAuth();
    utils.navigateTo('/quiz');
  });

  beforeEach(() => {
    page = new QuizPage();
  });

  it('/quiz should be navigatable and lead to correct page', () => {
    utils
      .getElement('title')
      .getAttribute('innerHTML')
      .then(value => expect(value).toBe(PAGETEXT.title.en));
    expect(utils.getElement('app-quiz-create')).toBeTruthy();
    browser.sleep(1000);
  });

  it('should have a button: "Create Quiz"', () => {
    const createBtn = page.getCreateButton();
    expect(createBtn).toBeTruthy();
    expect(createBtn.getText()).toBe(PAGETEXT.button.en);
  });

  it('clicking on the "Create Quiz" button should open modal', () => {
    page.getCreateButton().click();
    expect(utils.getElement('ngb-modal-window app-quiz-wizard')).toBeTruthy();
  });

  // it('modal should have a close feature', () => {
  // expect(page.getModalDismiss()).toBeTruthy();
  //});

  // it('clicking on "X" closes modal', () => {
  //   expect(utils.getElement('ngb-modal-window app-quiz-create')).toBeTruthy();
  //   page.closeModal().then(() => {
  //     page.getAll('ngb-modal-window app-quiz-wizard').count().then(value => {
  //       expect(value).toBe(0);
  //     });
  //   });
  // });

  // it('modal should have correct heading', () => {
  //   page.getCreateButton().click();
  //   expect(page.getModalHeader()).toBe(PAGETEXT.header.en);
  // });

  it('form submit button should exist', () => {
    expect(page.getSubmissionButton()).toBeTruthy();
  });

  it('form submit button should be disabled on entry to form', () => {
    expect(page.getSubmissionButton().getAttribute('disabled')).toBeTruthy();
  });

  it('form labels should have correct values', () => {
    Object.keys(VALIDFORM).map(field => {
      if (VALIDFORM[field].placeholder) {
        expect(page.getLabel(field).getText()).toBe(
          VALIDFORM[field].placeholder
        );
      }
    });
  });

  it('form validation should be correct on public quiz', () => {
    page.getInputField('title').sendKeys(VALIDFORM.title.safeValue);
    page.getInputField('isPublic_yes').click();
    expect(page.getSubmissionButton().getAttribute('disabled')).toBeFalsy();
  });

  it('form validation should be correct on private quiz', () => {
    page.getInputField('isPublic_no').click();
    expect(page.getSubmissionButton().getAttribute('disabled')).toBeTruthy();
  });

  it('form validation of private quiz should pass when receipients are sent', () => {
    page.getInputField('isPublic_no').click();
    page.getInputField('receipients').sendKeys('bode.gitto@photizzo.com');
    expect(page.getSubmissionButton().getAttribute('disabled')).toBeFalsy();
  });

  it('form validation of private quiz should pass when receipients are sent', () => {
    page.getInputField('receipients').clear();
    page.getInputField('receipients').sendKeys('bode.gitto@photizzo.com,');
    expect(page.getSubmissionButton().getAttribute('disabled')).toBeFalsy();
  });

  it('should be able to click on the next button to navigate to the third step', () => {
    page.getNextButton('button#oneNextButton').click();
    browser.sleep(5000);
  });

  // Third step test

  it('should show me a text with an heading that says Quiz Configuration Settings', () => {
    expect(page.getQuizTitle()).toEqual('Quiz Configuration Settings');
  });

  it('should show me a text with an heading that says Duration For Entire Quiz', () => {
    expect(page.getQuizDuratonQuiz()).toEqual('Duration For Entire Quiz');
  });

  it('form validation should be correct on duration for entire quiz', () => {
    page.getLabelfield('input#inlineRadio1').click();
    browser.sleep(5000);
  });
  it('form validation should be correct on duration for entire quiz', () => {
    page.getLabelfield('input#inlineRadio2').click();
    browser.sleep(5000);
  });

  it('should show me a text if users Can Users Go Back To a Previous Question During the Quiz', () => {
    expect(page.getGoBackOption()).toEqual(
      'Can Users Go Back To a Previous Question During the Quiz'
    );
  });

  it('form validation to go back to previous setting', () => {
    page.getYesNo('input#yes').click();
    browser.sleep(5000);
  });
  it('form validation to go back to previous settingz', () => {
    page.getYesNo('input#no').click();
    browser.sleep(5000);
  });

  it('should provide option to retake quiz', () => {
    expect(page.allowQuizRetake()).toEqual('Allow Quiz Retake');
  });

  it('form validation not to allow retakes', () => {
    page.numberOfRetakes('input#gridRadios1').click();
    browser.sleep(5000);
  });

  it('form validation to allow retakes', () => {
    page.numberOfRetakes('input#gridRadios2').click();
    browser.sleep(5000);
  });
  it('form validating the amount of retakes', () => {
    page.getCount('option#count').click();
    browser.sleep(2000);
  });
  it('should show me a text on what type of question to set', () => {
    expect(page.setQuestion()).toEqual(
      'What Type of Question DO You Want To Set?'
    );
  });
  it('form validating the choices available', () => {
    page.getChoice('option#choice').click();
    browser.sleep(2000);
  });

  it('should show me a text if questions and answers should be shuffled', () => {
    expect(page.setShuffling()).toEqual('Question / Answer Shuffling');
  });

  it('form validating the shuffle options', () => {
    page.getShuffle('option#optionshuffle').click();
    browser.sleep(1000);
  });

  it('should show me a text if all questions should be attempted', () => {
    expect(page.setAttempt()).toEqual('Should All Questions be Attempted?');
  });

  it('form validation to know if all questions be attempted', () => {
    page.getYesNo('input#attemptyes').click();
    browser.sleep(1000);
  });

  it('form validation to know if all questions be attempted', () => {
    page.getYesNo('input#attemptno').click();
    browser.sleep(5000);
  });

  it('should show me a text with an heading that says Feedback setting', () => {
    expect(page.getFeedback()).toEqual('Feedback Settings');
  });

  it('should show me a text with an heading that Display Result After Quiz Has Been Selected By User', () => {
    expect(page.displayUserFeedback()).toEqual(
      'Display Result After Quiz Has Been Selected By User'
    );
  });

  it('form validation to display result if yes', () => {
    page.getYesNo('input#useryes').click();
    browser.sleep(2000);
  });
  it('form validation to display result if no', () => {
    page.getYesNo('input#userno').click();
    browser.sleep(2000);
  });

  it('should show me a text says show Result as', () => {
    expect(page.showResult()).toEqual('Show Result as...');
  });

  it('form validation to display result as points', () => {
    page.getYesNo('input#resultpoint').click();
    browser.sleep(2000);
  });

  it('form validation to display result as percentage', () => {
    page.getYesNo('input#resultpercentage').click();
    browser.sleep(2000);
  });

  it('should show me a text says General Settings', () => {
    expect(page.general()).toEqual('General Settings');
  });
  it('should show me a text says Examination Availability', () => {
    expect(page.available()).toEqual('Examination Availability');
  });

  it('form validation to display specific', () => {
    page.getAvailable('input#always').click();
    browser.sleep(2000);
  });
  it('form validation to display always', () => {
    page.getAvailable('input#specific').click();
    browser.sleep(2000);
  });

  // it('it should be able to take text in the textarea', () => {
  // page.getElement('textarea#commentarea').sendKeys('Test Description area For Tests');
  //browser.sleep(2000);
  // });

  it('should be able to click on the next button to navigate to the fourth step', () => {
    page.getNextButton('button#nextsubmit').click();
    browser.sleep(5000);
  });

  //Fourth Step Test

  it('should show me a text that says Test Description', () => {
    expect(page.testDescribe()).toEqual('Test Description');
  });

  it('should be able to click on the next button to navigate to the summary page', () => {
    page.getNextButton('button#nextsummary').click();
    browser.sleep(5000);
  });

  it('should show me a text that provide test summary', () => {
    expect(page.details()).toEqual(
      'All Details of the Test Have Been Collected. You can still go back to make neccessary adjustments, else, Proceed to exam settings.'
    );
  });

  //stepOne details summary
  it('should show me a text that says Title', () => {
    expect(page.title()).toEqual('Title:');
  });
  it('should show me a text that says Visibilty', () => {
    expect(page.visibility()).toEqual('Visibilty:');
  });
  it('should show me a text that says Description', () => {
    expect(page.description()).toEqual('Description:');
  });
  it('should show me a text that says Recipients', () => {
    expect(page.receipient()).toEqual('Recipients:');
  });

  //stepTwo details summary
  it('should show me a text that says quiz duration', () => {
    expect(page.duration()).toEqual('Quiz Duration:');
  });

  it('should show me a text that says send results', () => {
    expect(page.sendResult()).toEqual('Send Results:');
  });

  it('should show me a text that says date availability', () => {
    expect(page.dateAvailable()).toEqual('Date Available:');
  });

  it('should show me a text that says attempall', () => {
    expect(page.attempAll()).toEqual('Attempt All:');
  });

  it('should show me a text that says shuffle method', () => {
    expect(page.shuffleMethod()).toEqual('Shuffle Method:');
  });

  it('should show me a text that says question type', () => {
    expect(page.questionType()).toEqual('Question Type:');
  });

  it('should show me a text that says test time', () => {
    expect(page.testTime()).toEqual('Test Time:');
  });

  it('should show me a text that says allow return', () => {
    expect(page.allowReturn()).toEqual('Allow Return:');
  });

  it('should show me a text that says result format', () => {
    expect(page.resultFormat()).toEqual('Result Format:');
  });

  it('should show me a text that says availability', () => {
    expect(page.availability()).toEqual('Availability:');
  });

  it('should show me a text that says retake possibility', () => {
    expect(page.retakePossibility()).toEqual('Retake Posibility:');
  });

  it('should be able to click on the next button to navigate to the summary page', () => {
    page.getNextButton('button#right').click();
    browser.sleep(5000);
  });

  //Take Questions
  it('should show me a text that says select preferred question', () => {
    expect(page.selectQuestion()).toEqual('Select Your Preferred Question');
  });
  it('should be able to click button to select multiple choice A-D', () => {
    page.getMultiple('option#multiple').click();
    browser.sleep(3000);
  });

  it('should show me a text that says question', () => {
    expect(page.multipleQuestion()).toEqual('Question');
  });
  it('should show me a text that says answers', () => {
    expect(page.answers()).toEqual('Answers');
  });

  it('should be able to click on option A', () => {
    page.getOption('input#optiona').click();
    browser.sleep(3000);
  });
  it('should be able to click on option B', () => {
    page.getOption('input#optionb').click();
    browser.sleep(3000);
  });
  it('should be able to click on option C', () => {
    page.getOption('input#optionc').click();
    browser.sleep(3000);
  });
  it('should be able to click on option D', () => {
    page.getOption('input#optiond').click();
    browser.sleep(3000);
  });

  it('should be able to click button to select multiple choice true or false', () => {
    page.getMultiple('option#trueorfalse').click();
    browser.sleep(3000);
  });

  it('should show me a text that says question', () => {
    expect(page.questionb()).toEqual('Question');
  });
  it('should show me a text that says question', () => {
    expect(page.answersb()).toEqual('Answers');
  });

  it('should be able to click on false option', () => {
    page.getOption('input#false').click();
    browser.sleep(3000);
  });
  it('should be able to click on true option', () => {
    page.getOption('input#true').click();
    browser.sleep(3000);
  });

  it('should be able to click button to select multiple choice no or yes', () => {
    page.getMultiple('option#yesorno').click();
    browser.sleep(3000);
  });

  it('should show me a text that says question', () => {
    expect(page.questionc()).toEqual('Question');
  });
  it('should show me a text that says question', () => {
    expect(page.answersc()).toEqual('Answers');
  });

  it('should be able to click Yes', () => {
    page.getOption('input#radioyes').click();
    browser.sleep(3000);
  });
  it('should be able to click No', () => {
    page.getOption('input#radiono').click();
    browser.sleep(3000);
  });

  //it('should show me a text that says question', () => {
  //expect(page.questiond()).toEqual('Question');
  //});

  it('should be able to click button to select fill in the blank', () => {
    page.getMultiple('option#fill').click();
    browser.sleep(3000);
  });
});

/*
  TEST LIST
  text - buttons et al
  labels - value and asterisks
  DIRTY VALIDATION
  button is diabled and enabled approp.
  spinner on button submit
  modal close on form submit
  parsed inputs
  input left in text area
*/
