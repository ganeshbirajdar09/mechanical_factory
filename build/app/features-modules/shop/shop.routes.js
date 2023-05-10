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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authorize_1 = require("../../utilities/authorize");
const response_handler_1 = require("../../utilities/response-handler");
const shop_service_1 = __importDefault(require("./shop.service"));
const constants_1 = require("../../utilities/constants");
const shop_validations_1 = require("./shop.validations");
const database_utilities_1 = require("../../utilities/database.utilities");
const router = (0, express_1.Router)();
router.get("/all", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield shop_service_1.default.allShops();
        res.send(new response_handler_1.ResponseHandler(result));
    }
    catch (error) {
        next(error);
    }
}));
//get all admin
router.get("/", (0, authorize_1.permit)([constants_1.ROLES.ADMIN]), database_utilities_1.PAGINATION_VALIDATIONS, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const queryData = req.query;
        const result = yield shop_service_1.default.find(queryData);
        res.send(new response_handler_1.ResponseHandler(result));
    }
    catch (error) {
        next(error);
    }
}));
//shops running low
router.get("/status", (0, authorize_1.permit)([constants_1.ROLES.ADMIN]), database_utilities_1.PAGINATION_VALIDATIONS, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const queryData = req.query;
        const result = yield shop_service_1.default.shopsRunningLow(queryData);
        res.send(new response_handler_1.ResponseHandler(result));
    }
    catch (error) {
        next(error);
    }
}));
router.post("/create", (0, authorize_1.permit)([constants_1.ROLES.ADMIN]), shop_validations_1.CREATE_SHOP_VALIDATIONS, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _a = req.body, { name, email, password } = _a, shop = __rest(_a, ["name", "email", "password"]);
        const result = yield shop_service_1.default.create({ name, email, password }, shop);
        res.send(new response_handler_1.ResponseHandler(result));
    }
    catch (error) {
        next(error);
    }
}));
//sales
router.get("/sales", (0, authorize_1.permit)([constants_1.ROLES.OWNER]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: ownerId } = res.locals.user;
        const result = yield shop_service_1.default.salesRequests(ownerId);
        res.send(new response_handler_1.ResponseHandler(result));
    }
    catch (error) {
        next(error);
    }
}));
router.post("/sales", (0, authorize_1.permit)([constants_1.ROLES.OWNER]), shop_validations_1.GENERATE_SALES_VALIDATIONS, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { salesData } = req.body;
        const { id: ownerId } = res.locals.user;
        const result = yield shop_service_1.default.salesEntry(ownerId, salesData);
        res.send(new response_handler_1.ResponseHandler(result));
    }
    catch (error) {
        next(error);
    }
}));
router.patch("/sales", (0, authorize_1.permit)([constants_1.ROLES.OWNER]), shop_validations_1.EDIT_SALES_VALIDATIONS, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const salesData = req.body;
        const { id: ownerId } = res.locals.user;
        const result = yield shop_service_1.default.editSales(ownerId, salesData);
        res.send(new response_handler_1.ResponseHandler(result));
    }
    catch (error) {
        next(error);
    }
}));
router.delete("/sales", (0, authorize_1.permit)([constants_1.ROLES.OWNER]), shop_validations_1.DELETE_SALES_VALIDATIONS, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { salesId } = req.body;
        const { id: ownerId } = res.locals.user;
        const result = yield shop_service_1.default.deleteSales(ownerId, salesId);
        res.send(new response_handler_1.ResponseHandler(result));
    }
    catch (error) {
        next(error);
    }
}));
// update shop
router.patch("/:id", (0, authorize_1.permit)([constants_1.ROLES.ADMIN]), shop_validations_1.UPDATE_SHOP_VALIDATIONS, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { location } = req.body;
        const result = yield shop_service_1.default.updateShopDetails(req.params.id, location);
        res.send(new response_handler_1.ResponseHandler(result));
    }
    catch (error) {
        next(error);
    }
}));
router.delete("/:id", (0, authorize_1.permit)([constants_1.ROLES.ADMIN]), shop_validations_1.DELETE_SHOP_VALIDATIONS, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield shop_service_1.default.removeShopWithOwner(req.params.id);
        res.send(new response_handler_1.ResponseHandler(result));
    }
    catch (error) {
        next(error);
    }
}));
router.get("/:id/inventory", (0, authorize_1.permit)([constants_1.ROLES.ADMIN, constants_1.ROLES.OWNER]), database_utilities_1.PAGINATION_VALIDATIONS, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const queryData = req.query;
        const result = yield shop_service_1.default.getInventory(req.params.id, queryData);
        res.send(new response_handler_1.ResponseHandler(result));
    }
    catch (error) {
        next(error);
    }
}));
router.get("/:id", (0, authorize_1.permit)([constants_1.ROLES.ADMIN, constants_1.ROLES.OWNER]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield shop_service_1.default.findShop(req.params.id);
        res.send(new response_handler_1.ResponseHandler(result));
    }
    catch (error) {
        next(error);
    }
}));
router.post("/review", shop_validations_1.REVIEW_VALIDATIONS, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reviewData = req.body;
        const result = yield shop_service_1.default.rateShop(reviewData);
        res.send(new response_handler_1.ResponseHandler(result));
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
