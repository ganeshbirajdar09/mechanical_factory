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
const constants_1 = require("../../utilities/constants");
const reward_service_1 = __importDefault(require("./reward.service"));
const reward_validations_1 = require("./reward.validations");
const database_utilities_1 = require("../../utilities/database.utilities");
const router = (0, express_1.Router)();
router.get("/all", (0, authorize_1.permit)([constants_1.ROLES.ADMIN, constants_1.ROLES.OWNER]), database_utilities_1.PAGINATION_VALIDATIONS, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const queryData = req.query;
        const result = yield reward_service_1.default.allRewards(queryData);
        res.send(new response_handler_1.ResponseHandler(result));
    }
    catch (error) {
        next(error);
    }
}));
router.get("/leaderboard/owners", (0, authorize_1.permit)([constants_1.ROLES.ADMIN, constants_1.ROLES.OWNER]), database_utilities_1.PAGINATION_VALIDATIONS, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const queryData = req.query;
        const result = yield reward_service_1.default.ownerLeaderboard(queryData);
        res.send(new response_handler_1.ResponseHandler(result));
    }
    catch (error) {
        next(error);
    }
}));
router.get("/leaderboard/shops", (0, authorize_1.permit)([constants_1.ROLES.ADMIN, constants_1.ROLES.OWNER]), database_utilities_1.PAGINATION_VALIDATIONS, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const queryData = req.query;
        const result = yield reward_service_1.default.shopLeaderboard(queryData);
        res.send(new response_handler_1.ResponseHandler(result));
    }
    catch (error) {
        next(error);
    }
}));
//eligible rewards for owner
router.get("/", (0, authorize_1.permit)([constants_1.ROLES.OWNER]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const queryData = req.query;
        const { id } = res.locals.user;
        const result = yield reward_service_1.default.getOwnerRewardInfo(queryData, id);
        res.send(new response_handler_1.ResponseHandler(result));
    }
    catch (error) {
        next(error);
    }
}));
router.post("/redeem", (0, authorize_1.permit)([constants_1.ROLES.OWNER]), reward_validations_1.REDEEM_REWARD_VALIDATIONS, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rewardId } = req.body;
        const { id } = res.locals.user;
        const result = yield reward_service_1.default.redeemReward(id, rewardId);
        res.send(new response_handler_1.ResponseHandler(result));
    }
    catch (error) {
        next(error);
    }
}));
router.delete("/redeem", (0, authorize_1.permit)([constants_1.ROLES.OWNER]), reward_validations_1.DELETE_REDEEM_REQUEST_VALIDATIONS, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { requestId } = req.body;
        const { id } = res.locals.user;
        const result = yield reward_service_1.default.deleteRedeemRequest(id, requestId);
        res.send(new response_handler_1.ResponseHandler(result));
    }
    catch (error) {
        next(error);
    }
}));
router.post("/create", (0, authorize_1.permit)([constants_1.ROLES.ADMIN]), reward_validations_1.ADD_REWARD_VALIDATIONS, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reward = req.body;
        const result = yield reward_service_1.default.create(reward);
        res.send(new response_handler_1.ResponseHandler(result));
    }
    catch (error) {
        next(error);
    }
}));
router.patch("/update", (0, authorize_1.permit)([constants_1.ROLES.ADMIN]), reward_validations_1.UDPATE_REWARD_VALIDATIONS, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _a = req.body, { _id } = _a, data = __rest(_a, ["_id"]);
        const result = yield reward_service_1.default.updateReward(_id, data);
        res.send(new response_handler_1.ResponseHandler(result));
    }
    catch (error) {
        next(error);
    }
}));
router.get("/requests", (0, authorize_1.permit)([constants_1.ROLES.ADMIN, constants_1.ROLES.OWNER]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = res.locals.user;
        const result = yield reward_service_1.default.rewardRequests(id);
        res.send(new response_handler_1.ResponseHandler(result));
    }
    catch (error) {
        next(error);
    }
}));
router.get("/:id", (0, authorize_1.permit)([constants_1.ROLES.ADMIN, constants_1.ROLES.OWNER]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield reward_service_1.default.findOne(id);
        res.send(new response_handler_1.ResponseHandler(result));
    }
    catch (error) {
        next(error);
    }
}));
router.delete("/:id", (0, authorize_1.permit)([constants_1.ROLES.ADMIN]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield reward_service_1.default.removeReward(id);
        res.send(new response_handler_1.ResponseHandler(result));
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
