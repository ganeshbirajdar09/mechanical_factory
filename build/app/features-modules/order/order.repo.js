"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const order_schema_1 = require("./order.schema");
const database_utilities_1 = require("../../utilities/database.utilities");
const create = (product) => order_schema_1.OrderModel.create(product);
const find = (queryData) => order_schema_1.OrderModel.aggregate((0, database_utilities_1.genericPipeline)(queryData));
const findOne = (filterParam) => order_schema_1.OrderModel.findOne(filterParam);
const findOrdersByShop = (shopId) => order_schema_1.OrderModel.find({ shopId: shopId });
const update = (filterParam, data) => order_schema_1.OrderModel.updateMany(filterParam, data);
exports.default = {
    create, find, findOne, update, findOrdersByShop
};
