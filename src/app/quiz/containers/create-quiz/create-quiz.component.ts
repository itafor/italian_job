import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgxLoadingModule } from 'ngx-loading';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CreateQuizWizardComponent } from '../create-wizard/create-wizard.component';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';

import { QuizService } from '../../services';

interface QuizesResponse {
  data: any[];
  quizes: any[];
}
@Component({
  selector: 'app-quiz-create',
  templateUrl: './create-quiz.component.html',
  styleUrls: ['./create-quiz.component.scss']
})
export class CreateQuizComponent implements OnInit {
  showWizard = false;
  showList = true;
  show = true;
  loading = true;

  // constructor(private modalService: NgbModal) {}

  ngOnInit() {
    this.getQuizes();
  }

  openModal() {
    this.showWizard = true;
    this.showList = false;
    this.show = !this.show;

    // const modalRef = this.modalService.open(CreateQuizWizardComponent);
    // modalRef.componentInstance.name = 'DemoModal';
  }

  constructor(public _quizService: QuizService) {}

  quizList: any[];
  rows = [];
  count = 0;
  offset = 0;
  limit = 5;

  getQuizes() {
    this._quizService.listQuizes().subscribe((data: QuizesResponse) => {
      if (data) {
        this.quizList = data.data;
      }
      this.onPage(this.offset, this.limit);
    });

    this._quizService.listQuizes().subscribe(
      successRes => {
        console.log(successRes);
      },
      errorRes => {
        console.error(errorRes);
        this.loading = false;
      },
      () => {
        console.log('API call complete');
        this.loading = false;
      }
    );
  }

  onPage(offset, limit) {
    this.count = this.quizList.length;
    const start = this.offset * this.limit;
    const end = start + this.limit;
    this.rows = this.quizList;
  }
}
