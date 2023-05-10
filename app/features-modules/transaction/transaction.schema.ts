import { Schema, model } from "mongoose";
import { BaseSchema } from "../../utilities/base-schema";
import { TRANSACTION_STATUSES } from "../../utilities/constants";
import { ITransaction } from "./transaction.types";

const TransactionSchema = new BaseSchema({
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
                type: Schema.Types.ObjectId,
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
        type: Schema.Types.ObjectId
    },
    status: {
        type: Schema.Types.ObjectId,
        default: TRANSACTION_STATUSES.PENDING,
        required: false
    },
    currentRewardPoints: {
        type: Number,
        required: false
    }

})

type TransactionyDocument = Document & ITransaction;


export const TransactionModel = model<TransactionyDocument>("transaction", TransactionSchema)
