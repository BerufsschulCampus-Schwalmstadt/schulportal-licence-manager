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
exports.refreshAccess = exports.authenticateToken = exports.generateRefreshToken = exports.generateAccessToken = exports.tokenRefreshRouter = void 0;
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../../database/database");
const dotenv = __importStar(require("dotenv"));
exports.tokenRefreshRouter = express_1.default.Router();
dotenv.config();
function generateAccessToken(userIdAndEmail) {
    return jsonwebtoken_1.default.sign(userIdAndEmail, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '10s',
    });
}
exports.generateAccessToken = generateAccessToken;
function generateRefreshToken(userIdAndEmail) {
    return __awaiter(this, void 0, void 0, function* () {
        const refreshToken = jsonwebtoken_1.default.sign(userIdAndEmail, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });
        yield (0, database_1.pushRefreshToken)(refreshToken, userIdAndEmail.id);
        return refreshToken;
    });
}
exports.generateRefreshToken = generateRefreshToken;
function authenticateToken(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('testing auth');
        const accessToken = req.headers['authorization'];
        if (!accessToken)
            return res.status(401).send({ authenticated: false });
        console.log('got token');
        jsonwebtoken_1.default.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, userIdAndEmail) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                console.log('current token expired');
                return refreshAccess(req, res, next);
            }
            else {
                req.userIdAndEmail = userIdAndEmail;
                req.accessToken = accessToken;
                next();
            }
        }));
    });
}
exports.authenticateToken = authenticateToken;
function refreshAccess(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const cookies = req.cookies;
        if (!(cookies === null || cookies === void 0 ? void 0 : cookies.refreshToken))
            return res.status(401).send({ authenticated: false });
        const refreshToken = cookies.refreshToken;
        const refreshTokenUser = (_a = (yield (0, database_1.findUserByRefreshToken)(refreshToken))) === null || _a === void 0 ? void 0 : _a.joyrUser;
        if (!refreshTokenUser) {
            console.log('refresh token not associated to a user');
            return res.status(403).send({ authenticated: false });
        }
        console.log('attempting to refresh');
        jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decodedElement) => {
            if (err) {
                console.log('Invalid refresh token - please login (token may be expired)');
                return res.status(403).send({ authenticated: false });
            }
            const decodedElementObject = JSON.parse(JSON.stringify(decodedElement));
            if (decodedElementObject.id !== refreshTokenUser.id) {
                return res.status(403).send({ authenticated: false });
            }
            const userIdAndEmail = {
                id: decodedElementObject.id,
                email: decodedElementObject.email,
            };
            const newAccessToken = generateAccessToken(userIdAndEmail);
            console.log('refresh successful');
            req.user = refreshTokenUser;
            req.accessToken = newAccessToken;
            next();
        });
    });
}
exports.refreshAccess = refreshAccess;
exports.tokenRefreshRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const cookies = req.cookies;
    if (!(cookies === null || cookies === void 0 ? void 0 : cookies.refreshToken))
        return res.status(401).send({ authenticated: false });
    const refreshToken = cookies.refreshToken;
    const refreshTokenUser = (_a = (yield (0, database_1.findUserByRefreshToken)(refreshToken))) === null || _a === void 0 ? void 0 : _a.joyrUser;
    if (!refreshTokenUser)
        return res.status(403).send({ authenticated: false });
    jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decodedElement) => {
        if (err)
            return res.status(403).send({ authenticated: false });
        const decodedElementObject = JSON.parse(JSON.stringify(decodedElement));
        if (decodedElementObject.id !== refreshTokenUser.id) {
            return res.status(403).send({ authenticated: false });
        }
        const userIdAndEmail = {
            id: decodedElementObject.id,
            email: decodedElementObject.email,
        };
        const newAccessToken = generateAccessToken(userIdAndEmail);
        const responseInfo = {
            authenticated: true,
            userId: refreshTokenUser.id,
            userEmail: refreshTokenUser.email,
            userRole: refreshTokenUser.accountType,
            accessToken: newAccessToken,
        };
        res.send(responseInfo);
        console.log('new access token generated');
    });
}));
