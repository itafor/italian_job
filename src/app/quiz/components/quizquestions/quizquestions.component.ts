import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
@Component({
  selector: 'app-quizquestions',
  templateUrl: './quizquestions.component.html',
  styleUrls: ['./quizquestions.component.scss']
})
export class QuizquestionsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }



// startTimer(){
//   this.quizService.timer=setInterval(()={
//     this.quizService.seconds++;
//   }, 1000);
// }
}
