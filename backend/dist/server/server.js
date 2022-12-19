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
const licenceDataExport_1 = require("./api-features/licenceDataExport");
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config;
const client_1 = require("@prisma/client");
const auth_1 = require("./routes/auth");
const dashboard_1 = require("./routes/dashboard");
const tokens_1 = require("./tokens");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
exports.prisma = new client_1.PrismaClient();
exports.prisma.refreshToken
    .deleteMany()
    .then(count => console.log(count))
    .then(() => exports.prisma.joyrUser.deleteMany().then(count => console.log(count)));
const app = (0, express_1.default)();
const port = Number(process.env.PORT) || 3001;
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({
    extended: true,
}));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express_1.default.static(path_1.default.resolve(__dirname, '../../../frontend/build')));
let loginObject;
app.get('/api', (req, res) => {
    res.send('Welcome to the server');
});
app.use('/api/auth', auth_1.authRouter);
app.use('/api/refresh', tokens_1.tokenRefreshRouter);
app.use(tokens_1.authenticateToken);
app.use('/api/dashboard', dashboard_1.dashboardRouter);
app.get('/api/CSVExport', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const csvFilePath = yield (0, licenceDataExport_1.generateCSVFile)(loginObject);
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
