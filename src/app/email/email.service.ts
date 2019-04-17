import { MailBoxType } from './enums/index';
import { Injectable } from '@angular/core';

import { Message } from './message';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { PaginationInterface, defaultPaginationObject, MsgGetSuccessResponse } from './interfaces';
import { environment } from '../../environments/environment';

interface EmailMessage {
  status: string;
  messages: Message[];
}

export interface SendMailObj {
  bcc?: string[];
  cc?: string[];
  recipients: string[];
  content: string;
  subject: string;
}

export interface SendMailWithAttachmentsObj extends SendMailObj {
  attachments: File[];
}

interface SendMailSuccess {
  status: string;
}

interface ApiPaginationInterface {
  size: number;
  page?: number;
}

@Injectable()
export class MailService {

  dummyMails: EmailMessage = {
    status: 'STATUS',
    messages: [
      {
        from: 'ali@simbi.com.ng',
        to: 'iyanu@kodi.ng',
        cc: '',
        subject: 'Demo EMail SUbject',
        sentDate: '10, Jan 2019',
        content: ``,
        contentType: 'text/html',
        id: 'email-iyanu-1333',
        important: true,
      },
      {
        from: 'ali@simbi.com.ng',
        to: 'iyanu@kodi.ng',
        cc: '',
        subject: 'Demo EMail SUbject',
        sentDate: '10, Jan 2019',
        content: ` `,
        contentType: 'text/html',
        id: 'email-iyanu-188',
        important: true,
      },
      {
        from: 'ali@simbi.com.ng',
        to: 'iyanu@kodi.ng',
        cc: '',
        subject: 'Demo EMail SUbject',
        sentDate: '10, Jan 2019',
        content: `
          <p class="lead">This is a demo message to test the Quabbly suite's mail</p>
          <div class="card">
            <div class="card-header">
              <span>Here we are, bootstrap 4 card works</span>
            </div>
            <div class="card-body">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit culpa co
                  nsectetur iure quisquam commodi quia consequuntur temporibus quis aspernatur quibusdam.
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Reprehenderit culpa consectetur iure quisquam commodi quia consequuntur temporibus quis aspernatur quibusdam.
            </div>
          </div>
        `,
        contentType: 'text/html',
        attachments: [
          {
          name: 'Welcome.png',
          id: 'jajajaja.png',
          size: '1mb',
          contentType: 'image/png'
       }],
        id: 'email-iyanu-1',
        important: true,
      },
      {
        from: 'support@photizzo.com',
        to: 'iyanu@kodi.ng',
        cc: 'iyanu@gmail.com',
        subject: 'A reminder of your subscription',
        sentDate: '14, Jan 2019',
        content: `
          Hello, Iyanu.<br />
          This is a reminder from us the good people of <a href="www.photizzo.com" _target="blank">photizzo</a>
          about the status of your subscription.
          <p>Do please take note Iyanu that your subscription will expire in a weeks time.
          To renew said subscription follow this <a href="www.photizzo.com/renew">link</a></p>
        `,
        id: 'email-iyanu-2',
        starred: true,
        contentType: 'text/html',
      },
      {
        from: 'paul.kingsley@atlassian.com',
        to: 'iyanu@kodi.ng',
        cc: '',
        subject: 'Welcome to Bitbucket :)',
        sentDate: '15, Jan 2019',
        content: `
          Hello, Iyanu.
          <p>
            We would like to welcome you to butbucket &trademark; and hope you enjoy your use of the tool.<br />
            Here are some useful links
            <ul class="list-group">
              <li class="list-group-item">
                <a href="#">Quick start</a>
              </li>
              <li class="list-group-item">
                <a href="#">Workflows</a>
              </li>
              <li class="list-group-item">
                <a href="#">Branching</a>
              </li>
            </ul>
          </p>
          <div class="signature">
            <p>Paul Kingsley,</p>
            <p>Lead Developer,</p>
            <p>Bit Bucket, Atlassian</p>
          </div>

        `,
        attachments: [
          {
            name: 'Introductory Video.webv',
            id: 'ajajajyayqyququqq',
            size: '400 kb',
            contentType: 'video/webv'
         },
         {
          name: 'Getting Started.pdf',
          id: 'file:///C:/Users/IdiakoseSunday/Desktop/Developing%20Real-Time%20Web%20Applications%20with%20Server-Sent%20Events.pdf',
          size: '35 kb',
          contentType: 'application/pdf'
       },
        ],
        contentType: 'text/html',
        id: 'email-iyanu-3',
        read: true,
      },
      {
        from: 'support@photizzo.com',
        to: 'iyanu@kodi.ng',
        cc: 'iyanu@gmail.com',
        subject: 'A reminder of your subscription',
        sentDate: '14, Jan 2019',
        content: `
          Hello, Iyanu.<br />
          This is a reminder from us the good people of <a href="www.photizzo.com" _target="blank">photizzo</a>
          about the status of your subscription.
          <p>Do please take note Iyanu that your subscription will expire in a weeks time.
          To renew said subscription follow this <a href="www.photizzo.com/renew">link</a></p>
        `,
        id: 'email-iyanu-7',
        starred: true,
        contentType: 'text/html',
      },
      {
        from: 'support@photizzo.com',
        to: 'iyanu@kodi.ng',
        cc: 'iyanu@gmail.com',
        subject: 'A reminder of your subscription',
        sentDate: '14, Jan 2019',
        content: `
          Hello, Iyanu.<br />
          This is a reminder from us the good people of <a href="www.photizzo.com" _target="blank">photizzo</a>
          about the status of your subscription.
          <p>Do please take note Iyanu that your subscription will expire in a weeks time.
          To renew said subscription follow this <a href="www.photizzo.com/renew">link</a></p>
        `,
        id: 'email-iyanu-4',
        starred: true,
        contentType: 'text/html',
      },
      {
        from: 'support@photizzo.com',
        to: 'iyanu@kodi.ng',
        cc: 'iyanu@gmail.com',
        subject: 'A reminder of your subscription',
        sentDate: '14, Jan 2019',
        content: `
          Hello, Iyanu.<br />
          This is a reminder from us the good people of <a href="www.photizzo.com" _target="blank">photizzo</a>
          about the status of your subscription.
          <p>Do please take note Iyanu that your subscription will expire in a weeks time.
          To renew said subscription follow this <a href="www.photizzo.com/renew">link</a></p>
        `,
        id: 'email-iyanu-5',
        starred: false,
        contentType: 'text/html',
      },
      {
        from: 'support@photizzo.com',
        to: 'iyanu@kodi.ng',
        cc: 'iyanu@gmail.com',
        subject: 'A reminder of your subscription',
        sentDate: '14, Jan 2019',
        content: `
          Hello, Iyanu.<br />
          This is a reminder from us the good people of <a href="www.photizzo.com" _target="blank">photizzo</a>
          about the status of your subscription.
          <p>Do please take note Iyanu that your subscription will expire in a weeks time.
          To renew said subscription follow this <a href="www.photizzo.com/renew">link</a></p>
        `,
        id: 'email-iyanu-6',
        starred: true,
        important: true,
        contentType: 'text/html',
      },
    ]
  };

  user: any;
  cachedMails: any[] = [];
  constructor(private http: HttpClient) {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
  }

  static downloadAttachmentUrl(attachmentId: string): string {
    return `${environment.mailBaseUrl}/download_file/${attachmentId}`;
  }

  static defaultPagObjIfUndefined(paginationObject?: ApiPaginationInterface): ApiPaginationInterface {
    if (!paginationObject) {
      return  {
        page: defaultPaginationObject.offset,
        size: defaultPaginationObject.limit
      };
    }
    return paginationObject;
  }

  static getUrlFromMailBoxType(boxType: MailBoxType): 'inbox' | 'sent' | 'newsletters' | 'alerts' | 'trash' {
    switch (boxType) {
      case MailBoxType.SENT:
        return 'sent';
      case MailBoxType.NEWSLETTER:
        return 'newsletters';
      case MailBoxType.ALERT:
        return 'alerts';
      case MailBoxType.TRASH:
        return 'trash';
      case MailBoxType.INBOX: default:
        return 'inbox';
    }
  }

  static getFolderNameForSeen(boxType: MailBoxType): 'INBOX' | 'Newsletters' | 'Alerts' | 'Trash' | 'Sent' {
    switch (boxType) {
      case MailBoxType.SENT:
        return 'Sent';
      case MailBoxType.NEWSLETTER:
        return 'Newsletters';
      case MailBoxType.ALERT:
        return 'Alerts';
      case MailBoxType.TRASH:
        return 'Trash';
      case MailBoxType.INBOX: default:
        return 'INBOX';
    }
  }

  appendAuthHeader(): any {
    return {
      headers: {
        'Authorization': `Bearer ${this.user.token}`
      }
    };
  }

  getMailsFromAPI(pageObj?: ApiPaginationInterface): Observable<any> {
    pageObj = MailService.defaultPagObjIfUndefined(pageObj);
    /*
    return of({
      status: this.dummyMails.status,
      summary: {
        messages: this.dummyMails.messages.slice(((pageObj.page - 1) * pageObj.size), (pageObj.page) * pageObj.size),
        totalMessages: this.dummyMails.messages.length,
        pageCount: pageObj.page
    }
    }).pipe(delay(1000));
    */

    const options = `?page=${pageObj.page}&size=${pageObj.size}`;
    return this.http.get<any>(
      `${environment.mailBaseUrl}/inbox${options}`, this.appendAuthHeader());
  }

  getNewslettersFromAPI(pageObj?: ApiPaginationInterface): Observable<any> {
    pageObj = MailService.defaultPagObjIfUndefined(pageObj);
    const options = `?page=${pageObj.page}&size=${pageObj.size}`;
    return this.http.get<any>(
      `${environment.mailBaseUrl}/newsletters${options}`, this.appendAuthHeader());
  }

  getAlertsFromAPI(pageObj?: ApiPaginationInterface): Observable<any> {
    pageObj = MailService.defaultPagObjIfUndefined(pageObj);
    const options = `?page=${pageObj.page}&size=${pageObj.size}`;
    return this.http.get<any>(
      `${environment.mailBaseUrl}/alerts${options}`, this.appendAuthHeader());
  }

  getSentMailsFromAPI(pageObj?: ApiPaginationInterface): Observable<any> {
    pageObj = MailService.defaultPagObjIfUndefined(pageObj);
    /*
    return of({
      status: this.dummyMails.status,
      summary: {
        messages: this.dummyMails.messages.slice(((pageObj.page - 1) * pageObj.size), (pageObj.page) * pageObj.size),
        totalMessages: this.dummyMails.messages.length,
        pageCount: pageObj.page
    }
    }).pipe(delay(300));
    */

    const options = `?page=${pageObj.page}&size=${pageObj.size}`;
    return this.http.get<any>(
      `${environment.mailBaseUrl}/sent${options}`, this.appendAuthHeader()
    );
  }

  getMails(mailboxType: MailBoxType, pageObj?: ApiPaginationInterface): Observable<any> {
    pageObj = MailService.defaultPagObjIfUndefined(pageObj);
    const options = `?page=${pageObj.page}&size=${pageObj.size}`;
    const urlSegment = MailService.getUrlFromMailBoxType(mailboxType);
    return this.http.get<any>(
      `${environment.mailBaseUrl}/${urlSegment}${options}`, this.appendAuthHeader());
  }

  getMessages(): Promise<EmailMessage> {
    const { messages, status } = this.dummyMails;
    return Promise.resolve({
      status,
      messages: messages.slice(0, defaultPaginationObject.limit)
    });
  }

  getMailsWithPaginationPromise(paginationConfig: PaginationInterface, mailbox: MailBoxType): Promise<MsgGetSuccessResponse> {
    const opts = {
      page: paginationConfig.offset,
      size: paginationConfig.limit
    };

    switch (mailbox) {
      case MailBoxType.SENT:
        return this.getSentMailsFromAPI(opts).pipe().toPromise();
      case MailBoxType.NEWSLETTER:
        return this.getNewslettersFromAPI(opts).pipe().toPromise();
      case MailBoxType.ALERT:
        return this.getAlertsFromAPI(opts).pipe().toPromise();
      default:
        return this.getMailsFromAPI(opts).pipe().toPromise();
    }
  }

  sendMail(mailObj: SendMailObj): Promise<SendMailSuccess | any> {
    return this.http.post<SendMailObj>(`${environment.mailBaseUrl}/send`,
      mailObj, this.appendAuthHeader())
      .pipe().toPromise();
  }

  downloadAttachment(attachmentId: string, pageQuery: number): Observable<any> {
    const { token } = this.user;
    return this.http.get(
      `${MailService.downloadAttachmentUrl(attachmentId)}?page=${pageQuery}&size=1&token=${token}`,
      {
        responseType: 'arraybuffer',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    ).pipe();
  }

  sendMailWithAttachments(mailWithAttachments: SendMailWithAttachmentsObj): Promise<SendMailSuccess | any> {
    const fd = new FormData();
    for (const field of Object.keys(mailWithAttachments)) {
      if (field !== 'attachments') {
        fd.append(field, mailWithAttachments[field]);
      }
    }

    mailWithAttachments.attachments.map(file => {
      fd.append('files', file, file.name);
    });

    return this.http.post<SendMailWithAttachmentsObj>(`${environment.mailBaseUrl}/send`, fd,
    this.appendAuthHeader()).pipe().toPromise();
  }

  markAsRead(mailBoxType: MailBoxType, ids: string[]): Observable<any> {
    ids = (Array.isArray(ids) ? ids : [ids] );
    return this.http.post<any>(`${environment.mailBaseUrl}/mark_as_read`, {
      folderName: MailService.getFolderNameForSeen(mailBoxType),
      ids
    }, this.appendAuthHeader());
  }


}
