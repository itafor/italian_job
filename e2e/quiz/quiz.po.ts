import { browser, by, element } from 'protractor';


const FIELDS = ['title', 'visibility', 'description'];

export class QuizPage {

  // function to help submit the form
  submit() {
    return this.getButton().click();
  }

  getInputField(id: string) {
    return element(by.css(`#form-quiz-create-one-${id}`));
    return element(by.css('invalid-feedback d-block'));
  }






  // get the button
  getButton() {
    return element(by.css('button.btn.btn-primary'));
  }

  getCreateButton() {
    return element(by.css('app-quiz-create button.btn.btn-lg.btn-outline-primary'));
  }

  getSubmissionButton() {
    return element(by.css('app-quiz-wizard button[type="submit"]'));
  }

  submitForm() { }

  openModal() { }

  getLabel(field: string) {
    return element(by.css(`label[for="form-quiz-create-one-${field}"]`));
  }

  // getModalDismiss() {
  // return element(by.css('app-quiz-wizard button.close'));
  //}

  // getModalHeader() {
  //   return element(by.css('app-quiz-wizard h4')).getText();
  // }

  getErrorsDisplayed() {
    const errorTextDivs = this.getAll('div.invalid-feedback.d-block');
    // console.log(errorTextDivs);
    const errorObject = {
      title: [],
      receipient: [],
      isPublic: []
    };
    errorTextDivs.each(err => {
      err.getText().then(displayedError => {
        console.log(displayedError);
        if (displayedError.toLowerCase().startsWith('title')) {
          errorObject.title.push(displayedError);
        } else if (displayedError.toLowerCase().startsWith('receipient')) {
          errorObject.receipient.push(displayedError);
        } else if (displayedError.toLowerCase().startsWith('visibility')) {
          errorObject.isPublic.push(displayedError);
        }
      });
    });
    return errorObject;
  }

  // close modal by 'X'
  // closeModal() {
  //   return this.getModalDismiss().click();
  // }

  getAll(selector: string) {
    return element.all(by.css(selector));
  }

  getParsedEmails() {
    return element.all(by.css('.parsed__email'));
  }


  getNextButton(selector: string) {
    return element.all(by.css(selector));
  }


  navigateToUrl(selector: string) {
    return browser.get(selector);
  }


  //Stage three

  getQuizTitle() {
    return element(by.css('#config')).getText();
  }

  getQuizDuratonQuiz() {
    return element(by.css('#duration')).getText();
  }


  getLabelfield(selector: string) {
    return element(by.css(selector));
  }

  getGoBackOption() {
    return element(by.css('#previous')).getText();
  }

  getYesNo(selector: string) {
    return element(by.css(selector));
  }

  allowQuizRetake() {
    return element(by.css('#retake')).getText();
  }

  numberOfRetakes(selector: string) {
    return element(by.css(selector));
  }
  getCount(selector: string) {
    return element(by.css(selector));
  }

  setQuestion() {
    return element(by.css('#setquestion')).getText();
  }

  getChoice(selector: string) {
    return element(by.css(selector));
  }

  setShuffling() {
    return element(by.css('#shuffle')).getText();
  }

  getShuffle(selector: string) {
    return element(by.css(selector));
  }

  setAttempt() {
    return element(by.css('#attempted')).getText();
  }

  getFeedback() {
    return element(by.css('#feedback')).getText();
  }

  displayUserFeedback() {
    return element(by.css('#userfeedback')).getText();
  }

  showResult() {
    return element(by.css('#show')).getText();
  }

  general() {
    return element(by.css('#general')).getText();
  }
  available() {
    return element(by.css('#available')).getText();
  }

  getAvailable(selector: string) {
    return element(by.css(selector));
  }
  getSave(selector: string) {
    return element(by.css(selector));
  }

  testDescribe() {
    return element(by.css('#describe')).getText();
  }

  getElement(selector: string) {
    return element(by.css(selector));
  }



  details() {
    return element(by.css('#details')).getText();
  }
  //stepOne details summary function

  title() {
    return element(by.css('#title')).getText();
  }
  visibility() {
    return element(by.css('#visible')).getText();
  }
  description() {
    return element(by.css('#describe')).getText();
  }
  receipient() {
    return element(by.css('#recipient')).getText();
  }

  //stepTwo details summary function
  duration() {
    return element(by.css('#duration')).getText();
  }
  sendResult() {
    return element(by.css('#sendresult')).getText();
  }
  dateAvailable() {
    return element(by.css('#dateavailable')).getText();
  }
  attempAll() {
    return element(by.css('#attemptall')).getText();
  }
  shuffleMethod() {
    return element(by.css('#shufflemethod')).getText();
  }
  questionType() {
    return element(by.css('#questiontype')).getText();
  }
  testTime() {
    return element(by.css('#testtime')).getText();
  }
  allowReturn() {
    return element(by.css('#allowreturn')).getText();
  }
  resultFormat() {
    return element(by.css('#resultformat')).getText();
  }
  availability() {
    return element(by.css('#availability')).getText();
  }
  retakePossibility() {
    return element(by.css('#retakepossibility')).getText();
  }

  //take questions step
  selectQuestion() {
    return element(by.css('#select')).getText();
  }

  getMultiple(selector: string) {
    return element(by.css(selector));
  }

  multipleQuestion() {
    return element(by.css('#multiplequestion')).getText();
  }

  answers() {
    return element(by.css('#answers')).getText();
  }
  getOption(selector: string) {
    return element(by.css(selector));
  }

  questionb() {
    return element(by.css('#questionb')).getText();
  }

  answersb() {
    return element(by.css('#answersb')).getText();
  }
  questionc() {
    return element(by.css('#questionc')).getText();
  }

  answersc() {
    return element(by.css('#answerc')).getText();
  }

  questiond() {
    return element(by.css('#questiond')).getText();
  }








}
