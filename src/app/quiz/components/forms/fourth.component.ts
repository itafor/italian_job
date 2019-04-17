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

@Component({
  selector: 'app-fourth',
  templateUrl: './fourth.component.html',
  providers: [NgbProgressbarConfig],
  styleUrls: ['./fourth.component.scss'],
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
export class FourthComponent implements OnInit {
  @Output() nextStageEvent: EventEmitter<DIRECTION> = new EventEmitter();

  public form: FormGroup;

  constructor(
    public formPersistence: DataService,
    config: NgbProgressbarConfig,
    private formPresistence: DataService,
    private _quizService: QuizService
  ) {
    config.max = 1000;
    config.striped = true;
    config.animated = true;
    config.type = 'success';
    config.height = '20px';
  }

  onSubmit() {
    this.nextStageEvent.emit();

    // stop here if form is invalid

    // this.nextStageEvent.emit();
  }
  ngOnInit() {}

  saveAndGoBack() {
    this.nextStageEvent.emit(DIRECTION.BACKWARD);
  }

  // goBack() {
  // window.history.back();
  //this.location.back();

  //console.log( 'goBack()...' );
  //}

  //log(x) { console.log(x); }
}
