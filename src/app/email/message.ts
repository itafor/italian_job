
import { Attachment } from './interfaces';
export class Message {
  from: string;
  date?: string;
  to?: string;
  cc?: string; // or string[]
  bcc?: string;
  subject: string;
  avatar?: string;
  icon?: any;
  iconClass?: any;
  body?: string;
  tag?: string;
  type?: string;
  sentDate: string;
  important?: boolean;
  content: string;
  attachments?: Attachment[];
  id: string;
  starred?: boolean;
  read?: boolean;
  contentType: string;
}
