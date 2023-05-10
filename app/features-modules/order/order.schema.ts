import { Schema, model } from "mongoose";
import { BaseSchema } from "../../utilities/base-schema";
import { IOrder } from "./order.types";
import { TRANSACTION_STATUSES } from "../../utilities/constants";

const OrderSchema = new BaseSchema({
    products: {
        type: [{
            productId: {
                type: Schema.Types.ObjectId,
                required: true,
                ref: "product"
            },
            quantity: {
                type: Number,
                required: true
            },
            status: {
                type: Schema.Types.ObjectId,
                default: TRANSACTION_STATUSES.PENDING
            }
        }],
    },
    shopId: {
        type: Schema.Types.ObjectId,
        ref: "shop"
    },
    status: {
        type: Schema.Types.ObjectId,
        default: TRANSACTION_STATUSES.PENDING
    }

})

type OrderDocument = Document & IOrder;

export const OrderModel = model<OrderDocument>("order", OrderSchema)