import { Routes } from '@angular/router';

import { QuizWizardComponent } from './quiz-wizard.component';

export const QuizWizardRoutes: Routes = [
  {
    path: '',
    component: QuizWizardComponent,
    data: {
      heading: 'Quiz Wizard'
    }
  }
];
