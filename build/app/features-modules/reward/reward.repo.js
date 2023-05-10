"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reward_schema_1 = require("./reward.schema");
const database_utilities_1 = require("../../utilities/database.utilities");
const create = (reward) => reward_schema_1.RewardModel.create(reward);
const find = (queryData) => reward_schema_1.RewardModel.aggregate((0, database_utilities_1.genericPipeline)(queryData));
const findOne = (filterParam) => reward_schema_1.RewardModel.findOne(filterParam);
const update = (filterParam, data) => reward_schema_1.RewardModel.updateMany(filterParam, data);
exports.default = {
    create, find, findOne, update
};
