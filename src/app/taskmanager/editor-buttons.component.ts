import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import 'quill-emoji/dist/quill-emoji.js';

class DefaultConfigs {
  static placeholder =  'No Description yet...';
  static sanitize =  true;
  static height =  'auto';
  static modules = {
    'emoji-shortname': true,
    'emoji-toolbar': true,
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['link'],                   // link and image, video
      ['emoji']
    ]
  };
}

const emojiModules = {
  'emoji-shortname': true,
  'emoji-textarea': true,
  'emoji-toolbar': true,
};

@Component({
  selector: 'app-editor-with-buttons',
  template: `
    <quill-editor [style]="style"
    (onEditorCreated)="defaultFocusEvent($event)"
    [(ngModel)]="data"
    [sanitize]="true"
    [modules]="modules"
    [placeholder]="placeholder"
    trackChanges="all"
    >
    </quill-editor>
    <div class="cta__container">
      <button class="btn btn-primary" (click)="initUpdate()"
      [disabled]="submitting">Update</button>
      <button class="btn btn-light"
      [disabled]="submitting"
      (click)="cancel.emit()">Cancel</button>
      <span [ngClass]=" submitting ? '': 'd-none' "><i class="fa fa-spinner fa-spin"></i></span>
    </div>
  `,
  styleUrls: ['../email/containers/create/create.component.scss'],
  styles: [
    `
    :host {
      display: block;
    }
    quill-editor div.ql-toolbar.ql-snow {
      border-radius: 10px !important;
    }

    .cta__container {
      margin: 10px 0 0 0;
    }

    .cta__container button {
      margin-right: 5%;
    }
    `
  ]
})
export class EditorWithButtonsComponent implements OnInit {
  @Input() autoFocus: boolean;
  @Input() formControl: AbstractControl;
  @Input() style;
  @Input() data: string;
  @Input() placeholder: string;
  @Output() submit: EventEmitter<string> = new EventEmitter();
  @Output() cancel = new EventEmitter();
  modules: any;
  submitting = false;
  constructor(
  ) { }

  ngOnInit() {
    if (!this.style) {
      this.style = {
        height: DefaultConfigs.height,
        'border-radius': '10px',
        'margin-': '20px',
        'min-height': '200px',
        'border-top-left-radius': '0px',
        'border-top-right-radius': '0px',
        'margin-top': '-27px',
        'padding-top': '20px',
      };
    }
    this.modules = DefaultConfigs.modules;
    this.placeholder = DefaultConfigs.placeholder;
  }

  defaultFocusEvent(event) {
    if (this.autoFocus) {
      event.focus();
    }
  }

  initUpdate(): void {
    this.submitting = true;
    this.submit.emit(this.data);
  }
}
