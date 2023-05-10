import { model } from "mongoose";
import { BaseSchema } from "../../utilities/base-schema";
import { IProduct } from "./product.types";

const ProductSchema = new BaseSchema({
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
})

type ProductDocument = Document & IProduct;

export const ProductModel = model<ProductDocument>("product", ProductSchema)