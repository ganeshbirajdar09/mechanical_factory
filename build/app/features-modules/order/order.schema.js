"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModel = void 0;
const mongoose_1 = require("mongoose");
const base_schema_1 = require("../../utilities/base-schema");
const constants_1 = require("../../utilities/constants");
const OrderSchema = new base_schema_1.BaseSchema({
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
                status: {
                    type: mongoose_1.Schema.Types.ObjectId,
                    default: constants_1.TRANSACTION_STATUSES.PENDING
                }
            }],
    },
    shopId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "shop"
    },
    status: {
        type: mongoose_1.Schema.Types.ObjectId,
        default: constants_1.TRANSACTION_STATUSES.PENDING
    }
});
exports.OrderModel = (0, mongoose_1.model)("order", OrderSchema);
