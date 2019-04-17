import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
import { ActivatedRoute } from '@angular/router';

interface templateResponse {
  template: any[]
}

@Component({
  selector: 'app-update-template',
  templateUrl: './update-template.component.html',
  styleUrls: ['./update-template.component.scss']
})
export class UpdateTemplateComponent implements OnInit {
  @ViewChild('codemirrortextarea') textareaobj: ElementRef;
  @ViewChild('codemirrortextareapreview') previewFrame: ElementRef;

  public form: FormGroup;
  public codemirror: CodeMirror;
  public theRouter: Router;
  public templateOne: any;
  public currentTemplateId: string;
  loading = false;
  submitted = false;
  showAlert = false;
  responsemsg = 'There were some errors';
  listTemplate = '/notifications/list-template';

  constructor(private fb: FormBuilder, private router: Router, private templateService: TemplateService, private actvroute: ActivatedRoute) { }

  ngOnInit() {
    const theRouter = this.router;

    this.actvroute.snapshot.params.id ? this.currentTemplateId = this.actvroute.snapshot.params.id : theRouter.navigate([this.listTemplate]);
    
    this.templateService.fetchOne(this.currentTemplateId).subscribe((data: templateResponse) => {
      data && data.template ? this.templateOne = data.template : theRouter.navigate([this.listTemplate]);
      this.initCodemirror();
      this.initformdata();
    });

    this.form = this.fb.group({
      templateName: ['', Validators.compose([Validators.required])],
      defaultSubject: ['', Validators.compose([Validators.required])],
      defaultFrom: ['', Validators.compose([Validators.required])],
      defaultFromName: ['', Validators.compose([Validators.required])],
      textContent: ['']
    });

    this.codemirror = CodeMirror.fromTextArea(this.textareaobj.nativeElement, {
      mode: "text/html",
      theme: "dracula",
      lineNumbers: true,
      lineWrapping: true,
    });

  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.form.invalid) {
        return;
    }

    this.loading = true;

    const updatedHtmlContent = this.codemirror;
    const htmlContent = updatedHtmlContent.getValue();

    this.templateService.edit(this.f.templateName.value, this.f.defaultSubject.value, this.f.defaultFrom.value, this.f.defaultFromName.value, htmlContent, this.f.textContent.value, this.templateOne.templateId)
        .pipe(first())
        .subscribe(
            data => {
              const theRouter = this.router;
              theRouter.navigate([this.listTemplate]);
            },
            error => {
                this.responsemsg = error;
                this.loading = false;
                this.showAlert = true;
            });
    
  }

  initformdata(){
    this.form = this.fb.group({
      templateName: [this.templateOne.templateSecret.templateName, Validators.compose([Validators.required])],
      defaultSubject: [this.templateOne.templateSecret.defaultSubject, Validators.compose([Validators.required])],
      defaultFrom: [this.templateOne.templateSecret.defaultFrom, Validators.compose([Validators.required])],
      defaultFromName: [this.templateOne.templateSecret.defaultFromName, Validators.compose([Validators.required])],
      textContent: [this.templateOne.templateSecret.textContent]
    });
  }

  initCodemirror(){

    const thePreviewFrame = this.previewFrame;

    const codemirrorEditor = this.codemirror;

    const editDataConst = this.templateOne;

    setTimeout(function(){
      
      codemirrorEditor.on("change", function() {
        setTimeout(function(){
          var preview =  thePreviewFrame.nativeElement.contentDocument ||  thePreviewFrame.nativeElement.contentWindow.document;
          preview.open();
          preview.write(codemirrorEditor.getValue());
          preview.close();
        }, 300);
      });

      if(editDataConst.templateSecret.htmlContent){
        codemirrorEditor.setValue(editDataConst.templateSecret.htmlContent);
      }

    }, 200);
      
  }

}
