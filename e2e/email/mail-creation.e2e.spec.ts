import { MailCreationPageObject, createMailTemplate, AttachmentViews,
  TemplateFieldsDataAttr, ToastrTypes, files as DemoFiles } from './mail-creation.po';
import utils from '../utils';



describe('Quabbly Email submodule tests: Mail Creation flow', () => {
  const pageObject: MailCreationPageObject = new MailCreationPageObject(null);

  beforeAll(() => {
    utils.navigateTo('/?test');
    // UPDATE FOR LIVE TESTING
    utils.handleAuthWithCredentials();
  });


  it('should navigate to email after auth', () => {
    utils.navigateTo('/email').then(() => {
      expect(utils.urlEndsWith('email')).toBeTruthy();
    });
  });

  it('should show expected mail creation template', () => {
    pageObject.initMailCreation().then(() => {
      Object.keys(createMailTemplate).map(templateFields => {
        pageObject.templateFieldExists((templateFields) as TemplateFieldsDataAttr).then(templateExists => {
          expect(templateExists).toBeTruthy();
        });
      });
    });
  });

  it('should have empty fields by default', () => {
    (Object.keys(createMailTemplate) as TemplateFieldsDataAttr[]).map(templateField => {
      pageObject.valueOfTemplateField(templateField).then(value => expect(value).toBe(createMailTemplate[templateField].emptyValue));
    });
  });

  it('should show send button by default', () => {
    pageObject.sendButtonAvailable().then(availForInt => expect(availForInt).toBeTruthy());
  });


  it('should allow user fill fields', () => {
    (Object.keys(createMailTemplate) as TemplateFieldsDataAttr[]).map(templateField => {
      pageObject.fillTemplateField(templateField, createMailTemplate[templateField].safeValue.single);
    });

    // CHECK IF WHAT YOU FILLED GOT ACCEPTED
    (Object.keys(createMailTemplate) as TemplateFieldsDataAttr[]).map(templateField => {
      pageObject.valueOfTemplateField(templateField).then(value => {
        expect(value).toBe(createMailTemplate[templateField].safeValue.single);
      });
    });
  });

  it('should show send button after filling inputs', () => {
    pageObject.forceUpdate().then(() => {
      pageObject.sendButtonAvailable().then(available => expect(available).toBeTruthy());
    });
  });

  it('should disable send button on click', () => {
    pageObject.clickSendButton().then(() => {
      // check for spinner in button
      // diabled

      // CREATE MAIL TAB IS CLOSED AFTER RESPONSE FROM API
      // I CANT CHECK FOR THESE ATM
        pageObject.sendButtonDisabled().then(isDisabled => {
          expect(isDisabled).toBeTruthy();
        }).catch(pageObject.handleErrorsFromInteractingWithElementThatMayNotNBePresent);
  });
});

  it('should show loading spinner', () => {
    pageObject.sendButtonSendIconDisplayed().then(sendIconDisplayed => {
      expect(sendIconDisplayed).toBeFalsy();
    });
    /*
    // PAGE NAVIGATES AWAY B4 LOADER CAN BE CHECKED
    pageObject.sendButtonSpinnerDisplayed().then(spinnerDisplayed => {
      expect(spinnerDisplayed).toBeTruthy();
    });
    */
  });

  it('should show appropriate UI notifications', () => {
    // This is proving to be tricky
      // check for toastr success
      utils.waitForPage(300).then(() => {
        expect(pageObject.toastrOfTypePresent(ToastrTypes.ERROR)).toBeTruthy();
      }).catch(err => {
        if (err.name === 'NoSuchElementError') {
          // ehh, try checking for sucess
          expect(pageObject.toastrOfTypePresent(ToastrTypes.SUCCESS)).toBeTruthy();
        }
      });
  });


  it('should have discard mail CTA', () => {
    utils.navigateTo('/email').then(() => {
      pageObject.initMailCreation().then(() => {
        pageObject.assertPresenceOfDiscardCTA();
      });
    });
  });

  it('should close the tab when discard mail CTA is clicked', () => {
    pageObject.getTabs().then(tabs => {
      // assume last mail is focused
      tabs[tabs.length - 1].$('a').getAttribute('id').then(idOfLastTab => {
        pageObject.discardCTA.click().then(() => {
          pageObject.getTabs().then(postDiscardTabs => {
            expect(postDiscardTabs.length).toBe(tabs.length - 1);
            tabs[tabs.length - 2].$('a').getAttribute('id').then(idOfLastTabPostClose => {
              expect(idOfLastTab === idOfLastTabPostClose).toBeFalsy();
            });
          });
        });
      });
    });
  });

});



describe('Quabbly Email submodule tests: Mail Creation flow | Attachments', () => {
  const pageObject: MailCreationPageObject = new MailCreationPageObject(null);
  let attachmentInputField;

  /*
  beforeAll(() => {
    utils.navigateTo('/');
    // UPDATE FOR LIVE TESTING
    utils.handleAuthWithCredentials();
  });
  */


  it('should navigate to email after auth', () => {
    utils.navigateTo('/email').then(() => {
      expect(utils.urlEndsWith('email')).toBeTruthy();
    });
  });


  it('should have an input field for files', () => {
    utils.navigateTo('/email').then(() => {
      // wait so previous checks can complete
      // DIDNT PROTRACTOR WAIT FOR COMPLETION OF ASYNC CALLS?
      pageObject.initMailCreation().then(() => {
        pageObject.allFileInputs.then(allFileInputs => {
          expect(allFileInputs.length).toBeGreaterThan(0);
        });
      });
    });
  });

  it('should be just one file input field', () => {
    pageObject.allFileInputs.then(allFileInputs => {
      expect(allFileInputs.length).toBe(1);
    });
  });

  it('should be hidden', () => {
    pageObject.allFileInputs.then(allFileInputs => {
      attachmentInputField = allFileInputs[0];
      attachmentInputField.isDisplayed().then(displayStatus => expect(displayStatus).toBeFalsy());
    });
  });

  it('should allow for adding attachment to a mail', () => {
    // click on CTA
    utils.getElement(`span[data-name=${MailCreationPageObject.attachmentCTADataAttr}]`).click()
      .then(() => {
        attachmentInputField.sendKeys(pageObject.fileURLs[0]);
        expect(pageObject.attachmentsDetailsContainer).toBeTruthy();
      });
    // pass file to actual input
  });

  it('should show details of attachment', () => {
    utils.waitForPage(300).then(() => {
      pageObject.attachmentDetails.then(details => {
        expect(details[0]).toBeTruthy();
      });
    });
  });

  it('should display expected UI Elements in attachment details container', () => {
    Object.keys(MailCreationPageObject.ATTACHMENTDETAILS).map(elem => {
      const fieldValue = MailCreationPageObject.ATTACHMENTDETAILS[elem];
      utils.getElement(`.${MailCreationPageObject.attachmentContainerClass}  ${fieldValue.selector}`)
      .getAttribute('class').then(classes => {
        expect(classes).toContain(fieldValue.class);
      });
    });
  });

  it('should show correct details of attachment', () => {
    pageObject.attachmentDetails.then(details => {
      details[0].getText().then(text => {
        expect(text).toContain(DemoFiles.names[0]);
      });
    });
  });

  it('should have a way to remove attachment', () => {
    pageObject.removeAttachmentCTA.then(removeCTAList => {
      expect(removeCTAList.length).toBeTruthy();
      expect(removeCTAList.length).toBe(1);
    });
  });

  it('should allow for removing attachment', () => {
    pageObject.removeAttachmentCTA.then(removeCTAList => {
      removeCTAList[0].click().then(() => {
        pageObject.attachmentsDetailsContainer.isPresent()
          .then(present => {
            expect(present).toBeFalsy();
            pageObject.removeAttachmentCTA.then(removeCTAListPostRemove => {
              expect(removeCTAListPostRemove.length).toBeFalsy();
            });
          });
      });
    });
  });


  it('should allow for multiple attachments', () => {
    utils.navigateTo('/email').then(() => {
      utils.waitForPage(700).then(() => {
        // wait so previous checks can complete
        // DIDNT PROTRACTOR WAIT FOR COMPLETION OF ASYNC CALLS?
        pageObject.initMailCreation().then(() => {
          pageObject.allFileInputs.then(allFileInputs => {
            attachmentInputField = allFileInputs[0];
            attachmentInputField.sendKeys(pageObject.fileURLs[0]);
            attachmentInputField.sendKeys(pageObject.fileURLs[1]);
            utils.waitForPage(300).then(() => {
              pageObject.attachmentDetails.then(details => {
                expect(details[0]).toBeTruthy();
                expect(details[1]).toBeTruthy();
              });
            });
          });
        });
      });
    });
  });

  // skipped due to known issues with protractor and multiple files
  // although this worked earlier
  // different versions perhaps
  xit('should show correct details of multiple attachments', () => {
    pageObject.attachmentDetails.then(details => {
      details.forEach((detail, index) => {
        detail.getText().then(text => {
          expect(text).toContain(DemoFiles.names[index]);
        });
      });
    });
  });

  it('should NOT ignore duplicate attachments', () => {
    attachmentInputField.sendKeys(pageObject.fileURLs[0]);
    utils.waitForPage(300).then(() => {
      pageObject.attachmentDetails.then(details => {
        expect(details.length).toBe(3);
      });
    });
  });

  it('should have all attachments be able to remove attachments', () => {
    pageObject.removeAttachmentCTA.then(removeCTAList => {
      expect(removeCTAList.length).toBe(3);
    });
  });

  it('should remove correct attachment', () => {
    pageObject.removeAttachmentCTA.then(removeCTAList => {
      removeCTAList[1].click().then(() => {
        // reduced length
        pageObject.attachmentDetails.then(details => {
          expect(details.length).toBe(2);
        });
        // corectly removed
        pageObject.attachmentDetails.then(details => {
          details[1].getText().then(text => {
            expect(text).toContain(DemoFiles.names[0]);
          });
        });
        // check number of remove CTAs
        pageObject.removeAttachmentCTA.then(postRemoveCTAList => {
          expect(postRemoveCTAList.length).toBe(2);
        });
      });
    });
  });

  it('should show correct number of attachments in header', () => {
    utils.getElement(`${MailCreationPageObject.baseSelector}
    .${MailCreationPageObject.attachmentContainerClass} ${MailCreationPageObject.ATTACHMENTDETAILS.description.selector}`)
      .getText().then(text => {
        expect(text).toBe('Attaching 2 files');
      });
  });


  it('should display total attachment size', () => {
    utils.getElement(`${MailCreationPageObject.baseSelector} ${MailCreationPageObject.attachmentTotalSize}`)
      .getText().then(text => {
        expect(text).toContain('of attachments');
      });
  });


  it('should have a functioning minimize functionality', () => {
    // should be expanded by default
    pageObject.viewSwitcher.$('i').getAttribute('class').then(classOfIcon => {
      expect(classOfIcon).toBe(AttachmentViews.EXPANDED);
      pageObject.attachmentDetails.then(details => {
        details[0].getCssValue('height').then(initHeight => {
          expect(parseInt(initHeight, 10)).toBeGreaterThan(1);
        });
      });
      pageObject.viewSwitcher.click().then(() => {
        pageObject.attachmentDetails.then(details => {
          details[0].getCssValue('height').then(afterCollapseHeight => {
            expect(parseInt(afterCollapseHeight, 10)).toBe(1);
            pageObject.viewSwitcher.$('i').getAttribute('class').then(classNames => {
              expect(classNames).toBe(AttachmentViews.COLLAPSED);
            });
          });
        });
      });
    });
  });

  it('should have functioning enlarge functionality', () => {
    pageObject.viewSwitcher.$('i').getAttribute('class').then(classOfIcon => {
      expect(classOfIcon).toBe(AttachmentViews.COLLAPSED);
      pageObject.attachmentDetails.then(details => {
        details[0].getCssValue('height').then(initHeight => {
          expect(parseInt(initHeight, 10)).toBe(1);
        });
      });
      pageObject.viewSwitcher.click().then(() => {
        pageObject.attachmentDetails.then(details => {
          details[0].getCssValue('height').then(afterEnlargeHeight => {
            expect(parseInt(afterEnlargeHeight, 10)).toBeGreaterThan(1);
            pageObject.viewSwitcher.$('i').getAttribute('class').then(classNames => {
              expect(classNames).toBe(AttachmentViews.EXPANDED);
            });
          });
        });
      });
    });
  });
});


describe('Quabbly Mail Creation Flow | Attachment SIze Validation', () => {
  const pageObject: MailCreationPageObject = new MailCreationPageObject(null);
  let attachmentInputField;

  it('should be able to attach a file with size less than 25MB', () => {
    utils.closeCurrentTab().then(() => {
      pageObject.initMailCreation().then(() => {
        pageObject.allFileInputs.then(allFileInputs => {
          attachmentInputField = allFileInputs[0];
          attachmentInputField.sendKeys(pageObject.fileURLs[2]);
          utils.waitForPage(300).then(() => {
            pageObject.attachmentDetails.then(details => {
              expect(details).toBeTruthy();
              details[0].getText().then(text => {
                expect(text).toContain(DemoFiles.names[2]);
              });
            });
          });
        });
      });
    });
  });

  it('should NOT add allow adding an attachment that would drive the total attachments be greater than 25MB', () => {
    attachmentInputField.sendKeys(pageObject.fileURLs[3]);
    utils.waitForPage(300).then(() => {
      pageObject.attachmentDetails.then(details => {
        expect(details.length).toBe(1);
      });
    });
  });

  it('should show a pop up explaining why attachment wasnt attached', () => {
    pageObject.userPrompt.isPresent().then(isPresentInDOM => {
      expect(isPresentInDOM).toBeTruthy();
    });
    pageObject.userPrompt.isDisplayed().then(isDisplayed => {
      expect(isDisplayed).toBeTruthy();
    });
  });

  it('pop up should have the expected contents', () => {
    pageObject.promptTests();
  });

  it('should be able to close the pop up', () => {
    pageObject.closePrompt().then(() => {
      pageObject.userPrompt.isPresent().then(isPresentInDOM => {
        expect(isPresentInDOM).toBeFalsy();
      });
    });
  });

  it('it should not allow a single attachment greater than 25MB', () => {
    utils.closeCurrentTab().then(() => {
      pageObject.initMailCreation().then(() => {
        pageObject.allFileInputs.then(allFileInputs => {
          attachmentInputField = allFileInputs[0];
          attachmentInputField.sendKeys(pageObject.fileURLs[4]);
          utils.waitForPage(300).then(() => {
            pageObject.attachmentDetails.then(details => {
              expect(details[0]).toBeFalsy();
            });
          });
        });
      });
    });
  });

  it('should show a pop up explaining why attachment wasnt attached', () => {
    pageObject.userPrompt.isPresent().then(isPresentInDOM => {
      expect(isPresentInDOM).toBeTruthy();
    });
    pageObject.userPrompt.isDisplayed().then(isDisplayed => {
      expect(isDisplayed).toBeTruthy();
      utils.waitForPage(10000);
    });
  });

  it('pop up should have the expected contents', () => {
    pageObject.promptTests();
  });
});




// put dmmy mails in a file for easier assertions?

// can send mail i.e button appears and isnt disabled
// when you actually click, spinner shows
// appropriate, expected notifs - for now, toastr put in PO
// does quabbly respect privacy? - later perhaps.
// email view respects mail you sent?
// only do this from sent msgs - since other mail clients may change stricture or you rmail
// change it to tables or so


// can i reply? or another test file?
// Reply respects create view???


// in create mail - is the form pure

// in replya dn forward mail

// on send, send button displays loading


// can oi forward?



// 28 - 02 - 2019
// Allow duplicates
// Collapse Enlarge, btn and works
// Container header
// emove , btn and func, cursor
// total attachment size
