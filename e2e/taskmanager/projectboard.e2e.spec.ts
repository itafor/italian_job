import utils from '../utils';
import { ProjectBoard, ToastrTypes} from './projectboard.po';

describe('Quabbly Task Manager', () => {

    let page: ProjectBoard;
    const nameofproject = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 8);
    const newnameofproject = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 8);
    const randommword = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
    const newWord = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 7);
    const spinner = '.fa-spin.fa-spinner';
    const addbutton = '.fa-plus';
    const editbutton = '.fa-pencil';
    const editTaskIcon = '.fa-check';
    const addattachment = '.fa-paperclip';
    const addsubtask = '.fa-tasks';
    const cancelTask = '.fa-times';
    const deletebutton = '.fa-trash';
    const faviconclass = '.fa';
    const modalclose = '.close';
    const modalsubmitbtn = '.modal-footer button';

    beforeAll(async () => {
        page = new ProjectBoard();
        await utils.navigateTo('/?test');
        utils.handleAuth();
        utils.waitForPage(10000);
    });

    it('should have a button named "Create New Project" ', async () => {
        await page.navigateTo(ProjectBoard.projectsUrl);
        expect(page.createProjectButton.getText()).toEqual('Create Project');
    });

    it('should have defined style class for the button named "Create New Project" ', () => {
        expect(page.createProjectButton.getCssValue('color')).toEqual(ProjectBoard.createBtn.color);
        expect(page.createProjectButton.getCssValue('background-color')).toEqual('rgba(255, 255, 255, 1)');
    });

    it('should have a plus icon for the button named "Create New Project" ', () => {
        expect(page.getElement(ProjectBoard.createBtn.iconClass).isDisplayed()).toBeTruthy();
    });

    it('should test that on create project button, a modal is opened', () => {
        page.createProjectButton.click().then(() => {
            expect(page.getElement('.modal-content').isPresent()).toBeTruthy();
        });
    });

    it('Create Project Modal header name should be equal to Create New Project', () => {
        expect(page.getElement('.modal-title').getText()).toEqual('Create New Project');
        expect(page.getElement('.modal-title').getTagName()).toEqual('h4');
    });

    it('should test that Create Project Modal header text be black', () => {
        expect(page.getElement('.modal-title').getCssValue('color')).toEqual('rgba(0, 0, 0, 0.87)');
    });

    it('should test that when Create Project Modal is open there is a close button', () => {
        expect(page.getElement(modalclose).getAttribute('aria-label')).toEqual('Close');
    });

    it('should test that when Create Project Modal is open and the close button is clicked, the modal should dismiss', () => {
        page.getElement(modalclose).click().then(() => {
            expect(page.getElement('.modal-content').isPresent()).toBeFalsy();
        });
    });

    it('should test that when Create Project Modal is open there should be a "create" button', () => {
        page.createProjectButton.click().then(() => {
            expect(page.getElement(modalsubmitbtn).getText()).toEqual('Create');
        });
    });

    it('should test that on initialising the Create Project modal the Create button is inactive', () => {
        expect(page.getElement(modalsubmitbtn).getAttribute('disabled')).toBeTruthy();
    });

    it('should test that the Create Project modal  has a field labeled "Name:" ', () => {
        expect(page.getElement('#label-create-project').getText()).toEqual('Name');
    });

    it('should test that the Create Project modal has a field labeled "Name:" and have text color of black ', () => {
        expect(page.getElement('#label-create-project').getCssValue('color')).toEqual('rgba(0, 0, 0, 0.87)');
    });

    it('should test that there Create Project modal has an input field with a specified id ', () => {
        expect(page.getElement('#input-create-project').isDisplayed()).toBeTruthy();
    });

    it('should test that on initialising the Create Project modal the input field be empty', () => {
        expect(page.getElement('#input-create-project').getAttribute('value')).toEqual('');
    });

    it('should Test that on typing into this field of the Create Project Modal the  Create Button is active', () => {
        page.getElement('#input-create-project').sendKeys(randommword);
        expect(page.getElement(modalsubmitbtn).isEnabled()).toBeTruthy();
    });

    it('should test that if there is a success response the modal is dismissed and toastr success message is shown', () => {
        page.getElement(modalsubmitbtn).click();
        utils.waitForPage(300).then(() => {
            expect(page.toastrOfTypePresent(ToastrTypes.SUCCESS)).toBeTruthy();
          }).catch(err => {
            if (err.name === 'NoSuchElementError') {
              expect(page.toastrOfTypePresent(ToastrTypes.ERROR)).toBeTruthy();
            }
          });
        expect(page.getElement('.modal-content').isPresent()).toBeFalsy();
    });

    it('create project should route to its taskboard on successful creation and check default columns to be "Todo, In Progress and Done" ',
    async () => {
        // await page.getElement('a#linkToBoard').click();
        expect(page.getAllElements('.task-list-name').getText()).toEqual([ 'Todo', 'In Progress', 'Done' ]);
        page.navigateTo(ProjectBoard.projectsUrl);
    });

    it('should show cards showing project details', async () => {
          // assert cards exists
          const details = await (utils.getElements(ProjectBoard.projectDetailsCard.selector));
          expect(details.length).toBeGreaterThan(0);
          // assert card
          page.assertProjectDetails(details[0]);
    });

    it('should expect project list total to update', () => {
        expect(page.getElement(ProjectBoard.projectCount).getText()).toBe('1');
    });


    it('should display admin actions on project when I click on "more"  ', async () => {
      // more CTA
      const details = await (utils.getElements(ProjectBoard.projectDetailsCard.selector));
      const dropdown = page.getDropdownCtaForElem(details[0]);
      const responses = await Promise.all([ dropdown.isPresent(), dropdown.isDisplayed()  ]);
      expect(responses).toEqual([true, true]);

      await dropdown.click();
      page.assertDropdownOpenForElem(details[0]);
      // on click modal appears
    });

    it('should have expected actions - edit, delete settings', async () => {
      const details = await (utils.getElements(ProjectBoard.projectDetailsCard.selector));
      const dropdowns = await page.dropdownMenus(details[0]);
      expect(dropdowns.length).toBe(3);
      const menuNames = await (page.dropdownMenu(details[0]).getText());
      ['Edit', 'Delete', 'Settings'].map(item => expect(menuNames.trim()).toContain(item));
    });

    it('menu items should have the expected icons', async () => {
      const expectedIconClasses = ['fa fa-edit fa-1.5x text-secondary', 'fa fa-cog fa-1.5x text-secondary',
      'fa fa-trash fa-1.5x text-secondary'];
      const details = await (utils.getElements(ProjectBoard.projectDetailsCard.selector));
      const dropdowns = await page.dropdownMenus(details[0]);
      Promise
      .all([dropdowns[0].$('i').getAttribute('class'),
      dropdowns[1].$('i').getAttribute('class'), dropdowns[2].$('i').getAttribute('class')])
        .then(iconClasses => expect(iconClasses).toEqual(expectedIconClasses) );
    });

    it('on clicking the edit icon with class \'fa-pencil\' a modal should appear', async () => {
      const details = await (utils.getElements(ProjectBoard.projectDetailsCard.selector));
      const dropdowns = await page.dropdownMenus(details[0]);

      await dropdowns[0].click();
      expect(page.getElement('.modal-content').isPresent()).toBeTruthy();
    });

    it('on initialising the edit project modal, there should be a close modal button', () => {
        expect(page.getElement(modalclose).getAttribute('aria-label')).toEqual('Close');
    });

    it('should test that edit project modal is dismissed when clicked', () => {
        page.getElement(modalclose).click().then(() => {
            expect(page.getElement('.modal-content').isPresent()).toBeFalsy();
        });
    });

    it('on clicking the edit icon with class \'fa-pencil\' a modal with header name \'Edit Project\' should appear', async () => {
      const details = await (utils.getElements(ProjectBoard.projectDetailsCard.selector));
      await (page.getDropdownCtaForElem(details[0])).click();
      const dropdowns = await page.dropdownMenus(details[0]);
      await dropdowns[0].click();
      expect(page.getElement('.modal-title').getText()).toEqual('Edit Project');
    });

    it('should test that there Edit Project modal has an input field with a specified id ', () => {
        expect(page.getElement('#example-text-input').isDisplayed()).toBeTruthy();
    });

    it('on initialising the edit project modal, there should be an Update button which should be disabled', () => {
        expect(page.getElement(modalsubmitbtn).getAttribute('disabled')).toBeTruthy();
    });

    it('should allow update of project name', async () => {
        expect(page.getElement(modalsubmitbtn).isEnabled()).toBeFalsy();
        page.getElement('#example-text-input').clear();
        expect(await (utils.getElement(modalsubmitbtn).$('i.fa.fa-spin.fa-spinner').isPresent())).toBeFalsy();
        page.getElement('#example-text-input').sendKeys(newnameofproject);
        expect(page.getElement(modalsubmitbtn).isEnabled()).toBeTruthy();
        page.getElement(modalsubmitbtn).click();
    });

    it('should have a delete icon with class \'fa-trash\' for each added project on the project board', async () => {
      await utils.navigateTo(ProjectBoard.projectsUrl);
      await utils.waitForPage(1000);
      const details = await (utils.getElements(ProjectBoard.projectDetailsCard.selector));
      await (page.getDropdownCtaForElem(details[0])).click();
      const dropdowns = await page.dropdownMenus(details[0]);
      expect(dropdowns.length).toBe(3);
      await dropdowns[2].click();
      expect(page.getElement('.modal-content').isPresent()).toBeTruthy();
    });

    it('open modal should have a header text titled "Deleting Project" ', () => {
        expect(page.getElement('.modal-title').getText()).toEqual('Deleting Project');
        expect(page.getElement('.modal-title').getTagName()).toEqual('h4');
    });

    it('open modal should have label text', () => {
        expect(page.getElement('h3').getText()).toContain(`Are you sure you want to delete`);
        expect(page.getElement(newnameofproject)).toBeTruthy();
    });

    it('on clicking the edit icon with class "fa-trash" a modal with buttons "No and Yes" be present', () => {
        expect(page.getAllElements(modalsubmitbtn).get(0).getText()).toEqual('No');
        expect(page.getAllElements(modalsubmitbtn).get(1).getText()).toEqual('Yes');
    });

    it('should expect the background color of the yes button to be red', () => {
        expect(page.getAllElements(modalsubmitbtn).get(1).getCssValue('background-color')).toEqual('rgba(239, 83, 80, 1)');
    });

    it('on clicking No button, the modal should be dismissed', () => {
        page.getAllElements(modalsubmitbtn).get(0).click().then(() => {
            expect(page.getElement('.modal-content').isPresent()).toBeFalsy();
        });
    });


    it('on successful deletion there should be a success toaster message and the modal should be dismissed', async () => {
      const details = await (utils.getElements(ProjectBoard.projectDetailsCard.selector));
      await (page.getDropdownCtaForElem(details[0])).click();
      const dropdowns = await page.dropdownMenus(details[0]);
      expect(dropdowns.length).toBe(3);
      await dropdowns[2].click();
      await utils.getElement('.modal-footer button[type="submit"]').click();
      utils.waitForPage(300).then(() => {
          expect(page.toastrOfTypePresent(ToastrTypes.ERROR)).toBeTruthy();
        }).catch(err => {
          if (err.name === 'NoSuchElementError') {
            expect(page.toastrOfTypePresent(ToastrTypes.SUCCESS)).toBeTruthy();
          }
        });
      expect(page.getElement('.modal-content').isPresent()).toBeFalsy();
    });

    it('should create new project and navigate', async () => {
        page.createProjectButton.click();
        page.getElement('#input-create-project').sendKeys(nameofproject);
        page.getElement('#submit-create-project').click();
        await utils.waitForPage(4000);
        expect(page.getAllElements('.task-list-name').getText()).toEqual([ 'Todo', 'In Progress', 'Done' ]);
    });

});
