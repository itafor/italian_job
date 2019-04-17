import { Routes } from '@angular/router';
import * as fromContainers from './containers';
import { ListQuizComponent } from './components/list-quiz/list-quiz.component';
import { ViewQuizComponent } from './components/view-quiz/view-quiz.component';
import { CreateQuizQuestionComponent } from './components/create-quiz-question/create-quiz-question.component';
import { ViewQuizQuestionComponent } from './components/view-quiz-question/view-quiz-question.component';

export const QuizRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        component: ListQuizComponent,
        data: {
          heading: 'List Quiz'
        }
      },
      {
        path: 'view/:id',
        component: ViewQuizComponent,
        data: {
          heading: 'View Quiz'
        }
      },
      {
        path: 'create-question/:id',
        component: CreateQuizQuestionComponent,
        data: {
          heading: 'Create Quiz Question'
        }
      },
      {
        path: 'viewquestion',
        component: ViewQuizQuestionComponent,
        data: {
          heading: 'View Quiz'
        }
      },
      {
        path: 'update/:id',
        component: ViewQuizComponent
      }
      /*
      {
        path: 'signin',
        component: QuizdetailsComponent
      },
      {
        path: 'welcome',
        component: QuizwelcomepageComponent
      },
      {
        path: 'question',
        component: QuizquestionsComponent
      }
      */
    ]
  }
];
