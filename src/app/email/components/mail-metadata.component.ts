import { Component, ViewEncapsulation,
  ChangeDetectionStrategy, Input,
  Output, EventEmitter
 } from '@angular/core';

 import { MetadataUpdates } from '../enums';

@Component({
  selector: 'app-email-metadata',
  encapsulation: ViewEncapsulation.Emulated,
  template: `
  <nav class="navbar custom-navbar px-0 flex-column">
  <div class="nav navbar-nav height__40 width__fix">
    <div class="nav-item  mr-1">
      <input type="checkbox"
      (click)="interceptEvent($event, metadataOptions.SELECTED, selectMailHandler)"
      [checked]="checkedState"
      *ngIf="bulkActivated">
    </div>

    <div class="nav-item  mr-1">
      <span class="nav-link" container="body" placement="bottom"
      ngbTooltip="{{ starStatus  }}"
      data-action="star"
      (click)="interceptEvent($event, null)">
        <i class="icon ion-ios-star" [ngClass]="  {'active': mail.starred} "></i>
      </span>
    </div>

    <div class="nav-item mr-3">
      <span class="nav-link" container="body" placement="bottom"
      ngbTooltip="{{ importantStatus }}"
      data-action="important"
      (click)="interceptEvent($event, null)">
        <i class="icon ion-ios-pricetag" [ngClass]="  {'active': mail.important} "></i>
      </span>
    </div>

    <div class="nav-item  mr-1">
      <span class="nav-link" container="body"
      *ngIf="!mail.read && showRead"
      data-action="read"
      placement="bottom" ngbTooltip="Mark as Read"
      (click)="interceptEvent($event, metadataOptions.READ, updateMailMetadata)">
        <i class="icon {{ readIcon }}"></i>
      </span>
    </div>
  </div>
</nav>

  `,
  styles: [
    `
      i.active {
        color: yellow
      }

      i {
        color: grey
      },

      .height__40 {
        height: 40px; // same as anchor tag holding email summary
      }

      .nav-item > * {
        padding: 0;
      }

      .nav-item {
        height: 40px;
      }

      .width__fix {
        min-width: 139px;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmailMetadataComponent {
  @Input() mail;
  @Input() checkedState: boolean;
  @Input() showRead: boolean;
  @Output() replyToMailEvent = new EventEmitter();
  @Output() mailSelectedEvent = new EventEmitter(); // may output mail id, on id from array
  @Output() mailStarredUpdatedEvent = new EventEmitter();
  @Output() mailImportantStatusUpdatedEvent = new EventEmitter();
  @Output() mailReadStatusUpdatedEvent = new EventEmitter();
  metadataOptions = MetadataUpdates;
  bulkActivated = true;

  emitReplyToMailEvent() {
    this.replyToMailEvent.emit();
  }

  get starStatus() {
    return 'Star this mail';
  }

  get importantStatus () {
    return 'Mark mail as Important';
  }

  get readIcon(): string {
    return (this.mail.read ? 'ion-email' : 'ion-email-unread');
  }

  interceptEvent($event: Event, updateType: MetadataUpdates, handler?: Function) {
    $event.stopPropagation();
    if (handler) {
      switch (updateType) {
        case MetadataUpdates.SELECTED:
          handler.call(this, [($event.target as HTMLInputElement)]);
          return;
        case MetadataUpdates.READ:
          handler.call(this, [!this.mail.read]);
          return;
      }
    }
  }

  selectMailHandler(checked): void {
    checked = checked[0].checked;
    this.mailSelectedEvent.emit({
      id: this.mail.id,
      checked
    });
  }

  updateMailMetadata(updatedReadStatus: boolean) {
    updatedReadStatus = updatedReadStatus[0];
    this.mailReadStatusUpdatedEvent.emit({
      id: this.mail.id,
      newReadStatus: updatedReadStatus
    });
  }
}
