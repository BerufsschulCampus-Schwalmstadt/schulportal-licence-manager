import dotenv from 'dotenv';
dotenv.config();
import assert from 'assert';
assert.strict;
import puppeteer, { Browser, Page } from 'puppeteer';
import { convertArrayToCSV } from 'convert-array-to-csv';
import * as fs from 'fs';

async function getBrowser() : Promise<Browser> {
    return await puppeteer.launch();
}

async function clickElement(page: Page, selector: string) {
    await page.evaluate((selector) => {
      (document.querySelector<HTMLLinkElement>(selector))?.click();
    }, selector);
}

async function selectElement(page: Page, selectElementSelector:string) {
    await page.evaluate((selectElementSelector) => {
        (document.querySelector(selectElementSelector) as HTMLSelectElement).selectedIndex = 2;
    }, selectElementSelector);
}

async function login(page: Page) : Promise<void> {

    // variables
    const loginURL:string = "https://sms-sgs.ic.gc.ca/login/auth";
    const loginUser: string = String(process.env.GOVUSERNAME);
    const loginPass: string = String(process.env.GOVPASSWORD);
    const userSelector: string = "#Username";
    const passSelector: string = "#Password";

    // initialisation
    await page.goto(loginURL);
    assert(page.url() === loginURL);

    // enter user name
    await page.type(userSelector, loginUser);

    // enter password
    await page.type(passSelector, loginPass);

    // Login
    await page.keyboard.press("Enter");
    await page.waitForNavigation();
    assert(page.url() === "https://sms-sgs.ic.gc.ca/eic/site/sms-sgs-prod.nsf/eng/home");
}

async function navToLicenceServices(page:Page) {

    const comLicServSelector: string = "a[title ='Radiocommunication Licensing Services']";
    await clickElement(page,comLicServSelector);
    await page.waitForNavigation();

    assert(page.url() === "https://sms-sgs.ic.gc.ca/eic/site/sms-sgs-prod.nsf/eng/h_00012.html");
}

async function navToLicencesList(page:Page) {

    const applyTabSelector: string = "#License_Application-lnk";
    const listAppsSelector: string = "a[title = 'List My Applications']";
    const selectAccSelector: string = "#changeClient";
    const submitBttnSelector: string = "#changeAccountButton";

    await clickElement(page,applyTabSelector);
    await page.waitForSelector(listAppsSelector);
    await clickElement(page,listAppsSelector);

    // wait for nav
    await page.waitForNavigation();
    // might want to set timeout here
    assert(page.url() === "https://sms-sgs.ic.gc.ca/multiClient/changeClientWizard?execution=e1s1");

    // select account option
    await selectElement(page,selectAccSelector)

    // navigate to list of license applications
    await clickElement(page,submitBttnSelector);
    await page.waitForNavigation();
    assert(page.url() === "https://sms-sgs.ic.gc.ca/product/listOwn/index?lang=en_CA");
}

async function navToNextTablePage(page: Page) {
    
    const nextPageBttnSelector: string = "a[rel = 'next']";

    await clickElement(page,nextPageBttnSelector);
    await page.waitForNavigation();
}

async function getTable(page: Page) {
    
    // table structure
    const table = {
        heading : [""],
        body: [[""],[""]]
    }

    // get table heading
    table.heading = await page.$$eval("th", columns => {
            return Array.from(columns, column => column.innerText);
    });

    assert(table.heading.length === 8);


    // get table body content from all pages
    let navSuccesful: boolean = true;
    let tableLen: number = 0;
    let currentPageNum: number = 1;

    // iterate through all pages
    while (currentPageNum <= Number(process.env.PAGENUM)) {
        
        navSuccesful = false

        let currentPageBody: string[][] = await page.$$eval("tbody > tr", rows => {
            return Array.from(rows, row => {
                const columns = row.querySelectorAll("td");
                return Array.from(columns, column => column.innerText);
            });
        });

        let currentPageTableLen:number = currentPageBody.length;
        
        for (let i = 0; i < currentPageTableLen; i++) {
            const newElement = currentPageBody[i];
            table.body[tableLen + i] = newElement;
        }
        tableLen += currentPageTableLen;

        await navToNextTablePage(page);
        currentPageNum++;
    }
    
    return table;
}

function getDate() : string{
    
    let dateString: string = new Date().toLocaleDateString("en-GB");
    
    // proper date format
    dateString = dateString.substring(0,2) + "_" + dateString.substring(3,5) + "_" + dateString.substring(6);

    return dateString;
}

function createCSVFile(writeContent: string ,fileName: string, fileExtension: string) {
    
    let dateString: string = getDate();
    let fullFileName: string = fileName + "_" + dateString + "." + fileExtension;

    // create writestream
    const writeStream = fs.createWriteStream("./exports/"+fullFileName)

    // write
    return writeStream.write(writeContent, (err) => {
        if (err){
            console.log(err);
            return false;
        }
        else{
            console.log("Table successfully exported");
            return true;
        }
    });
}

async function exportLicensesCSV() {

    // initialisation
    let browser: Browser = await getBrowser();
    let page: Page = await browser.newPage();

    // login to government sms (Spectrum Management System)
    await login(page);

    // go to license services page
    await navToLicenceServices(page);

    // load active license applications
    await navToLicencesList(page);

    // generate a table object from all license pages
    const table = await getTable(page);
    const header: string[] = table.heading;
    const body: string[][] = table.body;
    
    // generate csv string from table
    const csvString: string = convertArrayToCSV(body, {
        header,
        separator: ','
    });

    assert(csvString);

    // export csv
    createCSVFile( csvString,"Active_Licences_Export", "csv");

    
    await browser.close();
}

exportLicensesCSV();
