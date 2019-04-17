import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';

import { DataService } from '../../services/data.service';
import { QuizService } from '../../services';
import { DIRECTION } from '../../enums';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgxLoadingModule } from 'ngx-loading';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
interface QuizesResponse {
  data: any[];
  quizes: any[];
}

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  @Output() nextStageEvent: EventEmitter<DIRECTION> = new EventEmitter();
  public form: FormGroup;
  showWizard = false;
  showList = true;
  loading = true;

  // constructor(private modalService: NgbModal) {}

  ngOnInit() {
    this.getQuizes();
  }

  openModal() {
    this.showWizard = true;
    this.showList = false;
    // const modalRef = this.modalService.open(CreateQuizWizardComponent);
    // modalRef.componentInstance.name = 'DemoModal';
  }

  constructor(
    public _quizService: QuizService,
    private formPresistence: DataService
  ) {}

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

  onSubmit() {
    this.nextStageEvent.emit();
  }

  saveAndGoBack() {
    this.nextStageEvent.emit(DIRECTION.BACKWARD);
  }
}
