import { Component, ViewEncapsulation, ChangeDetectionStrategy, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-email-prompt',
  encapsulation: ViewEncapsulation.None,
  template:
  `
      <div class="modal-header">
        <h5 class="modal-title">
        <span class="box--shadow__wrap">
          <i class="fa fa-cloud-upload"></i>
        </span>
        {{ header }}
        </h5>
        <span aria-hidden="true" class="close" data-dismiss="modal"
          aria-label="Close" (click)="activeModal.dismiss('Cross click')">&times;</span>
      </div>
      <div class="modal-body">
        <p class="lead" [innerHTML]="content | sanitizeHtml"></p>
      </div>
      <div class="modal-footer">
        <button style="height: 1px;width: 1px;border: 0;padding: 0;" autofocus></button>
        <button type="button" class="btn btn-primary rounded__edges" data-dismiss="modal"
        (click)="activeModal.dismiss('Cross click')">Ok, got it!!!</button>
      </div>
  `,
  styles: [
    `
      .close {
        cursor: pointer;
      }
      .modal-title, .modal-footer {
        font-family: 'Trebuchet MS', inherit;
      }
      .box--shadow__wrap {
        border-radius: 50%;
        border: 1px transparent;
        background-color: #4c2a934d;
        padding: 10px 12px;
        height: 60px;
        width: 60px;
        margin-right: 10px;
      }
      .rounded_edges {
        border-radius: 5px;
      }

      .modal-header {
        border-bottom: 0;
      }

      .modal-footer {
        border-top: 0;
      }

      .modal-content {
        width: 300px;
      }

      .modal-title {
        margin-top: 10px;
      }

      .modal-body {
        padding: 0.8em;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmailPromptComponent {
  @Input() header: string;
  @Input() content: string;
  constructor(public activeModal: NgbActiveModal) {}
}
