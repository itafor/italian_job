import { Component, Input, Output, ChangeDetectionStrategy, EventEmitter,
  ViewChild, ElementRef, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { CommentDetails } from './interfaces';
import { Formatter as QuabblyFormatter } from '../core/helpers/formatter';
@Component({
  selector: 'app-quabbly-comment-component',
  template: `
  <div class="task-comments" style="padding-left: 0; margin-left: -7px;">
    <div class="commenter_avatar__container">
      <div class="commenter__avatar">
          <!-- may be replaced by images later -->
          <!-- <img src="/assets/images/gravatar_profile.png" alt="Avatar of {{ comment.userName }}"> -->
          <span class="user__widget--icon" style="padding:0;">{{ initialsOf(comment.userName) }}</span>
      </div>
    </div>
    <div class="task-comments__details">
        <p class="task-comments__meta">
          <span class="commenter__name"> {{ comment.userName }} </span> |
           <span class="comment__meta">  {{  comment.createdAt | timeAgo }}
           <span *ngIf="hasBeenEdited" style="font-size: 0.8em;">(edited)</span></span>
        </p>
        <p class="task-comments__comment" *ngIf="!editState" #commentRef
        [innerHTML]="_formatter.processCompletely(comment.comment)"></p>
        <textarea *ngIf="editState" class="task-comments__comment"
        [style]="initTextBoxHeight | sanitizeTaskStyle" #commentTextBox>{{ comment.comment }}</textarea>
        <div class="actions" *ngIf="authorizedToModifyComment">
          <span title="{{  editText }} comment" (click)="switchBtnAction()">{{ editText }}</span>
          <span *ngIf="loading" style="cursor: text;"><i class="fa fa-spinner fa-spin"></i></span>
          <span title="Delete  comment" (click)="confirmDelete()" *ngIf="!editState">Delete</span>
          <span *ngIf="editState && !loading" title="Discard Changes" (click)="toggleEditState()" style="color: red;">Cancel</span>
          <span *ngIf="error" class="text-danger" style="cursor: text;text-decoration: none;margin-left: 5%;">{{  error }}</span>
        </div>
    </div>
  </div>
  `,
  styleUrls: [
    './task/taskmanager.component.scss',
    './task-page/task-page.component.scss',
],
  styles: [
    `
      .actions {
        display: flex;
        width: 100%;
        margin-bottom: 20px;
      }

      .actions > span {
        text-decoration: underline;
        cursor: pointer;
      }

      .actions > span:nth-child(2) {
        margin-left: 5%;
      }

      textarea.task-comments__comment {
        /* retain size as paragraph, so add margin bottom */
        margin-bottom: 1em;
        max-height: 300px;
        border-radius: 5px;
        padding: 10px 5px;
      }

      textarea.task-comments__comment.invalid, textarea.task-comments__comment.invalid:focus {
        outline-color: red;
        border-color: red;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated
})
export class QuabblyCommentComponent implements OnChanges {
  @Input() comment: CommentDetails;
  @Input() authorizedToModifyComment: boolean;
  @Input() error: string;
  @Input() errorTimeout: number;
  @Output() deleteInitiated: EventEmitter<CommentDetails> = new EventEmitter<CommentDetails>();
  @Output() commentUpdated: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('commentRef') refCommentText: ElementRef;
  @ViewChild('commentTextBox') refCommentTextBox: ElementRef;
  editState: boolean;
  editText = 'Edit';
  initialCommentTextBoxHeight: string;
  loading: boolean;

  constructor(public _formatter: QuabblyFormatter) {}

  initialsOf(name: string): string {
    return name.match(/\b(\w)/g).join('').substr(0, 2) || 'NA';
  }

  confirmDelete(): void {
    this.deleteInitiated.next(this.comment);
  }

  toggleEditState(): void {
    this.editState = !this.editState;
    this.editText = (this.editState ? 'Update' : 'Edit');
    this.clearError();
  }

  initEdit(): void {
    this.initialCommentTextBoxHeight = window.getComputedStyle(this.refCommentText.nativeElement)['height'];
    this.toggleEditState();
  }

  switchBtnAction(): void {
    if (!this.editState) {
      this.initEdit();
    } else {
      this.updateComment();
    }
  }

  get initTextBoxHeight(): string {
    // add 20 px cos of padding
    return `height: ${parseFloat(this.initialCommentTextBoxHeight) + 20}px`;
  }

  updateComment(): void {
    const updatedComment = (this.refCommentTextBox.nativeElement as HTMLTextAreaElement).value.trim();
    if (updatedComment.length) {
      this.commentUpdated.emit(updatedComment);
      this.loading = true;
    } else {
      const currClassNames = (this.refCommentTextBox.nativeElement as HTMLTextAreaElement).getAttribute('class');
      (this.refCommentTextBox.nativeElement as HTMLTextAreaElement)
        .setAttribute('class', currClassNames.replace('invalid', '').concat(' invalid'));
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['error'].firstChange) {
      this.loading = false;
      if (this.errorTimeout) {
        setTimeout(this.clearError, this.errorTimeout);
      }
    }
  }

  clearError() {
    this.error = null;
  }

  get hasBeenEdited(): boolean {
    return !!this.comment.lastUpdatedTime;
  }
}
