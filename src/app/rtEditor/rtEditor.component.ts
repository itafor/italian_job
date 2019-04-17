import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { SupportedThemes, AccessorTypes, ToolbarPosition } from './enums';
import { of, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { DefaultConfigs } from './config';


@Component({
  selector: 'app-quabbly-rteditor',
  template: `
    <quill-editor [style]="style" [theme]="theme"
    (onEditorCreated)="defaultFocusEvent($event)"
    [sanitize]="true"
    customToolbarPosition="{{ customPosition }}"
    *ngIf="formControl" [formControl]="formControl" [placeholder]="placeholder"
    [modules]="modules">

    </quill-editor>
    <quill-editor [style]="style" [theme]="theme"
    (onEditorCreated)="defaultFocusEvent($event)"
    *ngIf="data" [(ngModel)]="data"
    [sanitize]="true"
    (ngModelChange)="modelChanges.next(data)"
    [placeholder]="placeholder"
    customToolbarPosition="{{ customPosition }}">
    </quill-editor>
  `,
  styleUrls: ['../email/containers/create/create.component.scss'],
  styles: [
    `
    quill-editor div.ql-toolbar.ql-snow {
      border-radius: 10px !important;
    }
    `
  ]
})
export class QuabblyRtEditorComponent implements OnInit {

  @Input() style;
  @Input() theme: SupportedThemes;
  @Input() autoFocus: boolean;
  @Input() formControl: AbstractControl;
  @Input() data: string;
  @Input() placeholder: string;
  @Input() customPosition;
  @Output() modelChanges = new EventEmitter<string>();
  @Input() modules;
  accessor: any;

  ngModelChanges$: Observable<string>;

  constructor(
  ) { }

  ngOnInit() {
    this.ensureCorrectAccessor();
    if (!this.customPosition) {
      this.customPosition = ToolbarPosition.TOP;
    }
    if (!this.style) {
      this.style = {
        height: DefaultConfigs.height,
        'border-radius': '10px',
        'margin-': '20px'
      };
    }

    if (!this.modules) {
      this.modules = DefaultConfigs.modules;
    }
    if (!this.placeholder) {
      this.placeholder = DefaultConfigs.placeholder;
    }
    if (this.data) {
      this.ngModelChanges$ = of(this.data).pipe(
        debounceTime(500),
        distinctUntilChanged()
      );
      this.ngModelChanges$.subscribe(changes => {
        this.modelChanges.next(changes);
      });
    }
  }

  defaultFocusEvent(event) {
    if (this.autoFocus) {
      event.focus();
    }
  }

  ensureCorrectAccessor(): void {
    if (this.formControl && this.data) {
      throw new Error('Specify either NGMODEL or FORMCONTROL, not both');
    }
  }
}
