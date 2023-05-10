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
const product_repo_1 = __importDefault(require("./product.repo"));
const product_responses_1 = require("./product.responses");
const database_utilities_1 = require("../../utilities/database.utilities");
const transaction_service_1 = __importDefault(require("../transaction/transaction.service"));
const create = (product) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = product;
    const oldProduct = yield product_repo_1.default.findOne({ name: name });
    if (oldProduct)
        throw product_responses_1.PRODUCT_RESPONSES.ALREADY_EXISTS;
    product.points > 0 ? product.isSpecial = true : product.isSpecial = false;
    return yield product_repo_1.default.create(product);
});
const find = (queryData) => __awaiter(void 0, void 0, void 0, function* () {
    const pipeline = (0, database_utilities_1.genericPipeline)(queryData);
    return yield product_repo_1.default.find(pipeline);
});
const findOne = (productId) => __awaiter(void 0, void 0, void 0, function* () { return yield product_repo_1.default.findOne({ _id: productId }); });
const updateProduct = (filterParam, data) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_repo_1.default.findOne({ _id: filterParam });
    if (!product)
        throw product_responses_1.PRODUCT_RESPONSES.NOT_FOUND;
    const result = yield product_repo_1.default.update({ _id: filterParam }, data);
    if (result.modifiedCount < 1)
        throw product_responses_1.PRODUCT_RESPONSES.UPDATE_FAILURE;
    return product_responses_1.PRODUCT_RESPONSES.UPDATE_SUCCESS;
});
const removeProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_repo_1.default.update({ _id: id }, { isDeleted: true });
    if (result.modifiedCount < 1)
        throw product_responses_1.PRODUCT_RESPONSES.DELETE_FAILURE;
    return product_responses_1.PRODUCT_RESPONSES.DELETE_SUCCESS;
});
const productWiseHighestSellers = (queryData) => __awaiter(void 0, void 0, void 0, function* () { return yield transaction_service_1.default.productWiseTransactionDetails(queryData); });
exports.default = {
    find, create, findOne, updateProduct, removeProduct, productWiseHighestSellers
};
