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

import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-create-quiz-question',
  templateUrl: './create-quiz-question.component.html',
  styleUrls: ['./create-quiz-question.component.scss']
})
export class CreateQuizQuestionComponent implements OnInit {
  @Output() nextStageEvent: EventEmitter<DIRECTION> = new EventEmitter();

  public form: FormGroup;
  public correct = '';
  public choose = '';
  loading = false;
  submitted = false;
  quizId;
  public quizListLink = '/quiz/viewquestion';
  post: any;
  score: any;
  question: string = '';
  questionChoice: string = '';
  questionName: string = '';
  questionOption: string = '';
  questionAnswer: string = '';
  questionScore: string = '';
  yes: string = '';
  no: string = '';
  questionType = [];

  setvalue(drp: any) {
    this.choose = drp.target.value;
  }

  constructor(
    private router: Router,
    private actvroute: ActivatedRoute,
    private quizService: QuizService,
    private fb: FormBuilder,
    private _quizService: QuizService,
    private toaster: ToastrManager
  ) {}

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  makeMCQOptions(label: string, text?: string) {
    return this.fb.group({
      label: [label, Validators.required],
      text: [text || '', Validators.required],
      isAnswer: [false]
    });
  }

  initMCQOptions() {
    return ['A', 'B', 'C'].map(label => this.makeMCQOptions(label));
  }

  makeDoubleOptions(label: string, text?: string) {
    return this.fb.group({
      label: [label, Validators.required],
      text: [text || '', Validators.required],
      isAnswer: [false]
    });
  }
  initDoubleOptions() {
    return ['A', 'B'].map(label => this.makeDoubleOptions(label));
  }
  // makeYesNoOptions(label: string, text?: string) {
  //   return this.fb.group({
  //     label: [label, Validators.required],
  //     text: [text || '', Validators.required],
  //     isAnswer: [false]
  //   });
  // }
  // initmakeYesNoOptions() {
  //   return ['A', 'B'].map(label => this.makeYesNoOptions(label));
  // }

  ngOnInit() {
    this.actvroute.snapshot.params.id
      ? (this.quizId = this.actvroute.snapshot.params.id)
      : this.router.navigate([this.quizListLink]);
    this.loading = true;
    this.quizId = this.actvroute.snapshot.params.id || this.quizService.id;

    this.form = this.fb.group({
      type: [null, Validators.required],
      name: [null, Validators.required],
      mcqOpts: this.fb.array(this.initMCQOptions()),
      douOpts: this.fb.array(this.initDoubleOptions()),
      // yesnoOpts: this.fb.array(this.initmakeYesNoOptions()),
      score: [null, Validators.required],
      quizquestioncategory: [null],
      multipleChoiceRadio: [null],
      multipleChoiceCheckbox: [null],
      multipleYesNo: [null],
      multipleTrueFalse: [null],
      questionName: [null],
      questionOption: [null],
      questionAnswer: [null],
      checkBoxOptions: this.fb.array([this.makeFieldObj()]),
      attemptAll: [null]
    });

    this.fetchQuizMeta();

    console.log(this.form.controls);

    return;
  }
  fetchQuizMeta() {
    this.quizService.getQuestionMeta(this.quizId).subscribe((data: any) => {
      this.questionType = data.data.question_types;
      console.log(this.questionType);
    });
  }

  saveAndGoBack() {
    this.nextStageEvent.emit(DIRECTION.BACKWARD);
  }

  // clearForm(ms: number) {
  //   (<HTMLFormElement>document.querySelector(".create")).reset();
  // }

  onQuestion() {
    this.router.navigate(['/quiz/viewquestion']);
  }

  setAnswer(elem: HTMLInputElement, optionIndex: number): void {
    elem.checked = true;
    this.f['mcqOpts']['controls'].forEach(opt => {
      opt.patchValue({ isAnswer: false });
    });
    (this.f['mcqOpts']['controls'][optionIndex] as FormControl).patchValue({
      isAnswer: elem.checked
    });
    console.log(this.f['mcqOpts'].value);
  }

  makeFieldObj(): FormGroup {
    return this.fb.group({
      textarea: [null],
      inputarea: ['#'],
      check_box_area: [null]
    });
  }

  addField() {
    (<FormArray>this.f['checkBoxOptions']).push(this.makeFieldObj());
  }

  deleteField(customFieldOpts) {
    (this.f['checkBoxOptions'] as FormArray).removeAt(customFieldOpts);
  }
  getAnswers(type, answer, fillInTheGap?) {
    if (answer) {
      let checkBoxANswer = [];
      let radioAnswer = {};
      if (type.includes('fill_in')) {
        console.log('yes fill in');
        return fillInTheGap;
      }
      if (type === 'multiple_choice_checkbox') {
        answer.forEach(element => {
          checkBoxANswer.push({ key: element.label, value: element.text });
        });
        return checkBoxANswer;
      } else if (type === 'multiple_choice_radio') {
        answer.forEach(element => {
          radioAnswer = { key: element.label, value: element.text };
        });
        return radioAnswer;
      }
    } else {
    }
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    // if (this.form.invalid) {
    //   return;
    // }
    this.loading = true;

    // submit via service
    // mock submitting
    // since Backend isnt ready

    const { value } = this.form;
    // console.log(value);

    const answers = this.getAnswer(value.mcqOpts);
    const option = [];
    let newAnswer = {};
    let multiAnswer = [{}];
    value.mcqOpts.forEach(element => {
      option.push({ key: element.label, value: element.text });
    });

    answers.forEach(element => {
      newAnswer = { key: element.label, value: element.text };
    });
    const expectedFormat = {
      type: value.type,
      name: value.name,
      options: option,
      answers: this.getAnswers(value.type, answers, value.questionAnswer),
      score: value.score
    };

    console.log(expectedFormat);
    console.log(value.questionAnswer);
    this.quizService.postQuestion(this.quizId, expectedFormat).subscribe(
      success => {
        this.toaster.successToastr(
          'Your Question has been Successfully Created',
          null,
          { toastrTimeout: 3000 }
        );
        console.log(success);
        this.loading = false;
        this.form.reset();
      },
      err => {
        this.toaster.errorToastr('Sorry, Question not Created. Try again.');
        console.error(err);
        this.loading = false;
      }
    );

    return;
  }

  getAnswer(options: any[]): any[] {
    return options.filter(opt => opt.isAnswer);
  }
}
