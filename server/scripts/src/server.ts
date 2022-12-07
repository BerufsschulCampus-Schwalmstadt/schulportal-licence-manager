import dotenv from 'dotenv';
dotenv.config();
import assert from 'assert';
import puppeteer, {Browser, Page} from 'puppeteer';
import {convertArrayToCSV} from 'convert-array-to-csv';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

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

// exportLicensesCSV navigates to the SMS and exports all your licence applications
async function generateCSVString(username: string, password: string) {
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

// -------------------------------  Main --------------------------------//

// initialise server params
const app = express();
const port = 3001;
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors());

// teaser :)
app.get('/', (req, res) => {
  res.send('Welcome to the server');
});

// Route that handles credentials input logic
app.post('/login', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  console.log(username);
  console.log(password);

  // get file content and path
  const csvString = await generateCSVString(username, password);
  const filePath = path.join(
    'exports',
    'Active_Licences_Export_' + getDate() + '.csv'
  );

  // write temp file
  fs.writeFileSync(filePath, csvString);

  // download temp file then delete it
  res.download(filePath, err => {
    if (err) console.log(err);
    fs.unlinkSync(filePath);
  });
});

app.listen(port, () => {
  console.log('server is running on port 3001');
});
