import { Schema } from "mongoose";

export interface IShop {
    ownerId: string | Schema.Types.ObjectId,
    inventory?: IShopInventory[],
    location: string,
    reviews?: number[],
    rating?: number,
    _id: string | Schema.Types.ObjectId,
    allTimePoints?: number,
    allTimeSales?: number
}
export interface IShopInventory {
    productId: string | Schema.Types.ObjectId,
    quantity: number,
    price?: number,
    _id?: string | Schema.Types.ObjectId
}
