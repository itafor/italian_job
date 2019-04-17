import { CreateFormStepOneComponent } from './forms/one.component';
import { Form2Component } from './forms/two.component';
import { FourthComponent } from './forms/fourth.component';
import { ListComponent } from './forms/list.component';
import { SetquestionsComponent } from './forms/setquestions/setquestions.component';
// import { Component } from './path/to/component';

export const components: any[] = [
  // Component
  CreateFormStepOneComponent,
  Form2Component,
  FourthComponent,
  ListComponent,
  SetquestionsComponent
];

// export * from './path/to/component';
export * from './forms/one.component';
export * from './forms/two.component';
export * from './forms/fourth.component';
export * from './forms/list.component';
export * from './forms/setquestions/setquestions.component';
