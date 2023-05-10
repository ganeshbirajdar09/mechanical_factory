"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AUTH_RESPONSES = void 0;
exports.AUTH_RESPONSES = {
    INVALID_CREDENTIALS: {
        statusCode: 400,
        message: "Invalid Credentials"
    },
    ALREADY_EXISTS: {
        statusCode: 409,
        message: "user already exists"
    },
    INVALID_TOKEN: {
        statusCode: 401,
        message: "Unauthorized"
    }
};
