"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shop_schema_1 = require("./shop.schema");
const database_utilities_1 = require("../../utilities/database.utilities");
const create = (shop) => shop_schema_1.ShopModel.create(shop);
const find = (queryData) => shop_schema_1.ShopModel.aggregate((0, database_utilities_1.genericPipeline)(queryData));
// const find = (pipeline: PipelineStage[]) => ShopModel.aggregate(pipeline)
const findOne = (filterParam) => shop_schema_1.ShopModel.findOne(filterParam);
const update = (filterParam, data) => shop_schema_1.ShopModel.updateMany(filterParam, data);
const shopsRunningLow = (pipeline) => shop_schema_1.ShopModel.aggregate(pipeline);
const getOwnerLeaderboard = (pipeline) => shop_schema_1.ShopModel.aggregate(pipeline);
const getShopInventory = (pipeline) => shop_schema_1.ShopModel.aggregate(pipeline);
const findAllShops = (pipeline) => shop_schema_1.ShopModel.aggregate(pipeline);
exports.default = {
    create, find, findOne, update, shopsRunningLow, getOwnerLeaderboard, getShopInventory, findAllShops
};
