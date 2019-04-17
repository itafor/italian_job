import utils from '../utils';
import { ProjectBoard, ToastrTypes } from './projectboard.po';
import { TaskBoardPageObject, AcceptOrReject } from './taskboard.po';
import taskUtils from './taskUtils';

interface UserInt { firstName: string; lastName: string; username: string; }

describe('Quabbly Task Manager | Task Page', () => {
  const page: TaskBoardPageObject = new TaskBoardPageObject();
  const project = {
    name: taskUtils.generateRandomString(true, 10),
    tasks: [
      { summary: taskUtils.generateRandomString(false, 8), id: '' }
    ],
    id: ''
  };

  const detailsOfUser = {
    firstName: '', lastName: '', email: ''
  };

  beforeAll(async () => {
    // utils.navigateTo('/?test');
    // utils.handleAuth();
    const loggedInUser: UserInt = (JSON.parse(await utils.LocalStorageInterface('getItem', 'currentUser') as string) as UserInt);
    detailsOfUser.email = loggedInUser.username;
    detailsOfUser.firstName = loggedInUser.firstName;
    detailsOfUser.lastName = loggedInUser.lastName;
  });

  // create a project
  it('should navigate to projects and select a project', async () => {
    await page.createProject(project.name);
    // wait for toastr to clear
    // adjust if defaut toastr is smnall enouugh
  });
  // create task

  it('should create a task', async () => {
    await page.createTask(project.tasks[0].summary);
  });
  // pick one

  it('should display a modal on clicking on a task', async () => {
    await utils.waitForPage(3000);
    const taskC = await page.getTaskContainer(0);
    await taskC.click();
    expect(await utils.getElement('div.modal-content[data-role="taskmodal"]').isDisplayed).toBeTruthy();
  });

  it('should navigate to task page on clcicking url on header of task modal', async () => {
    await utils.getElement('.modal-content div[role="ProjectNameAndKey"] a').click();
  });

  it('should also navigate to task from url', async () => {
    const segments = (await page.urlSegments);
    project.id = segments[5];
    project.tasks[0].id = segments[6];
    await utils.navigateTo(ProjectBoard.projectsUrl);
    await utils.navigateTo(`/taskmanager/project/${project.id}/${project.tasks[0].id}`);
    expect(await utils.urlEndsWith(undefined)).toBeFalsy();
  });

  it('should really be the same task', async () => {
    await utils.waitForPage(700);
    expect(await page.taskSummary.getText()).toEqual(project.tasks[0].summary);
  });

  it('has expected sections and there should be empty', async () => {
    for (const section in TaskBoardPageObject.taskSections) {
      if (TaskBoardPageObject.taskSections.hasOwnProperty(section) && section !== 'meta') {
        expect(await utils.getElement(TaskBoardPageObject.taskSections[section].noneSelector).isDisplayed()).toBeTruthy();
        expect(await utils.getElement(TaskBoardPageObject.taskSections[section].noneSelector).getText())
          .toEqual(TaskBoardPageObject.taskSections[section].noneText.trim());
      }
    }
  });

  it('has editable description', async () => {
    await page.taskDescriptionDiv.click();
    expect(await page.taskDescriptionDiv.isPresent()).toBeFalsy();
    expect(await page.taskDescriptionUpdateInput.isDisplayed()).toBeTruthy();
    await page.rtEditorField.sendKeys(`Gregoire le Merchinard`);
    expect(await page.taskDescriptionRTFieldAsText).toEqual('Gregoire le Merchinard');
    await page.getTaskDescriptionUpdateButton(AcceptOrReject.confirm).click();
    expect(await page.taskDescriptionDiv.isPresent()).toBeTruthy();
    expect(await page.taskDescriptionUpdateInput.isPresent()).toBeFalsy();
    expect(await page.taskDescriptionDiv.getText()).toEqual('Gregoire le Merchinard');
  });

  it('should have functional create subtask flow', async () => {
    expect(await Promise.all([
      page.subtaskMiniCTA.isPresent(), page.subtaskMiniCTA.isDisplayed(),
      page.subtaskMiniCTA.$('span i').getAttribute('class'),
    ])).toEqual([true, true, 'fa fa-plus']);
    await page.subtaskMiniCTA.click();
    expect(await page.createSubtaskField.isDisplayed()).toBeTruthy();
    expect(await page.subtaskMiniCTA.$('span i').getAttribute('class')).toBe('fa fa-minus');
    expect(await Promise.all([
      page.subtaskCancelCTA.isDisplayed(),
      page.subtaskConfirmCTA.isDisplayed()
    ])).toEqual([true, true]);
    await page.subtaskCancelCTA.click();
    expect(await page.createSubtaskField.isPresent()).toBeFalsy();
    expect(await Promise.all([
      page.subtaskMiniCTA.isPresent(), page.subtaskMiniCTA.isDisplayed(),
      page.subtaskMiniCTA.$('span i').getAttribute('class'),
    ])).toEqual([true, true, 'fa fa-plus']);
    await page.subtaskMiniCTA.click();
    expect(page.createSubtaskField.getAttribute('placeholder')).toEqual('What needs to be done?');
    await page.createSubtaskField.sendKeys('Do something awesome');
    await page.subtaskConfirmCTA.click();
    expect(await page.createSubtaskField.isPresent()).toBeFalsy();
    const subtasks = (await utils.getElements(TaskBoardPageObject.taskSections.subtasks.single));
    expect(subtasks.length).toBe(1);
    expect(await subtasks[0].$('p').getText()).toBe('Do something awesome');
    expect(await subtasks[0].$('.time__details').isDisplayed()).toBeTruthy();
    expect(await subtasks[0].$('span[data-role="subtaskupdate"]').isDisplayed()).toBeTruthy();
  });


  it('should open subtask update modal when I click CTA', async () => {
    const subtasks = (await utils.getElements(TaskBoardPageObject.taskSections.subtasks.single));
    expect(subtasks.length).toBe(1);
    expect(await subtasks[0].$('span[data-role="subtaskupdate"]').isPresent()).toBeTruthy();
    await subtasks[0].$('span[data-role="subtaskupdate"]').click();
    expect(await utils.getElement('.modal-content .modal-header[data-role="subtaskupdatemodal"]')).toBeTruthy();
    expect(await utils.getElement('.modal-body input').getAttribute('value')).toBe('Do something awesome');
    await utils.getElement('.modal-content span.close').click();
    await subtasks[0].$('span[data-role="subtaskupdate"]').click();
    await utils.getElement('.modal-body input').clear();
    await utils.getElement('.modal-body input').sendKeys('Do something awesome today!!!');
    await utils.getElement('.modal-footer button.btn.btn-primary').click();
    await utils.waitForPage(700);
    const updatedSubtasks = (await utils.getElements(TaskBoardPageObject.taskSections.subtasks.single));
    expect(updatedSubtasks.length).toBe(1);
    expect(await updatedSubtasks[0].$('p').getText()).toBe('Do something awesome today!!!');
  });

  it('should allow me post comments', async () => {
    // tslint:disable-next-line:max-line-length
    const comment = `This is along long long comment to hopefully show that this comment section rocks,this section will invariably support some basic formatting later. SO just quickly test this.`;
    // fill input
    await utils.getElement('textarea#taskcomment').sendKeys(comment);

    await utils.getElement('button#savecomment').click();
    // post
    // see comment
    await utils.waitForPage(700);
    expect(await utils.getElement(TaskBoardPageObject.taskSections.comments.noneSelector).isPresent())
      .toBeFalsy();    // conmfirm that its what you posted
    const comments = await utils.getElements(TaskBoardPageObject.taskSections.comments.single);
    expect(comments.length).toBe(1);
    expect( await comments[0].$('p.task-comments__comment').getText()).toEqual(comment.trim());
  });



  it('should show task meta', async () => {
    /**
     * status - TODO
     * priority - NONE
     * assigned - Unassined
     * goal - None
     * created by widget icons and name
     * logged tume - None
     * time created
     * last updated
     * title selector - task--meta.header
     */

    const startingDetails = {};
    (await page.allTaskMeta).forEach(async (mH) => {
      // console.log(await page.getHeaderValuePairForMeta(mH));
      const headerAndValue = await page.getHeaderValuePairForMeta(mH);
      startingDetails[headerAndValue[0]] = headerAndValue[1];
    });

    await utils.waitForPage(500);
    // console.log(startingDetails);
    expect(startingDetails['Status']).toBe('TODO');
    expect(startingDetails['Priority']).toBe('NONE');
    expect(startingDetails['Assigned']).toBe('Unassigned');
    expect(startingDetails['Goal']).toBe('None');
    expect(startingDetails['Created By']).toBe(`${detailsOfUser.firstName} ${detailsOfUser.lastName}`);
    expect(startingDetails['Logged Time']).toBe('None');
    expect(taskUtils.assertDateTimeFormatted(startingDetails['Time Created'])).toBe(true);
  });

  it('should have updateable meta - Status', async () => {
    const statusMeta = (await page.allTaskMeta)[0];
    const status = (await (statusMeta.$('.task__status').isPresent()) ?
    statusMeta.$('.task__status') : statusMeta.$('span[role="meta_value"]'));
    // expect cta boxes
    await status.click();
    expect(status.isPresent()).toBeFalsy();
    expect(await statusMeta.$('span[role="initialvalue"').isDisplayed()).toBeTruthy();
    expect(await (statusMeta.$('span[role="initialvalue"').getText())).toEqual('Todo');
    // Others in DD
    const availableStatuses = await utils.getElements('span[role="allowedvalues"');
    const expectedStatuses = ['In Progress', 'Done'];
    expect(availableStatuses.length).toBe(2);
    availableStatuses.forEach(async (s, index) => {
      expect(await s.getText()).toEqual(expectedStatuses[index]);
    });
    // click on first -
    await availableStatuses[0].click();
    // expect dpdown to close
    expect(statusMeta.$('div.selectable__dropdown').isDisplayed()).toBeFalsy();
    // wait
    await utils.waitForPage(1000);
    // expect what you clikced on to be new selected
    const headerAndValue = await page.getHeaderValuePairForMeta(statusMeta);
    expect(headerAndValue[1]).toBe('IN PROGRESS');
  });

  xit('should have updateable assignee', async () => {});

  it('should have updateable priority', async () => {
    const priorityMeta = (await page.allTaskMeta)[1];
    // unnecessary check individually
    // useful for ambiguosu func
    const priority = (await (priorityMeta.$('.task__status').isPresent()) ?
    priorityMeta.$('.task__status') : priorityMeta.$('span[role="meta_value"]'));
    // expect cta boxes
    await priority.click();
    expect(priority.isPresent()).toBeFalsy();
    expect(await priorityMeta.$('span[role="initialvalue"').isDisplayed()).toBeTruthy();
    expect(await (priorityMeta.$('span[role="initialvalue"').getText())).toEqual('None');
    // Others in DD
    const availablePriorities = await TaskBoardPageObject.allByCss(priorityMeta, 'span[role="allowedvalues"');
    const expectedPriorities = ['HIGH', 'MEDIUM', 'LOW'];
    expect(availablePriorities.length).toBe(3);
    availablePriorities.forEach(async (s, index) => {
      expect(await s.getText()).toEqual(expectedPriorities[index]);
    });
    // click on first -
    await availablePriorities[0].click();
    // expect dpdown to close
    expect(priorityMeta.$('div.selectable__dropdown').isDisplayed()).toBeFalsy();
    // wait
    await utils.waitForPage(700);
    // expect what you clikced on to be new selected
    const headerAndValue = await page.getHeaderValuePairForMeta(priorityMeta);
    expect(headerAndValue[1]).toBe('HIGH');
  });

  it('should allow me log hours', async () => {
    const lgHMeta = (await page.allTaskMeta)[5];
    const lgCTA = lgHMeta.$('.task__status');
    await lgCTA.click();
    // modal
    const lgModal = utils.getElement('.modal-content ng-component');
    expect(await lgModal.isDisplayed()).toBeTruthy();
    // expected UiELems

    const lgInput = lgModal.$('div.col-6:nth-child(1) > div:nth-child(1) > input:nth-child(2)');
    expect(await lgInput.isDisplayed()).toBeTruthy();
    // input
    expect(await lgInput.getAttribute('placeholder')).toEqual('Enter in this format 4w | 3d | 2h');
    const lgSaveBtn = lgModal.$('button.btn.btn-primary');
    expect(await lgSaveBtn.isDisplayed()).toBeTruthy();
    expect(await lgSaveBtn.getAttribute('disabled')).toBeTruthy();
    // validation
    // class and bg color
    await lgInput.sendKeys('7z');
    // btn still disabled
    expect(await lgInput.getAttribute('class')).toContain('is-invalid');
    expect(await lgSaveBtn.getAttribute('disabled')).toBeTruthy();
    // class and bg color clears and input clears
    await lgInput.clear();
    await lgInput.sendKeys('  ');
    // btn still disabled
    expect((await lgInput.getAttribute('class')).indexOf('is-invalid')).toBe(-1);
    expect(await lgSaveBtn.getAttribute('disabled')).toBeTruthy();
    // you have loged disappears
    // input goes red
    // accept correct value
    await lgInput.sendKeys('3d');
    const lgPlainTime = lgModal.$('div.col-6:nth-child(2) > div:nth-child(1)');
    expect(await lgPlainTime.isPresent()).toBeTruthy();
    expect(await lgPlainTime.$('label').getText()).toEqual('You are logging');
    expect(await lgPlainTime.$('span.simulate__disabled').getText()).toEqual('3day(s)');
    expect(await lgSaveBtn.getAttribute('disabled')).toBeFalsy();
    // you are logging shiws
    await lgSaveBtn.click();
    // modal disappears
    expect(await lgModal.isPresent()).toBeFalsy();
    // logghours clock shjows oemthing
    expect((await page.getHeaderValuePairForMeta(lgHMeta))[1]).toBe('3days');
  });


  it('should allow me log more hours', async () => {
    // accept weekm - if first way day
    const lgHMeta = (await page.allTaskMeta)[5];
    const lgCTA = lgHMeta.$('.task__status');
    await lgCTA.click();
    // modal
    const lgModal = utils.getElement('.modal-content ng-component');
    expect(await lgModal.isDisplayed()).toBeTruthy();
    // expected UiELems

    const lgInput = lgModal.$('div.col-6:nth-child(1) > div:nth-child(1) > input:nth-child(2)');
    expect(await lgInput.isDisplayed()).toBeTruthy();

    const lgSaveBtn = lgModal.$('button.btn.btn-primary');
    expect(await lgSaveBtn.isDisplayed()).toBeTruthy();
    expect(await lgSaveBtn.getAttribute('disabled')).toBeTruthy();
    // validation
    // class and bg color
    await lgInput.sendKeys('1w');
    const lgPlainTime = lgModal.$('div.col-6:nth-child(2) > div:nth-child(1)');
    expect(await lgPlainTime.isPresent()).toBeTruthy();
    expect(await lgPlainTime.$('label').getText()).toEqual('You are logging');
    expect(await lgPlainTime.$('span.simulate__disabled').getText()).toEqual('1week(s)');
    expect(await lgSaveBtn.getAttribute('disabled')).toBeFalsy();
    // you are logging shiws
    await lgSaveBtn.click();
    // modal disappears
    expect(await lgModal.isPresent()).toBeFalsy();
    // logghours clock shjows oemthing
    expect((await page.getHeaderValuePairForMeta(lgHMeta))[1]).toBe('1weeks 3days');
  });

  // do thuis lasy biko
  it('should allow me delete  task', async () => {
    // cta
    const deleteCTA = utils.getElement('.card-header span[role="deletetask"');
    expect(await deleteCTA.isDisplayed()).toBeTruthy();
    expect(await deleteCTA.getAttribute('title')).toBe('Delete Task');
    // click
    deleteCTA.click();
    // confirmation modal
    const confirmModal = utils.getElement('.modal-content');
    // yes
    expect(await confirmModal.isDisplayed()).toBeTruthy();

    await confirmModal.$('button.btn.btn-danger').click();
    // redirect
    await utils.waitForPage(1200);
    expect(await taskUtils.assertUrlIsBoard()).toBeTruthy();
  });
});
