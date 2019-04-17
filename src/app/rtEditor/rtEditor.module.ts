import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';

import { QuabblyRtEditorComponent } from './rtEditor.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    QuillModule,
  ],
  declarations: [
    QuabblyRtEditorComponent,
  ],
  providers: [
  ],
  entryComponents: [],
  exports: [QuabblyRtEditorComponent]
})
export class QuabblyRtEditorModule { }
