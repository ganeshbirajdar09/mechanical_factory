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
const auth_service_1 = __importDefault(require("../auth/auth.service"));
const shop_repo_1 = __importDefault(require("./shop.repo"));
const transaction_service_1 = __importDefault(require("../transaction/transaction.service"));
const shop_responses_1 = require("./shop.responses");
const database_utilities_1 = require("../../utilities/database.utilities");
const shop_pipelines_1 = require("./shop.pipelines");
const user_service_1 = __importDefault(require("../user/user.service"));
const transaction_responses_1 = require("../transaction/transaction.responses");
const constants_1 = require("../../utilities/constants");
const create = (userData, shop) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_service_1.default.createOwner(userData);
    shop.ownerId = user._id;
    return yield shop_repo_1.default.create(shop);
});
const find = (queryData) => __awaiter(void 0, void 0, void 0, function* () { return yield shop_repo_1.default.find(queryData); });
const findOne = (filterParam) => __awaiter(void 0, void 0, void 0, function* () { return yield shop_repo_1.default.findOne(filterParam); });
const update = (filterParam, data) => __awaiter(void 0, void 0, void 0, function* () { return yield shop_repo_1.default.update(filterParam, data); });
const updateShopDetails = (shopId, location) => __awaiter(void 0, void 0, void 0, function* () { return yield shop_repo_1.default.update({ _id: shopId }, { $set: { location: location } }); });
const getInventory = (shopId, queryData) => __awaiter(void 0, void 0, void 0, function* () {
    const shop = yield shop_repo_1.default.findOne({ _id: shopId });
    if (!shop)
        throw shop_responses_1.SHOP_RESPONSE.NOT_FOUND;
    const paginationPipeline = (0, database_utilities_1.genericPipeline)(queryData);
    const pipeline = ((0, shop_pipelines_1.getShopInventory)(shopId)).concat(paginationPipeline);
    return yield shop_repo_1.default.getShopInventory(pipeline);
});
const salesRequests = (ownerId) => __awaiter(void 0, void 0, void 0, function* () {
    const shop = yield shop_repo_1.default.findOne({ ownerId: ownerId });
    if (!shop)
        throw shop_responses_1.SHOP_RESPONSE.NOT_FOUND;
    return yield transaction_service_1.default.findSalesTransactions(shop._id);
});
const removeShopWithOwner = (shopId) => __awaiter(void 0, void 0, void 0, function* () {
    const shop = yield shop_repo_1.default.findOne({ _id: shopId });
    if (!shop)
        throw shop_responses_1.SHOP_RESPONSE.NOT_FOUND;
    yield user_service_1.default.removeOwner(shop.ownerId);
    yield shop_repo_1.default.update({ _id: shopId }, { isDeleted: true });
    return shop_responses_1.SHOP_RESPONSE.DELETE_SUCCESS;
});
const shopsRunningLow = (queryData) => __awaiter(void 0, void 0, void 0, function* () {
    const paginationPipeline = (0, database_utilities_1.genericPipeline)(queryData);
    const pipeline = (0, shop_pipelines_1.getShopsLowOnProducts)().concat(paginationPipeline);
    return yield shop_repo_1.default.shopsRunningLow(pipeline);
});
const getShopLeaderboard = (queryData) => __awaiter(void 0, void 0, void 0, function* () {
    const paginationPipeline = (0, database_utilities_1.genericPipeline)(queryData);
    const pipeline = ((0, shop_pipelines_1.shopLeaderboardPipeline)()).concat(paginationPipeline);
    return yield shop_repo_1.default.getOwnerLeaderboard(pipeline);
});
const updateInventoryOnOrder = (shopId, products) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const shop = yield shop_repo_1.default.findOne({ _id: shopId });
    for (let product of products) {
        const oldProduct = (_a = shop === null || shop === void 0 ? void 0 : shop.inventory) === null || _a === void 0 ? void 0 : _a.find(item => item.productId.toString() == product.productId.toString());
        if (!oldProduct)
            yield shop_repo_1.default.update({ _id: shop === null || shop === void 0 ? void 0 : shop._id }, { $push: { inventory: product } });
        else {
            const updatedQuantity = oldProduct.quantity + product.quantity;
            yield shop_repo_1.default.update({ _id: shop === null || shop === void 0 ? void 0 : shop._id, "inventory.productId": oldProduct.productId }, { $set: { "inventory.$.quantity": updatedQuantity } });
        }
    }
});
const updatedQuantityInInventory = (_id, products, type = "") => __awaiter(void 0, void 0, void 0, function* () {
    const shop = yield shop_repo_1.default.findOne({ _id: _id });
    if (!(shop === null || shop === void 0 ? void 0 : shop.inventory))
        throw shop_responses_1.SHOP_RESPONSE.NOT_FOUND;
    for (let product of products) {
        const oldProduct = shop.inventory.find(item => item.productId == product.productId.toString());
        if (!oldProduct) {
            yield shop_repo_1.default.update({ _id: shop._id }, { $push: { inventory: product } });
        }
        else {
            let updatedQuantity = (type == "sales") ? oldProduct.quantity - product.quantity : oldProduct.quantity + product.quantity;
            yield shop_repo_1.default.update({ _id: shop._id, "inventory.productId": oldProduct.productId }, { $set: { "inventory.$.quantity": updatedQuantity } });
        }
    }
});
const salesEntry = (ownerId, salesData) => __awaiter(void 0, void 0, void 0, function* () {
    const shop = yield shop_repo_1.default.findOne({ ownerId: ownerId });
    if (!shop)
        throw shop_responses_1.SHOP_RESPONSE.NOT_FOUND;
    return yield transaction_service_1.default.registerSales(shop._id, salesData);
});
const editSales = (ownerId, salesData) => __awaiter(void 0, void 0, void 0, function* () {
    const shop = yield shop_repo_1.default.findOne({ ownerId: ownerId });
    if (!shop)
        throw shop_responses_1.SHOP_RESPONSE.NOT_FOUND;
    return yield transaction_service_1.default.editSales(shop === null || shop === void 0 ? void 0 : shop._id, salesData);
});
const deleteSales = (ownerId, salesId) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d;
    const shop = yield shop_repo_1.default.findOne({ ownerId: ownerId });
    if (!shop)
        throw shop_responses_1.SHOP_RESPONSE.NOT_FOUND;
    const salesTransaction = yield transaction_service_1.default.findOne({ _id: salesId });
    if (((_b = salesTransaction === null || salesTransaction === void 0 ? void 0 : salesTransaction.shopId) === null || _b === void 0 ? void 0 : _b.toString()) !== shop._id.toString())
        return transaction_responses_1.TRANSACTION_RESPONSES.NOT_FOUND;
    if (((_c = salesTransaction === null || salesTransaction === void 0 ? void 0 : salesTransaction.status) === null || _c === void 0 ? void 0 : _c.toString()) === constants_1.TRANSACTION_STATUSES.APPROVED)
        throw transaction_responses_1.TRANSACTION_RESPONSES.SALES_ALREADY_APPROVED;
    if (salesTransaction.products) {
        for (let product of salesTransaction.products) {
            const { productId, quantity } = product;
            const oldProduct = (_d = shop.inventory) === null || _d === void 0 ? void 0 : _d.find(prod => { var _a; return ((_a = prod.productId) === null || _a === void 0 ? void 0 : _a.toString()) == productId.toString(); });
            if (oldProduct) {
                yield shop_repo_1.default.update({ _id: shop._id, "inventory.productId": productId }, { $inc: { "inventory.$.quantity": quantity } });
            }
            else {
                yield shop_repo_1.default.update({ _id: shop._id, "inventory.productId": productId }, { $set: { "inventory.$.quantity": quantity } });
            }
        }
    }
    return yield transaction_service_1.default.deleteSales(salesId);
});
const rateShop = (reviewData) => __awaiter(void 0, void 0, void 0, function* () {
    yield shop_repo_1.default.update({ _id: reviewData.shopId }, { $push: { reviews: reviewData.rating } });
    yield shop_repo_1.default.update({ _id: reviewData.shopId }, [{ $set: { rating: { $avg: "$reviews" } } }]);
    return shop_responses_1.SHOP_RESPONSE.SHOP_RATING_SUCCESS;
});
const findShop = (shopId) => __awaiter(void 0, void 0, void 0, function* () { return yield shop_repo_1.default.findOne({ _id: shopId }); });
const incrementShopPoints = (shopId, revenue, points) => __awaiter(void 0, void 0, void 0, function* () {
    yield shop_repo_1.default.update({ _id: shopId }, { $inc: { allTimeSales: revenue } });
    const result = yield shop_repo_1.default.update({ _id: shopId }, { $inc: { allTimePoints: Number(points) } });
    return result;
});
const allShops = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield shop_repo_1.default.findAllShops((0, shop_pipelines_1.allShopsPublic)());
    return result;
});
exports.default = {
    create, find, findOne, incrementShopPoints, updateShopDetails, salesRequests, editSales, deleteSales, removeShopWithOwner, updatedQuantityInInventory, updateInventoryOnOrder, salesEntry, update, shopsRunningLow, getShopLeaderboard, rateShop, getInventory, findShop, allShops
};
