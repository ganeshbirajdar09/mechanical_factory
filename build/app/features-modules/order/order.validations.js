"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DELETE_ORDER_VALIDATIONS = exports.ORDER_BY_ID_VALIDATIONS = exports.CHANGE_ORDER_STATUS_VALIDATIONS = exports.UPDATE_ORDER_VALIDATIONS = exports.CREATE_ORDER_VALIDATIONS = void 0;
const express_validator_1 = require("express-validator");
const validate_1 = require("../../utilities/validate");
exports.CREATE_ORDER_VALIDATIONS = [
    (0, express_validator_1.body)("products").exists().withMessage("products are required").isArray().isLength({ min: 1 }).withMessage("products must include atleast 1 product"),
    (0, express_validator_1.body)("products.*.productId").exists().withMessage("productId is required").isMongoId().withMessage("productId must be a in a valid mongoId format"),
    (0, express_validator_1.body)("products.*.quantity").exists().withMessage("quantity is required").isInt({ min: 1 }).withMessage("quantity must be atleast 1"),
    validate_1.validate
];
exports.UPDATE_ORDER_VALIDATIONS = [
    (0, express_validator_1.body)("orderId").exists().withMessage("orderId is required").isMongoId().withMessage("should be a valid mongoId format"),
    (0, express_validator_1.body)("products").exists().withMessage("products are required").isArray().isLength({ min: 1 }).withMessage("products must include atleast 1 product"),
    (0, express_validator_1.body)("products.*.productId").exists().withMessage("productId is required").isMongoId().withMessage("productId must be a in a valid mongoId format"),
    (0, express_validator_1.body)("products.*.quantity").exists().withMessage("quantity is required").isInt({ min: 1 }).withMessage("quantity must be atleast 1"),
];
exports.CHANGE_ORDER_STATUS_VALIDATIONS = [
    (0, express_validator_1.body)("_id").exists().withMessage("_id is required").isMongoId().withMessage("_id is required"),
    (0, express_validator_1.body)("productId").optional().isMongoId().withMessage("productId should be a valid mongoId "),
    validate_1.validate
];
exports.ORDER_BY_ID_VALIDATIONS = [
    (0, express_validator_1.param)("id").exists().withMessage("id is required").isMongoId().withMessage("should be a valid mongoId"),
    validate_1.validate
];
exports.DELETE_ORDER_VALIDATIONS = [
    (0, express_validator_1.body)("orderId").exists().withMessage("orderId is required").isMongoId().withMessage("should be a valid mongoId"),
    validate_1.validate
];
