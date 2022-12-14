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
exports.prisma = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const fs_1 = __importDefault(require("fs"));
const api_1 = require("../api/api");
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config;
const client_1 = require("@prisma/client");
exports.prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
const port = Number(process.env.PORT) || 3001;
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({
    extended: true,
}));
app.use((0, cors_1.default)());
app.use(express_1.default.static(path_1.default.resolve(__dirname, '../../../frontend/build')));
app.get('/api', (req, res) => {
    res.send('Welcome to the server');
});
let loginObject;
app.post('/api/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const testingUsername = 'test';
    const testingPassword = 'test';
    const requestUsername = req.body.username;
    const requestPassword = req.body.password;
    console.log(requestUsername);
    console.log(requestPassword);
    if (requestUsername === testingUsername &&
        requestPassword === testingPassword) {
        res.sendStatus(200);
        console.log('testing session initiated');
    }
    else {
        loginObject = yield (0, api_1.login)(requestUsername, requestPassword);
        if (!loginObject.response) {
            res.sendStatus(401);
            console.log('auth failed');
            loginObject.kill;
        }
        else {
            res.sendStatus(200);
            console.log('auth succeeded');
        }
    }
}));
app.get('/api/CSVExport', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const csvFilePath = yield (0, api_1.generateCSVFile)(loginObject);
    res.download(csvFilePath, err => {
        if (err)
            console.log(err);
        fs_1.default.unlinkSync(csvFilePath);
    });
    loginObject.kill;
}));
app.get('*', (req, res) => {
    res.sendFile(path_1.default.resolve(__dirname, '../../../frontend/build', 'index.html'));
});
app.listen(port, () => {
    console.log('server is running on port ' + port);
});
