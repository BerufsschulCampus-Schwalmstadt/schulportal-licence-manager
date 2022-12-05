"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const assert_1 = __importDefault(require("assert"));
const puppeteer_1 = __importDefault(require("puppeteer"));
const convert_array_to_csv_1 = require("convert-array-to-csv");
const fs = __importStar(require("fs"));
function getBrowser() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield puppeteer_1.default.launch();
    });
}
function clickElement(page, selector) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield page.evaluate(passedSelector => {
            const element = document.querySelector(passedSelector);
            if (element) {
                element.click();
                return true;
            }
            else {
                return false;
            }
        }, selector);
    });
}
function selectElement(page, selector, optionIndex) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield page.evaluate((passedSelector, passedOptionIndex) => {
            const element = document.querySelector(passedSelector);
            if (element) {
                element.selectedIndex = passedOptionIndex + 1;
                return true;
            }
            else {
                return false;
            }
        }, selector, optionIndex);
    });
}
function login(page) {
    return __awaiter(this, void 0, void 0, function* () {
        const loginURL = 'https://sms-sgs.ic.gc.ca/login/auth';
        const loginUser = String(process.env.GOVUSERNAME);
        const loginPass = String(process.env.GOVPASSWORD);
        const userSelector = '#Username';
        const passSelector = '#Password';
        yield page.goto(loginURL);
        (0, assert_1.default)(page.url() === loginURL);
        yield page.type(userSelector, loginUser);
        yield page.type(passSelector, loginPass);
        yield page.keyboard.press('Enter');
        yield page.waitForNavigation();
        (0, assert_1.default)(page.url() === 'https://sms-sgs.ic.gc.ca/eic/site/sms-sgs-prod.nsf/eng/home');
    });
}
function navToLicenceServices(page) {
    return __awaiter(this, void 0, void 0, function* () {
        const licenceServicesLinkSelector = "a[title ='Radiocommunication Licensing Services']";
        yield clickElement(page, licenceServicesLinkSelector);
        yield page.waitForNavigation();
        (0, assert_1.default)(page.url() ===
            'https://sms-sgs.ic.gc.ca/eic/site/sms-sgs-prod.nsf/eng/h_00012.html');
    });
}
function navToTablePage(page) {
    return __awaiter(this, void 0, void 0, function* () {
        const applyTabSelector = '#License_Application-lnk';
        const listAppsSelector = "a[title = 'List My Applications']";
        const selectAccSelector = '#changeClient';
        const submitBttnSelector = '#changeAccountButton';
        yield clickElement(page, applyTabSelector);
        yield page.waitForSelector(listAppsSelector);
        yield clickElement(page, listAppsSelector);
        yield page.waitForSelector(selectAccSelector);
        (0, assert_1.default)(page.url() ===
            'https://sms-sgs.ic.gc.ca/multiClient/changeClientWizard?execution=e1s1');
        yield selectElement(page, selectAccSelector, 1);
        yield clickElement(page, submitBttnSelector);
        yield page.waitForNavigation();
        (0, assert_1.default)(page.url() === 'https://sms-sgs.ic.gc.ca/product/listOwn/index?lang=en_CA');
    });
}
function navToNextTablePage(page) {
    return __awaiter(this, void 0, void 0, function* () {
        const nextPageBttnSelector = "a[rel = 'next']";
        const clickResponse = yield clickElement(page, nextPageBttnSelector);
        if (clickResponse) {
            yield page.waitForNavigation();
            return true;
        }
        return false;
    });
}
function getTable(page) {
    return __awaiter(this, void 0, void 0, function* () {
        const myTable = {
            heading: [],
            body: [[]],
            bodyLen: 0,
        };
        myTable.heading = yield page.$$eval('th', headingCells => {
            return Array.from(headingCells, headingText => headingText.innerText);
        });
        (0, assert_1.default)(myTable.heading.length === 8);
        let successfullNavIndicator = true;
        while (successfullNavIndicator) {
            yield page.evaluate(myTable => {
                const rows = document.querySelectorAll('tbody > tr');
                const rowsLen = rows.length;
                for (let i = 0; i < rowsLen; i++) {
                    const currentRowCellArray = Array.from(rows[i].cells, el => el.innerText);
                    myTable.body[myTable.bodyLen] = currentRowCellArray;
                    myTable.bodyLen++;
                }
            }, myTable);
            successfullNavIndicator = yield navToNextTablePage(page);
        }
        return myTable;
    });
}
function getDate() {
    let dateString = new Date().toLocaleDateString('en-GB');
    dateString =
        dateString.substring(0, 2) +
            '_' +
            dateString.substring(3, 5) +
            '_' +
            dateString.substring(6);
    return dateString;
}
function createCSVFile(writeContent, fileName, fileExtension) {
    const dateString = getDate();
    const fullFileName = fileName + '_' + dateString + '.' + fileExtension;
    const writeStream = fs.createWriteStream('./exports/' + fullFileName);
    return writeStream.write(writeContent, err => {
        if (err) {
            console.log(err);
            return false;
        }
        else {
            console.log('Table successfully exported');
            return true;
        }
    });
}
function exportLicensesCSV() {
    return __awaiter(this, void 0, void 0, function* () {
        const browser = yield getBrowser();
        const page = yield browser.newPage();
        yield login(page);
        yield navToLicenceServices(page);
        yield navToTablePage(page);
        const table = yield getTable(page);
        const header = table.heading;
        const body = table.body;
        const csvString = (0, convert_array_to_csv_1.convertArrayToCSV)(body, {
            header,
            separator: ',',
        });
        (0, assert_1.default)(csvString);
        createCSVFile(csvString, 'Active_Licences_Export', 'csv');
        yield browser.close();
    });
}
exportLicensesCSV();
