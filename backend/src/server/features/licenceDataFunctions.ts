import assert from 'assert';
import puppeteer, {Browser, Page} from 'puppeteer';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config();
import {convertArrayToCSV} from 'convert-array-to-csv';
import fs from 'fs';
//'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' ||
// ---------------------------  Classes ------------------------------//

/* It's a class that holds promises for a puppeteer browser and page,
and has a method that resolves those promises and returns a PuppeteerObject */
class PuppeteerObjectPromise {
  response: boolean | null;
  browserStatus: string;
  browser: Promise<Browser>;
  page: Promise<Page>;

  constructor() {
    this.response = null;
    this.browserStatus = 'promised';
    this.browser = puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      ignoreDefaultArgs: ['--disable-extensions'],
    });
    this.page = this.browser.then(value => value.newPage());
  }
  /**
   * It returns a new PuppeteerObject with a resolved:
   * response, browserStatus, browser, and page
   * @returns A PuppeteerObject
   */
  async resolve(): Promise<PuppeteerObject> {
    const puppeteerObject = new PuppeteerObject(
      this.response,
      'open',
      await this.browser,
      await this.page
    );
    return puppeteerObject;
  }
}

/* It's a class that holds the response, browser status, browser, and page objects */
export class PuppeteerObject {
  response: boolean | null;
  browserStatus: string;
  browser: Browser;
  page: Page;

  constructor(
    response: boolean | null,
    browserStatus: string,
    browser: Browser,
    page: Page
  ) {
    this.response = response;
    this.browserStatus = browserStatus;
    this.browser = browser;
    this.page = page;
  }

  /**
   * It closes the browser and sets the browserStatus to 'killed'
   */
  kill() {
    this.browser.close();
    this.browserStatus = 'killed';
  }
}

// ---------------------  general helper function ------------------------//

/**
 * It takes a date, formats it to a string, and returns it
 * @returns A string in the format of dd_mm_yyyy
 */
function getDate(): string {
  let dateString: string = new Date().toLocaleDateString('en-GB');

  // proper date format
  dateString =
    dateString.substring(0, 2) +
    '_' +
    dateString.substring(3, 5) +
    '_' +
    dateString.substring(6);

  return dateString;
}

/**
 * It returns a string that is the path to a file that is named after the current date
 * @returns A string
 */
function getPath(): string {
  return path.join(
    'temp_exports',
    'Active_Licences_Export_' + getDate() + '.csv'
  );
}

// -------------------  Page Navigation Helper Functions --------------------//

/**
 * It clicks on the element that matches the passed selector
 * @param {Page} page - Page - this is the Puppeteer page object that we're using to interact with the
 * page.
 * @param {string} selector - The CSS selector of the element you want to click.
 * @returns A boolean value.
 */
async function clickElement(page: Page, selector: string): Promise<boolean> {
  return await page.evaluate(passedSelector => {
    const element: HTMLElement | null = document.querySelector(passedSelector);
    if (element) {
      element.click();
      return true;
    } else {
      return false;
    }
  }, selector);
}

/**
 * It selects an option from a dropdown menu
 * @param {Page} page - Page - The Puppeteer page object.
 * @param {string} selector - The CSS selector of the select element.
 * @param {number} optionIndex - The index of the option you want to select.
 * @returns A boolean value.
 */
async function selectElement(
  page: Page,
  selector: string,
  optionIndex: number
): Promise<boolean> {
  return await page.evaluate(
    (passedSelector: string, passedOptionIndex: number) => {
      const element: HTMLSelectElement | null =
        document.querySelector(passedSelector);
      if (element) {
        element.selectedIndex = passedOptionIndex + 1;
        return true;
      } else {
        return false;
      }
    },
    selector,
    optionIndex
  );
}

// ----------------------  Page Navigation Functions -----------------------//

/**
 * It logs into the SMS website and returns a PuppeteerObject with a boolean response
 * @param {string} username - It's a string that holds the username for the SMS website.
 * @param {string} password - It's a string that holds the password for the SMS website.
 * @returns A promise that resolves to a PuppeteerObject
 */
export async function login(
  username: string,
  password: string
): Promise<PuppeteerObject> {
  // variables
  const loginURL = 'https://sms-sgs.ic.gc.ca/login/auth';
  const loginSuccesURL =
    'https://sms-sgs.ic.gc.ca/eic/site/sms-sgs-prod.nsf/eng/home';
  const userSelector = '#Username';
  const passSelector = '#Password';
  const loginBttnSelector = 'input[value="Login"]';
  const loginObject = await new PuppeteerObjectPromise().resolve();
  loginObject.page.setDefaultNavigationTimeout(120000); // 2min timeout

  // initialisation
  await loginObject.page.goto(loginURL);
  assert(loginObject.page.url() === loginURL);
  console.log('reached auth page');
  // enter user name & password
  await loginObject.page.type(userSelector, username);
  await loginObject.page.type(passSelector, password);
  console.log('entered credentials');

  // click login button
  const clickResponse = await clickElement(loginObject.page, loginBttnSelector);
  console.log(clickResponse ? 'submit succeeded' : 'submit failled');

  // check if we succesfully logged in
  if (
    clickResponse &&
    (await loginObject.page.waitForNavigation()) &&
    loginObject.page.url() === loginSuccesURL
  ) {
    loginObject.response = true;
    console.log('login successfull');
  } else {
    loginObject.response = false;
    console.log('login failled');
  }

  console.log('returning');
  return loginObject;
}

/**
 * It navigates to the table page by selecting the first account option on the license
 * application account dropdown, and clicking the submit button
 * @param {Page} page - Page - the puppeteer page object
 * @returns A boolean value.
 */
async function navToTablePage(page: Page): Promise<boolean> {
  await page.goto('https://sms-sgs.ic.gc.ca/product/listOwn/index?lang=en_CA');

  const selectAccSelector = '#changeClient';
  const submitBttnSelector = '#changeAccountButton';

  // select account option
  await selectElement(page, selectAccSelector, 1);

  // navigate to list of license applications
  const clickResponse = await clickElement(page, submitBttnSelector);
  if (clickResponse) {
    await page.waitForNavigation();
    return true;
  }
  return false;
}

/**
 * "Clicks the 'next page' button and wait for the page to load."
 *
 * The function takes a page object as an argument. It then uses the clickElement function to click the
 * 'next page' button. If the click was successful, the function waits for the page to load and returns
 * true. If the click was unsuccessful, the function returns false
 * @param {Page} page - Page - the Puppeteer page object
 * @returns A boolean value.
 */
async function navToNextTablePage(page: Page): Promise<boolean> {
  const nextPageBttnSelector = "a[rel = 'next']";

  const clickResponse: boolean = await clickElement(page, nextPageBttnSelector);
  if (clickResponse) {
    await page.waitForNavigation();
    return true;
  }
  return false;
}

// ----------------------  Table Creation Function -----------------------//

/**
 * We're iterating through all pages of the table, adding the table body content to our table object,
 * and returning the table object
 * @param {Page} page - Page - the page object from puppeteer
 * @returns An object with the following properties:
 *   heading: An array of strings representing the table headings
 *   body: An array of arrays of strings representing the table body
 *   bodyLen: The number of rows in the table body
 */
async function getTable(
  page: Page
): Promise<{heading: string[]; body: string[][]; bodyLen: number}> {
  // table structure
  let table = {
    heading: [] as string[],
    body: [] as string[][],
    bodyLen: 0,
  };

  // get table body content from all pages
  let successfullNavIndicator = true;

  // iterate through all pages
  while (successfullNavIndicator) {
    // add all table body content to our table object
    table = await page.evaluate(table => {
      // get rows
      const rows: NodeListOf<HTMLTableRowElement> =
        document.querySelectorAll('tr');

      const nodeCleaner = (nodeTextContent: string) => {
        return nodeTextContent.replace(/(\r\n|\n|\r)/gm, '').trim();
      };

      // set heading
      if (!table.heading[0]) {
        Array.from(rows[0].cells).forEach(cell => {
          Array.from(cell.childNodes)
            .filter(node => {
              const text = nodeCleaner(node.textContent as string);
              return text && text.toLowerCase() !== 'actions';
            })
            .forEach(textNode => {
              if (textNode.textContent) {
                table.heading.push(nodeCleaner(textNode.textContent));
              }
            });
        });
      }

      // iterate through all rows adding them to our table body
      for (let i = 1; i < rows.length; i++) {
        const row: string[] = [];
        Array.from(rows[i].cells)
          .slice(0, table.heading.length - 1)
          .forEach(cell => {
            let text: string | null;
            if (cell.childNodes.length === 1) {
              text = nodeCleaner(cell.textContent as string);
              row.push(text ? text : '');
            } else {
              const filteredArr = Array.from(cell.childNodes).filter(node =>
                nodeCleaner(node.textContent as string)
              );
              if (!filteredArr.length) row.push('');
              else {
                filteredArr.forEach(textNode =>
                  row.push(nodeCleaner(textNode.textContent as string))
                );
              }
            }
          });
        table.body.push(row);
        table.bodyLen++;
      }

      // new table
      return table;
    }, table);

    console.log(table.heading);
    successfullNavIndicator = await navToNextTablePage(page);
  }

  return table;
}

// ------------------------  CSV Export Functions ------------------------//

/**
 * It navigates to the table page, then generates a table object from all license pages
 * @param {PuppeteerObject} puppeteerObject - PuppeteerObject
 * @returns An object with the following properties:
 *   heading: an array of strings
 *   body: an array of arrays of strings
 *   bodyLen: a number
 */
export async function generateLicenceTableObject(
  puppeteerObject: PuppeteerObject
): Promise<{heading: string[]; body: string[][]; bodyLen: number}> {
  // go to table repo/page
  await navToTablePage(puppeteerObject.page as Page);

  // generate a table object from all license pages
  return await getTable(puppeteerObject.page as Page);
}

/**
 * It navigates to the table page, generates a table object from all license pages, and then generates
 * a csv string from the table object
 * @param {PuppeteerObject} puppeteerObject - PuppeteerObject
 * @returns A string of the CSV file
 */
async function generateCSVString(
  puppeteerObject: PuppeteerObject
): Promise<string> {
  // go to table repo/page
  await navToTablePage(puppeteerObject.page as Page);

  // generate a table object from all license pages
  const table = await getTable(puppeteerObject.page as Page);
  const header: string[] = table.heading;
  const body: string[][] = table.body;

  // generate csv string from table
  const csvString: string = convertArrayToCSV(body, {
    header,
    separator: ',',
  });

  return csvString;
}

/**
 * It takes a PuppeteerObject, generates a CSV string from it, writes that string to a file, and
 * returns the path to that file
 * @param {PuppeteerObject} puppeteerObject - This is the object that is returned from the
 * generatePuppeteerObject function.
 * @returns A string that is the path to the file that was created.
 */
export async function generateCSVFile(
  puppeteerObject: PuppeteerObject
): Promise<string> {
  const csvString = await generateCSVString(puppeteerObject);
  const filePath = getPath();

  fs.writeFileSync(filePath, csvString);
  return filePath;
}
