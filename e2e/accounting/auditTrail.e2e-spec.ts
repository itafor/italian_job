import { Accounting } from './accounting.po';
import { browser, by, element, until, protractor, Key } from 'protractor';
import utils from '../utils';
const path = require('path');
let page: Accounting;
const addbutton = '.fa-plus';
const editbutton = '.fa-edit';
const btn = '.btn';
const btnprimary = '.btn-primary';
const faviconclass = '.fa';
const today = new Date();
const tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);
describe('Accounting | Audit Trail', () => {
  let page: Accounting;
  beforeAll(() => {
    utils.navigateTo('/');
    utils.handleAuth();
  });
  beforeEach(() => {
    page = new Accounting();
  });
  it('should display a tabset that has a label "Audit Trail"', () => {
    page.navigateTo('/accounting/audittrail');

    expect(page.getElementLabel('viewAuditTrail')).toEqual('Audit Trail');
  });
  it('Audit Trail\'s Table  header label should contain: "Description, Action Type, Schema Name, Date Created, and Action', function() {
    expect(page.getLabelTitle()).toEqual([
      'Description',
      'Action Type',
      'Schema Name',
      'Date Created',
      'Action'
    ]);
  });
  it('should display "View Audit Trail" tooltip when hover over edit icon', function() {
    expect(page.getElement('viewAuditTrail')).toBeTruthy();
  });

  it('should test clicking on Audit Trail icon opens a tab and that tab should have the right header ', () => {
    page.getFirstButton('viewAuditTrail');
    browser.sleep(5000);
    expect(page.getInitialTab('tab-id-0')).toEqual('Audit Trail   ×');
  });
});
