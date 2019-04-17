import { Email, CTAEnums, MailListEnums } from './email.po';
import utils from '../utils';

const updatePageMeta = (oldPageMeta, newPageMeta) => {
  Object.assign(oldPageMeta, newPageMeta);
  oldPageMeta.messagesInView = (oldPageMeta['end'] - oldPageMeta['start']) + 1;
};

describe('Quabbly Email submodule tests | Trash Mails', () => {
  const page: Email = new Email(MailListEnums.SENT);
  const pagMeta: {} = {};
  const currentlyViewing = {};
  let hasAccessToSent: boolean;
  const thisBoxType = 'trash';

  /*
  beforeAll(() => {
    utils.navigateTo('/?test');
      // attempt login
      // NOTE:
      // Supply details of an account with access to creating and recieving emails
      // especially if this is run alone
    utils.handleAuthWithCredentials();
  });
  */

  it('should navigate to the url', () => {
    utils.navigateTo('/email/trash').then(() => {
      utils.urlEndsWith('trash').then(itDoes => {
        expect(itDoes).toBeTruthy();
      });
    });
  });


  it('should NOT have a button to create new mails', () => {
    page.composeButton().isPresent().then(present => {
      expect(present).toBeFalsy();
    });
  });

  it('should show correct message when there are no mails in trash', () => {
    utils.waitForPage(500).then(() => {
      utils.getElement('.empty--mailbox').isPresent()
        .then(noMails => {
          if (noMails) {
            utils.getElement('.empty--mailbox').getText().then(message => {
              expect(message).toBe('There are no mails in your trash.');
            });
          }
        });
    });
  });

  // SKIP: No mail in trash yet
  xit('should have the Recover Mail CTA on the view', () => {
    page.findRecoverMailCTA().then(isPresent => {
      expect(isPresent).toBeTruthy();
    });
  });
});

