import utils from '../utils';
import { ElementFinder, ElementArrayFinder, promise, browser, by } from 'protractor';
import { ProjectBoard, ToastrTypes } from './projectboard.po';

export enum AcceptOrReject {
  confirm = 'confirm',
  cancel = 'cancel'
}

export class TaskBoardPageObject extends ProjectBoard {
  static elementsMeta = {
    columnHandle: {
      selector: '.thecolumntomove',
      styles: [
        { 'style':  'background-color', 'value': 'rgba(91, 178, 95, 1)' },
        {'style': 'cursor', 'value': 'move'}
      ]
    }
  };


  static taskMeta = {
    summary: {
      selector: '.editheader.adjust-form-control',
      styles: [
        {style: 'background-color', value: 'rgba(0, 0, 0, 0)'},
        {style: 'color', value: 'rgba(51, 58, 103, 1)'}
      ],
    },
    description: {
      selector: 'div.task__description--container',
      noneSelector: 'div.task__description--container p.none__yet',
    },
  };

  static taskCTAs = {
    attachments: {
      ctas: {
        initiate: '#addattachmentCTA'
      }
    },
    subtasks: {
      selector: 'subtasks__container',
      ctas: {
        initiate: '#addsubtaskbutton'
      }
    },
    summary: {
      selector: 'input.editheader',
      hoverStyles: [
        {style: 'background-color', value: 'rgba(0, 0, 0, 0.04)'},
        {style: 'border-radius', value: '4px'},
        {style: 'cursor', value: 'text'}
      ],
      ctas: {
        base: '.taskheaderactionicons',
        confirm: 'i#acceptheaderchanges',
        cancel: 'i#rejectheaderchanges'
      }
    }
  };

  static defaults = {
    comments: {
      baseSelector: '.section__container:last-of-type',
      none: {
        en: 'No comments on this task...'
      },
      header: {
        en: 'Comments'
      }
    },
    columns: ['Todo', 'In Progress', 'Done']
  };

  static taskSections = {
    description: {
      selector: 'div.task__description--container',
      noneSelector: 'div.task__description--container p.none__yet',
      noneText: 'No Description yet...'
    },

    subtasks: {
      selector: '.subtasks',
      single: '.subtasks .subtask',
      noneSelector: '.subtasks p.none__yet',
      noneText: ' No subtasks for this task yet... '
    },

    attachments: {
      selector: 'div[data-role="attachments]"',
      single: 'div[data-role="attachments"] div[data-role="attachment]"',
      noneSelector: 'p[data-role="noattachments"]',
      noneText: ' No attachments in this task yet...'
    },

    meta: {
      selector: '.task--meta__container',
      single: '.task--meta__container .task--meta'
    },

    comments: {
      selector: '.task-comments__container',
      single: '.task-comments__container .task-comments',
      noneSelector: '.task-comments__container p.none__yet',
      noneText: 'No comments on this task...'
    }

  };

  static allByCss(metaHandle: ElementFinder, selector: string): ElementArrayFinder {
    return metaHandle.all(by.css(selector));
  };

  get addTaskCTA(): ElementFinder {
    return utils.getElement('button.btn.btn-primary.addtask');
  }

  get addColumnCTA(): ElementFinder {
    return utils.getElement('button.btn.btn-primary.addcolumn');
  }

  get allColumnHandles(): promise.Promise<ElementArrayFinder> {
    return utils.getElements('.thecolumntomove');
  }

  getAColumnHandle(index: number): promise.Promise<ElementFinder> {
    return this.allColumnHandles.then(handles => handles[index]);
  }

  get allColumnNames(): promise.Promise<ElementArrayFinder> {
    return utils.getElements('.task-list-name');
  }

  getAColumnName(index: number): promise.Promise<ElementFinder> {
    return this.allColumnNames.then(names => names[index]);
  }

  get allColumnNameInputs(): promise.Promise<ElementArrayFinder> {
    return utils.getElements('.the-taskboard-input');
  }

  getAColumnNameInput(index: number): promise.Promise<ElementFinder> {
    return this.allColumnNameInputs.then(inputs => inputs[index]);
  }

  get allCommentsContainer(): promise.Promise<ElementArrayFinder> {
    return utils.getElements(TaskBoardPageObject.taskSections.comments.single);
  }

  getACommentContainer(index: number): promise.Promise<ElementFinder> {
    return this.allCommentsContainer.then(comments => comments[index]);
  }

  getHTMLOfComment(comment: ElementFinder): promise.Promise<string> {
    return browser.executeScript( ` return arguments[0].innerHTML` , comment.$('p.task-comments__comment'));
  }

  async assertAdvertisedFormatting(rawString: string, expectedHTML: string, index: number) {
    utils.getElement('#taskcomment').sendKeys(rawString);
    await utils.getElement('#savecomment').click();
    await utils.waitForPage(10000);
    const comment = await this.getACommentContainer(index);
    const htmlRendered = await this.getHTMLOfComment(comment);
    expect(htmlRendered).toEqual(expectedHTML);
  }

  get allUpdateColumnNameCTAs(): promise.Promise<ElementArrayFinder>  {
    return utils.getElements('span[data-role="updateColumnNameCTA"');
  }

  getAnUpdateColumnNameCTA(index: number): promise.Promise<ElementFinder> {
    return this.allUpdateColumnNameCTAs.then(ctas => ctas[index]);
  }

  openColumnUpdate(index: number): promise.Promise<void> {
    return this.getAColumnName(index).then(columnName => columnName.click());
  }

  clickModalPrimaryActionButton(): promise.Promise<void> {
    return utils.getElement('.modal-content button.btn.btn-primary').click();
  }

  get taskSummaryUpdateInput(): ElementFinder {
    return utils.getElement(TaskBoardPageObject.taskCTAs.summary.selector);
  }

  get taskSummary(): ElementFinder {
    return utils.getElement(TaskBoardPageObject.taskMeta.summary.selector);
  }

  get taskDescriptionDiv(): ElementFinder {
    return utils.getElement(TaskBoardPageObject.taskSections.description.selector);
  }

  get taskDescriptionUpdateInput(): ElementFinder {
    return utils.getElement('div[data-role="descriptionupdate"] app-editor-with-buttons');
  }

  getTaskDescriptionUpdateButton(type: AcceptOrReject) {
    const cta = (type === AcceptOrReject.confirm) ? '.btn-primary' : '.btn-light';
    return this.taskDescriptionUpdateInput.$(`.cta__container > button.btn${cta}`);
  }

  get rtEditorField(): ElementFinder {
    return utils.getElement('app-editor-with-buttons .ql-editor ');
  }

  get taskDescriptionRTFieldAsText(): promise.Promise<string> {
    return this.rtEditorField.getText();
  }

  get taskSubtasksContainer(): ElementFinder {
    return utils.getElement(TaskBoardPageObject.taskSections.subtasks.selector);
  }


  get taskCommentsContainer(): ElementFinder {
    return utils.getElement(TaskBoardPageObject.taskSections.comments.selector);
  }

  get taskAttachmentContainer(): ElementFinder {
    return utils.getElement(TaskBoardPageObject.taskSections.attachments.selector);
  }

  getTaskSummaryUpdateCTA(type?: AcceptOrReject): ElementFinder {
    const { ctas } = TaskBoardPageObject.taskCTAs.summary;
    const selector = type ? `${ctas.base} ${ctas[type]}` : ctas.base;
    return utils.getElement(selector);
  }

  get subtaskMiniCTA() {
    return utils.getElement('.subtask-action-btn  #addsubtaskbutton ');
  }

  get createSubtaskField() {
    return utils.getElement('.inty.input-desc');
  }

  get subtaskCancelCTA() {
    return  utils.getElement('#cancelsubtask');
  }

  get subtaskConfirmCTA() {
    return utils.getElement('#savesubtask');
  }


  /**
   * This handles checks for toastr notifications
   * You can optionally specify if you want a strict check
   * and and optional wait time in ms for the ApiCAll to return
   * @method handleToastrChecks
   * @param ToastrTypes checkForNotifFirst - the notification type to check for first
   * @param strict? perform a strict check for the existence of toastr
   * @param waitForAPI? time in ms to wait for call, default is 300ms
   */
  handleToastrChecks(checkForNotifFirst: ToastrTypes, strict?: boolean, waitForAPI?: string | number) {
    let otherNotif: ToastrTypes;
    if (checkForNotifFirst === ToastrTypes.ERROR) {
      otherNotif = ToastrTypes.SUCCESS;
    } else {
      otherNotif = ToastrTypes.ERROR;
    }
    utils.waitForPage(waitForAPI || 300).then(() => {
      expect(this.toastrOfTypePresent(checkForNotifFirst)).toBeTruthy();
    }).catch(err => {
      if (err.name === 'NoSuchElementError' && strict !== true) {
        expect(this.toastrOfTypePresent(otherNotif)).toBeTruthy();
      } else {
        throw err;
      }
    });
  }

  /**
   * @method createProject
   * @description this method creates a project
   * @param projectName the name of the project
   */
  async createProject(projectName: string) {
    const areWeOnProjectBoard = await utils.urlEndsWith(ProjectBoard.projectsUrl);
    if ( areWeOnProjectBoard === false) {
      await utils.navigateTo(ProjectBoard.projectsUrl);
    }
    await this.createProjectButton.click();
    await utils.getElement('#input-create-project').sendKeys(projectName);
    await utils.getElement(ProjectBoard.modalPrimaryCTA).click();
    await utils.waitForPage(ProjectBoard.toastrTimeout - 1000);
    await utils.waitForPage(5000);
    expect(this.getAllElements('.task-list-name').getText()).toEqual(TaskBoardPageObject.defaults.columns);
  }

  /**
   * @method createTask this method abstracts away creating a task
   * @param taskName the summary of the task to be created
   */
  async createTask(taskName: string) {
    await this.addTaskCTA.click();
    await utils.getElement('#example-text-input').sendKeys(taskName);
    await this.clickModalPrimaryActionButton();
    this.handleToastrChecks(ToastrTypes.SUCCESS, true);
  }

  get tasksContainer(): promise.Promise<ElementArrayFinder> {
    return utils.getElements('.taskboard-task');
  }

  getTaskContainer(index: number): promise.Promise<ElementFinder> {
    return this.tasksContainer.then(taskC => taskC[index]);
  }

  get urlSegments(): promise.Promise<string[]> {
    return browser.getCurrentUrl().then(url => url.split('/'));
  }

  getAllSubtasks(): promise.Promise<ElementArrayFinder> {
    return utils.getElements('.subtasks .list-group-item.subtask');
  }

  get allTaskMeta(): promise.Promise<ElementArrayFinder> {
    return utils.getElements(TaskBoardPageObject.taskSections.meta.single);
  }

  getATaskMeta(index: number): promise.Promise<ElementFinder> {
    return this.allTaskMeta.then(metas => metas[index]);
  }

  async getHeaderValuePairForMeta(metaHandle: ElementFinder): Promise<[string, string]> {
    // return metaHandle.$('span.header').getText();
    return Promise.all([ metaHandle.$('span.header').getText(),
    (await metaHandle.$('.task__status').isPresent() ?
    metaHandle.$('.task__status').getText() : metaHandle.$('span[role="meta_value"]').getText()) ])
      .then(res => res);
  }
}
