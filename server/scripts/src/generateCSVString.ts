import assert from 'assert';
import puppeteer, {Browser, Page} from 'puppeteer';
import {convertArrayToCSV} from 'convert-array-to-csv';

// -----------------  Page Initialization Functions ------------------------//

// getBrowser initialises the puppeteer browser
async function getBrowser(): Promise<Browser> {
  return await puppeteer.launch();
}

// -------------------  Page Navigation Helper Functions --------------------//

// clickElement performs a DOM "click" on the passed selector
// on the passed puppeteer page
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

// selectElement DOM "select's" the option at the passed index
// on the passed select element selector on the passed puppeteer page
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

// login logs-in to the SMS using the credentials in the .env file
async function login(
  page: Page,
  username: string,
  password: string
): Promise<boolean> {
  // variables
  const loginURL = 'https://sms-sgs.ic.gc.ca/login/auth';
  const userSelector = '#Username';
  const passSelector = '#Password';
  const loginBttnSelector = 'input[value="Login"]';

  // initialisation
  await page.goto(loginURL);
  assert(page.url() === loginURL);

  // enter user name & password
  await page.type(userSelector, username);
  await page.type(passSelector, password);

  // Login
  const clickResponse = await clickElement(page, loginBttnSelector);
  if (clickResponse) {
    await page.waitForNavigation();
    return true;
  }
  return false;
}

// navToLicencesList navigates to the first licence table page in the SMS
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

// navToNextTablePage navigates to the next table page and returns true if one exists
// if no next page exists the funtion returns false
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

// getTable generates and returns a custom table object that holds'
// the license content from all tables in the SMS
async function getTable(
  page: Page
): Promise<{heading: string[]; body: string[][]; bodyLen: number}> {
  // table structure
  let table = {
    heading: [''],
    body: [['']],
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

      // set heading
      if (!table.heading[0]) {
        table.heading = Array.from(
          rows[0].cells,
          headingText => headingText.innerText
        );
      }

      // get number of rows on page
      const rowsLen: number = rows.length;

      // iterate through all rows adding them to our table body
      for (let i = 1; i < rowsLen; i++) {
        const currentRowCellArray: string[] = Array.from(
          rows[i].cells,
          el => el.innerText
        );
        table.body[table.bodyLen] = currentRowCellArray;
        table.bodyLen++;
      }

      // new table
      return table;
    }, table);

    successfullNavIndicator = await navToNextTablePage(page);
  }

  return table;
}

// ------------------------  CSV Export Functions ------------------------//

// getDate generates formats and returns a date to be used for version
// control of CSV exports
export function getDate(): string {
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

// exportLicensesCSV navigates to the SMS and exports all your licence applications
export async function generateCSVString(username: string, password: string) {
  // initialisation
  const browser: Browser = await getBrowser();
  const page: Page = await browser.newPage();

  // login to government sms (Spectrum Management System)
  await login(page, username, password);

  // go to table repo/page
  await navToTablePage(page);

  // generate a table object from all license pages
  const table = await getTable(page);
  const header: string[] = table.heading;
  const body: string[][] = table.body;

  // generate csv string from table
  const csvString: string = convertArrayToCSV(body, {
    header,
    separator: ',',
  });

  await browser.close();

  return csvString;
}
