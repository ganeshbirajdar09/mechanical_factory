"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const product_schema_1 = require("./product.schema");
const create = (product) => product_schema_1.ProductModel.create(product);
const find = (pipeline) => product_schema_1.ProductModel.aggregate(pipeline);
const findOne = (filterParam) => product_schema_1.ProductModel.findOne(filterParam);
const update = (filterParam, data) => product_schema_1.ProductModel.updateMany(filterParam, data);
exports.default = {
    create, find, findOne, update
};
