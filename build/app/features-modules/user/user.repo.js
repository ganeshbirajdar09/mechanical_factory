"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_schema_1 = require("./user.schema");
const create = (user) => user_schema_1.UserModel.create(user);
const find = (pipeline) => user_schema_1.UserModel.aggregate(pipeline);
const findOne = (filterParam) => user_schema_1.UserModel.findOne(filterParam);
const update = (filterParam, data) => user_schema_1.UserModel.updateMany(filterParam, data);
const getRewardInfo = (pipeline) => user_schema_1.UserModel.aggregate(pipeline);
const getOwnerLeaderboard = (pipeline) => user_schema_1.UserModel.aggregate(pipeline);
exports.default = {
    create, find, findOne, update, getRewardInfo, getOwnerLeaderboard
};
