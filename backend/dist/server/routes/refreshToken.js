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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../../database/database");
const dotenv = __importStar(require("dotenv"));
const server_1 = require("../server");
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
function generateAccessToken(user) {
    return jsonwebtoken_1.default.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '30s',
    });
}
function generateRefreshToken(user) {
    return jsonwebtoken_1.default.sign(user, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '1d',
    });
}
exports.authRouter.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reqEmail = req.body.email;
    const reqPassword = yield encryptPassword(req.body.password);
    console.log(reqEmail);
    console.log(reqPassword);
    yield server_1.prisma.joyrUser.deleteMany();
    const userAlreadyExists = yield (0, database_1.findUserByEmail)(reqEmail);
    if (userAlreadyExists) {
        res.sendStatus(409);
    }
    else {
        const createdUser = yield (0, database_1.newUser)(reqEmail, reqPassword).catch(error => {
            throw error;
        });
        const accessToken = generateAccessToken(createdUser);
        const refreshToken = generateRefreshToken(createdUser);
        yield (0, database_1.pushUserRefreshToken)(createdUser.id, refreshToken).catch(error => {
            throw error;
        });
        res
            .send({
            accessToken: accessToken,
            refreshToken: refreshToken,
        })
            .status(200);
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
    }
    else {
        const databasePassword = userToLogin.password;
        const isCorrectCredentials = yield verifyPassword(reqPassword, databasePassword);
        if (isCorrectCredentials) {
            const token = jsonwebtoken_1.default.sign(userToLogin, process.env.ACCESS_TOKEN_SECRET);
            res.send(token).status(200);
        }
        else {
            res.sendStatus(401);
        }
    }
}));
