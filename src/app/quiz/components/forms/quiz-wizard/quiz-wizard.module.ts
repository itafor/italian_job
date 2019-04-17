import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { QuizWizardComponent } from './quiz-wizard.component';
import { QuizWizardRoutes } from './quiz-wizard.routing';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(QuizWizardRoutes),
  ],
  declarations: [
    QuizWizardComponent,
  ]
})
export class QuizWizardModule {}
