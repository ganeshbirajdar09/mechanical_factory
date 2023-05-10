"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRODUCT_UPDATE_VALIDATIONS = exports.ADD_PRODUCT_VALIDATIONS = void 0;
const express_validator_1 = require("express-validator");
const validate_1 = require("../../utilities/validate");
exports.ADD_PRODUCT_VALIDATIONS = [
    (0, express_validator_1.body)("name").exists().withMessage("name is required").isString().isLength({ min: 3 }).withMessage("name length should be atleast 3"),
    (0, express_validator_1.body)("price").exists().withMessage("price is required").isInt({ min: 1 }).withMessage("price value must be a numeric value"),
    (0, express_validator_1.body)("points").exists().withMessage("points is required").isInt({ min: 0 }).withMessage("points value must be a numeric value"),
    (0, express_validator_1.body)("threshold").exists().withMessage("threshold is required").isInt({ min: 1 }).withMessage("threshold value must be a numeric value and should be atleast 1"),
    validate_1.validate
];
exports.PRODUCT_UPDATE_VALIDATIONS = [
    (0, express_validator_1.body)("_id").exists().withMessage("name is required").isMongoId().withMessage("should be a valid mongodbId format"),
    (0, express_validator_1.body)("name").optional().isString().isLength({ min: 3 }).withMessage("name length should be atleast 3"),
    (0, express_validator_1.body)("price").optional().isInt({ min: 1 }).withMessage("price value must be a numeric value"),
    (0, express_validator_1.body)("points").optional().isInt({ min: 0 }).withMessage("points value must be a numeric value"),
    (0, express_validator_1.body)("threshold").optional().isInt({ min: 1 }).withMessage("threshold value must be a numeric value and should be atleast 1"),
    validate_1.validate
];
