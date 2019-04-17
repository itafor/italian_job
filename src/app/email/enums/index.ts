export enum OnwardActions {
  REPLY = 'reply',
  FORWARD = 'forward',
}

export enum MailBoxType {
  INBOX = 'inbox',
  SENT = 'sent',
  NEWSLETTER = 'newsletter',
  ALERT = 'alert',
  TRASH = 'trash'
}

export enum DownloadStatus {
  STARTED,
  ERRORED,
  FINISHED
}

export enum MetadataUpdates {
  READ,
  SELECTED,
  SELECTALL,
  UNSELECTALL
}

export enum BulkActions {
  BULK_FLAG = 'BULK FLAG',
  BULK_READ = 'BULK MARK AS READ',
  BULK_ARCHIVE = 'BULK ARCHIVE',
  BULK_DELETE = 'BULK DELETE'
}
