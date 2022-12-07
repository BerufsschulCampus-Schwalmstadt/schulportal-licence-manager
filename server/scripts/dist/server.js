"use strict";
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
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
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
function login(page, username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const loginURL = 'https://sms-sgs.ic.gc.ca/login/auth';
        const userSelector = '#Username';
        const passSelector = '#Password';
        const loginBttnSelector = 'input[value="Login"]';
        yield page.goto(loginURL);
        (0, assert_1.default)(page.url() === loginURL);
        yield page.type(userSelector, username);
        yield page.type(passSelector, password);
        const clickResponse = yield clickElement(page, loginBttnSelector);
        if (clickResponse) {
            yield page.waitForNavigation();
            return true;
        }
        return false;
    });
}
function navToTablePage(page) {
    return __awaiter(this, void 0, void 0, function* () {
        yield page.goto('https://sms-sgs.ic.gc.ca/product/listOwn/index?lang=en_CA');
        const selectAccSelector = '#changeClient';
        const submitBttnSelector = '#changeAccountButton';
        yield selectElement(page, selectAccSelector, 1);
        const clickResponse = yield clickElement(page, submitBttnSelector);
        if (clickResponse) {
            yield page.waitForNavigation();
            return true;
        }
        return false;
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
        let table = {
            heading: [''],
            body: [['']],
            bodyLen: 0,
        };
        let successfullNavIndicator = true;
        while (successfullNavIndicator) {
            table = yield page.evaluate(table => {
                const rows = document.querySelectorAll('tr');
                if (!table.heading[0]) {
                    table.heading = Array.from(rows[0].cells, headingText => headingText.innerText);
                }
                const rowsLen = rows.length;
                for (let i = 1; i < rowsLen; i++) {
                    const currentRowCellArray = Array.from(rows[i].cells, el => el.innerText);
                    table.body[table.bodyLen] = currentRowCellArray;
                    table.bodyLen++;
                }
                return table;
            }, table);
            successfullNavIndicator = yield navToNextTablePage(page);
        }
        return table;
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
function generateCSVString(username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const browser = yield getBrowser();
        const page = yield browser.newPage();
        yield login(page, username, password);
        yield navToTablePage(page);
        const table = yield getTable(page);
        const header = table.heading;
        const body = table.body;
        const csvString = (0, convert_array_to_csv_1.convertArrayToCSV)(body, {
            header,
            separator: ',',
        });
        yield browser.close();
        return csvString;
    });
}
const app = (0, express_1.default)();
const port = 3001;
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({
    extended: true,
}));
app.use((0, cors_1.default)());
app.get('/', (req, res) => {
    res.send('Welcome to the server');
});
app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    console.log(username);
    console.log(password);
    const csvString = yield generateCSVString(username, password);
    const filePath = path_1.default.join('exports', 'Active_Licences_Export_' + getDate() + '.csv');
    fs_1.default.writeFileSync(filePath, csvString);
    res.download(filePath, err => {
        if (err)
            console.log(err);
        fs_1.default.unlinkSync(filePath);
    });
}));
app.listen(port, () => {
    console.log('server is running on port 3001');
});
