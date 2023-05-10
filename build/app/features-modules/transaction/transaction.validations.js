"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SALES_TRANSACTION_APPROVE_VALIDATIONS = void 0;
const express_validator_1 = require("express-validator");
const validate_1 = require("../../utilities/validate");
exports.SALES_TRANSACTION_APPROVE_VALIDATIONS = [
    (0, express_validator_1.body)("status").isMongoId().withMessage("status is required"),
    (0, express_validator_1.body)("salesId").isMongoId().withMessage("salesId is required"),
    validate_1.validate
];
