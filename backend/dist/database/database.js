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
exports.deleteUser = exports.deleteRefreshToken = exports.pushRefreshToken = exports.findUserByRefreshToken = exports.findUserById = exports.findUserByEmail = exports.newUser = void 0;
const server_1 = require("../server/server");
function newUser(emailToSet, passwordToSet) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield server_1.prisma.joyrUser.create({
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
        return yield server_1.prisma.joyrUser.findUnique({
            where: { email: emailToQuery },
        });
    });
}
exports.findUserByEmail = findUserByEmail;
function findUserById(idToQuery) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield server_1.prisma.joyrUser.findUnique({
            where: { id: idToQuery },
        });
    });
}
exports.findUserById = findUserById;
function findUserByRefreshToken(refreshToken) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield server_1.prisma.refreshToken.findUnique({
            where: { token: refreshToken },
            select: { joyrUser: true },
        });
    });
}
exports.findUserByRefreshToken = findUserByRefreshToken;
function pushRefreshToken(refreshToken, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield server_1.prisma.refreshToken.create({
            data: {
                token: refreshToken,
                joyrUserId: userId,
            },
        });
    });
}
exports.pushRefreshToken = pushRefreshToken;
function deleteRefreshToken(tokenTodelete) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield server_1.prisma.refreshToken.deleteMany({
            where: { token: tokenTodelete },
        });
    });
}
exports.deleteRefreshToken = deleteRefreshToken;
function deleteUser(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield server_1.prisma.refreshToken.deleteMany({
            where: { joyrUserId: userId },
        });
        return yield server_1.prisma.joyrUser.delete({
            where: { id: userId },
        });
    });
}
exports.deleteUser = deleteUser;
