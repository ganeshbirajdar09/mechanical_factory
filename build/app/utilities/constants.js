"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ADMIN_DATA = exports.TRANSACTION_STATUSES = exports.ROLES = void 0;
exports.ROLES = {
    ADMIN: "643f81c87eb0fc7fadaa86a8",
    OWNER: "643f81c87eb0fc7fadaa86a9"
};
exports.TRANSACTION_STATUSES = {
    PENDING: "643f822f7eb0fc7fadaa86ac",
    APPROVED: "643f822f7eb0fc7fadaa86ad",
    REJECTED: "643f822f7eb0fc7fadaa86ae"
};
exports.ADMIN_DATA = [{
        name: "admin",
        email: "a@admin.com",
        password: "admin",
        role: exports.ROLES.ADMIN
    }];
