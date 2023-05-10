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
const response_handler_1 = require("../../utilities/response-handler");
const order_service_1 = __importDefault(require("./order.service"));
const order_validations_1 = require("./order.validations");
const authorize_1 = require("../../utilities/authorize");
const constants_1 = require("../../utilities/constants");
const database_utilities_1 = require("../../utilities/database.utilities");
const router = (0, express_1.Router)();
//owners orders
router.get("/", (0, authorize_1.permit)([constants_1.ROLES.OWNER]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = res.locals.user;
        const result = yield order_service_1.default.findOrdersByShop(id);
        res.send(new response_handler_1.ResponseHandler(result));
    }
    catch (error) {
        next(error);
    }
}));
router.post("/create", (0, authorize_1.permit)([constants_1.ROLES.OWNER]), order_validations_1.CREATE_ORDER_VALIDATIONS, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = req.body;
        const { id } = res.locals.user;
        const result = yield order_service_1.default.create(order, id);
        res.send(new response_handler_1.ResponseHandler(result));
    }
    catch (error) {
        next(error);
    }
}));
router.patch("/edit", (0, authorize_1.permit)([constants_1.ROLES.OWNER]), order_validations_1.UPDATE_ORDER_VALIDATIONS, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderData = req.body;
        const { id: ownerId } = res.locals.user;
        const result = yield order_service_1.default.onwerEditOrder(ownerId, orderData);
        res.send(new response_handler_1.ResponseHandler(result));
    }
    catch (error) {
        next(error);
    }
}));
router.delete("/remove", (0, authorize_1.permit)([constants_1.ROLES.OWNER]), order_validations_1.DELETE_ORDER_VALIDATIONS, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.body;
        const { id: ownerId } = res.locals.user;
        const result = yield order_service_1.default.removeOrder(ownerId, orderId);
        res.send(new response_handler_1.ResponseHandler(result));
    }
    catch (error) {
        next(error);
    }
}));
router.get("/all", (0, authorize_1.permit)([constants_1.ROLES.ADMIN]), database_utilities_1.PAGINATION_VALIDATIONS, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const queryData = req.query;
        const result = yield order_service_1.default.findAll(queryData);
        res.send(new response_handler_1.ResponseHandler(result));
    }
    catch (error) {
        next(error);
    }
}));
//approve
router.patch("/status", (0, authorize_1.permit)([constants_1.ROLES.ADMIN]), order_validations_1.CHANGE_ORDER_STATUS_VALIDATIONS, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id, productId } = req.body;
        const result = yield order_service_1.default.approveOrder(_id, productId);
        res.send(new response_handler_1.ResponseHandler(result));
    }
    catch (error) {
        next(error);
    }
}));
router.get("/:id", (0, authorize_1.permit)([constants_1.ROLES.ADMIN, constants_1.ROLES.OWNER]), order_validations_1.ORDER_BY_ID_VALIDATIONS, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield order_service_1.default.findOne(req.params.id);
        res.send(new response_handler_1.ResponseHandler(result));
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
