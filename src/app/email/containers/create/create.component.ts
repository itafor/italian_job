import { Component, OnInit, ViewEncapsulation, Input,
  EventEmitter, Output, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { EmailObject, SendEventInterface } from '../../interfaces';
import { Message } from '../../message';
import { OnwardActions } from '../../enums';
import {  FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {  AuthenticationService } from '../../../account/account.authentication';
import { SupportedThemes } from '../../../rtEditor/enums';
import { DetailsOfOrganizationInt } from '../../../interfaces';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmailPromptComponent } from './../../components/mail-prompt.component';

const styles = {
  quoted__mail: `
    font: small/1.5 'Trebuchet MS', Consolas, 'Courier New', Arial,Helvetica,sans-serif;
    letter-spacing: normal;
  `,
  blockquote: `
  margin: 0px 0px 0px 0.8ex;
  border-left: 1px solid rgb(204, 204, 204);
  padding-left: 1ex;
  `
};

enum SizeUnits {
  KB = 1,
  MB = 2,
  GB = 3
}

const fullDateTransform = 'fullDate';
const fullTimeTransform = 'fullTime';
@Component({
  selector: 'app-create-email',
  encapsulation: ViewEncapsulation.Emulated,
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateEmailComponent implements OnInit, OnDestroy {
  @Input() initMailObj: Message;
  @Input() tabIndex: number;
  @Input() initMailContext: OnwardActions;
  @Output() sendMailEvent = new EventEmitter<SendEventInterface>();
  @Input() mailSender: string;
  @Output() addDraftEvent = new EventEmitter();
  @Output() discardEvent = new EventEmitter();
  @ViewChild('attachmentRef') refFileInput: ElementRef;
  @ViewChild('editor') refEditor: ElementRef;
  apiCallMade = false;
  selectedTheme = SupportedThemes.SNOW;
  placeholder = 'Enter your mail here...';
  newMail: EmailObject = {
    to: '',
    subject: '',
    mailBody: '',
    from: '',
    cc: '',
    bcc: ''
  };

  attachmentDetailView = 'expanded';

  draftMail: EmailObject;

  rtEditorConfig = {
    skin_url: '/assets/tinymce/skins/lightgray',
    inline: false,
    statusbar: false,
    browser_spellcheck: true,
    menubar: false,
    plugins: `advlist autolink lists link charmap hr anchor pagebreak
    nonbreaking table directionality
    paste textcolor colorpicker textpattern`,
    toolbar1: `undo redo | fontselect fontsizeselect | bold italic | alignleft
     aligncenter alignright alignjustify | bullist numlist outdent indent | link | preview media | forecolor backcolor`,
  };

  quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction

      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],

      ['clean'],                                         // remove formatting button

      ['link']                         // link and image, video
    ]
  };

  attachments: File[] = [];

  public form: FormGroup;

  mailSent: boolean;

  // interval between autosaves in milliseconds
  draftAutoSaveIntervalMS = 3000;
  notifyUserOfSavingMS = 500;
  savingDraft = false;
  contactSuggestDebounceMS = 300;
  contactSuggestMinLength = 2;

  constructor(
    private datePipe: DatePipe,
    private fb: FormBuilder,
    public authService: AuthenticationService,
    private modalService: NgbModal
    ) {
  }

  get f() { return this.form.controls; }

  transform(date, format) {
    let transformed;
    try {
      transformed = this.datePipe.transform(date, format);
    } catch (error) {
      transformed = this.datePipe.transform(Date.now(), format);
    }
    return transformed;
  }

  fullDateTransform(date: Date): string {
    return this.transform(date, fullDateTransform);
  }

  fullTimeTransform(date: Date): string {
    return this.transform(date, fullTimeTransform);
  }

  // from mail-view getAppropriateWayTORefeerToSentTo
  getEmailFromEmailAndName(emailAndName: string): string {
    const parsedReceiver = emailAndName.split('<');
    let email;
    if (parsedReceiver.length > 1) {
      email = parsedReceiver[1].replace('>', '');
    } else {
      email = parsedReceiver[0];
    }
    console.log(email);
    return email;
  }

  ngOnInit(): void {
    // TODO(oneeyedsunday)

    if (!this.authService.detailsOfPeopleInMyOrg.length) {
      this.authService.populateEmailsOfPeopleInMyOrganization();
    }

    if (this.initMailObj) {
      if (this.initMailContext === OnwardActions.REPLY) {
        if (this.authService.currentUserValue.username === this.getEmailFromEmailAndName(this.initMailObj.from)) {
          // i sent this mail
          this.newMail.to = this.initMailObj.to || this.initMailObj.from;
        } else {
          this.newMail.to = this.initMailObj.from;
        }
      } else if (!this.initMailContext) {
        this.newMail.to = this.initMailObj.to;
      }
      this.newMail.cc = this.initMailObj.cc;
      this.newMail.subject = this.uiFriendlySubject(this.initMailObj.subject);
      if (this.initMailContext) {
        this.newMail.mailBody = this.prependMail(this.initMailObj, this.initMailContext);
        this.newMail.mailBody += this.appendInitialMail(this.initMailObj);
      } else {
        this.newMail.mailBody = this.initMailObj.content;
      }
    }

    this.newMail.from = this.mailSender;
    this.draftMail = this.newMail;

    this.form = this.fb.group({
      to: [this.newMail.to, Validators.required],
      cc: [this.newMail.cc, null],
      bcc: [this.newMail.bcc, null],
      subject: [this.newMail.subject, null],
      mailBody: [this.newMail.mailBody, Validators.required],
      from: [this.newMail.from, null]
    });

    this.form.valueChanges.pipe(
      debounceTime(this.draftAutoSaveIntervalMS),
      distinctUntilChanged()
    ).
    subscribe(changes => {
      this.storeContentInDraft(changes);
      this.publishDraft();
      this.notifySavingDraft();
    });

    this.mailSent = false;
  }


  prependMail(mailObj: Message, context: OnwardActions): string {
    switch (context) {
      case OnwardActions.REPLY:
        return `
        <p></p>
        <div class="quabbly__quoted--mail" style="font: small/1.5 'Trebuchet MS', Consolas, 'Courier New', Arial,Helvetica,sans-serif;
        letter-spacing: normal;">
          On ${this.fullDateTransform(new Date(mailObj.date))} formatted at
           ${this.fullTimeTransform(new Date(mailObj.date))},
           ${mailObj.from} wrote:
        </div>
        `;
      case OnwardActions.FORWARD:
        return `
        <p></p>
        ---------- Forwarded message ---------
        <br />
        From: <strong>${mailObj.from}</strong>
        <br />
        Date: ${this.fullDateTransform(new Date(mailObj.date))} at ${this.fullTimeTransform(new Date(mailObj.date))}
        <br />
        Subject: ${this.uiFriendlySubject(mailObj.subject)}
        <br />
        To: < <a href="mailto:${mailObj.to || this.mailSender}" >${mailObj.to || this.mailSender}</a> >
        `;
    }
  }

  appendInitialMail(mailObj: Message): string {
    return `
    <blockquote
    style="
      margin: 0px 0px 0px 0.8ex;
      border-left: 1px solid rgb(204, 204, 204);
      padding-left: 1ex;
    "
    >
      ${mailObj.body}
    </blockquote>
    `;
  }

  mailIsValid(): boolean {
    return this.form.valid;
  }

  sendMessage() {
    this.apiCallMade = true;
    this.mailSent = true;
    this.sendMailEvent.emit({
      mailObj: this.form.value,
      tabIndex: this.tabIndex,
      attachments: this.attachments
    });
  }

  ngOnDestroy(): void {
    if (this.passDraftableCriteria()) {
      if (!this.mailSent) {
        this.storeContentInDraft(this.form.value);
        this.publishDraft();
        this.notifySavingDraft();
      }
    }
  }

  passDraftableCriteria(): boolean {
    if (this.form.value.cc || this.form.value.bcc || this.form.value.subject || this.form.value.to || this.form.value.mailBody) {
      return true;
    }
    return false;
  }

  storeContentInDraft(contents: EmailObject): void {
    // this.draftMail = this.form.value;
    Object.assign(this.draftMail, contents);
  }

  publishDraft(): void {
    this.addDraftEvent.emit(this.draftMail);
  }

  notifySavingDraft(): void {
    this.savingDraft = true;
    setTimeout(() => { this.savingDraft = false; }, this.notifyUserOfSavingMS);
  }

  showContacts(item): boolean {
    return (item.length > this.contactSuggestMinLength);
  }

  populateSuggestions(cond: string ): string[] {
      return this.authService.detailsOfPeopleInMyOrg().filter((contact => this.existsIn(contact.email, cond)))
      .map(detail => detail.email)
      .slice(0, 10);
  }

  existsIn(base: string, term: string): boolean {
    return base.toLowerCase().indexOf(term.toLowerCase()) > -1;
  }

  suggestContacts = (mails$: Observable<string>) => mails$.pipe(
    debounceTime(this.contactSuggestDebounceMS),
    distinctUntilChanged(),
    map(currentTerm => this.showContacts(currentTerm) ? this.populateSuggestions(currentTerm) : [])
  )

  uiFriendlySubject(subject: string): string {
    const uiSubject = (subject.length ? subject : '(no Subject)' );
    return uiSubject;
  }

  passDuplicityFilesTest(candidate: File): boolean {
    return this.attachments.findIndex(
      fileChecking => (fileChecking.name ===  candidate.name) && (fileChecking.size === candidate.size)
      ) === -1;
  }

  sanityChecks(attachments: FileList): File[] {
    const attachmentsA = Array.from(attachments);
    if (!this.lessThan(25, SizeUnits.MB, attachmentsA)) {
      this.showUserPrompt('File(s) too large', 'Attachments greater than <strong>25MB</strong> cannot be attached to mails at this point.');
      return [];
    }
    this.attachments.push(...attachmentsA);
    return attachmentsA;
  }

  showUserPrompt(header: string, content: string): void {
    const modalRef = this.modalService.open(EmailPromptComponent, { centered: true });
    modalRef.componentInstance.header = header;
    modalRef.componentInstance.content = content;
  }

  lessThan(size: number, unit: SizeUnits, additional: File[]): boolean {
    const sizeComparing = additional.reduce((acc, attachment) => acc + attachment.size, this.sizeOfAttachments);
    return (sizeComparing < Math.pow(1024, unit) * size);
  }

  get sizeOfAttachments(): number {
    return this.attachments.reduce((acc, attach) => acc + attach.size , 0);
  }

  get attachmentDescription(): string {
    const tense = this.attachments.length > 1 ? 'files' : 'file';
    return `Attaching ${this.attachments.length} ${tense}`;
  }

  toggleView() {
    if (this.attachmentDetailView === 'compressed') {
      this.attachmentDetailView = 'expanded';
    } else {
      this.attachmentDetailView = 'compressed';
    }
  }

  get viewIcon(): string {
    return this.attachmentDetailView === 'compressed' ? 'fa fa-expand' : 'fa fa-compress';
  }

  attachmentDetailsCollapsed(): boolean {
    return this.attachmentDetailView === 'compressed';
  }

  get viewIconTitle(): string {
    return this.attachmentDetailView === 'compressed' ?  'Expand' : 'Minimize';
  }

  removeAttachment(index: number): void {
    this.attachments.splice(index, 1);
  }

  onFileSelected() {
    if (typeof (FileReader) !== 'undefined') {
    for (const file of this.sanityChecks(this.refFileInput.nativeElement.files)) {
        new FileReader().readAsArrayBuffer(file);
      }
    } else {
      // notify us somehow
      this.showUserPrompt('Browser not supported',
      `We are unable to process attachments from your browser. <br />
      Please update your browser or switch to <a href="https://www.google.com/chrome/" _target="blank" >Google Chrome.</a>
      or <a href="https://www.mozilla.org/en-US/firefox/new/" target="_blank" >Mozilla Firefox</a>`);
    }
  }

  handleDiscard(): void {
    this.discardEvent.emit();
  }

  scrollIntoView() {
    this.refEditor['elementRef'].nativeElement.querySelector('iframe').style.height = '400px';
    this.refEditor['elementRef'].nativeElement.
    querySelector('.mce-container.mce-panel.mce-edit-area').scrollIntoView({behavior: 'auto', block: 'start', inline: 'nearest'});
  }

  scrollOutOfView() {
    this.refEditor['elementRef'].nativeElement.querySelector('iframe').style.height = '100px';
    /*
    this.refEditor['elementRef'].nativeElement.
    querySelector('.mce-container.mce-panel.mce-edit-area').scrollIntoView({behavior: 'smooth', block: 'end', inline: 'nearest'});
    */
  }
}
