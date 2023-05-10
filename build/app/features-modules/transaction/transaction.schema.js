"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionModel = void 0;
const mongoose_1 = require("mongoose");
const base_schema_1 = require("../../utilities/base-schema");
const constants_1 = require("../../utilities/constants");
const TransactionSchema = new base_schema_1.BaseSchema({
    type: {
        type: String,
        required: true
    },
    ownerId: {
        type: String,
        ref: "user",
        required: false
    },
    shopId: {
        type: String,
        ref: "shop",
        required: false
    },
    products: {
        type: [{
                productId: {
                    type: mongoose_1.Schema.Types.ObjectId,
                    required: true,
                    ref: "product"
                },
                quantity: {
                    type: Number,
                    required: true
                },
                price: {
                    type: Number,
                    required: false
                }
            }],
        required: false
    },
    netSales: {
        type: Number
    },
    reward: {
        type: mongoose_1.Schema.Types.ObjectId
    },
    status: {
        type: mongoose_1.Schema.Types.ObjectId,
        default: constants_1.TRANSACTION_STATUSES.PENDING,
        required: false
    },
    currentRewardPoints: {
        type: Number,
        required: false
    }
});
exports.TransactionModel = (0, mongoose_1.model)("transaction", TransactionSchema);
