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
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = require("../../database/database");
const dotenv = __importStar(require("dotenv"));
const tokens_1 = require("../tokens");
dotenv.config();
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
    const userAlreadyExists = yield (0, database_1.findUserByEmail)(reqEmail);
    if (userAlreadyExists) {
        console.log('user already exists');
        res.sendStatus(409);
    }
    else {
        const createdUser = yield (0, database_1.newUser)(reqEmail, reqPassword);
        const userIdAndEmail = {
            id: createdUser.id,
            email: createdUser.email,
        };
        const accessToken = (0, tokens_1.generateAccessToken)(userIdAndEmail);
        const refreshToken = yield (0, tokens_1.generateRefreshToken)(userIdAndEmail);
        const responseInfo = {
            userId: createdUser.id,
            userEmail: createdUser.email,
            userRole: createdUser.accountType,
            accessToken: accessToken,
        };
        console.log(responseInfo);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 3 * 24 * 60 * 60 * 1000,
        });
        res.send(responseInfo).status(200);
        console.log('user created successfully');
    }
}));
exports.authRouter.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reqEmail = req.body.email;
    const reqPassword = req.body.password;
    console.log(reqEmail);
    console.log(reqPassword);
    const userToLogin = yield (0, database_1.findUserByEmail)(reqEmail);
    if (!userToLogin) {
        res.sendStatus(404);
        console.log('user not found');
    }
    else {
        const databasePassword = userToLogin.password;
        const isCorrectCredentials = yield verifyPassword(reqPassword, databasePassword);
        if (isCorrectCredentials) {
            const userIdAndEmail = {
                id: userToLogin.id,
                email: userToLogin.email,
            };
            const accessToken = (0, tokens_1.generateAccessToken)(userIdAndEmail);
            const refreshToken = yield (0, tokens_1.generateRefreshToken)(userIdAndEmail);
            const responseInfo = {
                userId: userToLogin.id,
                userEmail: userToLogin.email,
                userRole: userToLogin.accountType,
                accessToken: accessToken,
            };
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: 3 * 24 * 60 * 60 * 1000,
            });
            console.log(responseInfo);
            res.send(responseInfo).status(200);
            console.log('user logged in successfully');
        }
        else {
            res.sendStatus(401);
            console.log('wrong credentials');
        }
    }
}));
exports.authRouter.post('/logout', (req, res) => {
    (0, database_1.deleteRefreshToken)(req.cookies.refreshToken);
    res.sendStatus(204);
    console.log('successfully loged out');
});
