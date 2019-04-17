import { by, element, ElementArrayFinder, ElementFinder, browser, promise } from 'protractor';
import utils from '../utils';

interface PaginationMeta {
  totalMessages: number;
  start: number;
  end: number;
}
export class Email {
  static readonly TRUNCATEDFIELDS = ['subject', 'addresser'];
  static defaultTabs = [
    {
      'label': 'Inbox',
      id: 'ngb-tab-0',
      contentId: 'ngb-tab-0-panel'
    },
    {
      'label': 'Newsletters',
      id: 'ngb-tab-1',
      contentId: 'ngb-tab-1-panel'
    },
    {
      'label': 'Alerts',
      id: 'ngb-tab-2',
      contentId: 'ngb-tab-2-panel'
    },
    {
      'label': 'Outbox | Pending',
      id: 'ngb-tab-3',
      contentId: 'ngb-tab-3-panel'
    },
    {
      label: 'Drafts',
      id: 'ngb-tab-4',
      contentId: 'ngb-tab-4-panel'
    },
  ];

  static readonly mailboxMetadata = {
    message: 'Number of mails to fetch',
    paginationMeta: ['-', 'of', 'mails'],
    mailsPerPage: 10,
    paginationMetaClassName: 'div.messages--metadata',
    messagesMeta: {
      idOfElement: {
       'inbox': 'inboxElePaginationMeta',
       'alerts': 'alertsElePaginationMeta',
       'newsletters': 'newslettersElePaginationMeta',
       'sent': 'sentElePaginationMeta'
      }
    }
  };

  static composeButtonMeta = {
    class: ['btn', 'btn-primary'],
    styleAttributes: {
      color: 'rgba(255, 255, 255, 1)',
      'background-color': 'rgba(92, 107, 192, 1)',
    }
  };

  static PREFORMATTEDCLASS = 'flex-justify-content-center';
  static PreFormattedContent = {
    attrs: ['display', 'flex-direction', 'justify-content'],
    values: ['flex', 'row', 'center'],
  };
  filterer: string;

  constructor(mailBoxType: MailListEnums) {
    this.filterer = mailBoxType;
  }

  getTitle() {
    return element(by.css('title'));
  }

  getTabs(): promise.Promise<ElementArrayFinder> {
    return utils.getElements('ul[role="tablist"] > li');
  }

  getTabContentContainer() {
    return element(by.css('div.tab-content'));
  }

  async getTab(index: number): Promise<ElementFinder> {
    const tabs = await this.getTabs();
    return tabs[index];
  }

  async getTabContent(): Promise<ElementFinder> {
    return (await this.getTabContentContainer()).$('div[role="tabpanel"].active');
  }

  getLoadingSpinner(): ElementFinder {
    return element(by.css('div.spinner[role="initSpinner"]'));
  }

  getComposeMailButton() {
    return utils.getText('button.btn.btn-primary');
  }

  composeButton() {
    return utils.getElement('button.btn.btn-primary');
  }

  getPaginationIndicators(mailBox: string) {
    mailBox = mailBox.toLowerCase();

    switch (mailBox) {
      case 'sent':
        return utils.getElements('app-email-sent .pagination__indicator');
      default:
        return utils.getElements('app-email-inbox .pagination__indicator');
    }
  }

  getMessagesContainer(boxTypeId?: string) {
    if (!boxTypeId) {
      boxTypeId = '';
    }
    return utils.getElement(`#${boxTypeId}.messages-container`);
  }

  getItemsInMessagesContainer(boxType?: string) {
    return this.getMessagesContainer(boxType).all(by.css('.list-group-item'));
  }

  getPaginationMeta(boxType: string) {
    const meta: PaginationMeta = {
      totalMessages: null,
      start: null,
      end: null
    };
    const { messagesMeta } = Email.mailboxMetadata;
    const elementHoldingMeta = element(by.id(messagesMeta.idOfElement[boxType]));
    return utils.dataset(elementHoldingMeta).then(attrs => {
      meta.totalMessages = parseInt(attrs['totalMessages'].trim(), 10);
      const startAndEnd = attrs['startAndEnd'].split('-');
      meta.start =  parseInt(startAndEnd[0].trim(), 10);
      meta.end = parseInt(startAndEnd[1].replace('-', '').trim(), 10);
      return meta;
    });
  }

  getDataFromMailSummary(list) {
    return utils.dataset(list.$('app-email-summary > a')).then(attrs => attrs);
  }

  getEmailAsWidget(elt: ElementFinder): ElementFinder {
    return elt.$('.widget-icon.rounded-circle');
  }

  getEmailDate(): ElementFinder {
    return utils.getElement('.date');
  }

  getEmailSubject(): ElementFinder {
    return utils.getElement('h4.lead');
  }

  getEmailContainerForCurrentView() {
    return this.getTabContent().then(thisTab => {
      return thisTab.$('app-email-view .mail__body');
    });
  }

  assertMailFormatting(shouldIBeFormattedAsText: boolean) {
    this.getEmailContainerForCurrentView().then(container => {
      container.getAttribute('class').then(classnames => {
        if (shouldIBeFormattedAsText) {
          expect(classnames).toContain(Email.PREFORMATTEDCLASS);
          container.$('pre').isPresent().then(prePresent => {
            expect(prePresent).toBeTruthy();
          });
          Promise.all(Email.PreFormattedContent.attrs.map(attr => container.getCssValue(attr)))
            .then(styleAttrs => {expect(styleAttrs).toEqual(Email.PreFormattedContent.values); });
        } else {
        expect(classnames.indexOf(Email.PREFORMATTEDCLASS)).toBe(-1);
        }
      });
    });
  }


  getEmailAddresses(): ElementFinder {
    return utils.getElement('div.pl-0.w-100>small.d-block');
  }

  getEmailBody(): ElementFinder {
    return utils.getElement('.mail__body');
  }

  getEmailActions(): ElementFinder {
    return utils.getElement('app-email-actions > nav');
  }

  getMailActionsFor(elt: ElementFinder): ElementFinder {
    return elt.$('app-email-actions');
  }

  findRecoverMailCTA(): promise.Promise<boolean> {
    return utils.getElement('app-email-view app-email-actions span[data-action="recover"]').isPresent();
  }

  mailActionsConform(elt: ElementFinder, Actions: string[]): promise.Promise<boolean> {
    const allVisible: boolean[] = new Array(Actions.length).fill(false);
    const container = this.getMailActionsFor(elt);
    Actions.map((action, index) => {
      container.$(`span[data-action=${action}]`).isDisplayed().then(isAvailable => {
        allVisible[index] = isAvailable;
      });
    });
    return utils.waitForPage(50).then(() => allVisible.every(status => status === true));
  }

  getMailMetaActions(elt: ElementFinder): ElementFinder {
    return elt.$('app-email-metadata');
  }

  getAttributes(elt: ElementFinder) {
    return browser.executeScript(`return arguments[0].attributes`, elt);
  }

  mailMetaActionsConform(elt: ElementFinder, Actions: string[]): promise.Promise<boolean> {
    const allVisible: boolean[] = new Array(Actions.length).fill(false);
    const container = this.getMailMetaActions(elt);
    Actions.map((action, index) => {
      container.$(`span[data-action=${action}]`).isDisplayed().then(isAvailable => {
        allVisible[index] = isAvailable;
      });
    });
    return utils.waitForPage(50).then(() => allVisible.every(status => status === true));
  }

  mailMetaActionsIcons(elt: ElementFinder, iconsObj) {
    const container = this.getMailMetaActions(elt);
    Object.keys(iconsObj).map(icon => {
      container.$(`span[data-action=${icon}] i${iconsObj[icon]}`).isPresent()
        .then(ispresent => expect(ispresent).toBeTruthy());
    });
  }

  getPaginationCTA(direction: string): ElementFinder {
    const marginClass = direction.toLowerCase() === 'backward' ? '.mr-1' : '.ml-1';
    return utils.getElement(`${marginClass}.pagination__indicator`);
  }

  getBulkInputForSummary(list: ElementFinder): ElementFinder {
    return list.$('app-email-metadata input[type="checkbox"]');
  }

  getBulkElement(): ElementFinder {
    return utils.getElement(`${this.filterer} .messages--metadata app-email-actions`);
  }

  attributesConform(elt: ElementFinder, selector: string, filterSelector: string, attribute: string, attrObj) {
    const wrapper = elt.$(selector);
    (Object.keys(attrObj)).map(elem => {
      wrapper.$(`${filterSelector}${elem}`).getAttribute(attribute).then(valueOfAttribute => {
        expect(valueOfAttribute).toBe(attrObj[elem]);
      });
    });
  }

  getBulkElemInput(): ElementFinder {
    return this.getBulkElement().$('input[type="checkbox"]');
  }

  bulkActionsActivated() {
    return utils.getElement(this.filterer.concat(' .messages--metadata app-email-actions span[data-action="archive"]')).isPresent();
  }

  getBulkActionsCTAByDataAttr(attr: CTAEnums): ElementFinder {
    return utils.getElement(`.messages--metadata app-email-actions span[data-action=${attr}]`);
  }

  checkMarkedStatus(mailSummary: ElementFinder) {
    return mailSummary.$('app-email-summary input[type="checkbox"]').isSelected().then(checked => checked);
  }

  checkIfIGotAnError(selector: string): promise.Promise<boolean> {
    return utils.getElement(`${selector} p.alert.alert-danger`).isPresent();
  }

  paginationIndicatorAssertions(mailsLength, indicatorsCount) {
    if (mailsLength >= Email.mailboxMetadata.mailsPerPage) {
      expect(indicatorsCount).toBeGreaterThan(0);
    } else {
      expect(indicatorsCount).toBe(0);
    }
  }

  get discardCTA() {
    return utils.getElement('span[data-name="discardCTA"]');
  }

  assertPresenceOfDiscardCTA() {
    Promise.all([
      this.discardCTA.isPresent(),
      this.discardCTA.isDisplayed()
    ]).then(promises => {
      expect(promises).toEqual([true, true]);
    });
  }

  handleErrorsFromInteractingWithElementThatMayNotNBePresent(err: Error) {
    if (err.name === 'NoSuchElementError') {
      // for now do nothing
    } else { throw err; }
  }

  assertMarkAsReadConsicousOfNonExistience(boxType) {
    this.getItemsInMessagesContainer(boxType).then(async (mails) => {
      // CAVEAT EMPTOR
      // Populate test account with mails
      const index = mails.length > 1 ? 1 : 0;
      const markAsReadCTA = this.getMailMetaActions(mails[index]).$('span[data-action="read"]');
    // find mark as read
      const mailCTAPresent = await markAsReadCTA.isPresent();
      if (mailCTAPresent) {
        markAsReadCTA.click().then(() => {
          utils.waitForPage(100).then(() => {
            // I dont need this ATM, so would change it to 100ms
            // But when the Mark as read functionality gets connected to the API
            // a wait of 1000 is advised
            // depending on if it changes the UI before the call is confirmed as successful or not
            this.getItemsInMessagesContainer(boxType).then(mailsAgain => {
              mailsAgain[index].$('app-email-summary').getAttribute('class').then(classNames => {
                expect(classNames.indexOf('unread')).toBeLessThan(0);
              });
            });
          });
      });
      }
    });
  }


  assertSubjectAsTabTitle(subject: string, tabTitle: string) {
    // account for x - close icon
    tabTitle = tabTitle.substr(0, tabTitle.length - 1).trim();
    browser.executeScript(` const mockParagraph = document.createElement('p');
    mockParagraph.innerHTML = arguments[0];
    return mockParagraph.innerText;`, subject).then((asText: string) => {
      asText = asText.trim();
      expect(tabTitle.length).toBeLessThan(19);
      if (asText.length > 15) {
        expect(tabTitle).toEqual(`${asText.substr(0, 15)}...`);
      } else {
        expect(tabTitle).toEqual(asText);
      }
    });
  }

  async assertLinkOpensInNewTab() {
      const allLinks = await utils.getElements('app-email-view div.mail__body a');
      allLinks.forEach(async (l) => {
        expect( await l.getAttribute('target')).toEqual('_blank');
      });
      if (allLinks.length) {
        const windowTabs = await utils.getAllBrowserTabs();
        await allLinks[0].click();
        expect((await utils.getAllBrowserTabs()).length).toBe(windowTabs.length + 1);
        // await utils.closeCurrentWindowTab();
      }
  }
}


export enum CTAEnums {
  READ = 'read',
  DELETE = 'delete'
}

export enum MailListEnums {
  NEWSLETTERS = 'app-email-newsletter',
  INBOX = 'app-email-inbox',
  ALERTS = 'app-email-alert',
  SENT = 'app-email-sent'
}
