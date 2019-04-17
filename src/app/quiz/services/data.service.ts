import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const fullFormSpec = {
  one: {
    title: '',
    is_public: '',
    description: '',
    recipients: ''
  },
  two: {
    quizDurationHours: '',
    quizDurationMinutes: '',
    navigateQuiz: '',
    retakeQuiz: '',
    shuffleQuestions: '',
    attemptAll: '',
    percentageGradingOption: '',
    displayResult: '',
    quizAvailability: '',
    quizCategoryQuestion: '',
    passingGrade: '',
    quizAvailableAt: '2011-08-19T13:45:00',
    allowedRetakes: '',
    testTime: '45:00',
    resultView: ''
  },
  three: {
    instruction: ''
  }
};

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private http: HttpClient) {}

  readBack(formKey: string) {
    return fullFormSpec[formKey];
  }

  save(formKey: string, data: {}) {
    console.log(
      `saving data from form ${formKey} to persistence module: `,
      data
    );
    Object.assign(fullFormSpec[formKey], data);
    console.log('full data in persistence module is now: ', fullFormSpec);
  }

  viewAll() {
    return fullFormSpec;
  }
}
