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
const user_repo_1 = __importDefault(require("./user.repo"));
const auth_service_1 = __importDefault(require("../auth/auth.service"));
const database_utilities_1 = require("../../utilities/database.utilities");
const reward_pipelines_1 = require("../reward/reward.pipelines");
const user_pipelines_1 = require("./user.pipelines");
const create = (user) => __awaiter(void 0, void 0, void 0, function* () { return yield user_repo_1.default.create(user); });
const createOwner = (user) => __awaiter(void 0, void 0, void 0, function* () { return yield auth_service_1.default.createOwner(user); });
const find = (queryData) => __awaiter(void 0, void 0, void 0, function* () {
    const pipeline = (0, database_utilities_1.genericPipeline)(queryData);
    const result = yield user_repo_1.default.find(pipeline);
    const users = result.map((_a) => {
        var { password } = _a, user = __rest(_a, ["password"]);
        return user;
    });
    return users;
});
const findOne = (filterParam) => __awaiter(void 0, void 0, void 0, function* () { return yield user_repo_1.default.findOne(filterParam); });
const removeOwner = (ownerId) => __awaiter(void 0, void 0, void 0, function* () { return yield user_repo_1.default.update({ _id: ownerId }, { isDeleted: true }); });
const getRewardInfo = (queryData, ownerId) => __awaiter(void 0, void 0, void 0, function* () {
    const paginationPipeline = (0, database_utilities_1.genericPipeline)(queryData);
    const pipeline = (0, reward_pipelines_1.getRewardsEligible)(ownerId).concat(paginationPipeline);
    return yield user_repo_1.default.getRewardInfo(pipeline);
});
const getOwnerLeaderboard = (queryData) => __awaiter(void 0, void 0, void 0, function* () {
    const paginationPipeline = (0, database_utilities_1.genericPipeline)(queryData);
    const pipeline = (0, user_pipelines_1.onwerLeaderboardPipeline)().concat(paginationPipeline);
    return yield user_repo_1.default.getOwnerLeaderboard(pipeline);
});
const update = (filterParam, data) => __awaiter(void 0, void 0, void 0, function* () { return yield user_repo_1.default.update(filterParam, data); });
exports.default = {
    create, createOwner, find, findOne, removeOwner, update, getRewardInfo, getOwnerLeaderboard
};
