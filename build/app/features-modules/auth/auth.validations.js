"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REFRESH_TOKEN_VALIDATIONS = exports.LOGIN_VALIDATOR = exports.ADMIN_REGISTRATION_VALIDATOR = void 0;
const express_validator_1 = require("express-validator");
const validate_1 = require("../../utilities/validate");
exports.ADMIN_REGISTRATION_VALIDATOR = [
    (0, express_validator_1.body)("name").exists().withMessage("name is required").isString().withMessage("name is required"),
    (0, express_validator_1.body)("email").exists().withMessage("email is required").isEmail().withMessage("email should in a valid email format"),
    (0, express_validator_1.body)("password").exists().withMessage("password is required").isLength({ min: 3 }).withMessage("password is required"),
    validate_1.validate
];
exports.LOGIN_VALIDATOR = [
    (0, express_validator_1.body)("email").exists().withMessage("email is required").isEmail().withMessage("email should in a valid email format"),
    (0, express_validator_1.body)("password").exists().withMessage("password is required").isLength({ min: 3 }).withMessage("password is required"),
    validate_1.validate
];
exports.REFRESH_TOKEN_VALIDATIONS = [
    (0, express_validator_1.body)("refreshToken").exists().withMessage("refreshtoken is required").isString().withMessage("refreshToken should ben in a valid email format"),
    validate_1.validate
];
