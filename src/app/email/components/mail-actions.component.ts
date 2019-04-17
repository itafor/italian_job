
import { Component, ViewEncapsulation,
  ChangeDetectionStrategy, Input,
  Output, EventEmitter, OnChanges,
  SimpleChanges, OnInit, OnDestroy
 } from '@angular/core';

 import { OnwardActions, MetadataUpdates, BulkActions } from '../enums';
 import { BehaviorSubject } from 'rxjs';


@Component({
  selector: 'app-email-actions',
  encapsulation: ViewEncapsulation.Emulated,
  template: `
  <nav class="navbar custom-navbar px-0" [ngClass]=" {'preview': previewPane} ">
  <div class="nav navbar-nav">
    <div class="nav-item  mr-1" *ngIf="!previewPane && navPane">
      <input type="checkbox" (click)="interceptEvent($event, bulkActionsHandler)"
      [checked]="(fromOthersSelected | async).allSelected" *ngIf="bulkActivated">
    </div>
    <div class="nav-item mx-3 d-lg-none" *ngIf="showNavToggle && !previewPane">
      <a (click)="toggleNav()" class="nav-link" href="javascript:;">
        <i class="icon ion-navicon"></i>
      </a>
    </div>

    <div class="nav-item  {{margin}}" *ngIf="showIfNavPane() || previewPane">
      <span data-action="archive" class="nav-link" container="body" placement="bottom"
      ngbTooltip="Archive"
      (click)="interceptEvent($event, makeABulkAction, bulkActionType.BULK_ARCHIVE)">
        <i class="icon ion-ios-albums"></i>
      </span>
    </div>

    <div class="nav-item  {{margin}}" *ngIf="(showIfNavPane() || previewPane) && showMarkAsRead">
      <span data-action="read" class="nav-link" container="body" placement="bottom"
      ngbTooltip="Mark As Read"
      (click)="interceptEvent($event, makeABulkAction, bulkActionType.BULK_READ)">
        <i class="icon ion-email-unread"></i>
      </span>
    </div>

    <div class="nav-item  {{margin}}" *ngIf="(showIfNavPane() || previewPane) && !quarantined">
      <span data-action="delete" class="nav-link" container="body" placement="bottom"
      ngbTooltip="Send to trash"
      (click)="interceptEvent($event, makeABulkAction, bulkActionType.BULK_DELETE)">
        <i class="icon ion-ios-trash delete--icon"></i>
      </span>
    </div>

    <div class="nav-item mr-3" *ngIf="!previewPane && !navPane && quarantined">
      <span data-action="recover" class="nav-link" container="body" placement="bottom"
      ngbTooltip="Recover message"
      (click)="interceptEvent($event)">
        <i class="icon ion-ios-medkit"></i>
      </span>
    </div>

    <div class="nav-item  {{margin}}" *ngIf="!previewPane && !navPane">
      <a href="javascript:;" class="nav-link" container="body"
      placement="bottom" ngbTooltip="Reply"
      data-action="reply"
      (click)="interceptEvent($event, emitReplyToMailEvent)">
        <i class="icon ion-reply"></i>
      </a>
    </div>

    <div class="nav-item mr-3" *ngIf="!previewPane && !navPane">
      <a href="javascript:;" class="nav-link text-muted" container="body" placement="bottom"
      ngbTooltip="Reply all"
      (click)="interceptEvent($event, emitReplyToMailEvent)">
        <i class="icon ion-reply-all"></i>
      </a>
    </div>

    <div class="nav-item mr-3" *ngIf="!previewPane && !navPane">
      <a href="javascript:;" class="nav-link" container="body"
      placement="bottom" ngbTooltip="Forward"
      data-action="forward"
      (click)="interceptEvent($event, emitForwardMailEvent)">
        <i class="icon ion-forward"></i>
      </a>
    </div>

    <div class="nav-item {{margin}}" *ngIf="showIfNavPane() || previewPane">
      <span class="nav-link" container="body" placement="bottom"
      ngbTooltip="Flag" data-action="flag"
      (click)="interceptEvent($event, makeABulkAction, bulkActionType.BULK_FLAG)">
        <i class="icon ion-ios-flag"></i>
      </span>
    </div>
  </div>
</nav>

  `,
  styles: [
    `
      .preview {
        height: 40px;
        min-height: fit-content;
        flex-direction: column;
      }
      .preview i {
        color: grey;
      }

      i.delete--icon:hover {
        color: red;
      }

      span > i {
        cursor: pointer;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmailActionsComponent implements OnChanges, OnInit, OnDestroy {
  @Input() showNavToggle = true;
  @Input() previewPane;
  @Input() navPane;
  @Input() allChecked;
  @Input() quarantined: boolean;
  @Input() showMarkAsRead: boolean;
  @Output() mailNavToggleEvent = new EventEmitter<void>();
  @Output() onwardMailEvent = new EventEmitter();
  @Output() bulkSelectEvent = new EventEmitter();
  @Output() bulkActionEvent = new EventEmitter();
  @Output() deleteMailEvent = new EventEmitter();
  metadataOptions: MetadataUpdates;
  public bulkActionType = BulkActions;
  showBulkActions: boolean;
  bulkActivated = true; // unset when we set up bulk mails
  fromOthersSelected: BehaviorSubject<any> = new BehaviorSubject({allSelected: false, showBulkActions: false});
  toggleNav() {
    this.mailNavToggleEvent.emit();
  }
  emitReplyToMailEvent() {
    this.onwardMailEvent.emit(OnwardActions.REPLY);
  }

  emitForwardMailEvent() {
    this.onwardMailEvent.emit(OnwardActions.FORWARD);
  }

  get margin(): string {
    return this.previewPane ? 'mr-1' : 'mr-3';
  }

  interceptEvent($event: Event, handler?: Function, actionType?: BulkActions) {
    $event.stopPropagation();
    if (handler) {
      handler.call(this, [($event.target as HTMLInputElement), actionType]);
    }
  }

  bulkActionsHandler(selectAllValue) {
    this.bulkSelectEvent.emit(selectAllValue[0].checked);
    this.fromOthersSelected.next({showBulkActions: selectAllValue[0].checked, allSelected: selectAllValue[0].checked});
  }

  makeABulkAction(eventDetail: any[]): void {
    let actionType = eventDetail[1];
    if (this.navPane) {
      // if navpane, emit just the action type
      this.bulkActionEvent.emit(actionType);
    } else {
      // for now, its gonna be on a single mail
      actionType = actionType.replace('BULK', '').trim();
      switch (actionType) {
        case 'DELETE':
          // emkit delete mail event with id of mail
          this.deleteMailEvent.emit();
          return;
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.allChecked) {
      this.fromOthersSelected.next(changes.allChecked.currentValue);
    }
  }

  ngOnInit(): void {
    this.fromOthersSelected.subscribe(data => {
      this.showBulkActions = data.showBulkActions;
    });
  }

  ngOnDestroy(): void {
    this.fromOthersSelected.unsubscribe();
  }

  showIfPreview(): boolean {
    return !!this.previewPane;
  }

  showIfNavPane(): boolean {
    return (this.navPane && this.showBulkActions);
  }
}
