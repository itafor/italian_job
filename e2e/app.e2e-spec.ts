import { AppPage } from './app.po';
import utils from './utils';

describe('Quabbly App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should have the correct paragraph text', () => {
    utils.navigateTo('/home');
    expect(utils.getElement('app-home h1')).toBeTruthy();
  });

  // it('Brand image should be a text', () => {
  //   expect(utils.getText('h3.masthead-brand')).toEqual('Quabbly');
  // });
});
