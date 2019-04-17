import { Email, CTAEnums, MailListEnums } from './email.po';
import utils from '../utils';

const updatePageMeta = (oldPageMeta, newPageMeta) => {
  Object.assign(oldPageMeta, newPageMeta);
  oldPageMeta.messagesInView = (oldPageMeta['end'] - oldPageMeta['start']) + 1;
};

describe('Quabbly Email submodule tests | Sent Mails', () => {
  const page: Email = new Email(MailListEnums.SENT);
  const pagMeta: {} = {};
  const currentlyViewing = {};
  let hasAccessToSent: boolean;
  const thisBoxType = 'sent';

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
    utils.navigateTo('/email/sent').then(() => {
      utils.urlEndsWith('sent').then(itDoes => {
        expect(itDoes).toBeTruthy();
      });
    });
  });


  it('should NOT have a button to create new mails', () => {
    page.composeButton().isPresent().then(present => {
      expect(present).toBeFalsy();
    });
  });


  it('should exhibit expected pagination behaviour', () => {
    page.checkIfIGotAnError(MailListEnums.SENT).then(errorState => {
      hasAccessToSent = !errorState;
      if (hasAccessToSent) {
        // proceed with tests - else no point
        // change account
        utils.getPaginationIndicatorsFor(MailListEnums.SENT).then(indicators => {
          page.getItemsInMessagesContainer(thisBoxType).then(mails => {
            page.paginationIndicatorAssertions(mails.length, indicators.length);
          });
        });
      } else {
        utils.abortTest('Account doesnt have access to mailbox, please switch accounts');
      }
    });
  });

  it('should display messages metadata ', () => {
    page.getTabContent().then(alertContent => {
      alertContent.$(Email.mailboxMetadata.paginationMetaClassName).getText().then(metaText => {
        expect(metaText).toContain(Email.mailboxMetadata.message);
        Email.mailboxMetadata.paginationMeta.forEach(keyWord => {
          expect(metaText).toContain(keyWord);
        });
      });
    });
  });

  it('should perform stricter checks on data present', () => {
    page.getPaginationMeta('sent').then(meta => {
      updatePageMeta(pagMeta, meta);
      page.getItemsInMessagesContainer(thisBoxType).then(mails => {
        expect(mails.length).toBe(pagMeta['messagesInView']);
      });
    });
  });

  it('should shrink the subject and contact details of sender', () => {
    page.getTab(0).then(sentTab => {
      sentTab.click().then(() => {
        page.getItemsInMessagesContainer(thisBoxType).then(mails => {
          mails[0].all(utils.locateByCSS('app-email-summary div.crop__text')).then(truncated => {
            expect(truncated.length).toBe(Email.TRUNCATEDFIELDS.length);
          });
        });
      });
    });
  });


  it('should display a mail in a new tab when the mail is clicked', () => {
    page.getItemsInMessagesContainer(thisBoxType).then(mails => {
      page.getDataFromMailSummary(mails[0]).then(dataAttrs => {
        Object.assign(currentlyViewing, dataAttrs);
        mails[0].click().then(() => {
          // check that acrive tab is now a  view mail tab
          page.getTabContent().then(content => {
            content.getAttribute('id').then(id => {
              // UPDATE MARK
              // set tab ids to ids of emails
              // that way disallow opening of a mail in more than a tab
              // what about reading and replying or forwarding???
              expect(id).toBe('tab-id-0-panel');
            });
          });
          // next test will test for visible email UI elements
        });
      });
    });
  });

    it('should have expected UI elements displayed when viewing a mail', () => {
      page.getEmailAsWidget(utils.getElement('app-email-view')).isDisplayed().then(isDisplayed => {
        expect(isDisplayed).toBeTruthy();
      });

      page.getEmailDate().isDisplayed().then(isDisplayed => {
        expect(isDisplayed).toBeTruthy();
      });

      page.getEmailSubject().isDisplayed().then(isDisplayed => {
        expect(isDisplayed).toBeTruthy();
      });

      page.getEmailAddresses().isDisplayed().then(isDisplayed => {
        expect(isDisplayed).toBeTruthy();
      });

      page.getEmailBody().isDisplayed().then(isDisplayed => {
        expect(isDisplayed).toBeTruthy();
      });
    });

    it('should format mails appropriately - text and html', () => {
      page.assertMailFormatting(currentlyViewing['text_format'] === 'true');
    });

    it('should not have the Recover Mail CTA on the view', () => {
      page.findRecoverMailCTA().then(isPresent => {
        expect(isPresent).toBeFalsy();
      });
    });

    it(' the tab title should be at most 15 characters with elipsis', () => {
      page.getTabs().then(labels => {
        labels[labels.length - 1].getText().then(text => {
          page.assertSubjectAsTabTitle(currentlyViewing['subject'], text);
        });
      });
    });



    it('should have expected CTAs on the view screen', () => {
      utils.getElements('app-email-view app-email-actions').then(actionCTA => {
        expect(actionCTA.length).toBe(1);
      });
    });

    it('should open all links in mail in a new tab', async () => {
      page.assertLinkOpensInNewTab();
    });

    it('should have the expected meta CTAs - important, star, etc', () => {
      const defaultMeta  = ['important', 'star'];
      page.getTab(0).then(inboxTab => {
        inboxTab.click().then(() => {
          page.getItemsInMessagesContainer(thisBoxType).then(mails => {
            page.mailMetaActionsConform(mails[0], defaultMeta).then(allExpectedActionsShowUp => {
              expect(allExpectedActionsShowUp).toBeTruthy();
            });
          });
        });
      });
    });


    it('should not have a CTA to mark a mail as READ', () => {
      page.getTab(0).then(inboxTab => {
        inboxTab.click().then(() => {
          page.getItemsInMessagesContainer(thisBoxType).then(mails => {
            const container = mails[0].$('app-email-metadata');
              container.$(`span[data-action='read']`).isPresent().then(isAvailable => {
                expect(isAvailable).toBeFalsy();
            });
          });
        });
      });
    });

    it('should show mail actions and display expected styling when I hover on a mail', () => {
      page.getTab(0).then(sentTab => {
        sentTab.click().then(() => {
          page.getItemsInMessagesContainer(thisBoxType).then(mails => {
            utils.simulateHover(mails[0]).then(() => {
              page.getMailActionsFor(mails[0]).isDisplayed().then(isDisplayed => {
                expect(isDisplayed).toBeTruthy();
                page.mailActionsConform(mails[0], ['archive', 'delete', 'flag']).then(allExpectedActionsShowUp => {
                  expect(allExpectedActionsShowUp).toBeTruthy();
                });
                utils.simulateHover(mails[1]).then(() => {
                  page.getMailActionsFor(mails[0]).isDisplayed().then(displayedAfterHoverOff => {
                    expect(displayedAfterHoverOff).toBeFalsy();
                    page.getMailActionsFor(mails[0]).$('nav:nth-child(1) > div > div > span > i').getCssValue('cursor').then(cursorType => {
                      expect(cursorType).toBe('pointer');
                    });
                    page.mailActionsConform(mails[0], ['archive', 'delete', 'flag']).then(allExpectedActionsShowUp => {
                      expect(allExpectedActionsShowUp).toBeFalsy();
                    });
                  });
                });
              });
            });
          });
        });
      });
    });



    it('should have a functional multiple marking system', () => {
      // should allow me click multiple
      page.getItemsInMessagesContainer(thisBoxType).then(mails => {
        utils.waitForPage(1000).then(() => {
          page.getBulkInputForSummary(mails[0]).click().then(() => {
            page.checkMarkedStatus(mails[0]).then(checkedStatus => {
              expect(checkedStatus).toBeTruthy();
              page.getBulkInputForSummary(mails[1]).click().then(() => {
                page.checkMarkedStatus(mails[1]).then(secondFieldCheckedStatus => {
                expect(secondFieldCheckedStatus).toBeTruthy();
                });
              });
            });
          });
        });
        });
    });


    it('should style a mail that is marked as part of bulk action', () => {
      page.getItemsInMessagesContainer(thisBoxType).then(mails => {
        page.checkMarkedStatus(mails[1]).then(checkedStatus => {
          expect(checkedStatus).toBeTruthy();
          mails[1].getAttribute('class').then(classNames => {
            expect(classNames).toContain('marked');
            mails[1].$('app-email-summary').getAttribute('class').then(summaryCmpClassName => {
              expect(summaryCmpClassName).toContain('marked');
            });
          });
        });
      });
    });

    it('should remove styling when mail is no longer marked as part of bulk action', () => {
      page.getItemsInMessagesContainer(thisBoxType).then(mails => {
        page.getBulkInputForSummary(mails[1]).click().then(() => {
          page.checkMarkedStatus(mails[1]).then(checkedStatus => {
            expect(checkedStatus).toBeFalsy();
            mails[1].getAttribute('class').then(classNames => {
              expect(classNames.indexOf('marked')).toBe(-1);
              mails[1].$('app-email-summary').getAttribute('class').then(summaryCmpClassName => {
                expect(summaryCmpClassName.indexOf('marked')).toBe(-1);
              });
            });
          });
      });
    });
    });

    it('should mark all if I click the central box', () => {
      page.getBulkElemInput().click().then(() => {
        // loop through the items in view,
        // get checked status
        page.getItemsInMessagesContainer(thisBoxType).then(mails => {
          const checkedStatus: boolean[] = new Array(mails.length).fill(false);
          mails.forEach((mail, index) => {
            // check status
            page.checkMarkedStatus(mail).then(status => {
              checkedStatus[index] = status;
            });
          });

          utils.waitForPage(300).then(() => {
            // check if everything is true
            const anyNotChecked = checkedStatus.some(status => status === false);
            expect(anyNotChecked).toBeFalsy();
          });
        });
      });
    });

    it('should unmark all if I uncheck the central box', () => {
      page.getBulkElemInput().click().then(() => {
        // loop through the items in view,
        // get checked status
        page.getItemsInMessagesContainer(thisBoxType).then(mails => {
          const checkedStatus: boolean[] = new Array(mails.length).fill(true);
          mails.forEach((mail, index) => {
            // check status
            page.checkMarkedStatus(mail).then(status => {
              checkedStatus[index] = status;
            });
          });

          utils.waitForPage(300).then(() => {
            // check if everything is true
            const allNotChecked = checkedStatus.every(status => status === false);
            expect(allNotChecked).toBeTruthy();
          });
        });
      });
    });


    it('should display the potential actions performable on bulk mails when i have more than one mail checked', () => {
      // TELL ME WHEN I DONT HAVE AT LEAST TWO MAILS
      page.getItemsInMessagesContainer(thisBoxType).then(mails => {
        page.getBulkInputForSummary(mails[0]).click().then(() => {
            page.getBulkInputForSummary(mails[1]).click().then(() => {
              page.bulkActionsActivated().then(canISeeBulkActionsCTA => {
                expect(canISeeBulkActionsCTA).toBeTruthy();
                });
              });
            });
        });
    });

    it('show continue to show bulk actions even as you check more mails ', () => {
      // AGAIN CHECK FOR NUMBER OF MAILS IN BOX
      page.getItemsInMessagesContainer(thisBoxType).then(mails => {
        page.getBulkInputForSummary(mails[2]).click().then(() => {
            page.getBulkInputForSummary(mails[3]).click().then(() => {
                  page.bulkActionsActivated().then(canISeeBulkActionsCTA => {
                    expect(canISeeBulkActionsCTA).toBeTruthy();
                    });
                  });
            });
        });
    });

    it('should no longer show potentual actions if only one mail is selected', () => {
      // deselect all
      // select one
      // THIS IS TRICKY
      // DEPENDING ON HOW MANY MAILS I HAVE
      // CLICKING THE BULK MAIL MAY RESULT IN ALL BEING CHECKED

      // SO, CHECK FOR THE CURRENT STATE
      // IF BULK TOGGLE IS SELECTED
      // DESELECT IT - THEN CHOOSE ONE
      // ELSE ITS NOT SELECTED - WE ARE UNSURE OF STATE
      // SO CLICK TO SELECT IT, THEN CLICK AGAIN TO DESELECT ALL, THE SELECT ONE

      // OR CONVERSELY RELOAD PAGE
      // THEN CLICK ONE
      // IM TAKING THE LATER ROUTE
      utils.navigateTo('/email/sent').then(() => {
        utils.waitForPage(1300).then(() => {
          page.getItemsInMessagesContainer(thisBoxType).then(mails => {
            page.getBulkInputForSummary(mails[0]).click().then(() => {
              page.bulkActionsActivated().then(canISeeBulkActionsCTA => {
                expect(canISeeBulkActionsCTA).toBeFalsy();
              });
            });
          });
        });
      });
    });

    it('should perform bulk actions on all selected mails', () => {
      // UNCOMMENT WHEN A NON DESTRUCTIVE ACTION EXISTS
      // You cant Mark SENT MAILS as READ
      // Archive has no visible action
      /*
      utils.navigateTo('/email/sent').then(() => {
        utils.waitForPage(3000).then(() => {
          page.getItemsInMessagesContainer(thisBoxType).then(mails => {
            page.getBulkInputForSummary(mails[0]).click().then(() => {
              page.getBulkInputForSummary(mails[1]).click().then(() => {
                page.bulkActionsActivated().then(canISeeBulkActionsCTA => {
                  expect(canISeeBulkActionsCTA).toBeTruthy();
                  page.getBulkActionsCTAByDataAttr(CTAEnums.READ).click().then(() => {
                    utils.waitForPage(300).then(() => {
                      page.getItemsInMessagesContainer(thisBoxType).then(postActionMails => {
                        postActionMails[0].$('app-email-summary').getAttribute('class').then(classNames => {
                          expect(classNames.indexOf('unread')).toBeLessThan(0);
                        });
                        postActionMails[1].$('app-email-summary').getAttribute('class').then(classNames => {
                          expect(classNames.indexOf('unread')).toBeLessThan(0);
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
      */
    });

    it('deleting a mail, should reduce the number of mails', () => {
      utils.navigateTo('/email/sent').then(() => {
        utils.waitForPage(2000).then(() => {
          page.getItemsInMessagesContainer(thisBoxType).then(mails => {
            page.getDataFromMailSummary(mails[0]).then(dataAttrs => {
              const deleteMail = {};
              Object.assign(deleteMail, dataAttrs);
              utils.simulateHover(mails[0]).then(() => {
                page.getMailActionsFor(mails[0]).$('span[data-action="delete"]').click().then(() => {
                  utils.waitForPage(100).then(() => {
                    page.getItemsInMessagesContainer(thisBoxType).then(postDeleteMails => {
                      expect(postDeleteMails.length).toBe(mails.length - 1);
                      page.getDataFromMailSummary(postDeleteMails[0]).then(detailsOfPostDeleteFirstMail => {
                        expect(detailsOfPostDeleteFirstMail['id'] === deleteMail['id']).toBeFalsy();
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
});

