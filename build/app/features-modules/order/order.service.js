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
const order_repo_1 = __importDefault(require("./order.repo"));
const order_responses_1 = require("./order.responses");
const shop_service_1 = __importDefault(require("../shop/shop.service"));
const constants_1 = require("../../utilities/constants");
const shop_responses_1 = require("../shop/shop.responses");
const product_responses_1 = require("../product/product.responses");
const product_service_1 = __importDefault(require("../product/product.service"));
const create = (order, ownerId) => __awaiter(void 0, void 0, void 0, function* () {
    const shop = yield shop_service_1.default.findOne({ ownerId: ownerId });
    if (!shop)
        throw order_responses_1.ORDER_RESPONSES.NOT_FOUND;
    const { products } = order;
    for (let product of products) {
        const doesProductExists = yield product_service_1.default.findOne(product.productId);
        if (!doesProductExists)
            throw product_responses_1.PRODUCT_RESPONSES.NOT_FOUND;
    }
    order.shopId = shop._id;
    return yield order_repo_1.default.create(order);
});
const findAll = (queryData) => __awaiter(void 0, void 0, void 0, function* () { return yield order_repo_1.default.find(queryData); });
const findOne = (orderId) => __awaiter(void 0, void 0, void 0, function* () { return yield order_repo_1.default.findOne({ _id: orderId }); });
const findOrdersByShop = (ownerId) => __awaiter(void 0, void 0, void 0, function* () {
    const shop = yield shop_service_1.default.findOne({ ownerId: ownerId });
    if (!shop)
        throw shop_responses_1.SHOP_RESPONSE.NOT_FOUND;
    const result = yield order_repo_1.default.findOrdersByShop(shop._id);
    return result;
});
const confirmOwnerAndOrder = (ownerId, orderId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const order = yield order_repo_1.default.findOne({ _id: orderId });
    if (!order)
        throw order_responses_1.ORDER_RESPONSES.NOT_FOUND;
    const shop = yield shop_service_1.default.findOne({ ownerId: ownerId });
    if (!shop)
        throw shop_responses_1.SHOP_RESPONSE.NOT_FOUND;
    if (((_a = order.shopId) === null || _a === void 0 ? void 0 : _a.toString()) != shop._id.toString())
        return false;
    if (((_b = order === null || order === void 0 ? void 0 : order.status) === null || _b === void 0 ? void 0 : _b.toString()) == constants_1.TRANSACTION_STATUSES.APPROVED)
        return false;
    return true;
});
const onwerEditOrder = (ownerId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId, products } = data;
    const check = confirmOwnerAndOrder(ownerId, orderId);
    if (!check)
        throw order_responses_1.ORDER_RESPONSES.NOT_FOUND;
    const result = yield order_repo_1.default.update({ _id: orderId }, { $set: { products: products } });
    if (result.modifiedCount < 1)
        throw order_responses_1.ORDER_RESPONSES.UPDATE_FAILURE;
    return order_responses_1.ORDER_RESPONSES.UPDATE_SUCCESS;
});
const removeOrder = (ownerId, orderId) => __awaiter(void 0, void 0, void 0, function* () {
    // const check = confirmOwnerAndOrder(ownerId, orderId)
    // if (!check) throw ORDER_RESPONSES.NOT_FOUND
    const order = yield order_repo_1.default.findOne({ _id: orderId });
    if (!order)
        throw order_responses_1.ORDER_RESPONSES.NOT_FOUND;
    const shop = yield shop_service_1.default.findOne({ ownerId: ownerId });
    if (!shop)
        throw shop_responses_1.SHOP_RESPONSE.NOT_FOUND;
    const result = yield order_repo_1.default.update({ _id: orderId }, { isDeleted: true });
    if (result.modifiedCount < 1)
        throw order_responses_1.ORDER_RESPONSES.DELETE_FAILURE;
    return order_responses_1.ORDER_RESPONSES.DELETE_SUCCESS;
});
const approveOrder = (_id, productId = "") => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const order = yield order_repo_1.default.findOne({ _id: _id });
    if (!order)
        throw order_responses_1.ORDER_RESPONSES.NOT_FOUND;
    if (((_c = order.status) === null || _c === void 0 ? void 0 : _c.toString()) == constants_1.TRANSACTION_STATUSES.APPROVED)
        throw order_responses_1.ORDER_RESPONSES.ALREADY_APPROVED;
    const shop = yield shop_service_1.default.findOne({ _id: order.shopId });
    if (!shop)
        throw shop_responses_1.SHOP_RESPONSE.NOT_FOUND;
    //approve the whole order
    if (!productId) {
        const productsToUpdate = order.products.filter(prod => { var _a; return ((_a = prod.status) === null || _a === void 0 ? void 0 : _a.toString()) !== constants_1.TRANSACTION_STATUSES.APPROVED; });
        yield shop_service_1.default.updateInventoryOnOrder(shop._id.toString(), productsToUpdate);
        yield order_repo_1.default.update({ _id: order._id }, { $set: { status: constants_1.TRANSACTION_STATUSES.APPROVED } });
        const result = yield order_repo_1.default.update({ _id: order._id }, { $set: { "products.$[].status": constants_1.TRANSACTION_STATUSES.APPROVED } });
        if (result.modifiedCount < 1)
            throw order_responses_1.ORDER_RESPONSES.UPDATE_FAILURE;
        return order_responses_1.ORDER_RESPONSES.UPDATE_SUCCESS;
    }
    //approve that one particular product
    const product = order.products.find(item => item.productId.toString() == productId.toString());
    if (!product)
        throw product_responses_1.PRODUCT_RESPONSES.NOT_FOUND;
    yield shop_service_1.default.update({ "inventory.productId": product.productId }, { $inc: { "inventory.$.quantity": product.quantity } });
    yield order_repo_1.default.update({ "products.productId": productId }, { $set: { "products.$.status": constants_1.TRANSACTION_STATUSES.APPROVED } });
    return order_responses_1.ORDER_RESPONSES.UPDATE_SUCCESS;
});
exports.default = {
    create, removeOrder, findOne, approveOrder, findAll, onwerEditOrder, findOrdersByShop
};
