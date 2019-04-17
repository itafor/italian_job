
import { DownloadStatus } from '../enums';
export interface EmailObject {
  to: string;
  cc?: string;
  bcc?:  string;
  subject: string;
  mailBody: string;
  from: string;
}

export interface SendEventInterface {
  mailObj: EmailObject;
  tabIndex: number;
  attachments?: File[];
}

export interface Attachment {
  name: string;
  id: string;
  size: string;
  contentType: string;
}

export interface PaginationInterface {
  loading: boolean;
  offset: number;
  limit: number;
  endOfMails: boolean;
  lastIndex: number;
}

export const defaultPaginationObject: PaginationInterface = {
  loading: false,
  offset: 1,
  limit: 10,
  endOfMails: false,
  lastIndex: 0,
};
export interface MsgGetSuccessResponse {
  status: string;
  summary: {
    messages: any[],
    pageCount?: number;
    totalMessages?: number
  };
}

export interface DownloadStatusInterface {
  status: DownloadStatus;
  payload?: string;
}

export interface PaginationNumbersInterface {
  forwardDirection: boolean;
  pageBeforePageAttempt: number;
  pageAttemptingToGo: number;
}

export interface MetaDataUpdateInterface {
  id: string;
  newReadStatus?: boolean;
  checked?: boolean;
}
