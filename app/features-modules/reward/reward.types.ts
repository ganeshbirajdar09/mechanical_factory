import { Schema } from "mongoose";

export interface IReward{
    _id?: string | Schema.Types.ObjectId,
    name: string,
    points: number
}