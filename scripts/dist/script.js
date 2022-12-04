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
assert_1.default.strict;
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
        yield page.evaluate((selector) => {
            var _a;
            (_a = (document.querySelector(selector))) === null || _a === void 0 ? void 0 : _a.click();
        }, selector);
    });
}
function selectElement(page, selectElementSelector) {
    return __awaiter(this, void 0, void 0, function* () {
        yield page.evaluate((selectElementSelector) => {
            document.querySelector(selectElementSelector).selectedIndex = 2;
        }, selectElementSelector);
    });
}
function login(page) {
    return __awaiter(this, void 0, void 0, function* () {
        const loginURL = "https://sms-sgs.ic.gc.ca/login/auth";
        const loginUser = String(process.env.GOVUSERNAME);
        const loginPass = String(process.env.GOVPASSWORD);
        const userSelector = "#Username";
        const passSelector = "#Password";
        yield page.goto(loginURL);
        (0, assert_1.default)(page.url() === loginURL);
        yield page.type(userSelector, loginUser);
        yield page.type(passSelector, loginPass);
        yield page.keyboard.press("Enter");
        yield page.waitForNavigation();
        (0, assert_1.default)(page.url() === "https://sms-sgs.ic.gc.ca/eic/site/sms-sgs-prod.nsf/eng/home");
    });
}
function navToLicenceServices(page) {
    return __awaiter(this, void 0, void 0, function* () {
        const comLicServSelector = "a[title ='Radiocommunication Licensing Services']";
        yield clickElement(page, comLicServSelector);
        yield page.waitForNavigation();
        (0, assert_1.default)(page.url() === "https://sms-sgs.ic.gc.ca/eic/site/sms-sgs-prod.nsf/eng/h_00012.html");
    });
}
function navToLicencesList(page) {
    return __awaiter(this, void 0, void 0, function* () {
        const applyTabSelector = "#License_Application-lnk";
        const listAppsSelector = "a[title = 'List My Applications']";
        const selectAccSelector = "#changeClient";
        const submitBttnSelector = "#changeAccountButton";
        yield clickElement(page, applyTabSelector);
        yield page.waitForSelector(listAppsSelector);
        yield clickElement(page, listAppsSelector);
        yield page.waitForNavigation();
        (0, assert_1.default)(page.url() === "https://sms-sgs.ic.gc.ca/multiClient/changeClientWizard?execution=e1s1");
        yield selectElement(page, selectAccSelector);
        yield clickElement(page, submitBttnSelector);
        yield page.waitForNavigation();
        (0, assert_1.default)(page.url() === "https://sms-sgs.ic.gc.ca/product/listOwn/index?lang=en_CA");
    });
}
function navToNextTablePage(page) {
    return __awaiter(this, void 0, void 0, function* () {
        const nextPageBttnSelector = "a[rel = 'next']";
        yield clickElement(page, nextPageBttnSelector);
        yield page.waitForNavigation();
    });
}
function getTable(page) {
    return __awaiter(this, void 0, void 0, function* () {
        const table = {
            heading: [""],
            body: [[""], [""]]
        };
        table.heading = yield page.$$eval("th", columns => {
            return Array.from(columns, column => column.innerText);
        });
        (0, assert_1.default)(table.heading.length === 8);
        let navSuccesful = true;
        let tableLen = 0;
        let currentPageNum = 1;
        while (currentPageNum <= Number(process.env.PAGENUM)) {
            navSuccesful = false;
            let currentPageBody = yield page.$$eval("tbody > tr", rows => {
                return Array.from(rows, row => {
                    const columns = row.querySelectorAll("td");
                    return Array.from(columns, column => column.innerText);
                });
            });
            let currentPageTableLen = currentPageBody.length;
            for (let i = 0; i < currentPageTableLen; i++) {
                const newElement = currentPageBody[i];
                table.body[tableLen + i] = newElement;
            }
            tableLen += currentPageTableLen;
            yield navToNextTablePage(page);
            currentPageNum++;
        }
        return table;
    });
}
function getDate() {
    let dateString = new Date().toLocaleDateString("en-GB");
    dateString = dateString.substring(0, 2) + "_" + dateString.substring(3, 5) + "_" + dateString.substring(6);
    return dateString;
}
function createCSVFile(writeContent, fileName, fileExtension) {
    let dateString = getDate();
    let fullFileName = fileName + "_" + dateString + "." + fileExtension;
    const writeStream = fs.createWriteStream("./exports/" + fullFileName);
    return writeStream.write(writeContent, (err) => {
        if (err) {
            console.log(err);
            return false;
        }
        else {
            console.log("Table successfully exported");
            return true;
        }
    });
}
function exportLicensesCSV() {
    return __awaiter(this, void 0, void 0, function* () {
        let browser = yield getBrowser();
        let page = yield browser.newPage();
        yield login(page);
        yield navToLicenceServices(page);
        yield navToLicencesList(page);
        const table = yield getTable(page);
        const header = table.heading;
        const body = table.body;
        const csvString = (0, convert_array_to_csv_1.convertArrayToCSV)(body, {
            header,
            separator: ','
        });
        (0, assert_1.default)(csvString);
        createCSVFile(csvString, "Active_Licences_Export", "csv");
        yield browser.close();
    });
}
exportLicensesCSV();
