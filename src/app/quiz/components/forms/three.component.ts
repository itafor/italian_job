import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  CUSTOM_ELEMENTS_SCHEMA
} from '@angular/core';
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
import { DIRECTION } from '../../enums';
import { QuizService } from '../../services';
import { QuillModule } from 'ngx-quill';
import { EditorModule } from 'primeng/editor';
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
  selector: 'app-three',
  templateUrl: './three.component.html',
  styleUrls: ['./three.component.scss'],
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
export class ThreeComponent implements OnInit {
  @Output() nextStageEvent: EventEmitter<DIRECTION> = new EventEmitter();
  public form: FormGroup;
  loading = false;
  submitted = false;
  showAlert = false;

  constructor(
    private elem: ElementRef,
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
  }

  public editor;
  public instruction =
    '<p>Type quiz instruction here (Instruction should have more than three words)  </p>';
  public editorOptions = {
    theme: 'snow',
    modules: {
      toolbar: {
        container: [
          [{ placeholder: ['[GuestName]', '[HotelName]'] }], // my custom dropdown
          ['bold', 'italic', 'underline', 'strike'], // toggled buttons
          ['blockquote', 'code-block'],

          [{ header: 1 }, { header: 2 }], // custom button values
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
          [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
          [{ direction: 'rtl' }], // text direction

          [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
          [{ header: [1, 2, 3, 4, 5, 6, false] }],

          [{ color: [] }, { background: [] }], // dropdown with defaults from theme
          [{ font: [] }],
          [{ align: [] }],

          ['clean'] // remove formatting button
        ],
        handlers: {
          placeholder: function(value) {
            if (value) {
              const cursorPosition = this.quill.getSelection().index;
              this.quill.insertText(cursorPosition, value);
              this.quill.setSelection(cursorPosition + value.length);
            }
          }
        }
      }
    }
  };

  onEditorCreated(quill) {
    this.editor = quill;
    console.log('quill is ready! this is current quill instance object', quill);
  }

  onContentChanged({ quill, html, text }) {
    console.log('quill content is changed!', quill, html, text);
  }
  ngAfterViewInit() {
    // Update your dropdown with labels
    let placeholderPickerItems = this.elem.nativeElement.querySelectorAll(
      '.ql-placeholder .ql-picker-item'
    );
    placeholderPickerItems.forEach(
      item => (item.textContent = item.dataset.value)
    );
    // this.elem.nativeElement.querySelector(
    //   '.ql-placeholder .ql-picker-label'
    // ).innerHTML =
    //   'Insert Data Field &nbsp; &nbsp; &nbsp;' +
    //   this.elem.nativeElement.querySelector('.ql-placeholder .ql-picker-label')
    //     .innerHTML;
  }

  ngOnInit(): void {}

  saveAndGoBack() {
    this.nextStageEvent.emit(DIRECTION.BACKWARD);
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

    const expectedFormat = {
      instructions: this.instruction
    };

    this._quizService
      .publishStep('three', this._quizService.id, expectedFormat)
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
}
