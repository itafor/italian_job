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
import {
  trigger,
  style,
  transition,
  animate,
  keyframes,
  query,
  stagger
} from '@angular/animations';
import {
  NgbActiveModal,
  NgbProgressbarConfig
} from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-quiz',
  templateUrl: './view-quiz.component.html',
  providers: [NgbProgressbarConfig],
  styleUrls: ['./view-quiz.component.scss'],
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
})
export class ViewQuizComponent implements OnInit {
  @Output() nextStageEvent: EventEmitter<DIRECTION> = new EventEmitter();

  public form: FormGroup;
  public quizData;
  public loading;
  public quizId;
  public quizListLink = '/quiz/list';
  public quizTitle;
  public quizDurationHours;
  public quizDurationMinutes;
  quizSetting;

  constructor(
    private router: Router,
    private actvroute: ActivatedRoute,
    public formPersistence: DataService,
    config: NgbProgressbarConfig,
    private quizService: QuizService
  ) {
    config.max = 1000;
    config.striped = true;
    config.animated = true;
    config.type = 'success';
    config.height = '20px';
  }

  // onSubmit() {
  //   this.nextStageEvent.emit();
  // }
  ngOnInit() {
    this.actvroute.snapshot.params.id
      ? (this.quizId = this.actvroute.snapshot.params.id)
      : this.router.navigate([this.quizListLink]);
    this.loading = true;
    this.quizId = this.actvroute.snapshot.params.id || this.quizService.id;
    this.getQuizSetting();
    this.getQuiz();
  }

  getQuiz() {
    this.quizService.getQuiz(this.quizId).subscribe(data => {
      console.log(data);
      if (data) {
        this.quizData = data.data;
        this.quizTitle = data.data.title;
      }
      this.loading = false;
    });
  }
  getQuizSetting() {
    this.quizService.getQuizSetting(this.quizId).subscribe((data: any) => {
      this.quizSetting = data.data;
      console.log(data);
    });
  }

  onSubmit() {
    this.router.navigate(['quiz/list']);
  }

  saveAndGoBack() {
    this.nextStageEvent.emit(DIRECTION.BACKWARD);
  }
  getHours(time) {
    const hours = time / 60;
    return Math.floor(hours) + ' Hours';
  }
  getMinutes(time) {
    const minute = time % 60;
    return Math.floor(minute) + ' Minutes';
  }

  createQuizQuestion() {
    this.router.navigate(['quiz/create-question/' + this.quizId]);
  }
}
