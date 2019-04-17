import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-wizard',
  templateUrl: './quiz-wizard.component.html',
  styleUrls: ['./quiz-wizard.component.scss']
})
export class QuizWizardComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  // createRange(number) {
  //   const items: any[] = [];
  //   for (let i = 0; i <= number; i++) {
  //      items.push(i < 10 ? '0' + i : i);
  //   }
  //   return items;
  // }
}
