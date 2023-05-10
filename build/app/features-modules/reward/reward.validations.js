"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DELETE_REDEEM_REQUEST_VALIDATIONS = exports.UDPATE_REWARD_VALIDATIONS = exports.REDEEM_REWARD_VALIDATIONS = exports.ADD_REWARD_VALIDATIONS = void 0;
const express_validator_1 = require("express-validator");
const validate_1 = require("../../utilities/validate");
exports.ADD_REWARD_VALIDATIONS = [
    (0, express_validator_1.body)("name").exists().withMessage("name is required").isString().isLength({ min: 3 }).withMessage("name length should be atleast 3"),
    (0, express_validator_1.body)("points").exists().withMessage("points is required").isInt({ min: 1 }).withMessage("points value must be a numeric value and atleast 1"),
    validate_1.validate
];
exports.REDEEM_REWARD_VALIDATIONS = [
    (0, express_validator_1.body)("rewardId").exists().withMessage("rewardId is required").isMongoId().withMessage("rewardId is required"),
    validate_1.validate
];
exports.UDPATE_REWARD_VALIDATIONS = [
    (0, express_validator_1.body)("_id").exists().withMessage("_id is required").isMongoId().withMessage("should be a valid mongodbId format"),
    validate_1.validate
];
exports.DELETE_REDEEM_REQUEST_VALIDATIONS = [
    (0, express_validator_1.body)("requestId").exists().withMessage("requestId is required").isMongoId().withMessage("should be a valid mongodbId format"),
    validate_1.validate
];
