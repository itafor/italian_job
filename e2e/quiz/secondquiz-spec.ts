
// import { QuizPage } from './quiz.po';
// import utils from '../utils';


// // const VALIDFORM = {
// //   title: {
// //     label: 'Title*',
// //     safeValue: 'Demo Test 1',
// //     invalidValue: `
// //       hshhjjajajajauauauauauauaauauauauauauauauauauauauauauauauauaau
// //       uiauauauauaaauauauauauauauauauauauauauuauauauauuauauauaauauaau
// //       aauuauauauauauauauuauauauauauauauauauauuauauauauauauauuauauaua
// //       ayayayayayayayayayyayayayayyayayayayayayayayayyayayayayayaayyayaya
// //       auauauauauauauauauauauauauauauuauauauauuuuauauauuauuuauauaua
// //     `
// //   },

// //   description: {
// //     label: 'Description',
// //     invalidValue: '',
// //     safeValue: ''
// //   },

// //   isPublic: {
// //     type: 'radio',
// //     label: 'Visibility*'
// //   },

// //   isPublic_yes: {
// //     placeholder: 'Public',
// //     type: 'radio'
// //   },

// //   isPublic_no: {
// //     placeholder: 'Private',
// //     type: 'radio'
// //   },

// //   receipients: {
// //     label: 'Receipients',
// //     safeValue: '',
// //     invalidValue: ''
// //   }
// // };

// // const PAGETEXT = {
// //   header: {
// //     en: 'Create Quiz'
// //   },

// //   button: {
// //     en: 'Create Quiz'
// //   },

// //   title: {
// //     en: 'Quabbly | Create Quiz'
// //   }
// // };

// describe('Quabbly Quiz Page', () => {
//   let page: QuizPage;

//   beforeAll(() => {
//     utils.navigateTo('/quiz');
//   });


//   beforeEach(() => {
//     page = new QuizPage();
//   });


//   //   beforeAll(() => {
//   //     utils.navigateTo('/quiz');
//   //   });


//   it('form validation should kick in as soon as form fields are interacted with', () => {
//     page.getInputField('title').clear();
//     page.getInputField('title').sendKeys(VALIDFORM.title.invalidValue);
//     expect(utils.getElement('#form-quiz-create-one-title_maxlength_error')).toBeTruthy();
//     page.getInputField('title').clear();
//   });

//   it('should accept multiple receipients', () => {
//     page.getInputField('isPublic_no').click();
//     page.getInputField('receipients').sendKeys('bodegitto@photizzo.com,ide@ide.com,');
//     page.getInputField('title').sendKeys(VALIDFORM.title.safeValue);
//     utils.waitForPage(2000);
//     expect(page.getSubmissionButton().getAttribute('disabled')).toBeFalsy();
//   });

//   it('should show receipients seperately', () => {
//     page.getParsedEmails().count()
//       .then(numberOfParsedEmails => expect(numberOfParsedEmails).toBe(2));
//   });



//   it('should show me an error if i AM TYPING in an invalid email', () => {
//     page.getInputField('receipients').clear();
//     page.getInputField('receipients').sendKeys('bode.gitto@photizzo');
//     page.getInputField('receipients').sendKeys(' ');
//     expect(utils.
//       getText('#form-quiz-create-one-receipient_email_error'))
//       .toBe('Receipient email you are typing must be a valid email address');
//   });




//   it('should show me a text with an heading that says Quiz Configuration Settings', () => {
//     expect(page.getQuizTitle()).toEqual('Quiz Configuration Settings');
//   });
//   it('should show me a text with an heading that says Duration For Entire Quiz', () => {
//     expect(page.getQuizDuratonQuiz()).toEqual('Duration For Entire Quiz');
//   });


//   // it('should on submission of form, close modal after 3 seconds', () => {
//   //   page.getInputField('receipients').clear();
//   //   page.getInputField('receipients').sendKeys('bode.gitto@photizzo.com');
//   //   page.getSubmissionButton().click().then(() => {
//   //     setTimeout(() => {
//   //       page.getAll('ngb-modal-window app-quiz-wizard').count().then(value => {
//   //         expect(value).toBe(0);
//   //       });
//   //     }, 3500);
//   //   });
//   // });
// });
