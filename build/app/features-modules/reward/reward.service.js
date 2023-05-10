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
const reward_repo_1 = __importDefault(require("./reward.repo"));
const reward_responses_1 = require("./reward.responses");
const user_service_1 = __importDefault(require("../user/user.service"));
const transaction_service_1 = __importDefault(require("../transaction/transaction.service"));
const shop_service_1 = __importDefault(require("../shop/shop.service"));
const transaction_responses_1 = require("../transaction/transaction.responses");
const constants_1 = require("../../utilities/constants");
const create = (reward) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = reward;
    const oldReward = yield reward_repo_1.default.findOne({ name: name });
    if (oldReward)
        throw reward_responses_1.REWARD_RESPONSES.ALREADY_EXISTS;
    return yield reward_repo_1.default.create(reward);
});
const findOne = (_id) => __awaiter(void 0, void 0, void 0, function* () { return yield reward_repo_1.default.findOne({ _id: _id }); });
const allRewards = (queryData) => __awaiter(void 0, void 0, void 0, function* () { return yield reward_repo_1.default.find(queryData); });
const getOwnerRewardInfo = (queryData, ownerId) => __awaiter(void 0, void 0, void 0, function* () { return yield user_service_1.default.getRewardInfo(queryData, ownerId); });
const ownerLeaderboard = (queryData) => __awaiter(void 0, void 0, void 0, function* () { return yield user_service_1.default.getOwnerLeaderboard(queryData); });
const shopLeaderboard = (queryData) => __awaiter(void 0, void 0, void 0, function* () { return yield shop_service_1.default.getShopLeaderboard(queryData); });
const rewardRequests = (ownerId) => __awaiter(void 0, void 0, void 0, function* () { return yield transaction_service_1.default.findRewardTransactions(ownerId); });
const updateReward = (filterParam, data) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield reward_repo_1.default.findOne({ _id: filterParam });
    if (!product)
        throw reward_responses_1.REWARD_RESPONSES.NOT_FOUND;
    const result = yield reward_repo_1.default.update({ _id: filterParam }, data);
    if (result.modifiedCount < 1)
        throw reward_responses_1.REWARD_RESPONSES.UPDATE_FAILURE;
    return reward_responses_1.REWARD_RESPONSES.UPDATE_SUCCESS;
});
const removeReward = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield reward_repo_1.default.update({ _id: id }, { isDeleted: true });
    if (result.modifiedCount < 1)
        throw reward_responses_1.REWARD_RESPONSES.DELETE_FAILURE;
    return reward_responses_1.REWARD_RESPONSES.DELETE_SUCCESS;
});
const redeemReward = (ownerId, rewardId) => __awaiter(void 0, void 0, void 0, function* () {
    const reward = yield reward_repo_1.default.findOne({ _id: rewardId });
    const owner = yield user_service_1.default.findOne({ _id: ownerId });
    if (!(owner === null || owner === void 0 ? void 0 : owner.points) && !(reward === null || reward === void 0 ? void 0 : reward.points))
        throw reward_responses_1.REWARD_RESPONSES.NOT_FOUND;
    if ((owner === null || owner === void 0 ? void 0 : owner.points) - (reward === null || reward === void 0 ? void 0 : reward.points) < 0)
        throw reward_responses_1.REWARD_RESPONSES.INSUFFICIENT_POINTS;
    const transactionObject = {
        type: "reward",
        ownerId: owner === null || owner === void 0 ? void 0 : owner._id,
        reward: reward === null || reward === void 0 ? void 0 : reward._id,
        currentRewardPoints: reward === null || reward === void 0 ? void 0 : reward.points,
    };
    yield transaction_service_1.default.create(transactionObject);
    return reward_responses_1.REWARD_RESPONSES.SUCCESSFULL_REDEEM_REQUESTED;
});
const deleteRedeemRequest = (ownerId, requestId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const rewardTransaction = yield transaction_service_1.default.findOne({ _id: requestId });
    if (!rewardTransaction)
        throw transaction_responses_1.TRANSACTION_RESPONSES.NOT_FOUND;
    if (((_a = rewardTransaction.status) === null || _a === void 0 ? void 0 : _a.toString()) == constants_1.TRANSACTION_STATUSES.APPROVED)
        throw transaction_responses_1.TRANSACTION_RESPONSES.REDEEM_ALREADY_APPROVED;
    yield transaction_service_1.default.update({ _id: rewardTransaction._id }, { isDeleted: true });
    yield user_service_1.default.update({ _id: ownerId }, { $inc: { points: rewardTransaction.currentRewardPoints } });
    return reward_responses_1.REWARD_RESPONSES.REDEEM_REQUEST_DELETE_SUCCESS;
});
exports.default = {
    create, findOne, updateReward, rewardRequests, deleteRedeemRequest, removeReward, redeemReward, allRewards, getOwnerRewardInfo, ownerLeaderboard, shopLeaderboard
};
