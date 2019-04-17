import utils from '../utils';
import { MailListEnums, Email as MailListObject } from './email.po';
import { ForwardingHelpers } from './mail-forwarding.po';
import { OnwardActions } from '../../src/app/email/enums';
import { ElementFinder } from 'protractor';
import { createMailTemplate, TemplateFieldsDataAttr } from './mail-creation.po';


const expectedSubjectAdjust = (actionType: OnwardActions, subject: string): string =>  {
  if (actionType === OnwardActions.REPLY) {
    return `RE: ${subject}`;
  } else if (actionType === OnwardActions.FORWARD) {
    return `Fwd: ${subject}`;
  }
};

const expectedContentAdjust = (actionType: OnwardActions, from: string): string => {
  if (actionType === OnwardActions.REPLY) {
    return '<div class="quabbly__quoted--mail"';
  } else if (actionType === OnwardActions.FORWARD) {
    return '<p>---------- Forwarded message --------- <br>From: <strong>';
  }
}


describe('Quabbly Email submodule | Replying | Forwarding mails', () => {
  const page: MailListObject = new MailListObject(null);
  const forwardingHelpers: ForwardingHelpers = new ForwardingHelpers();
  const onwardingThis = {}; // addressed - who the mail is from -> This is from Inbox
  let CTA: ElementFinder;
  let MailForm: ElementFinder;
  const initMailTemplate = {};
/*
  beforeAll(() => {
    // auth
    utils.navigateTo('/?test');
      utils.handleAuthWithCredentials();
  });
  */


  it('should successfully go to a mail ', () => {
    utils.navigateTo('/email').then(() => {
      utils.waitForPage(7000).then(() => {
        utils.urlEndsWith('email').then(itDoes => {
          expect(itDoes).toBeTruthy();
          page.getItemsInMessagesContainer('inbox').then(mails => {
            page.getDataFromMailSummary(mails[0]).then(dataAttrs => {
              Object.assign(onwardingThis, dataAttrs);
              mails[0].click().then(() => {
                // assert it opened
                page.getTabs().then(openTabs => {
                  expect(openTabs.length).toBe(MailListObject.defaultTabs.length + 1);
                });
              });
            });
          });
        });
      });
    });
  });

  it('should have a reply CTA', () => {
    CTA = forwardingHelpers.getMailAction(utils.getElement('app-email-view'), OnwardActions.REPLY);
    expect(CTA.isPresent()).toBeTruthy();
  });

  it('should open mail creation template on clicking reply CTA', () => {
    CTA.click().then(() => {
      utils.waitForPage(500).then(() => {
        MailForm = forwardingHelpers.getOnwardMailForm(utils.getElement('app-email-view'));
        expect(MailForm.isPresent()).toBeTruthy();
      });
    });
  });

  it('should populate Mail Creation template with correct data', () => {
    (Object.keys(createMailTemplate) as TemplateFieldsDataAttr[]).map(field => {
      forwardingHelpers.getFormValue(MailForm, field).then(initValue => {
        initMailTemplate[field] = initValue;
      });
    });

    utils.waitForPage(2000).then(() => {
      // wait for all promises
      // increase if possible
      // CHECKS
      // USER THAT SENT is RECIPIENT
      expect(initMailTemplate['recipients']).toBe(onwardingThis['addressed']);
      expect(initMailTemplate['subject'])
        .toBe(expectedSubjectAdjust(OnwardActions.REPLY, onwardingThis['subject']));
    });
  });

  it('should have the correct Metadata ', () => {
    expect(initMailTemplate['content'])
      .toContain(expectedContentAdjust(OnwardActions.REPLY, null));
  });


  it('should allow me close tab', () => {
    page.getTab(MailListObject.defaultTabs.length).then(tabHeader => {
      tabHeader.$('span.indicate--danger').click().then(() => {
        page.getTabs().then(remainingTabs => {
          expect(remainingTabs.length).toEqual(MailListObject.defaultTabs.length);
        });
      });
    });
  });

  it('should close Mail Creation/Forwarding Template when I click discard CTA | REPLY ', () => {
    utils.navigateTo('/email').then(() => {
      utils.waitForPage(7000).then(() => {
          page.getItemsInMessagesContainer('inbox').then(mails => {
              mails[0].click().then(() => {
                forwardingHelpers.getMailAction(utils.getElement('app-email-view'), OnwardActions.REPLY).click().then(() => {
                  // click the discard
                  page.assertPresenceOfDiscardCTA();
                  page.discardCTA.click().then(() => {
                    page.getTabContent().then(currentTab => {
                      currentTab.$('app-create-email').isPresent().then(createTemplateShown => {
                        expect(createTemplateShown).toBeFalsy();
                        utils.closeCurrentTab();
                      });
                    })
                  })
                });
              });
        });
      });
    });
  });


  it('should allow me click the same mail', () => {
    page.getItemsInMessagesContainer('inbox').then(mails => {
      page.getDataFromMailSummary(mails[0]).then(dataAttrs => {
        Object.assign(onwardingThis, dataAttrs);
        mails[0].click().then(() => {
          // assert it opened
          page.getTabs().then(openTabs => {
            expect(openTabs.length).toBe(MailListObject.defaultTabs.length + 1);
          });
        });
      });
    });
  });

  it('should have a functioning forward CTA', () => {
    CTA = forwardingHelpers.getMailAction(utils.getElement('app-email-view'), OnwardActions.FORWARD);
    expect(CTA.isPresent()).toBeTruthy();
  });

  it('should open mail creation template on clicking FORWARD CTA', () => {
    CTA.click().then(() => {
      utils.waitForPage(500).then(() => {
        MailForm = forwardingHelpers.getOnwardMailForm(utils.getElement('app-email-view'));
        expect(MailForm.isPresent()).toBeTruthy();
      });
    });
  });

  it('should populate Mail Creation template with correct data | Forwarding', () => {
    (Object.keys(createMailTemplate) as TemplateFieldsDataAttr[]).map(field => {
      forwardingHelpers.getFormValue(MailForm, field).then(initValue => {
        initMailTemplate[field] = initValue;
      });
    });

    utils.waitForPage(2000).then(() => {
      // CHECKS
      // USER THAT SENT is RECIPIENT
      expect(initMailTemplate['recipients']).toBe('');
      expect(initMailTemplate['subject'])
        .toBe(expectedSubjectAdjust(OnwardActions.FORWARD, onwardingThis['subject']));
    });
  });

  it('should have appropriate metadata for FORWARD', () => {
    expect(initMailTemplate['content'])
      .toContain(expectedContentAdjust(OnwardActions.FORWARD, onwardingThis['addressed']));
  });

  it('should close Mail Creation/Forwarding Template when I click discard CTA ', () => {
    page.assertPresenceOfDiscardCTA();
    page.discardCTA.click().then(() => {
      page.getTabContent().then(currentTab => {
        currentTab.$('app-create-email').isPresent().then(createTemplateShown => {
          expect(createTemplateShown).toBeFalsy();
        });
      });
    });
  });

});

