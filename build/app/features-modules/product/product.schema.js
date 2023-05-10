"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModel = void 0;
const mongoose_1 = require("mongoose");
const base_schema_1 = require("../../utilities/base-schema");
const ProductSchema = new base_schema_1.BaseSchema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    points: {
        type: Number,
        required: true,
        default: 0
    },
    threshold: {
        type: Number,
        required: true,
        default: 0
    },
    isSpecial: {
        type: Boolean,
        default: false
    }
});
exports.ProductModel = (0, mongoose_1.model)("product", ProductSchema);
