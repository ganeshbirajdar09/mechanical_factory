"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transaction_schema_1 = require("./transaction.schema");
const transaction_pipelines_1 = require("./transaction.pipelines");
const create = (transaction) => transaction_schema_1.TransactionModel.create(transaction);
const findTransactions = (filterParam) => transaction_schema_1.TransactionModel.find(filterParam);
const find = (pipeline) => transaction_schema_1.TransactionModel.aggregate(pipeline);
const findOne = (filterParam) => transaction_schema_1.TransactionModel.findOne(filterParam);
const update = (filterParam, data) => transaction_schema_1.TransactionModel.updateMany(filterParam, data);
const getPointsToBeRedeemed = (salesId) => transaction_schema_1.TransactionModel.aggregate((0, transaction_pipelines_1.calculateRedeemPoints)(salesId));
// const productWiseTransactionDetails = () => TransactionModel.aggregate()
const productWiseTransactionDetails = (pipeline) => transaction_schema_1.TransactionModel.aggregate(pipeline);
exports.default = {
    create, find, findOne, update, findTransactions, getPointsToBeRedeemed, productWiseTransactionDetails
};
