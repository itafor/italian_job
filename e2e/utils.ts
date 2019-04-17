import { browser, element, by, ElementFinder, promise, Locator,  ElementArrayFinder } from 'protractor';
import { environment } from './../src/environments/environment';
const fetch = require('node-fetch');
import loginCredsMailAccount from './email/credentials';
interface AuthCredsInt {
  username?: string;
  password?: string;
  namespace?: string;
}
const credentials = {
  firstname: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5),
  lastname: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5),
};
export default class TestingUtilities {
  static SIGNUPLINK = '/account/signup';
  static SIGNINLINK = '/account/signin';
  static PASSWORDRECOVERYLINK = '/account/forgot';
  static FULLAUTHURL = environment.authurl + '/auth/login';
  static FULLREGISTERURL = environment.authurl + '/auth/register';
  static credentials = {
    firstname: credentials.firstname,
    lastname: credentials.lastname,
    email: `${credentials.firstname}.${credentials.lastname}@quabbly.com`,
    password: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10),
    companyName: 'Quabbly',
  };
  static isLink(toTest: string, urlFragment: string) {
    return toTest.indexOf(urlFragment) > -1;
  }
  static navigateTo(link: string) {
    return browser.get(link);
  }
  // get the text from a css selector
  static getText(selector: string) {
    return element(by.css(selector)).getText();
  }
  static getElement(selector: string) {
    return element(by.css(selector));
  }
  static getElements(selector: string): promise.Promise<ElementArrayFinder> {
    return promise.Promise.resolve(element.all(by.css(selector)));
  }
  static waitForPage(durationInSecs: string | number) {
    if (typeof durationInSecs === 'string') {
      durationInSecs = parseInt(durationInSecs, 10);
    }
    return browser.sleep(durationInSecs);
  }
  static getPaginationIndicatorsFor(containerSelector: string): promise.Promise<ElementArrayFinder> {
    return TestingUtilities.getElements(`${containerSelector} .pagination__indicator`);
  }
  static signup(): Promise<any> {
    const stringifiedCreds = JSON.stringify(TestingUtilities.credentials);
    return fetch(TestingUtilities.FULLREGISTERURL, {
      body: stringifiedCreds,
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json'
      },
    });
  }
  static login(suppCredentials?: AuthCredsInt): Promise<any> {
    const authCredentials = {
      username: TestingUtilities.credentials.email,
      password: TestingUtilities.credentials.password
    };
    const stringifiedCreds = JSON.stringify(suppCredentials ? suppCredentials :  authCredentials);
    return fetch(TestingUtilities.FULLAUTHURL, {
      body: stringifiedCreds,
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json'
      },
    });
  }
  static LocalStorageInterface(script: string, item?: string, value?: string) {
    let scriptParts;
    if (script === 'getItem') {
      scriptParts = `.getItem("${item}")`;
    } else if (script === 'get') {
      scriptParts = '';
    } else if (script === 'setItem') {
      scriptParts = `.setItem("${item}",`.concat('  \'  ').concat(value).concat(' \'  ').concat(');');
    }
    return browser.executeScript(`return window.localStorage${scriptParts};`).then(result => result);
  }
  static abortTest(reason?: string) {
    console.error(reason || 'Please check your internet connection. Aborting test');
    process.exit(-1);
  }
  static handleAuth() {
    TestingUtilities.signup().then(res => res.json())
      .then(jsonRes => {
        TestingUtilities.login()
          .then(res => {
            res.json().then(parsedJsonRes => {
              if ((parsedJsonRes.status === 401) || (parsedJsonRes.message && parsedJsonRes.message.toLowerCase() === 'unauthorized')) {
                // auth failed
                TestingUtilities.abortTest('Auth Failed');
              } else {
                // push needed details to local storage
                // emulating AUth Service's login
                if (parsedJsonRes.status === 'SUCCESS') {
                  console.log('Signed in successfully');
                  const user = {
                    firstName: parsedJsonRes.user.firstname,
                    lastName: parsedJsonRes.user.lastname,
                    token: parsedJsonRes.token,
                    username: parsedJsonRes.user.email,
                    roles: parsedJsonRes.user.roles,
                  };
                  return TestingUtilities.LocalStorageInterface('setItem', 'currentUser', JSON.stringify(user));
                }
              }
            });
          });
      })
      .catch(err => {
        console.error(err);
        if (err.type === 'system') {
          TestingUtilities.abortTest();
        }
        // other scenarios
        TestingUtilities.abortTest('An unknown API related error occured');
      });
  }
  static dataset(elt: ElementFinder) {
    return browser.executeScript('return arguments[0].dataset;', elt);
  }
  static simulateHover(elt: ElementFinder) {
    return browser.actions().mouseMove(elt).perform();
  }
  static urlContains(path: string) {
    return browser.getCurrentUrl().then(fullUrl => {
      return fullUrl.indexOf(path) > -1;
    });
  }
  static urlEndsWith(path: string) {
    return browser.getCurrentUrl().then(fullUrl => {
      return fullUrl.endsWith(path);
    });
  }
  static handleAuthWithCredentials(authCredentials: AuthCredsInt = loginCredsMailAccount, url?: string) {
    TestingUtilities.login(authCredentials)
      .then(res => {
        res.json().then(parsedJsonRes => {
          if ((parsedJsonRes.status === 401) || (parsedJsonRes.message && parsedJsonRes.message.toLowerCase() === 'unauthorized')) {
            // auth failed
            TestingUtilities.abortTest('Auth Failed');
          } else {
            // push needed details to local storage
            // emulating AUth Service's login
            if (parsedJsonRes.status === 'SUCCESS') {
              console.log('Signed in successfully');
              const user = {
                firstName: parsedJsonRes.user.firstname,
                lastName: parsedJsonRes.user.lastname,
                token: parsedJsonRes.token,
                username: parsedJsonRes.user.email
              };
              TestingUtilities.LocalStorageInterface('setItem', 'currentUser', JSON.stringify(user)).then(() => {
                if (url) {
                  TestingUtilities.navigateTo(url);
                  return TestingUtilities.waitForPage(2000);
                }
              });
            }
          }
        }).catch(errParsingJson => {
          TestingUtilities.abortTest('Error PArsing received JSON');
        });
      })
      .catch(err => {
        console.error(err);
        if (err.type === 'system') {
          TestingUtilities.abortTest();
        }
        // other scenarios
        TestingUtilities.abortTest('An unknown API related error occured');
      });
  }
  static locateByCSS(selector: string): Locator {
    return by.css(selector);
  }
  static reload(): promise.Promise<any> {
    return browser.refresh();
  }
  static clearLocalStorage(): promise.Promise<any> {
    return browser.executeScript(`return window.localStorage.clear();`);
  }

  static closeCurrentTab(): promise.Promise<void> {
    return TestingUtilities.getElement('ul[role="tablist"] > li > a.active span.indicate--danger').click();
  }

  static getAllBrowserTabs(): promise.Promise<string[]> {
    return browser.getAllWindowHandles();
  }

  static switchToTab(handle): promise.Promise<void> {
    return browser.switchTo().window(handle);
  }

  static closeCurrentWindowTab(): promise.Promise<void> {
    return browser.close();
  }
}




