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
const express_1 = require("express");
const authorize_1 = require("../../utilities/authorize");
const response_handler_1 = require("../../utilities/response-handler");
const constants_1 = require("../../utilities/constants");
const transaction_service_1 = __importDefault(require("./transaction.service"));
const transaction_validations_1 = require("./transaction.validations");
const database_utilities_1 = require("../../utilities/database.utilities");
const router = (0, express_1.Router)();
router.patch("/approve/redeem/:redeemId", (0, authorize_1.permit)([constants_1.ROLES.ADMIN]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield transaction_service_1.default.approveRedeemTransaction(req.params.redeemId);
        res.send(new response_handler_1.ResponseHandler(result));
    }
    catch (error) {
        next(error);
    }
}));
//all sales
router.get("/sales", (0, authorize_1.permit)([constants_1.ROLES.ADMIN]), database_utilities_1.PAGINATION_VALIDATIONS, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const queryData = req.query;
        const result = yield transaction_service_1.default.getAllTransactions(queryData);
        res.send(new response_handler_1.ResponseHandler(result));
    }
    catch (error) {
        next(error);
    }
}));
router.get("/sales/revenue", (0, authorize_1.permit)([constants_1.ROLES.ADMIN]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const queryData = req.query;
        const result = yield transaction_service_1.default.getRevenueByMonth(queryData);
        res.send(new response_handler_1.ResponseHandler(result));
    }
    catch (error) {
        next(error);
    }
}));
router.patch("/sales/status", (0, authorize_1.permit)([constants_1.ROLES.ADMIN]), transaction_validations_1.SALES_TRANSACTION_APPROVE_VALIDATIONS, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const status = req.body;
        const result = yield transaction_service_1.default.setSalesTransactionStatus(status);
        res.send(new response_handler_1.ResponseHandler(result));
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
