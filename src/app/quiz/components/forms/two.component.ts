import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
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
import { DataService } from '../../services/data.service';
import { QuizService } from '../../services';
import {
  trigger,
  style,
  transition,
  animate,
  keyframes,
  query,
  stagger
} from '@angular/animations';
import { NgbActiveModal, NgbProgressbarConfig } from '@ng-bootstrap/ng-bootstrap';
import { DIRECTION } from '../../enums';

enum GRADINGOPTS {
  custom = 'custom_grading',
  cutoff = 'pass_fail'
}
@Component({
  selector: 'app-form2',
  templateUrl: './two.component.html',
  styleUrls: ['./two.component.scss'],
  providers: [NgbProgressbarConfig],
  animations: [
    trigger('stageEnter', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(
          '.6s ease-in',
          keyframes([
            style({ opacity: 0, offset: 0 }),
            style({ opacity: 0.5, offset: 0.3 }),
            style({ opacity: 1, offset: 1 })
          ])
        )
      ])
    ])
  ]
  // styleUrls: ['./two.component.scss']
})
export class Form2Component implements OnInit, OnDestroy {
  shuffles = [
    'Shuffle Questions Only',
    'Shuffle Both Question and Answer',
    'Do Not SHuffle'
  ];
  choices = ['Multiple Choice', 'Fill in the gap', 'mixed'];
  counts = ['Once', 'Two', 'Three', 'four'];
  hours: string[];
  minutes: string[];

  show = false;
  @Output() nextStageEvent: EventEmitter<DIRECTION> = new EventEmitter();

  public form: FormGroup;
  loading = false;
  submitted = false;
  showAlert = false;

  gradingenum = GRADINGOPTS;

  constructor(
    private fb: FormBuilder,
    private formPresistence: DataService,
    config: NgbProgressbarConfig,
    private _quizService: QuizService
  ) {
    config.max = 1000;
    config.striped = true;
    config.animated = true;
    config.type = 'success';
    config.height = '20px';
    this.hours = this.getArrayOfTimes(24);
    this.minutes = this.getArrayOfTimes(60);
  }

  getArrayOfTimes(length: number): string[] {
    return Array(length)
      .fill('')
      .map(
        (v, index) => `${index < 10 ? '0'.concat(index.toString()) : index}`
      );
  }

  ngOnInit() {
    const two = this.formPresistence.readBack('two');
    this.form = this.fb.group({
      quizDurationHours: [two.quizDurationHours || '00'],
      quizDurationMinutes: [two.quizDurationMinutes || '00'],
      navigateQuiz: [two.navigateQuiz],
      retakeQuiz: [two.retakeQuiz],
      quizCategoryQuestion: [two.quizCategoryQuestion, Validators.required],
      shuffleQuestions: [two.shuffleQuestions, Validators.required],
      attemptAll: [two.attemptAll],
      displayResult: [two.displayResult],
      timesAllowedForRetakes: [two.timesAllowedForRetakes],
      quizAvailability: [two.quizAvailability, Validators.required],
      quizAvailableAt: [two.quizAvailableAt],
      resultView: [two.resultView, Validators.required],
      testTime: [two.testTime],
      percentageGradingOption: [
        two.percentageGradingOption,
        Validators.required
      ],
      customPassingGrade: this.fb.array([this.makeGradeObj()]),
      percentageMinimumScore: [50]
    });

    this.form.valueChanges.subscribe(c => console.log(c));

    console.log(this.f['customPassingGrade']);
  }

  makeGradeObj(): FormGroup {
    return this.fb.group({
      grade_name: ['Grade #', Validators.required],
      min_grade: ['80', Validators.required],
      max_grade: ['100', Validators.required]
    });
  }

  addGrade() {
    (this.f['customPassingGrade'] as FormArray).push(this.makeGradeObj());
  }

  ngOnDestroy(): void {
    this.formPresistence.save('two', this.form.value);
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
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
    console.log(value);

    const expectedFormat = {
      quiz_duration: `${value.quizDurationHours}:${value.quizDurationMinutes}`,
      navigate_quiz_back: value.navigateQuiz,
      retake_quiz: value.retakeQuiz,
      times_to_retake_quiz: value.timesAllowedForRetakes,
      quiz_question_category: value.quizCategoryQuestion,
      question_answer_shuffle: value.shuffleQuestions,
      attempt_all_questions: value.attemptAll,
      display_result_after_quiz: value.displayResult,
      quiz_availability: value.quizAvailability,
      quiz_available_at: value.quizAvailableAt,
      percentage_grading_option: value.percentageGradingOption,
      percentage_grading_option_data: this.getExpectedDataForPassing(
        value.percentageGradingOption
      ),
      result_score_form: value.resultView
    };

    console.log(expectedFormat);
    this._quizService
      .publishStep('two', this._quizService.id, expectedFormat)
      .subscribe(
        success => {
          console.log(success);
          if (success && success.data) {
            this._quizService.setId(success.data);
          }
          this.nextStageEvent.emit(DIRECTION.FORWARD);
          this.loading = false;
        },
        err => {
          console.error(err);
          this.loading = false;
        }
      );
  }

  saveAndGoBack() {
    this.formPresistence.save('two', this.form.value);
    this.nextStageEvent.emit(DIRECTION.BACKWARD);
  }

  getExpectedDataForPassing(optionSelected: GRADINGOPTS) {
    switch (optionSelected) {
      case GRADINGOPTS.custom:
        // change numbers to strings
        const mapIntsToStrings: [
          {
            grade_name: string;
            min_grade: string;
            max_grade: string;
          }
        ] = this.form.value.customPassingGrade.map(
          (gradeDetails: {
            grade_name: string;
            min_grade: number;
            max_grade: number;
          }) => {
            return {
              grade_name: gradeDetails.grade_name,
              min_grade: gradeDetails.min_grade.toString(),
              max_grade: gradeDetails.max_grade.toString()
            };
          }
        );
        return mapIntsToStrings;
      case GRADINGOPTS.cutoff:
        return {
          min_score: this.form.value.percentageMinimumScore.toString()
        };
      default:
        throw new Error('Unsupported');
    }
  }
}
