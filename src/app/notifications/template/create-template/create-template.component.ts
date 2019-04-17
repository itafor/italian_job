import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { TemplateService } from './../template.service';
import { first } from 'rxjs/operators';
import * as CodeMirror from '../../../../assets/codemirror/codemirror_core/lib/codemirror.js';


@Component({
  selector: 'app-create-template',
  templateUrl: './create-template.component.html',
  styleUrls: ['./create-template.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CreateTemplateComponent implements OnInit {
  @ViewChild('codemirrortextarea') textareaobj: ElementRef;
  @ViewChild('codemirrortextareapreview') previewFrame: ElementRef;

  public form: FormGroup;
  public codemirror: CodeMirror;
  public theRouter: Router;
  loading = false;
  submitted = false;
  listTemplate = '/notifications/list-template';
  createTemplate = '/notifications/create-template';
  showAlert = false;
  responsemsg: any = 'There were some errors';

  constructor(private fb: FormBuilder, private router: Router, private templateService: TemplateService) { }

  ngOnInit() {
    this.form = this.fb.group({
      templateName: [null, Validators.compose([Validators.required])],
      defaultSubject: [null, Validators.compose([Validators.required])],
      defaultFrom: [null, Validators.compose([Validators.required])],
      defaultFromName: [null, Validators.compose([Validators.required])],
      textContent: [null]
    });

    this.codemirror = CodeMirror.fromTextArea(this.textareaobj.nativeElement, {
      mode: 'text/html',
      theme: 'dracula',
      lineNumbers: true,
      lineWrapping: true,
    });

    this.initCodemirror();

  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    const templateName = this.f.templateName.value;
    const defaultSubject = this.f.defaultSubject.value;
    const defaultFrom = this.f.defaultFrom.value;
    const defaultFromName = this.f.defaultFromName.value;
    const updatedHtmlContent = this.codemirror;
    const htmlContent = updatedHtmlContent.getValue();
    const textContent = this.f.textContent.value;

    this.templateService.create(templateName, defaultSubject, defaultFrom, defaultFromName, htmlContent, textContent)
      .pipe(first())
      .subscribe(
        data => {
          this.responsemsg = data;
          const theRouter = this.router;
          theRouter.navigate([this.listTemplate]);
        },
        error => {
          this.responsemsg = error;
          this.loading = false;
          this.showAlert = true;
        });
  }

  initCodemirror() {

    const thePreviewFrame = this.previewFrame;

    const codemirrorEditor = this.codemirror;

    setTimeout(function () {

      codemirrorEditor.on('change', function () {
        setTimeout(function () {
          const preview = thePreviewFrame.nativeElement.contentDocument || thePreviewFrame.nativeElement.contentWindow.document;
          preview.open();
          preview.write(codemirrorEditor.getValue());
          preview.close();
        }, 300);
      });

      const codemirrordefaultvalue = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">' +
        '<html xmlns="http://www.w3.org/1999/xhtml">' +
        '<head>' +
        '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">' +
        '</head>' +
        '<body>' +
        '<table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="body_table">' +
        '<tr>' +
        '<td align="center" valign="top">' +
        '<table border="0" cellpadding="20" cellspacing="0" width="600" id="content">' +
        '<tr>' +
        '<td align="left" valign="top">' +
        '<h1>This is where my content goes.</h1>' +
        '<br>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec interdum mi ac justo tincidunt, scelerisque tristique lorem posuere.' +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td align="center" valign="top">{accountaddress},' +
        '<a href="{unsubscribe}">Unsubscribe</a>.' +
        '</td>' +
        '</tr>' +
        '</table>' +
        '</td>' +
        '</tr>' +
        '</table>' +
        '</body>' +
        '</html>';

      codemirrorEditor.setValue(codemirrordefaultvalue);

    }, 200);

  }

}
