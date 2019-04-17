import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-basic',
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.scss']
})
export class BasicComponent implements OnInit {



  public form: FormGroup;
  public choose = '';
  post: any;
  question: string = '';

  setvalue(drp: any) {
    this.choose = drp.target.value;
  }



  constructor(private fb: FormBuilder) {
    this.form = fb.group({
      'question': [null, Validators.required],
      'validate': ['', Validators.required]
    });
  }


  onSubmit(post) {
    this.question = post.question;
  }


  ngOnInit() {
    this.form.valueChanges.subscribe(changes => console.log(changes));
  }




}








