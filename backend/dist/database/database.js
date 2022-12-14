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
exports.deleteUser = exports.findUserByEmail = exports.newUser = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function newUser(emailToSet, passwordToSet) {
    return __awaiter(this, void 0, void 0, function* () {
        yield prisma.joyrUser.deleteMany();
        const createdUser = yield prisma.joyrUser.create({
            data: {
                email: emailToSet,
                password: passwordToSet,
            },
        });
        console.log(createdUser);
        return createdUser;
    });
}
exports.newUser = newUser;
function findUserByEmail(emailToQuery) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.joyrUser.findUnique({
            where: {
                email: emailToQuery,
            },
        });
    });
}
exports.findUserByEmail = findUserByEmail;
function deleteUser(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const deletedUser = yield prisma.joyrUser.delete({
            where: { id: userId },
        });
        console.log(deletedUser);
        return deletedUser;
    });
}
exports.deleteUser = deleteUser;
