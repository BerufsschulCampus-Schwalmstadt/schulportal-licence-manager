import dotenv from 'dotenv';
dotenv.config();
import assert from 'assert';
import puppeteer, {Browser, Page} from 'puppeteer';
import {convertArrayToCSV} from 'convert-array-to-csv';
import * as fs from 'fs';

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
async function login(page: Page): Promise<void> {
  // variables
  const loginURL = 'https://sms-sgs.ic.gc.ca/login/auth';
  const loginUser = String(process.env.GOVUSERNAME);
  const loginPass = String(process.env.GOVPASSWORD);
  const userSelector = '#Username';
  const passSelector = '#Password';

  // initialisation
  await page.goto(loginURL);
  assert(page.url() === loginURL);

  // enter user name & password
  await page.type(userSelector, loginUser);
  await page.type(passSelector, loginPass);

  // Login
  await page.keyboard.press('Enter');
  await page.waitForNavigation();
  assert(
    page.url() === 'https://sms-sgs.ic.gc.ca/eic/site/sms-sgs-prod.nsf/eng/home'
  );
}

// navToLicencesList navigates to the first licence table page in the SMS
async function navToTablePage(page: Page): Promise<void> {
  await page.goto('https://sms-sgs.ic.gc.ca/product/listOwn/index?lang=en_CA');

  const selectAccSelector = '#changeClient';
  const submitBttnSelector = '#changeAccountButton';

  // select account option
  await selectElement(page, selectAccSelector, 1);

  // navigate to list of license applications
  await clickElement(page, submitBttnSelector);
  await page.waitForNavigation();
  assert(
    page.url() === 'https://sms-sgs.ic.gc.ca/product/listOwn/index?lang=en_CA'
  );
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

  // get table heading
  table.heading = await page.$$eval('th', headingCells => {
    return Array.from(headingCells, headingText => headingText.innerText);
  });

  assert(table.heading.length === 8);

  // get table body content from all pages
  let successfullNavIndicator = true;

  // iterate through all pages
  while (successfullNavIndicator) {
    // add all table body content to our table object
    table = await page.evaluate(table => {
      // get rows
      const rows: NodeListOf<HTMLTableRowElement> =
        document.querySelectorAll('tbody > tr');

      // get rows length
      const rowsLen: number = rows.length;

      // iterate through all rows adding them to our table body
      for (let i = 0; i < rowsLen; i++) {
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

// createCSVFile write a csv file with the given content and name
function createCSVFile(
  writeContent: string,
  fileName: string,
  fileExtension: string
): boolean {
  const dateString: string = getDate();
  const fullFileName: string =
    fileName + '_' + dateString + '.' + fileExtension;

  // create writestream
  const writeStream = fs.createWriteStream('./exports/' + fullFileName);

  // write
  return writeStream.write(writeContent, err => {
    if (err) {
      console.log(err);
      return false;
    } else {
      console.log('Table successfully exported');
      return true;
    }
  });
}

// exportLicensesCSV navigates to the SMS and exports all your licence applications
async function exportLicensesCSV() {
  // initialisation
  const browser: Browser = await getBrowser();
  const page: Page = await browser.newPage();

  // login to government sms (Spectrum Management System)
  await login(page);

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

  assert(csvString);

  // export csv
  createCSVFile(csvString, 'Active_Licences_Export', 'csv');

  await browser.close();
}

// -------------------------------  Main --------------------------------//

// 1.5s per page
exportLicensesCSV();
