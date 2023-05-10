"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopModel = void 0;
const mongoose_1 = require("mongoose");
const base_schema_1 = require("../../utilities/base-schema");
const ShopSchema = new base_schema_1.BaseSchema({
    ownerId: {
        type: String,
        ref: "user",
    },
    inventory: {
        type: [{
                productId: {
                    type: mongoose_1.Schema.Types.ObjectId,
                    ref: "product"
                },
                quantity: Number,
            }],
    },
    location: {
        type: String,
        required: true
    },
    reviews: {
        type: [Number],
        required: false
    },
    allTimePoints: {
        type: Number,
        required: false,
        default: 0
    },
    allTimeSales: {
        type: Number,
        required: false,
        default: 0
    },
    rating: {
        type: Number,
        required: false,
        default: 0
    }
});
exports.ShopModel = (0, mongoose_1.model)("shop", ShopSchema);
