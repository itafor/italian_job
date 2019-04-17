import { Email, CTAEnums, MailListEnums } from './email.po';
import utils from '../utils';

const updatePageMeta = (oldPageMeta, newPageMeta) => {
  Object.assign(oldPageMeta, newPageMeta);
  oldPageMeta.messagesInView = (oldPageMeta['end'] - oldPageMeta['start']) + 1;
};


describe('Quabbly Email submodule tests', () => {
    const page: Email = new Email(MailListEnums.INBOX);
    const pagMeta: {} = {};
    const currentlyViewing = {};
    const thisBoxType = 'inbox';
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
      utils.navigateTo('/email').then(() => {
        utils.waitForPage(3000).then(() => {
          utils.urlEndsWith('email').then(itDoes => {
            expect(itDoes).toBeTruthy();
          });
        });
      });
    });

      // should have three tabs on load:
    it('should have the specified number of tabs on load', () => {
      page.getTabs().then(tabs => {
        expect(tabs.length).toEqual(Email.defaultTabs.length);
      });
    });

    it('the tabs should have the correct labels', () => {
      page.getTabs()
        .then(tabs => {
          for (let index = 0; index < tabs.length; index++) {
            tabs[index].getText().then(label => {
              expect(label).toEqual(Email.defaultTabs[index].label);
            });
          }
        });
    });

    it('should have the inbox tab as default tab', () => {
      page.getTab(0).then(tab => {
        tab.$('a').getAttribute('class').then(className => expect(className).toContain('active'));
        tab.getText().then(label => {
          expect(label).toBe(Email.defaultTabs[0].label);
        });
      });
    });

  it('should pass more stringent test checking if mailbox content is actually shown', () => {
    page.getTabContent().then(content => {
      content.getAttribute('id').then(id => {
        expect(id).toBe(Email.defaultTabs[0].contentId);
      });
    });
  });


  it('should have a functional tab system', () => {
    page.getTab(1).then(newslettersTab => {
      newslettersTab.click().then(() => {
        // check if its active
        newslettersTab.$('a').getAttribute('class').then(className => {
          expect(className).toContain('active');
          page.getTab(2).then(alertsTab => {
            alertsTab.click().then(() => {
              alertsTab.$('a').getAttribute('class').then(secondClassName => {
                expect(secondClassName).toContain('active');
                // check that first tab no longer contains active
                newslettersTab.$('a').getAttribute('class').then(postSwitchClassName => {
                  expect(postSwitchClassName.indexOf('active')).toBeLessThan(0);
                  newslettersTab.click().then(() => {
                    newslettersTab.$('a').getAttribute('class').then(postReturnClassName => {
                      expect(postReturnClassName).toContain('active');
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

  it('should pass further test checking content changes', () => {
    page.getTabContent().then(content => {
      content.getAttribute('id').then(id => {
        expect(id).toBe(Email.defaultTabs[1].contentId);
      });
    });
  });



  it('shows loading spinner whilst api call is in progress', () => {
    utils.navigateTo('/email').then(() => {
      utils.waitForPage('300').then(() => {
        expect(page.getLoadingSpinner()).toBeTruthy();
      });
    });
  });

  it('should exhibit expected animations on page load', () => {
    const animsAttrs = ['ng-trigger', 'ng-trigger-mailEnter'];
    page.getAttributes(page.getMessagesContainer(thisBoxType)).then(nodes => {
      animsAttrs.map(attr => expect(nodes[1].textContent).toContain(attr));
    });
  });

  it('should have the compose button have the expected styling', () => {
    page.getComposeMailButton().then(btnText => {
      expect(btnText).toContain('Compose');
    });

    expect(page.composeButton().$('i.fa-fa-plus')).toBeTruthy();
    page.composeButton().getAttribute('class').then(className => {
      Email.composeButtonMeta.class.forEach(classWeExpect => {
        expect(className).toContain(classWeExpect);
      });
    });
    Object.keys(Email.composeButtonMeta.styleAttributes).forEach(styleAttr => {
      page.composeButton().getCssValue(styleAttr).then(value => expect(value).toBe(Email.composeButtonMeta.styleAttributes[styleAttr]));
    });
  });

  it('should exhibit expected pagination behaviour', () => {
    utils.getPaginationIndicatorsFor(MailListEnums.INBOX).then(indicators => {
      page.getItemsInMessagesContainer(thisBoxType).then(mails => {
        page.paginationIndicatorAssertions(mails.length, indicators.length);
      });
    });
  });

  it('should display messages metadata when inbox is clicked', () => {
    page.getTab(0).then(inboxTab => {
      inboxTab.click().then(() => {
        page.getTabContent().then(inboxContent => {
          inboxContent.$(Email.mailboxMetadata.paginationMetaClassName).getText().then(metaText => {
            expect(metaText).toContain(Email.mailboxMetadata.message);
            Email.mailboxMetadata.paginationMeta.forEach(keyWord => {
              expect(metaText).toContain(keyWord);
            });
          });
        });
      });
    });
  });

  it('should perform stricter checks on data present', () => {
    page.getPaginationMeta(thisBoxType).then(meta => {
      updatePageMeta(pagMeta, meta);
      page.getItemsInMessagesContainer(thisBoxType).then(mails => {
        expect(mails.length).toBe(pagMeta['messagesInView']);
      });
    });
  });

  it('expected meta CTAs should have expected tooltips', () => {
    page.getTab(0).then(inboxTab => {
      const expectedAttrObj = {
        '[data-action="important"]': 'Mark mail as Important',
        '[data-action="star"]': 'Star this mail',
      };
      inboxTab.click().then(() => {
        page.getItemsInMessagesContainer(thisBoxType).then(mails => {
          mails[0].$('app-email-summary').getAttribute('class').then(classNames => {
            if (classNames.indexOf('unread') > -1) {
              expectedAttrObj['[data-action="read"]'] = 'Mark as Read';
             }
            page.attributesConform(mails[0], 'app-email-metadata', 'span', 'ng-reflect-ngb-tooltip', expectedAttrObj);
          });
        });
      });
    });
  });

  it('mail list should have expected icons', () => {
    const iconsObj = {
      star: '.icon.ion-ios-star',
      important: '.icon.ion-ios-pricetag'
    };

    page.getTab(0).then(inboxTab => {
      inboxTab.click().then(() => {
        page.getItemsInMessagesContainer(thisBoxType).then(mails => {
          mails[0].$('app-email-summary').getAttribute('class').then(classNames => {
            if (classNames.indexOf('unread') > -1) {
              iconsObj['read'] = '.icon.ion-email-unread';
            }
            page.mailMetaActionsIcons(mails[0], iconsObj);
          });
        });
      });
    });
  });

  it('should shrink the subject and contact details of sender', () => {
    page.getTab(0).then(inboxTab => {
      inboxTab.click().then(() => {
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

    it('should show the correct sender', () => {
      page.getEmailAddresses().getText().then(addressed => {
        expect(addressed).toContain(currentlyViewing['addressed']);
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

    it('should have the expected meta CTAs - read, important, star, etc', () => {
      const defaultMeta  = ['important', 'star'];
      page.getTab(0).then(inboxTab => {
        inboxTab.click().then(() => {
          page.getItemsInMessagesContainer(thisBoxType).then(mails => {
            mails[0].getAttribute('class').then(classNames => {
              if (classNames.indexOf('unread') > -1) {
                defaultMeta.push('read');
              }
              page.mailMetaActionsConform(mails[0], defaultMeta).then(allExpectedActionsShowUp => {
                expect(allExpectedActionsShowUp).toBeTruthy();
              });
            });
          });
        });
      });
    });


    it('should show mail actions and display expected styling when I hover on a mail', () => {
      page.getTab(0).then(inboxTab => {
        inboxTab.click().then(() => {
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

    it('should mark a mail as read, when mail is clicked', () => {
      page.getItemsInMessagesContainer(thisBoxType).then(mails => {
        mails[0].$('app-email-summary').getAttribute('class').then(classNames => {
          expect(classNames.indexOf('unread')).toBeLessThan(0);
        });
      });
    });

    it('should mark a mail as read, when CTA is clicked', () => {
      page.assertMarkAsReadConsicousOfNonExistience(thisBoxType);
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

  it('should no longer show potential actions if only one mail is selected', () => {
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
    utils.navigateTo('/email').then(() => {
      utils.waitForPage(1000).then(() => {
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

  it('shows loading spinner when i reload page', () => {
    utils.reload().then(() => {
      utils.waitForPage('200').then(() => {
        expect(page.getLoadingSpinner()).toBeTruthy();
      });
    });
  });

  it('should perform bulk actions on all selected mails', () => {
    // select two or more mails
    // mark them as read
    // wait
    // check their new status via class
    utils.navigateTo('/email').then(() => {
      utils.waitForPage(3000).then(() => {
        page.getItemsInMessagesContainer(thisBoxType).then(mails => {
          page.getBulkInputForSummary(mails[0]).click().then(() => {
            page.getBulkInputForSummary(mails[1]).click().then(() => {
              page.bulkActionsActivated().then(canISeeBulkActionsCTA => {
                expect(canISeeBulkActionsCTA).toBeTruthy();
                // search out mark as read
                page.getBulkActionsCTAByDataAttr(CTAEnums.READ).click().then(() => {
                  // SIMULATE API CALL
                  utils.waitForPage(300).then(() => {
                    // INSPECT PAGE AGAIN
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
  });

  it('deleting a mail, should reduce the number of mails', () => {
    utils.navigateTo('/email').then(() => {
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


// Test schematics

// it should have an expected pagination behaviior
// show all mails if number is less than curr pagination limit etc

// fetches mails
// shows pagination ,metadata
// shows action buttons on nav
// show action buttons on hover
// on click - mark as read
// bulk actions
// behavior of inputs
// show metadata div

// bulk reading - i.e. checking bulk wworls
// check some first



// check if expected buttons exist  - mark as read, checkboxes, etc


// email view works
// reply works
// pagination works
// pagonatoom buttopns show as they are supposed to, back doenst show on first page


