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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.pushRefreshToken = exports.findUserByRefreshToken = exports.findUserById = exports.findUserByEmail = exports.newUser = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function newUser(emailToSet, passwordToSet) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.joyrUser.create({
            data: {
                email: emailToSet,
                password: passwordToSet,
            },
        });
    });
}
exports.newUser = newUser;
function findUserByEmail(emailToQuery) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.joyrUser.findUnique({
            where: { email: emailToQuery },
        });
    });
}
exports.findUserByEmail = findUserByEmail;
function findUserById(idToQuery) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.joyrUser.findUnique({
            where: { email: idToQuery },
        });
    });
}
exports.findUserById = findUserById;
function findUserByRefreshToken(refreshToken) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.refreshToken.findUnique({
            where: { token: refreshToken },
            include: { joyrUser: true },
        });
    });
}
exports.findUserByRefreshToken = findUserByRefreshToken;
function pushRefreshToken(refreshToken, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.refreshToken.create({
            data: {
                token: refreshToken,
                joyrUserId: userId,
            },
        });
    });
}
exports.pushRefreshToken = pushRefreshToken;
function deleteUser(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.joyrUser.delete({
            where: { id: userId },
        });
    });
}
exports.deleteUser = deleteUser;
