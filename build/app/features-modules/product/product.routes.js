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
const response_handler_1 = require("../../utilities/response-handler");
const product_validations_1 = require("./product.validations");
const product_service_1 = __importDefault(require("./product.service"));
const authorize_1 = require("../../utilities/authorize");
const constants_1 = require("../../utilities/constants");
const database_utilities_1 = require("../../utilities/database.utilities");
const router = (0, express_1.Router)();
router.get("/", (0, authorize_1.permit)([constants_1.ROLES.ADMIN, constants_1.ROLES.OWNER]), database_utilities_1.PAGINATION_VALIDATIONS, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const queryData = req.query;
        const result = yield product_service_1.default.find(queryData);
        res.send(new response_handler_1.ResponseHandler(result));
    }
    catch (error) {
        next(error);
    }
}));
//highest selling
router.get("/sales", (0, authorize_1.permit)([constants_1.ROLES.ADMIN]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const queryData = req.query;
        const result = yield product_service_1.default.productWiseHighestSellers(queryData);
        res.send(new response_handler_1.ResponseHandler(result));
    }
    catch (error) {
        next(error);
    }
}));
router.post("/create", (0, authorize_1.permit)([constants_1.ROLES.ADMIN]), product_validations_1.ADD_PRODUCT_VALIDATIONS, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = req.body;
        const result = yield product_service_1.default.create(product);
        res.send(new response_handler_1.ResponseHandler(result));
    }
    catch (error) {
        next(error);
    }
}));
router.patch("/update", (0, authorize_1.permit)([constants_1.ROLES.ADMIN]), product_validations_1.PRODUCT_UPDATE_VALIDATIONS, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _a = req.body, { _id } = _a, data = __rest(_a, ["_id"]);
        const result = yield product_service_1.default.updateProduct(_id, data);
        res.send(new response_handler_1.ResponseHandler(result));
    }
    catch (error) {
        next(error);
    }
}));
router.delete("/:id", (0, authorize_1.permit)([constants_1.ROLES.ADMIN]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield product_service_1.default.removeProduct(id);
        res.send(new response_handler_1.ResponseHandler(result));
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
