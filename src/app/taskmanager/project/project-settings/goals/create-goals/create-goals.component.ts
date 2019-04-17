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
  selector: 'app-create-goals',
  templateUrl: './create-goals.component.html',
  styleUrls: ['./create-goals.component.scss']
})
export class CreateGoalsComponent implements OnInit {
  public form: FormGroup;
  loading = false;
  createButton = true;

  @Output() goalsCreatedSuccessfulEvent = new EventEmitter();

  constructor(private taskmanagerService: TaskManagerService,
    private fb: FormBuilder, public toastr: ToastrManager,
    private alertService: AlertService, private route: ActivatedRoute) { }

  projectInfo;
  projectID;

  ngOnInit() {
    this.form = this.fb.group({
      name: [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
      description: [null, Validators.compose([Validators.required])],
      startDate: [null, Validators.compose([Validators.required])],
      stopDate: [null, Validators.compose([Validators.required])],
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
    const stopDate = new Date(this.f.stopDate.value);
    const startDate = new Date(this.f.startDate.value);

    this.taskmanagerService.createGoal(this.projectID, description, name, startDate, stopDate)
      .pipe(first())
      .subscribe(
        successRes => {
          this.toastr.successToastr('Goal Created Successfully', null, { maxShown: 1 });
          this.goalsCreatedSuccessfulEvent.emit(successRes['goal']);
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
