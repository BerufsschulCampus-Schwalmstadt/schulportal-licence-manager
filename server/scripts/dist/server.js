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
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const fs_1 = __importDefault(require("fs"));
const exportCSV_1 = require("./exportCSV");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config;
function getRedirectPath(allowedPaths, currentPath) {
    for (let i = 0; i < allowedPaths.length; i++) {
        const allowedPath = allowedPaths[i];
        if (allowedPath.includes(currentPath)) {
            return allowedPath;
        }
    }
    return allowedPaths[0];
}
const app = (0, express_1.default)();
const port = Number(process.env.PORT) || 3001;
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({
    extended: true,
}));
const corsAllowedList = [
    'https://spectrum-downloader.vercel.app',
    'http://localhost:3000',
];
app.use((0, cors_1.default)({
    origin: corsAllowedList,
}));
app.get('/api', (req, res) => {
    res.send('Welcome to the server');
});
let loginObject;
app.post('/api/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    console.log(username);
    console.log(password);
    loginObject = yield (0, exportCSV_1.login)(username, password);
    if (!loginObject.response) {
        res.sendStatus(401);
        console.log('auth failed');
        loginObject.kill;
    }
    else {
        res.sendStatus(200);
        console.log('auth succeeded');
    }
}));
app.get('/api/CSVExport', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const csvFilePath = yield (0, exportCSV_1.generateCSVFile)(loginObject);
    res.download(csvFilePath, err => {
        if (err)
            console.log(err);
        fs_1.default.unlinkSync(csvFilePath);
    });
    loginObject.kill;
}));
app.get('*', (req, res) => {
    if (req.hostname === 'localhost') {
        res.redirect(corsAllowedList[1]);
    }
    else {
        const url = req.protocol + '://' + req.hostname;
        const redirectUrl = getRedirectPath(corsAllowedList, url);
        console.log(url);
        res.redirect(redirectUrl);
    }
});
app.listen(port, () => {
    console.log('server is running on port ' + port);
});
