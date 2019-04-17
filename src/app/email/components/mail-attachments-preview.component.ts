import { Component, ViewEncapsulation, ViewChild, ElementRef,
  ChangeDetectionStrategy, Input, OnInit, Output, EventEmitter
 } from '@angular/core';

 import { MailService } from '../email.service';
 import { Attachment, DownloadStatusInterface } from '../interfaces';
 import { HttpErrorResponse } from '@angular/common/http';
 import { DownloadStatus } from '../enums';

@Component({
  selector: 'app-email-attachments-preview',
  encapsulation: ViewEncapsulation.Emulated,
  template: `
    <div class="attachment__container">
      <div *ngFor="let attachment of attachments" class="attachment">
        <div class="attachment--icon">
          <i class="icon ion-android-attach"></i>
        </div>
        <div class="attachment--name" #downloadDivRef>
          <a href="#" download
          (click)="handleDownload($event,attachment)"
          >{{ attachment.name }}</a>&nbsp;
          <br />
          <span> {{ attachment.size }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .attachment {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
      }

        .attachment__container, .attachment__container > * {
          display: flex;
        }

        .attachment__container {
          flex-wrap: wrap;
          flex-direction: row;
        }

        .attachment--icon {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        i.icon {
          font-size: 20px;
        }

        .attachment--name {
          padding: 5px 10px;
          width: 100%;
          text-align: center;
          display: flex;
          font-weight:  300;
          font-family: 'Trebuchet MS', Cambria, Arial, Helvetica, sans-serif
        }
      }

      .attachment__container {
        border: 1px solid #ffa02e;
        padding: 10px 20px;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmailAttachmentsPreviewComponent implements OnInit {
  @Input() attachments: Attachment[];
  @Input() page: number;
  @Output() downloadEvent = new EventEmitter<DownloadStatusInterface>();
  @ViewChild('downloadDivRef') refToDloadDiv: ElementRef;

  constructor(private mailService: MailService) {}

  ngOnInit(): void {
    // consider also
    // its passed as a comma separated string of attchement urls
    if (!Array.isArray(this.attachments)) {
      this.attachments = [this.attachments];
    }
  }

  getIcon(attachmentMimeType: string): string {
    switch (attachmentMimeType) {
      case 'png': case 'jpg': case 'jpeg': case 'image':
        return 'icon ion-image';
      case 'webv': case 'mp4': case 'ogg': case 'video':
        return 'icon ion-ios-videocam';
      case 'pdf':
        return 'icon ion-document';
      default:
        return 'icon ion-information';
    }
  }

  attachmentExtension(attach: Attachment): string {
    const splitDotDelimiter = attach.name.split('.');
    return splitDotDelimiter[splitDotDelimiter.length - 1];
  }

  getAttachmentUrl(attachId: string): string {
    return MailService.downloadAttachmentUrl(attachId);
  }

  getAttachmentMime(attachment: Attachment): string {
    // contentType is currently
    // **/**;
    return attachment.contentType.split(';')[0];
  }

  handleDownload($event: Event, attachment: Attachment) {
    if ($event) {
      $event.preventDefault();
    }
    this.downloadEvent.emit({
      status: DownloadStatus.STARTED
    });
    this.mailService.downloadAttachment(attachment.id, this.page)
      .subscribe(data => {
        const file = new Blob([data], {type: this.getAttachmentMime(attachment)});
        const fileURL = URL.createObjectURL(file);
        const link = document.createElement('a');
        link.setAttribute('href', fileURL);
        link.setAttribute('download', attachment.name);
        this.refToDloadDiv.nativeElement.append(link);
        link.click();
        // you may lose access to download cos blob is revoked
        // window.open(fileURL, '_blank');
        setTimeout(() => {
          URL.revokeObjectURL(fileURL);
          this.refToDloadDiv.nativeElement.removeChild(link);
        }, 10);
      },
     (error: HttpErrorResponse) => {
      this.downloadEvent.emit({
        status: DownloadStatus.ERRORED,
        payload: error.message
      });
     },
     () => {
      this.downloadEvent.emit({
        status: DownloadStatus.FINISHED
      });
       console.log('This wont show up if download is hijacked by a download manager');
       // Feedback shiuld be on start
       // not necessarly end
     });
  }
}

