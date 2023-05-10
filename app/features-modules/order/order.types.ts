import { Schema } from "mongoose";

export interface IOrder {
    products: IOrderProducts[],
    status?: string | Schema.Types.ObjectId,
    shopId?: string | Schema.Types.ObjectId,
}

export interface IOrderProducts {
    productId: string,
    quantity: number,
    status?: string | Schema.Types.ObjectId,
    _id?: string
}
export interface IProductInfo {
    productId: string ,
    quantity: number,
    price?: number,
    _id?: string | Schema.Types.ObjectId
}
