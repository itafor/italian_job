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
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-setquestions',
  templateUrl: './setquestions.component.html',
  styleUrls: ['./setquestions.component.scss']
})

export class SetquestionsComponent implements OnInit {
// @Output() nextStageEvent: EventEmitter<DIRECTION> = new EventEmitter();


  QuestionType = [
    'Multiple Choice',
    'Multiple Choice (drop down)',
    'Multiple Choice (True / False)',
    'Multiple Choice (Yes / No)',
    'Multiple Choice (Check Box)',
    'Fill-in-the-Blank',
    ''
  ];

  public form: FormGroup;
  public correct = '';
  public choose = '';
  post: any;
  question: string = '';

  setvalue(drp: any) {
    this.choose = drp.target.value;
  }

  constructor(private fb: FormBuilder) {
    this.form = fb.group({
      question: [null, Validators.required],
      validate: ['', Validators.required]
    });
  }

  onSubmit(submit) {
    this.question = submit.question;
  }

  ngOnInit() {
    this.form.valueChanges.subscribe(changes => console.log(changes));
  }
  saveAndGoBack() {
   // this.nextStageEvent.emit(DIRECTION.BACKWARD);
  }
}
