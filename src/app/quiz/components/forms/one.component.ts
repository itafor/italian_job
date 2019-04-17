import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';

import { CustomValidators } from '../../../core/forms/validators';
import { InputParserService } from '../../../core/forms/helpers';
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
  selector: 'app-quiz-create-step-one',
  templateUrl: './one.component.html',
  providers: [NgbProgressbarConfig],
  styleUrls: ['./one.component.scss'],
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
export class CreateFormStepOneComponent implements OnInit, OnDestroy {
  @Output() nextStageEvent = new EventEmitter();
  public form: FormGroup;
  showAlert: boolean;

  loading = false;
  requiredPrompt = 'This field is required';

  constructor(
    private fb: FormBuilder,
    private formPresistence: DataService,
    public parser: InputParserService,
    config: NgbProgressbarConfig,
    private _quizService: QuizService
  ) {
    config.max = 1000;
    config.striped = true;
    config.animated = true;
    config.type = 'success';
    config.height = '20px';
  }

  getStartingChecked(): string {
    return this.formPresistence.readBack('one').is_public;
  }

  ngOnInit(): void {
    const one = this.formPresistence.readBack('one');
    this.form = this.fb.group({
      title: [
        one.title,
        Validators.compose([Validators.required, Validators.maxLength(100)])
      ],
      description: [one.description],
      recipients: [''],
      is_public: [one.is_public, Validators.required]
    });

    this.parser.initFormattedInputs(
      this.formPresistence.readBack('one').recipients
    );

    this.form.controls['is_public'].valueChanges.subscribe(() => {
      if (this.form.controls.is_public.value === 'true') {
        this.updateValidatorsForControl(this.f['recipients'], null);
      } else {
        this.updateValidatorsForControl(
          this.f['recipients'],
          Validators.compose([
            Validators.pattern(CustomValidators.EMAIL_REGEX),
            CustomValidators.parsedInputsExists(this.parser.formattedInputs)
          ])
        );
      }
    });
  }

  get f() {
    return this.form.controls;
  }

  updateValidatorsForControl(
    control: FormControl | AbstractControl,
    newValidators: ValidatorFn | ValidatorFn[]
  ): void {
    control.setValidators(newValidators);
    control.updateValueAndValidity();
  }

  removeAndUpdateValidity(mailIndex: number): void {
    this.parser.removeFromDelimited(mailIndex);
    this.form.controls['recipients'].updateValueAndValidity();
  }

  ngOnDestroy(): void {
    const valueIncludingParsedEmails = {
      ...this.form.value,
      // for checking if  changes
      recipients: this.allEmails.length ? this.allEmails : ''
    };
    this.formPresistence.save('one', valueIncludingParsedEmails);
  }

  get receivers() {
    return this.form.controls.recipients;
  }

  receipientsRequired(): boolean {
    return this.form.controls.is_public.value === 'false';
  }

  hideRecipientField(): boolean {
    return !this.receipientsRequired() ? true : false;
  }

  parseField() {
    this.receivers.setValue(
      this.parser.parseRecipientField(this.form.value.recipients, ',')
    );
  }

  get allEmails(): string[] {
    const trailingVal = this.form.value.recipients.trim();
    const parsedValues = [...this.parser.formattedInputs];
    if (trailingVal.length) {
      parsedValues.push(trailingVal);
    }
    return parsedValues;
  }

  castToBoolean(value: string): boolean {
    return value === 'true';
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    // loading init
    this.loading = true;
    const { value } = this.form;
    const expectedFormat = {
      is_public: this.castToBoolean(value.is_public),
      title: value.title,
      description: value.description,
      recipients: this.allEmails
    };
    // compare curreent value with value in storage
    // CHANGE THIS WHEN
    if (this.updatesMade()) {
      // we've edited the values
      this._quizService
        .publishStep('one', this._quizService.id, expectedFormat)
        .subscribe(
          success => {
            console.log(success);
            this._quizService.setId(success.data);
            this.nextStageEvent.emit();
            this.loading = false;
          },
          err => {
            console.error(err);
            this.loading = false;
          }
        );
    } else {
      this.nextStageEvent.emit();
    }
  }

  updatesMade(): boolean {
    // compare what is in service to what is in form value
    const formValueBeforeNextStage = this.form.value;
    const valuesInStorage = this.formPresistence.readBack('one');
    const changes: boolean[] = [];

    for (const property in formValueBeforeNextStage) {
      if (formValueBeforeNextStage.hasOwnProperty(property)) {
        // check the types
        if (typeof formValueBeforeNextStage[property] !== typeof valuesInStorage[property]) {
          return true;
        } else {
          const objComparison = JSON.stringify(formValueBeforeNextStage[property]) === JSON.stringify(valuesInStorage[property]);
          if (objComparison) {
            changes.push(false);
          } else {
            changes.push(true);
            return true;
          }
        }
      }
    }
    return changes.some(item => item === true);
  }
}
