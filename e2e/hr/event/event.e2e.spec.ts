import { Event } from './event.po';
import { browser, Key } from 'protractor';
import utils from '../../utils';

const date = new Date();
let todayDate:any = date.getDate();
if (todayDate.toString().length === 1) {
    todayDate = `0${todayDate}`;
} else {
    todayDate = todayDate - 3;
}

const testValue = {

    name: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 9),
    description: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 8),
    startDate: `${date.getMonth() + 2}-${todayDate}-${date.getFullYear()}`,
    startTime: `0245AM`,
    stopTime: `0245AM`,
    stopDate: `${date.getMonth() + 3}-${todayDate}-${date.getFullYear()}`,


};
const eventCreateTopFields = {
    name: {
        placeholder: 'Name',
        safeValue: testValue.name
    },
    description: {
        placeholder: 'Description',
        safeValue: testValue.description
    }
};

const eventCreateBottomFields = {
    startTime: {
        placeholder: 'Start Time',
        label: 'Event Start Time',
        safeDate: testValue.startDate,
        tab: 'Key.Tab',
        safeTime: testValue.startTime,
        actualValue: `${date.getFullYear()}-0${date.getMonth() + 2}-${todayDate}T02:45`
    },
    stopTime: {
        placeholder: 'Stop Time',
        label: 'Event Stop Time',
        safeDate: testValue.stopDate,
        tab: 'Key.TAB',
        safeTime: testValue.stopTime,
        actualValue: `${date.getFullYear()}-0${date.getMonth() + 3}-${todayDate}T02:45`
    }

};


const eventUpdateTopFields = {
    name: {
        safeValue: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 9),
    },
    description: {
        safeValue: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 9),
    },
}
const eventUpdateBottomFields = {

    startTime: {
        placeholder: 'Start Time',
        safeDate: `0${date.getMonth() + 3}-${todayDate}-${date.getFullYear()}`,
        safeTime: `0245AM`,
    },
    stopTime: {
        placeholder: 'Stop Time',
        safeDate: `0${date.getMonth() + 4}-${todayDate}-${date.getFullYear()}`,
        safeTime: `0245PM`,

    }
}


const invalidTest = {
    name: {
        emptyChar: {
            input: '',
            msg: 'Please enter event name'
        }
    },
    description: {
        emptyChar: {
            input: '',
            msg: 'Please enter event description'
        }
    },
    startTime: {
        emptyChar: {
            input: '',
            msg: 'Please enter event start time'
        }
    },
    stopTime: {
        emptyChar: {
            input: '',
            msg: 'Please enter event stop time'
        }
    }
};


const addbutton = '.fa-plus';
const btn = '.btn';
const btnprimary = '.btn-primary';
const faviconclass = '.fa';

describe('Quabbly| EVENT', () => {
    let page: Event;

    beforeEach(() => {
        page = new Event();
    });

    it('should display an initial static tab with the title "Events", and an empty list with text "No Events", if no Event has been created', () => {
        page.navigateTo('/hr/events');
        expect(page.getElement('#events-id').getText()).toEqual('Events');
        expect(page.getElement('#no-event-id').getText()).toEqual('No Events');
    });

    it('should have a button with a title Create Event, a plus icon and class btn-primary', () => {
        page.getActionButton('#createEventButton', `${btn}${btnprimary}`, `#icon-create-event${faviconclass}${addbutton}`, 'Create Event');
    });

    it('on click of the Create Button, a new tab titled New Event should be shown', () => {
        page.getElement('#createEventButton').click();
        browser.sleep(1000);
        expect(page.getElement('#tab-id-0').getText()).toEqual('New Event   ×');

    });

    it('should display a form with a title New Event', () => {
        expect(page.getElement('#newEventHeader').getText()).toEqual('New Event');
    });


    it('should show form input fields with the correct placeholders and label', () => {
        Object.keys(eventCreateTopFields).map(field => {
            expect(page.getElement(`#event-${field}`).getAttribute('placeholder')).toEqual(eventCreateTopFields[field].placeholder);
        });
        Object.keys(eventCreateBottomFields).map(field => {
            expect(page.getElement(`#event-${field}`).getAttribute('placeholder')).toEqual(eventCreateBottomFields[field].placeholder);
            expect(page.getElement(`#create-${field}-label`).getText()).toEqual(eventCreateBottomFields[field].label);
        });
    });

    it('should have a button with a title Create Event and class btn-primary, and the button should be disabled', () => {
        expect(page.getElement('#create-event-submit').getText()).toEqual('Create Event');
        expect(page.getElement(`#create-event-submit${btn}${btnprimary}`).isDisplayed()).toBeTruthy();
        expect(page.getElement('#create-event-submit').getAttribute('disabled')).toBeTruthy();
    });

    it('should display error message below the text input field values are invalid', () => {
        Object.keys(invalidTest).map(field => {
            Object.keys(invalidTest[field]).map(datas => {
                page.getElement(`#event-${field}`).sendKeys(invalidTest[field][datas].input);
                page.getElement(`#newEventHeader`).click();
                expect(page.getElement(`.err${field}`).isDisplayed()).toBeTruthy();
                expect(page.getElement(`.err${field}`).getText()).toEqual(invalidTest[field][datas].msg);
                page.getElement(`#event-${field}`).clear();
            });
        });
    });

    it('should allow valid text input', () => {

        Object.keys(eventCreateTopFields).map(field => {
            page.getElement(`#event-${field}`).sendKeys(eventCreateTopFields[field].safeValue);
            expect(page.getElement(`#event-${field}`).getAttribute('value')).toEqual(eventCreateTopFields[field].safeValue);
            page.getElement(`#event-${field}`).clear();
        });
        Object.keys(eventCreateBottomFields).map(field => {
            page.getElement(`#event-${field}`).sendKeys(eventCreateBottomFields[field].safeDate).then(() => {
                page.getElement(`#event-${field}`).sendKeys(Key.TAB).then(() => {
                    page.getElement(`#event-${field}`).sendKeys(eventCreateBottomFields[field].safeTime);
                    expect(page.getElement(`#event-${field}`).getAttribute('value')).toEqual(eventCreateBottomFields[field].actualValue);
                    page.getElement(`#event-${field}`).clear();
                })
            })
        });
    });

    it('should display a toaster success on successful creation if all required fields are correctly entered', () => {

        Object.keys(eventCreateTopFields).map(field => {
            page.getElement(`#event-${field}`).sendKeys(eventCreateTopFields[field].safeValue);
        });
        Object.keys(eventCreateBottomFields).map(field => {
            page.getElement(`#event-${field}`).sendKeys(eventCreateBottomFields[field].safeDate).then(() => {
                page.getElement(`#event-${field}`).sendKeys(Key.TAB).then(() => {
                    page.getElement(`#event-${field}`).sendKeys(eventCreateBottomFields[field].safeTime);
                });
            });
        });
        page.getElement("#create-event-submit").click();
        expect(page.toasterSuccess()).toEqual('Event Created Successfully');
    });

    xit('should display a table with header text titled - Names, Description, Start Time,  Stop Time, Action, on successful creation', () => {
        browser.sleep(700);
        expect(page.getTableHeader()).toEqual(['Names', 'Description', 'Start Time', 'Stop Time', 'Action']);
    });

    xit('should display a table body with created content of event, on successful creation', () => {
        expect(page.getElement('#event-startTime-id').isPresent()).toBeTruthy();
        expect(page.getElement('#event-stopTime-id').isPresent()).toBeTruthy();
    });

    it(`should be able to click on the "Update Event" from the drop-down list and a new tab with text Updating ${eventCreateTopFields.name.safeValue} should be shown `, () => {
        page.getElement('#drop-view').click().then(() => {
            page.getElement('#update-event').click();
        });
        expect(page.getElement('#tab-id-0').getText()).toEqual(`Updating ${eventCreateTopFields.name.safeValue}   ×`);
    });

    it(`should display a form with a header text Updating ${eventCreateTopFields.name.safeValue}}`, () => {
        expect(page.getElement('#event-update-header-text').getText()).toEqual(`Updating ${eventCreateTopFields.name.safeValue}`);
    });

    it('should show form input fields with the correct label', () => {
        Object.keys(eventCreateBottomFields).map(field => {
            expect(page.getElement(`#update-${field}-label`).getText()).toEqual(eventCreateBottomFields[field].label);
        });
    });

    it('should have a button with a title Update Event and class btn-primary, and the button should be enabled', () => {
        expect(page.getElement('#event-submit-update').getText()).toEqual('Update Event');
        expect(page.getElement(`#event-submit-update${btn}${btnprimary}`).isDisplayed()).toBeTruthy();
        expect(page.getElement('#event-submit-update').getAttribute('disabled')).toBeFalsy();
    });


    it('should have already prefilled values on the form', () => {

        Object.keys(eventCreateTopFields).map(field => {
            expect(page.getElement(`#event-${field}-update`).getAttribute('value')).toEqual(eventCreateTopFields[field].safeValue);
        });
        Object.keys(eventCreateBottomFields).map(field => {
            expect(page.getElement(`#event-${field}-update`).getAttribute('value')).toEqual(eventCreateBottomFields[field].actualValue);
        });
    });

    it('should display a toaster success on successful update if all required fields are correctly entered', () => {
        Object.keys(eventUpdateTopFields).map(field => {
            page.getElement(`#event-${field}-update`).clear();
            page.getElement(`#event-${field}-update`).sendKeys(eventUpdateTopFields[field].safeValue);
        });
        Object.keys(eventUpdateBottomFields).map(field => {
            page.getElement(`#event-${field}-update`).clear();
            page.getElement(`#event-${field}-update`).sendKeys(eventUpdateBottomFields[field].safeDate).then(() => {
                page.getElement(`#event-${field}-update`).sendKeys(Key.TAB).then(() => {
                    page.getElement(`#event-${field}-update`).sendKeys(eventUpdateBottomFields[field].safeTime);
                });
            });
        });

        page.getElement("#event-submit-update").click();
        expect(page.getElement('.toastr-success').getText()).toEqual('Event Updated Successfully');
    });

    it('should be able to suspend an event if the suspend event is selected from the drop-down list is clicked and display a toaster success on successful suspension', () => {
        page.getElement('#drop-view').click().then(() => {
            page.getElement('#suspend-id').click();
        });
        browser.sleep(1000);
        expect(page.getElement('.toastr-success').getText()).toEqual('Event Suspended');
        expect(page.getElement('.eventInactive').isPresent()).toBeTruthy();
    });

    it('should be able to unsuspend an event if the unsuspend is selected from the drop-down list is clicked and display a toaster success on successful unsuspension', () => {
        browser.sleep(1000);
        page.getElement('#drop-view').click().then(() => {
            page.getElement('#unsuspend-id').click();
        });
        expect(page.getElement('.toastr-success').getText()).toEqual('Event Unsuspended');
        expect(page.getElement('.eventActive').isPresent()).toBeTruthy();
    });


    it('should be able to click delete from the drop-down list and display a toaster success on successful delete', () => {
        page.getElement('#drop-view').click().then(() => {
            page.getElement("#delete-id").click();
        });
        expect(page.getElement('.toastr-success').getText()).toEqual('Event Deleted');
        expect(page.getElement('#no-event-id').getText()).toEqual('No Events');
    });

});
