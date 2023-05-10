import { Schema } from "mongoose";

export interface IProduct {
    name: string,
    price: number,
    points: number,
    _id?: string | Schema.Types.ObjectId,
    threshold: number,
    isSpecial: boolean
}