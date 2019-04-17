import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { TaskManagerService } from 'src/app/taskmanager/taskmanager.service';
import { first } from 'rxjs/operators';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AlertService } from 'src/app/components/alert/alert.service';


@Component({
  selector: 'app-create-fields',
  templateUrl: './create-fields.component.html',
  styleUrls: ['./create-fields.component.scss']
})
export class CreateFieldsComponent implements OnInit {
  public form: FormGroup;
  loading = false;
  createButton = true;

  @Output() fieldsCreatedSuccessfulEvent = new EventEmitter();

  constructor(private taskmanagerService: TaskManagerService,
    private fb: FormBuilder, public toastr: ToastrManager,
    private alertService: AlertService, private route: ActivatedRoute) { }
  projectInfo;
  projectID;
  types = ['NUMBER', 'MONEY', 'DATE', 'TEXT'];


  ngOnInit() {
    this.form = this.fb.group({
      name: [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
      description: [null, Validators.compose([Validators.required])],
      type: [null, Validators.compose([Validators.required])]
    });
    this.route.params.subscribe(params => {
      this.projectID = params['id'];
    });
  }
  get f() {
    return this.form.controls;
  }

  isBtnDisabled() {
    return this.form.invalid || this.loading;
  }

  onSubmit(evt: Event) {
    evt.preventDefault();
    this.loading = true;
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
   
    const name = this.f.name.value;
    const description = this.f.description.value;
    const type = this.f.type.value;

    this.taskmanagerService.createField(this.projectID,description, name, type)
      .pipe(first())
      .subscribe(
        successRes => {
          this.toastr.successToastr('Field Created Successfully', null, { maxShown: 1 });
          this.fieldsCreatedSuccessfulEvent.emit(successRes['field']);
          this.form.reset();
        },
        error => {
          this.loading = false;
          this.alertService.error(error, true);
        },
        () => {
          this.loading = false;
        }

      );
  }


}
