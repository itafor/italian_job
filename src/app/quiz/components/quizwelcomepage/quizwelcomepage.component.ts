import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';



@Component({
  selector: 'app-quizwelcomepage',
  templateUrl: './quizwelcomepage.component.html',
  styleUrls: ['./quizwelcomepage.component.scss']
})
export class QuizwelcomepageComponent implements OnInit {

  constructor(private router: Router) { }

 

  ngOnInit() {
  }


   onSubmit(){
    this.router.navigate(['quiz/question']);
  }

}
