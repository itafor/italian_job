import { Component, OnInit, Input } from '@angular/core';
import { QuizService } from '../../services';
import { Router } from '@angular/router';

interface QuizesResponse {
  data: any[];
  quizes: any[];
}
@Component({
  selector: 'app-list-quiz',
  templateUrl: './list-quiz.component.html',
  styleUrls: ['./list-quiz.component.scss']
})
export class ListQuizComponent implements OnInit {
  listQuiz = true;
  createQuiz = false;
  loading = true;
  updateQuizLink = '/quiz/view';
  viewQuizLink = '/quiz/view';

  ngOnInit() {
    this.getQuiz();
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
