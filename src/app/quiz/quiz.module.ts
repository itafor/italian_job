import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertModule } from './../components/alert/alert.module';
import { QuizRoutes } from './quiz.routing';
import { NgbModule, NgbProgressbarConfig } from '@ng-bootstrap/ng-bootstrap';
import { InputParserService } from './../core/forms/helpers';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { QuillModule } from 'ngx-quill';

import * as fromComponents from './components';
import * as fromContainers from './containers';
import * as fromServices from './services';
import { ThreeComponent } from './components/forms/three.component';
import { FourthComponent } from './components/forms/fourth.component';
import { QuizdetailsComponent } from './quizdetails/quizdetails.component';

import {
  MatInputModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatTableModule
} from '@angular/material';
import { QuizwelcomepageComponent } from './components/quizwelcomepage/quizwelcomepage.component';
import { QuizquestionsComponent } from './components/quizquestions/quizquestions.component';
import { SetquestionsComponent } from './components/forms/setquestions/setquestions.component';
import { NgxLoadingModule } from 'ngx-loading';
import { EditorModule } from 'primeng/editor';
import { ListQuizComponent } from './components/list-quiz/list-quiz.component';
import { CreateQuizComponent } from './components/create-quiz/create-quiz.component';
import { CreateQuizStartComponent } from './components/create-quiz/create-quiz-start/create-quiz-start.component';
import { ViewQuizQuestionComponent } from './components/view-quiz-question/view-quiz-question.component';
import { CreateQuizSettingComponent } from './components/create-quiz/create-quiz-setting/create-quiz-setting.component';
import { CreateQuizInstructionComponent } from './components/create-quiz/create-quiz-instruction/create-quiz-instruction.component';
import { ViewQuizComponent } from './components/view-quiz/view-quiz.component';
import { CreateQuizQuestionComponent } from './components/create-quiz-question/create-quiz-question.component';
// import { ToastrModule } from 'ngx-toastr';
import { ToastrModule } from 'ng6-toastr-notifications';

@NgModule({
  imports: [
    CommonModule,

    RouterModule.forChild(QuizRoutes),
    FormsModule,
    NgxDatatableModule,
    ReactiveFormsModule,
    AlertModule,
    NgbModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    QuillModule,
    EditorModule,
    NgxLoadingModule,
    ToastrModule.forRoot()
  ],
  declarations: [
    ...fromComponents.components,
    ...fromContainers.containers,
    ThreeComponent,
    FourthComponent,
    QuizdetailsComponent,
    QuizwelcomepageComponent,
    QuizquestionsComponent,
    SetquestionsComponent,
    CreateQuizComponent,
    ListQuizComponent,
    CreateQuizStartComponent,
    ViewQuizQuestionComponent,
    CreateQuizSettingComponent,
    CreateQuizInstructionComponent,
    ViewQuizComponent,
    CreateQuizQuestionComponent
  ],
  providers: [
    ...fromServices.services,
    InputParserService,
    NgbProgressbarConfig
  ],
  entryComponents: [fromContainers.CreateQuizWizardComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class QuizModule {}
