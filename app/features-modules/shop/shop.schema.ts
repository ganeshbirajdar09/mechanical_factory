import { Schema, Types, model } from "mongoose";
import { BaseSchema } from "../../utilities/base-schema";
import { IShop } from "./shop.types";

const ShopSchema = new BaseSchema({
    ownerId: {
        type: String,
        ref: "user",
    },
    inventory: {
        type: [{
            productId: {
                type: Schema.Types.ObjectId,
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
})

type ShopDocument = Document & IShop;

export const ShopModel = model<ShopDocument>("shop", ShopSchema)