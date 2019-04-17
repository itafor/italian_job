import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  FormControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../../services/data.service';
import { QuizService } from '../../services';
import { DIRECTION } from '../../enums';
import { Router, ActivatedRoute } from '@angular/router';

import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';

interface QuizesResponse {
  data: any[];
  quizes: any[];
}

@Component({
  selector: 'app-view-quiz-question',
  templateUrl: './view-quiz-question.component.html',
  styleUrls: ['./view-quiz-question.component.scss']
})
export class ViewQuizQuestionComponent implements OnInit {
  @Output() nextStageEvent: EventEmitter<DIRECTION> = new EventEmitter();

  listQuiz = true;
  createQuiz = false;
  loading = true;
  updateQuizLink = '/quiz/view';
  viewQuizLink = '/quiz/view';

  ngOnInit() {
    this.getQuiz();
    this.getQuizQuestionList();
  }
  onSubmit() {
    this.router.navigate(['quiz/list']);
  }

  togglePage() {
    this.listQuiz = !this.listQuiz;
    this.createQuiz = !this.createQuiz;
    if (this.listQuiz) {
      this.loading = true;
      this.getQuiz();
    }
  }

  constructor(public quizService: QuizService, public router: Router) {}

  quizList: any[];
  rows = [];
  count = 0;
  offset = 0;
  limit = 5;

  getQuiz() {
    this.quizService.listQuiz().subscribe((data: QuizesResponse) => {
      if (data) {
        this.quizList = data.data;
      }
      this.onPage(this.offset, this.limit);
      this.loading = false;
    });
  }

  getQuizQuestionList() {
    this.quizService.getQuizQuestionList().subscribe((data: any) => {
      if (data) {
        this.quizList = data.data;
        console.log(data);
      }
      this.onPage(this.offset, this.limit);

      this.loading = false;
    });
  }

  onPage(offset, limit) {
    this.count = this.quizList.length;
    const start = this.offset * this.limit;
    const end = start + this.limit;
    this.rows = this.quizList;
  }

  edit(data) {
    this.router.navigate([this.updateQuizLink + '/' + data.id]);
  }

  view(data) {
    this.router.navigate([this.viewQuizLink + '/' + data.id]);
  }
}
