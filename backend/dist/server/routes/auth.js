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
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = require("../../database/database");
exports.authRouter = express_1.default.Router();
function encryptPassword(password) {
    return __awaiter(this, void 0, void 0, function* () {
        const encryptionSalt = yield bcrypt_1.default.genSalt(10);
        return bcrypt_1.default.hash(password, encryptionSalt);
    });
}
function verifyPassword(password, encryptedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(password, encryptedPassword);
    });
}
exports.authRouter.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reqEmail = req.body.email;
    const reqPassword = yield encryptPassword(req.body.password);
    console.log(reqEmail);
    console.log(reqPassword);
    const createdUser = yield (0, database_1.newUser)(reqEmail, reqPassword);
    res.send(createdUser).status(200);
}));
exports.authRouter.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reqEmail = req.body.email;
    const reqPassword = req.body.password;
    console.log(reqEmail);
    console.log(reqPassword);
    const userToLogin = yield (0, database_1.findUserByEmail)(reqEmail);
    if (!userToLogin) {
        res.sendStatus(404);
    }
    else {
        const databasePassword = userToLogin.password;
        const isCorrectCredentials = yield verifyPassword(reqPassword, databasePassword);
        if (isCorrectCredentials) {
            res.send(userToLogin).status(200);
        }
        else {
            res.sendStatus(401);
        }
    }
}));
