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
exports.licenceDataRouter = void 0;
const express_1 = __importDefault(require("express"));
const licenceDataFunctions_1 = require("../features/licenceDataFunctions");
exports.licenceDataRouter = express_1.default.Router();
exports.licenceDataRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('access granted, getting data');
    const loginObject = yield (0, licenceDataFunctions_1.login)('Rogers_TCS', 'Sf16}2dDA$)p');
    console.log('sms login successfull');
    const data = yield (0, licenceDataFunctions_1.generateLicenceTableObject)(loginObject);
    const responseObject = {
        data,
        lastSynced: new Date(),
    };
    loginObject.kill();
    console.log(data);
    return res.status(200).send(responseObject);
}));
