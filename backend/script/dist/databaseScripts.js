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
exports.deleteUser = exports.newUser = void 0;
const server_1 = require("./server");
function newUser(emailToSet, passwordToSet) {
    return __awaiter(this, void 0, void 0, function* () {
        const createdUser = yield server_1.prisma.joyrUser.create({
            data: {
                email: emailToSet,
                password: passwordToSet,
            },
        });
        return createdUser;
    });
}
exports.newUser = newUser;
function deleteUser(userEmail) {
    return __awaiter(this, void 0, void 0, function* () {
        const deletedUser = yield server_1.prisma.joyrUser.delete({
            where: { email: userEmail },
        });
        return deletedUser;
    });
}
exports.deleteUser = deleteUser;
