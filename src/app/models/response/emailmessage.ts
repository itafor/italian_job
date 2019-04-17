export class EmailMessage {
    status: string;
    messages: [{
        from: string,
        to: string,
        cc: string,
        subject: string,
        sentDate: string,
        content: string,
        attachments: string,
        id: string
    }];
}
