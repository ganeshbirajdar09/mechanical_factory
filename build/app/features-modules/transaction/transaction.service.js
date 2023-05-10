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
const constants_1 = require("../../utilities/constants");
const database_utilities_1 = require("../../utilities/database.utilities");
const reward_service_1 = __importDefault(require("../reward/reward.service"));
const shop_service_1 = __importDefault(require("../shop/shop.service"));
const user_service_1 = __importDefault(require("../user/user.service"));
const transaction_repo_1 = __importDefault(require("./transaction.repo"));
const transaction_responses_1 = require("./transaction.responses");
const transaction_pipelines_1 = require("./transaction.pipelines");
const shop_responses_1 = require("../shop/shop.responses");
const product_service_1 = __importDefault(require("../product/product.service"));
const create = (transaction) => __awaiter(void 0, void 0, void 0, function* () { return yield transaction_repo_1.default.create(transaction); });
const findOne = (filterParam) => __awaiter(void 0, void 0, void 0, function* () { return yield transaction_repo_1.default.findOne(filterParam); });
const update = (filterParam, data) => __awaiter(void 0, void 0, void 0, function* () { return yield transaction_repo_1.default.update(filterParam, data); });
const findSalesTransactions = (shopId) => __awaiter(void 0, void 0, void 0, function* () { return yield transaction_repo_1.default.findTransactions({ type: 'sales', shopId: shopId }); });
const findRewardTransactions = (ownerId) => __awaiter(void 0, void 0, void 0, function* () { return yield transaction_repo_1.default.findTransactions({ type: 'reward', ownerId: ownerId }); });
const getAllTransactions = (queryData) => {
    const pipeline = (0, transaction_pipelines_1.getAllSales)(queryData);
    return transaction_repo_1.default.find(pipeline);
};
const registerSales = (shopId, salesData) => __awaiter(void 0, void 0, void 0, function* () {
    const shop = yield shop_service_1.default.findOne({ _id: shopId });
    const inventory = shop === null || shop === void 0 ? void 0 : shop.inventory;
    let netSales = 0;
    for (let item of salesData) {
        const { quantity, productId } = item;
        const product = inventory === null || inventory === void 0 ? void 0 : inventory.find((prod) => prod.productId.toString() == item.productId.toString());
        if (product && (quantity <= product.quantity)) {
            const productFromInventory = yield product_service_1.default.findOne(productId);
            netSales += Number(quantity) * Number(productFromInventory === null || productFromInventory === void 0 ? void 0 : productFromInventory.price);
            yield shop_service_1.default.update({ "inventory.productId": item.productId }, { $inc: { "inventory.$.quantity": quantity * -1 } });
        }
        else {
            throw shop_responses_1.SHOP_RESPONSE.INSUFFICIENT_QUANTITY;
        }
    }
    const transactionObject = {
        type: "sales",
        shopId: shop === null || shop === void 0 ? void 0 : shop._id,
        products: salesData,
        netSales: netSales
    };
    const result = yield transaction_repo_1.default.create(transactionObject);
    if (!result)
        transaction_responses_1.TRANSACTION_RESPONSES.SOMETHING_WENT_WRONG;
    return shop_responses_1.SHOP_RESPONSE.SUCCESSFULL_SALES_REGISTRATION;
});
const editSales = (shopId, salesData) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { salesId, products } = salesData;
    const salesTransaction = yield transaction_repo_1.default.findOne({ _id: salesId });
    if (((_a = salesTransaction === null || salesTransaction === void 0 ? void 0 : salesTransaction.shopId) === null || _a === void 0 ? void 0 : _a.toString()) !== shopId.toString())
        return transaction_responses_1.TRANSACTION_RESPONSES.NOT_FOUND;
    if (((_b = salesTransaction === null || salesTransaction === void 0 ? void 0 : salesTransaction.status) === null || _b === void 0 ? void 0 : _b.toString()) === constants_1.TRANSACTION_STATUSES.APPROVED)
        throw transaction_responses_1.TRANSACTION_RESPONSES.SALES_ALREADY_APPROVED;
    const result = yield transaction_repo_1.default.update({ _id: salesTransaction === null || salesTransaction === void 0 ? void 0 : salesTransaction._id }, { $set: { products: products } });
    if (result.modifiedCount < 1)
        throw transaction_responses_1.TRANSACTION_RESPONSES.SALES_EDIT_FAILURE;
    return transaction_responses_1.TRANSACTION_RESPONSES.SALES_EDIT_SUCCESS;
});
const deleteSales = (salesId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield transaction_repo_1.default.update({ _id: salesId }, { isDeleted: true });
    if (result.modifiedCount < 1)
        throw transaction_responses_1.TRANSACTION_RESPONSES.DELETE_FAILURE;
    return transaction_responses_1.TRANSACTION_RESPONSES.DELETE_SUCCESS;
});
const getRevenueByMonth = (queryData) => __awaiter(void 0, void 0, void 0, function* () {
    const pipeline = (0, transaction_pipelines_1.getMontlySales)(queryData);
    let { from, to, shopId, status } = queryData;
    const transactionData = yield transaction_repo_1.default.find(pipeline);
    const { revenue, totalRedeemPoints, _id } = transactionData[0];
    const shop = yield shop_service_1.default.findOne({ _id: _id });
    if ((status === null || status === void 0 ? void 0 : status.toLowerCase()) === "approve") {
        yield transaction_repo_1.default.update({ shopId: shopId, createdAt: { $gte: new Date(from), $lte: new Date(to) } }, { $set: { status: constants_1.TRANSACTION_STATUSES.APPROVED } });
        yield shop_service_1.default.incrementShopPoints(shop === null || shop === void 0 ? void 0 : shop._id, revenue, totalRedeemPoints);
        yield user_service_1.default.update({ _id: shop === null || shop === void 0 ? void 0 : shop.ownerId }, { $inc: { points: totalRedeemPoints } });
    }
    if ((status === null || status === void 0 ? void 0 : status.toLowerCase()) === "reject") {
        yield transaction_repo_1.default.update({ shopId: shopId, createdAt: { $gte: new Date(from), $lte: new Date(to) } }, { $set: { status: constants_1.TRANSACTION_STATUSES.REJECTED } });
    }
    return transactionData;
});
const approveRedeemTransaction = (redeemId) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield transaction_repo_1.default.findOne({ _id: redeemId });
    if (transaction && transaction.type !== "reward")
        throw transaction_responses_1.TRANSACTION_RESPONSES.NOT_FOUND;
    const owner = yield user_service_1.default.findOne({ _id: transaction === null || transaction === void 0 ? void 0 : transaction.ownerId });
    const reward = yield reward_service_1.default.findOne(transaction === null || transaction === void 0 ? void 0 : transaction.reward);
    const updatedOwnerPoints = (owner === null || owner === void 0 ? void 0 : owner.points) - (reward === null || reward === void 0 ? void 0 : reward.points);
    yield user_service_1.default.update({ _id: owner === null || owner === void 0 ? void 0 : owner._id }, { points: updatedOwnerPoints });
    yield user_service_1.default.update({ _id: owner === null || owner === void 0 ? void 0 : owner._id }, { $push: { rewards: reward === null || reward === void 0 ? void 0 : reward._id } });
    yield transaction_repo_1.default.update({ _id: transaction === null || transaction === void 0 ? void 0 : transaction._id }, { $set: { status: constants_1.TRANSACTION_STATUSES.APPROVED } });
    return transaction_responses_1.TRANSACTION_RESPONSES.REDEEM_REQUEST_APPROVED;
});
const setSalesTransactionStatus = (status) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    const transaction = yield transaction_repo_1.default.findOne({ _id: status.salesId });
    if (transaction && ((_c = transaction.status) === null || _c === void 0 ? void 0 : _c.toString()) == constants_1.TRANSACTION_STATUSES.APPROVED)
        throw transaction_responses_1.TRANSACTION_RESPONSES.SALES_ALREADY_APPROVED;
    const products = transaction === null || transaction === void 0 ? void 0 : transaction.products;
    if (transaction && transaction.type != "sales")
        throw transaction_responses_1.TRANSACTION_RESPONSES.NOT_FOUND;
    if (status.status.toString() == constants_1.TRANSACTION_STATUSES.REJECTED) {
        if (((_d = transaction === null || transaction === void 0 ? void 0 : transaction.status) === null || _d === void 0 ? void 0 : _d.toString()) == constants_1.TRANSACTION_STATUSES.REJECTED)
            throw transaction_responses_1.TRANSACTION_RESPONSES.SALES_ALREADY_REJECTED;
        yield transaction_repo_1.default.update({ _id: transaction === null || transaction === void 0 ? void 0 : transaction._id }, { $set: { status: constants_1.TRANSACTION_STATUSES.REJECTED } });
        return transaction_responses_1.TRANSACTION_RESPONSES.SALES_TRANSACTION_REJECTED;
    }
    const shop = yield shop_service_1.default.findOne({ _id: transaction === null || transaction === void 0 ? void 0 : transaction.shopId });
    const owner = yield user_service_1.default.findOne({ _id: shop === null || shop === void 0 ? void 0 : shop.ownerId });
    const redeemPointsArray = yield transaction_repo_1.default.getPointsToBeRedeemed(status.salesId);
    if (redeemPointsArray.length == 0) {
        yield shop_service_1.default.incrementShopPoints(shop === null || shop === void 0 ? void 0 : shop._id, transaction === null || transaction === void 0 ? void 0 : transaction.netSales, 0);
    }
    else {
        yield shop_service_1.default.incrementShopPoints(shop === null || shop === void 0 ? void 0 : shop._id, transaction === null || transaction === void 0 ? void 0 : transaction.netSales, redeemPointsArray[0].totalRedeemPoints);
        yield user_service_1.default.update({ _id: owner === null || owner === void 0 ? void 0 : owner._id }, { $inc: { points: redeemPointsArray[0].totalRedeemPoints } });
    }
    yield shop_service_1.default.updatedQuantityInInventory(shop === null || shop === void 0 ? void 0 : shop._id, products, "sales");
    yield transaction_repo_1.default.update({ _id: transaction === null || transaction === void 0 ? void 0 : transaction._id }, { $set: { status: constants_1.TRANSACTION_STATUSES.APPROVED } });
    return transaction_responses_1.TRANSACTION_RESPONSES.SALES_TRANSACTION_APPROVED;
});
const productWiseTransactionDetails = (queryData) => __awaiter(void 0, void 0, void 0, function* () {
    const paginationPipeline = (0, database_utilities_1.genericPipeline)(queryData);
    const pipeline = (0, transaction_pipelines_1.getTopSellingProducts)().concat(paginationPipeline);
    return yield transaction_repo_1.default.productWiseTransactionDetails(pipeline);
});
const getTransactionById = (id) => __awaiter(void 0, void 0, void 0, function* () { return yield transaction_repo_1.default.findOne({ _id: id }); });
exports.default = {
    create, findOne, registerSales, update, editSales, deleteSales, findSalesTransactions, findRewardTransactions, getTransactionById, getRevenueByMonth, getAllTransactions, approveRedeemTransaction, setSalesTransactionStatus, productWiseTransactionDetails
};
