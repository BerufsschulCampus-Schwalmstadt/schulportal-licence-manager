"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config;
const app = (0, express_1.default)();
const port = Number(process.env.PORT) || 3001;
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({
    extended: true,
}));
app.use((0, cors_1.default)());
app.use(express_1.default.static(path_1.default.resolve(__dirname, '../../../client/build')));
app.get('*', (req, res) => {
    res.sendFile(path_1.default.resolve(__dirname, '../../../client', 'index.html'));
});
app.listen(port, () => {
    console.log('server is running on port ' + port);
});
