import { browser } from 'protractor';

const eligibleCharacters = 'abcdefghijklmnopqrstu  vwxyzABCDEFGHIJKLMN   OPQRSTUVWXYZ0123456789  '; // don't use replace
const eligibleCharactersWithoutSpaces = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export default class TaskManagerTestingUtilities {

  static dateTimeRegex = /\d{1,2} [a-zA-Z]{3} \d{4} - \d{1,2}:\d{2} (?:AM|PM)/;
  static boardUrlRegex = /.+\/taskmanager\/project\/[0-9a-z]{16,28}/;
  /**
   * @method generateRandomString  generate a random string
   * @param spaces should string include spaces
   * @param length length of returned string - optional
   */
  static generateRandomString(spaces: boolean, length?: number): string {
    if (!length) {
      length = ((Math.random() * 100) % 100) + 1;
    }
    const sample = spaces ? eligibleCharacters : eligibleCharactersWithoutSpaces;
    return Array(length).join().split(',').map(function() { return sample.charAt(Math.floor(Math.random() * sample.length)); }).join('');
  }

  static assertDateTimeFormatted(dtString: string): boolean {
    return TaskManagerTestingUtilities.dateTimeRegex.test(dtString) &&
    dtString.match(TaskManagerTestingUtilities.dateTimeRegex)[0] === dtString;
  }

  static async assertUrlIsBoard(): Promise<boolean> {
    const url = await browser.getCurrentUrl();
    console.log(url);
    return TaskManagerTestingUtilities.boardUrlRegex.test(url);
  }
}

