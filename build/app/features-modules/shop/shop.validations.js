"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DELETE_SHOP_VALIDATIONS = exports.UPDATE_SHOP_VALIDATIONS = exports.DELETE_SALES_VALIDATIONS = exports.EDIT_SALES_VALIDATIONS = exports.REVIEW_VALIDATIONS = exports.GENERATE_SALES_VALIDATIONS = exports.CREATE_SHOP_VALIDATIONS = void 0;
const express_validator_1 = require("express-validator");
const validate_1 = require("../../utilities/validate");
exports.CREATE_SHOP_VALIDATIONS = [
    (0, express_validator_1.body)("name").exists().withMessage("name is required").isString().withMessage("name should be a string"),
    (0, express_validator_1.body)("email").exists().withMessage("email is required").isEmail().withMessage("email should in a valid email format"),
    (0, express_validator_1.body)("password").exists().withMessage("password is required").isLength({ min: 3 }).withMessage("password is required"),
    (0, express_validator_1.body)("location").exists().withMessage("location is required").isString().isLength({ min: 1 }),
    validate_1.validate
];
exports.GENERATE_SALES_VALIDATIONS = [
    (0, express_validator_1.body)("salesData").exists().withMessage("salesData is required").isArray().isLength({ min: 1 }).withMessage("salesData must contain atleast one entry"),
    (0, express_validator_1.body)("salesData.*.productId").exists().withMessage("productId is required").isMongoId().withMessage("productId must be a in a valid mongoId format"),
    (0, express_validator_1.body)("salesData.*.quantity").exists().withMessage("quantity is required").isInt({ min: 1 }).withMessage("quantity must be atleast 1"),
    validate_1.validate
];
exports.REVIEW_VALIDATIONS = [
    (0, express_validator_1.body)("shopId").exists().withMessage("shopId is required").isMongoId().withMessage("must be a in a valid mongoId format"),
    (0, express_validator_1.body)("rating").exists().withMessage("rating is required").isInt({ min: 1, max: 5 }).withMessage("rating must be numeric and between 1 and 5"),
    validate_1.validate
];
exports.EDIT_SALES_VALIDATIONS = [
    (0, express_validator_1.body)("salesId").exists().withMessage("salesId is required").isMongoId().withMessage("salesId must be a in a valid mongoId format"),
    (0, express_validator_1.body)("products").exists().withMessage("products are required").isArray().isLength({ min: 1 }).withMessage("there must be atleast 1 product"),
    (0, express_validator_1.body)("products.*.productId").exists().withMessage("productId is required").isMongoId().withMessage("productId must be a in a valid mongoId format"),
    (0, express_validator_1.body)("products.*.quantity").exists().withMessage("quantity is required").isInt({ min: 1 }).withMessage("quantity must be atleast 1"),
    (0, express_validator_1.body)("products.*.price").exists().withMessage("price is required").isInt({ min: 1 }).withMessage("price must be atleast 1"),
    validate_1.validate
];
exports.DELETE_SALES_VALIDATIONS = [
    (0, express_validator_1.body)("salesId").exists().withMessage("salesId is required").isMongoId().withMessage("must be a in a valid mongoId format"),
    validate_1.validate
];
exports.UPDATE_SHOP_VALIDATIONS = [
    (0, express_validator_1.body)("location").exists().withMessage("location is required").isString().isLength({ min: 1 }),
    (0, express_validator_1.param)("id").exists().withMessage("id(shopId) is requrired").isMongoId().withMessage("must be a in a valid mongoId format"),
    validate_1.validate
];
exports.DELETE_SHOP_VALIDATIONS = [
    (0, express_validator_1.param)("id").exists().withMessage("id(shopId) is requrired").isMongoId().withMessage("must be a in a valid mongoId format"),
    validate_1.validate
];
