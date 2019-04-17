import {  browser, element, by } from 'protractor';
import utils from '../utils';
import { ProjectBoard, ToastrTypes} from './projectboard.po';
import { TaskBoardPageObject, AcceptOrReject } from './taskboard.po';
import taskUtils from './taskUtils';

const path = require('path');

const comment = taskUtils.generateRandomString(true, 50);

const project = {
  name: '',
  tasks: [
    {
      name: taskUtils.generateRandomString(false, 8),
      name_edited: taskUtils.generateRandomString(false, 8),
      subtasks: [
        {name: taskUtils.generateRandomString(false, 20)}
      ],
      comments: [
        {raw: comment, formatted: comment},
        {raw: '   *bold* ~strikedout~  _italicized_  `let x = y;`',
        formatted:  '   <b>bold</b> <del>strikedout</del>  <i>italicized</i>  <code>let x = y;</code>'},
        {raw: ' ```  <code>This shouldnt be code</code>  *not bold* ~not strikedout~  _not italicized_ ```   ',
        formatted: '<pre>   &lt;code&gt;This shouldnt be code&lt;/code&gt;  *not bold* ~not strikedout~  _not italicized_    </pre>'}
      ]
    }
  ],
  columns: [
    { name: taskUtils.generateRandomString(false, 10) }
  ]
};


describe('Quabbly Task Manager | Task Modal', () => {

    let page: TaskBoardPageObject;
    const spinner = '.fa-spin.fa-spinner';
    const modalclose = '.close';
    const modalsubmitbtn = '.modal-footer button';

    beforeAll(() => {
        page = new TaskBoardPageObject();
        page.navigateTo(ProjectBoard.projectsUrl);
    });

    it('on navigation back there should be a project in the table ', async () => {
        await utils.waitForPage(500);
        const projectDetails = await utils.getElements(ProjectBoard.projectDetailsCard.selector);
        expect(projectDetails.length).toBeGreaterThan(0);
    });

  it('should be able to open task board on clicking a project detail ', async () => {
        const details = await utils.getElements(ProjectBoard.projectDetailsCard.selector);
        await details[0].$('h4').click();
         // expect(browser.getCurrentUrl()).toContain('http://localhost:4200/taskmanager/projects');
         expect(page.getAllElements('.task-list-name').getText()).toEqual([ 'Todo', 'In Progress', 'Done' ]);
  });

  it('should have a button named "Add Task"', () => {
      expect(page.addTaskCTA.isDisplayed()).toBeTruthy();
  });

  it('should have a button named "Add Column"', () => {
      expect(page.addColumnCTA.isDisplayed()).toBeTruthy();
  });

  it('should test that "Add Task" button has a background color and text color of white', () => {
      expect(page.addTaskCTA.getCssValue('background-color')).toEqual('rgba(92, 107, 192, 1)');
      expect(page.addTaskCTA.getCssValue('color')).toEqual('rgba(255, 255, 255, 1)');
  });

  it('should test that "Add Column" button has a text color of blue and a background color of white', () => {
      expect(page.addColumnCTA.getCssValue('color')).toEqual('rgba(255, 255, 255, 1)');
      expect(page.addColumnCTA.getCssValue('background-color')).toEqual('rgba(92, 107, 192, 1)');
  });

  it('should test that on clicking on Add Task Button, a modal is opened', () => {
      page.addTaskCTA.click().then(() => {
          expect(page.getElement('.modal-content').isPresent()).toBeTruthy();
      });
  });

  it('Add Task Modal header name should be equal to "Add Task"', () => {
      expect(page.getElement('.modal-title').getText()).toEqual('Add Task');
      expect(page.getElement('.modal-title').getTagName()).toEqual('h4');
  });

  it('should test that Add Task Modal header text be black', () => {
      expect(page.getElement('.modal-title').getCssValue('color')).toEqual('rgba(0, 0, 0, 0.87)');
  });

  it('should test that when Add Task Modal is open there is a close button', () => {
      expect(page.getElement(modalclose).getAttribute('aria-label')).toEqual('Close');
  });

  it('should test that when Add Task Modal is open there should be an "Add" button', () => {
      expect(page.getElement(modalsubmitbtn).getText()).toEqual('Add');
  });

  it('should test that on initialising the Add Task modal the add button is inactive', () => {
      expect(page.getElement(modalsubmitbtn).getAttribute('disabled')).toBeTruthy();
  });


  it('should test that the color of the text on the Add Task modal button is "white" and background-color be blue ', () => {
      expect(page.getElement(modalsubmitbtn).getCssValue('color')).toEqual('rgba(255, 255, 255, 1)').then(() => {
          expect(page.getElement('#submittasks').getCssValue('background-color')).toEqual('rgba(92, 107, 192, 1)');
      });
  });

  it('should test that the Add Task modal  has a field labeled "Summary:" ', () => {
      expect(page.getElement('#modal-label').getText()).toEqual('Summary:');
  });

  it('should test that the Add Task modal has a field labeled "Summary:" and have text color of black ', () => {
      expect(page.getElement('#modal-label').getCssValue('color')).toEqual('rgba(0, 0, 0, 0.87)');
  });

  it('should test that there Add Task modal modal has an input field with a specified id ', () => {
      expect(page.getElement('#example-text-input').isDisplayed()).toBeTruthy();
  });

  it('should test that on initialising the Add Task modal the input field be empty', () => {
      expect(page.getElement('#example-text-input').getAttribute('value')).toEqual('');
  });

  it('should Test that on typing into this field of the Add Task  Modal the  Add Button is active', () => {
      page.getElement('#example-text-input').sendKeys(project.tasks[0].name);
      expect(page.getElement(modalsubmitbtn).isEnabled()).toBeTruthy();
  });

  it('should Test that on typing into this field of the Add Task Modal the  Add Button is active and on click, a loader appears', () => {
      page.clickModalPrimaryActionButton().then(() => {
        expect(page.getLoadingState(spinner).isDisplayed()).toBeTruthy();
      });
  });

  it('should test that if there is a success response the modal is dismissed and toastr success message is shown', () => {
      page.handleToastrChecks(ToastrTypes.SUCCESS);
      expect(page.getElement('.modal-content').isPresent()).toBeFalsy();
  });

  it('should test that on clicking on Add Colum Button, a modal is opened', () => {
      page.addColumnCTA.click().then(() => {
          expect(page.getElement('.modal-content').isPresent()).toBeTruthy();
      });
  });

  it('Add Colum Modal header name should be equal to "New Column"', () => {
      expect(page.getElement('.modal-title').getText()).toEqual('New Column');
      expect(page.getElement('.modal-title').getTagName()).toEqual('h4');
  });

  it('should test that Add Column Modal header text be black', () => {
      expect(page.getElement('.modal-title').getCssValue('color')).toEqual('rgba(0, 0, 0, 0.87)');
  });

  it('should test that when Add Column Modal is open there is a close button', () => {
      expect(page.getElement(modalclose).getAttribute('aria-label')).toEqual('Close');
  });

  it('should test that when Add Column Modal is open there should be an "Add" button', () => {
      expect(page.getElement(modalsubmitbtn).getText()).toEqual('Add');

  });

  it('should test that on initialising the Add Column modal the add button is inactive', () => {
      expect(page.getElement(modalsubmitbtn).getAttribute('disabled')).toBeTruthy();
  });
  it('should test that the color of the text on the Add Column modal button is "white" and background-color be blue ', () => {
      expect(page.getElement(modalsubmitbtn).getCssValue('color')).toEqual('rgba(255, 255, 255, 1)').then(() => {
          expect(page.getElement('#submitcolumns').getCssValue('background-color')).toEqual('rgba(92, 107, 192, 1)');
      });
  });
  it('should test that the Add Column modal  has a field labeled "Name:" ', () => {
      expect(page.getElement('#modal-label').getText()).toEqual('Name:');
  });
  it('should test that the Add Column modal has a field labeled "Name:" and have text color of black ', () => {
      expect(page.getElement('#modal-label').getCssValue('color')).toEqual('rgba(0, 0, 0, 0.87)');
  });
  it('should test that there Add Column modal modal has an input field with a specified id ', () => {
      expect(page.getElement('#example-text-input').isDisplayed()).toBeTruthy();
  });
  it('should test that on initialising the Add Column modal the input field be empty', () => {
      expect(page.getElement('#example-text-input').getAttribute('value')).toEqual('');
  });
  it('should Test that on typing into this field of the Add Column  Modal the  Add Button is active', () => {
      page.getElement('#example-text-input').sendKeys(project.columns[0].name);
      expect(page.getElement(modalsubmitbtn).isEnabled()).toBeTruthy();
  });
  it('should Test that on typing into this field of the Add Column Modal the  Add Button is active and on click, a loader appears', () => {
    page.getElement(modalsubmitbtn).click().then(() => {
      expect(page.getLoadingState(spinner).isDisplayed()).toBeTruthy();
    });
  });
  it('should test that if there is a success response the modal is dismissed and toastr success message is shown', () => {
      page.handleToastrChecks(ToastrTypes.ERROR);
      expect(page.getElement('.modal-content').isPresent()).toBeFalsy();
  });

  it('should test that each column has a plus icon', () => {
      page.getAColumnHandle(0).then(columnHandle => {
        Promise.all(
          [columnHandle.isPresent(), columnHandle.isDisplayed()]
        ).then(results => expect(results).toEqual([ true, true ]));
        utils.simulateHover(columnHandle).then(() => {
          TaskBoardPageObject.elementsMeta.columnHandle.styles.forEach(styleAndValue => {
            expect(columnHandle.getCssValue(styleAndValue.style)).toEqual(styleAndValue.value);
          });
        });
      });
  });

  it('should display a modal when any task summary is clicked', () => {
    // used to specify any column we want to select task from. To change column, change index number as long as it doesn't exceed it
    const anycolumn = element.all(by.css('.taskboard-wrapper')).get(0);
    // used to specify the particular task we want to click. To choose a different class, change index number as long as it doesn't exceed
    const anytaskinanycolumn = anycolumn.all(by.css('.taskboard-task')).get(0);
    anytaskinanycolumn.click().then(() => {
      expect(page.getElement('.modal-content').isPresent()).toBeTruthy();
    });
  });

  it('should display expected task meta fields on the task details modal', () => {
    Object.keys(TaskBoardPageObject.taskMeta).forEach(meta => {
      const item = utils.getElement(`.modal-content ${TaskBoardPageObject.taskMeta[meta].selector}`);
      Promise.all([item.isDisplayed(), item.isPresent()]).then(results => {
        expect(results).toEqual([true, true]);
      });
    });
  });

  it('should display a text project name at the top left', () => {
    utils.getElement('div[role="ProjectNameAndKey"]').getText().then(text => {
      utils.dataset(utils.getElement('#projectNameTitle')).then(attrs => {
        const uniqueKey = attrs['taskuniquekey'];
        expect(text.split('>>')[1]).toBe(` ${uniqueKey}`);
      });
    });
  });

  it('task summary should have expected styling' , () => {
    TaskBoardPageObject.taskMeta.summary.styles.forEach(styleAndValue => {
      page.taskSummary.getCssValue(styleAndValue.style).then(res => {
        expect(res).toBe(styleAndValue.value);
      });
    });
  });

  it('task summary should be editable', async () => {
    expect(await page.taskSummaryUpdateInput.isDisplayed()).toBeFalsy();
    await page.taskSummary.click();
    expect(await page.taskSummaryUpdateInput.isDisplayed()).toBeTruthy();
    page.taskSummaryUpdateInput.getAttribute('value').then(val => {
      expect(val).toBe(project.tasks[0].name);
      utils.simulateHover(page.taskSummaryUpdateInput).then(() => {
        TaskBoardPageObject.taskCTAs.summary.hoverStyles.forEach(styleAndValue => {
          page.taskSummaryUpdateInput.getCssValue(styleAndValue.style).then(res => {
            expect(res).toBe(styleAndValue.value);
          });
        });

        utils.waitForPage(300).then(async () => {
          await page.taskSummaryUpdateInput.clear();
          await page.taskSummaryUpdateInput.sendKeys(project.tasks[0].name_edited);
        });
      });
    });
  });

  it('should have cancel and confirm CTAs', () => {
    Promise.all([
    page.getTaskSummaryUpdateCTA().isDisplayed(),
    page.getTaskSummaryUpdateCTA(AcceptOrReject.cancel).isDisplayed(),
    page.getTaskSummaryUpdateCTA(AcceptOrReject.confirm).isDisplayed()
  ]).then(res => expect(res).toEqual(Array(3).fill(true)));
  });


  it('cancel CTA should close input', async () => {
    await page.getTaskSummaryUpdateCTA(AcceptOrReject.cancel).click();
    expect(await page.taskSummaryUpdateInput.isDisplayed()).toBeFalsy();
  });


  it('confirm CTA should actaully initiate API call', async () => {
    await page.taskSummary.click();
    // expect input
    expect(await page.taskSummaryUpdateInput.isDisplayed()).toBeTruthy();
    // expect to have value whihc is the summary of task
    page.taskSummaryUpdateInput.getAttribute('value').then(val => {
      expect(val).toBe(project.tasks[0].name_edited);
      utils.simulateHover(page.taskSummaryUpdateInput).then(async () => {
        // check for expected styles
        TaskBoardPageObject.taskCTAs.summary.hoverStyles.forEach(styleAndValue => {
          page.taskSummaryUpdateInput.getCssValue(styleAndValue.style).then(res => {
            expect(res).toBe(styleAndValue.value);
          });
        });

        await utils.waitForPage(400);
        await page.taskSummaryUpdateInput.clear();
        await page.taskSummaryUpdateInput.sendKeys('Edited Task summary');
        await page.getTaskSummaryUpdateCTA(AcceptOrReject.confirm).click();
        // Update UI Feedback
      });
    });
  });

  it('task header should be present', () => {
    expect(page.getElement('.inputheader').isPresent()).toBeTruthy();
  });

  it('it should be equal to the task', async () => {
    expect(await page.taskSummary.getText()).toEqual('Edited Task summary');
  });

  it('should display subtask section header and equal to Subtasks', () => {
    expect(page.getAllElements('.task-detail-sub-header').get(0).isDisplayed()).toBeTruthy();
    expect(page.getAllElements('.task-detail-sub-header').get(0).getText()).toEqual('SubTasks');
  });

  it('should display add subtask text field when the plus button is clicked', () => {
    const clicksubtask =  page.getElement(TaskBoardPageObject.taskCTAs.subtasks.ctas.initiate);
        clicksubtask.click().then(() => {
            expect(page.getElement('.inty').isDisplayed()).toBeTruthy();
        });
  });
  it('should display check and times button', () => {
    expect(page.getElement('#savesubtask').isDisplayed()).toBeTruthy();
    expect(page.getElement('#cancelsubtask').isDisplayed()).toBeTruthy();

  });

  it('times button should have a text color', () => {
    expect(page.getElement('#cancelsubtask').getCssValue('color')).toEqual('rgba(239, 83, 80, 1)');
  });

  it('should display add subtask text field only when add subtask icon is clicked', async () => {
    const clicksubtask =  page.getElement(TaskBoardPageObject.taskCTAs.subtasks.ctas.initiate);
    await clicksubtask.click();
    expect(page.getElement('.inty').isPresent()).toBeFalsy();
  });
  it('text filed should collect value', async () => {
    await page.getElement(TaskBoardPageObject.taskCTAs.subtasks.ctas.initiate).click();
    expect(page.getElement('.inty').isDisplayed()).toBeTruthy();
    page.getElement('.inty').sendKeys(project.tasks[0].subtasks[0].name);
  });

  it('clicking the save button should save input', async () => {
    await page.getElement('#savesubtask').click();
    await utils.waitForPage(500);
    // TODO(oneyedsunday) Check fir feedback
  });

  it('should update view with new subtask', async () => {
    const subtasks = await page.getAllSubtasks();
    expect(subtasks.length).toBe(1);
  });

  it('should display correct details of new subtask', async () => {
    expect(await((await page.getAllSubtasks())[0].$('p').getText())).toEqual(project.tasks[0].subtasks[0].name);
  });

  /**
   * Test cases for updating subtasks
   * - check for update
   * - check for delete
   * - check for widget
   */

  it('should show add attachment modal when icon is clicked', () => {
    utils.getElement(TaskBoardPageObject.taskCTAs.attachments.ctas.initiate).click().then(() => {
        expect(page.getElement('.modal-content').isPresent()).toBeTruthy();
    });
  });

  it('should test that add attachment modal header be equal to Upload File', () => {
    expect(page.getElement('.modal-title').getText()).toEqual('Upload File');
    expect(page.getElement('.modal-title').getTagName()).toEqual('h4');
  });

  it('should test that add attachment modal header text be black', () => {
    expect(page.getElement('.modal-title').getCssValue('color')).toEqual('rgba(0, 0, 0, 0.87)');
  });

  it('should be an upload button', () => {
      expect(page.getElement('.uploadefile').getText()).toEqual('Upload');
  });

  it('should test that on initialising the add attachment modal the upload button is inactive', () => {
    expect(page.getElement(modalsubmitbtn).getAttribute('disabled')).toBeTruthy();
  });

  it('should test that the color of the name on the add attachment modal upload button is "white" and background-color be black ', () => {
    expect(page.getElement(modalsubmitbtn).getCssValue('color')).toEqual('rgba(255, 255, 255, 1)').then(() => {
        expect(page.getElement('.uploadefile').getCssValue('background-color')).toEqual('rgba(52, 58, 64, 1)');
    });
  });

  it('should test that there Add attachment modal has an input field of type file ', () => {
    expect(page.getElement('#fileupload').getAttribute('type')).toEqual('file');
  });

  it('should test for file upload greater than 1mb and an error', async () => {
    const absoluteLargePath = path.resolve(__dirname, 'files/Angular2NotesForProfessionals.pdf');
    await page.getElement('#fileupload').sendKeys(absoluteLargePath);
    const errorAlert = utils.getElement('.modal-body p.alert.alert-danger');
    expect(await page.getElement('.uploadefile').getAttribute('disabled')).toBeTruthy();
    expect(await errorAlert.isDisplayed()).toBeTruthy();
    expect(await errorAlert.getText()).toEqual('File too Large. We support files less than 1mb.');
  });

  it('test for file upload lesser than 1mb', async () => {
    const absolutePath = path.resolve(__dirname, 'files/image.png');
    await page.getElement('#fileupload').sendKeys(absolutePath);
    await page.getElement('.uploadefile').click();
    // TODO (oneeyedsunday)
    // file size validations
  });


  it('should show attachments field on successful addition and named Attachments', async () => {
    await utils.waitForPage(1000);
    expect(page.getAllElements('.task-detail-sub-header').get(1).isDisplayed()).toBeTruthy();
    expect(page.getAllElements('.task-detail-sub-header').get(1).getText()).toContain('Attachments');
  });


  /**
   * Atachment template and func tests - TODOS
   * - verify
   * - delete CTA
   * - defer testihg delete till later
   * - defere testing dlink on hover
   */

  it('should have expected fields and detials of attachmemnts', async () => {
    const attachmentFileTypeDetails = utils.getElement('.attachment__container .image');
    const imageDVals = await Promise.all([attachmentFileTypeDetails.$('i.fa.fa-file-image-o.t__maskable').isDisplayed(),
    attachmentFileTypeDetails.$('span.t__maskable').isDisplayed()]);
    expect(imageDVals).toEqual([true, true]);

    const attachmentDetails = utils.getElement('.attachment__container .details');
    const detailsVal = await Promise.all([1, 2, 3].map(index => attachmentDetails.$(`span:nth-child(${index})`).getText()));
    expect(detailsVal[0]).toEqual('image.png');
    expect(detailsVal[1]).toContain('Added');
    expect(detailsVal[2]).toEqual('Delete');
  });



  it('clicking on the delete icon should delete the attachment', async () => {
    const deleteCTA = utils.getElement('.attachment__container .details span.deleteable');
    await deleteCTA.click();
    expect(utils.getElement('h5#modal-basic-title').getText()).toEqual('Delete attachment');
    await utils.getElement('.modal-content .btn.btn-danger').click();
    await utils.waitForPage(5000);
    expect((await utils.getElements('.attachment__container')).length).toBe(0);
  });

  it('should show Comments field', () => {
    utils.getElement(TaskBoardPageObject.defaults.comments.baseSelector.concat(' .task-detail-sub-header'))
    .getText().then(commentHeader => {
      expect(commentHeader).toEqual(TaskBoardPageObject.defaults.comments.header.en);
    });
  });

  it('should show no comments if no comment has been added', () => {
    expect(page.getElement(TaskBoardPageObject.defaults.comments.baseSelector.concat(' .none__yet'))
      .getText()).toEqual(TaskBoardPageObject.defaults.comments.none.en);
  });
  it('should show add comments textarea', () => {
    expect(page.getElement('#taskcomment').isDisplayed()).toBeTruthy();
  });

  it('with a visible placeholder', () => {
    expect(page.getElement('#taskcomment').getAttribute('placeholder')).toEqual('Add comment...');
  });

  it('with a save button visible', () => {
    expect(page.getElement('#savecomment').isDisplayed()).toBeTruthy();
    expect(page.getElement('#savecomment').getText()).toEqual('Save');
  });

  it('the save button should have a background color and text color', () => {
    expect(page.getElement('#savecomment').getCssValue('color')).toEqual('rgba(255, 255, 255, 1)');
    expect(page.getElement('#savecomment').getCssValue('background-color')).toEqual('rgba(92, 107, 192, 1)');
  });

  it('the textarea should accept a value and clicking on the save button saves the commment ', () => {
    page.getElement('#taskcomment').sendKeys(project.tasks[0].comments[0].raw);
    const clicked =  page.getElement('#savecomment');
    clicked.click();
    utils.waitForPage(10000);
  });

  it('comment area should be populated with the new comment', async () => {
    await utils.waitForPage(10000);
    const comments = await page.allCommentsContainer;
    expect(comments.length).toBe(1);
    const htmlRendered = await page.getHTMLOfComment(comments[0]);
    expect(htmlRendered).toEqual(project.tasks[0].comments[0].raw);
  });

  it('should display advertised formatting', async () => {
    project.tasks[0].comments.forEach(async (commentRF, index) => {
      // theres a comment already
      page.assertAdvertisedFormatting(commentRF.raw, commentRF.formatted, index + 1);
    });
  });

  it('should display watchers count with an eye', () => {
    expect(page.getElement('#watchers').isDisplayed()).toBeTruthy();
    expect(browser.driver.findElement(by.css('#watchers')).getAttribute('class')).toMatch('fa fa-eye');
  });

  it('should show expected sentence on hover & allow to watch task', async () => {
    // correct UI fedback
    // and should change
    const watchersCTA = utils.getElement('.watcher-section');
    expect(await watchersCTA.isDisplayed()).toBeTruthy();
    await utils.simulateHover(watchersCTA);
    expect(watchersCTA.getAttribute('title')).toEqual('Watch Task');
    await watchersCTA.click();
  });

  it('should show a "Task Status" section', () => {
    expect(page.getElement('#statusLog').isDisplayed()).toBeTruthy();
    expect(page.getElement('#statusLog').getText()).toEqual('Status');
  });

  it('should show an "Assignee" section', () => {
    expect(page.getElement('#assigneeLog').isDisplayed()).toBeTruthy();
    expect(page.getElement('#assigneeLog').getText()).toEqual('Assigned');
  });

  it('should show a "Reported By" section', () => {
    expect(page.getElement('#reportedbyLog').isDisplayed()).toBeTruthy();
    expect(page.getElement('#reportedbyLog').getText()).toEqual('Created By');
  });

  it('should stop watching task', async () => {
    const watchersCTA = utils.getElement('.watcher-section');
    await utils.simulateHover(watchersCTA);
    expect(watchersCTA.getAttribute('title')).toEqual('Unwatch Task');
    await watchersCTA.click();
  });

  it('there should NOT be a delete task button on the task modal', async () => {
  expect(await (utils.getElement('#deletethistask').isPresent())).toBeFalsy();
  });

});
