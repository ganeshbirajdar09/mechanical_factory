import { Schema } from "mongoose";

export interface IRole {
    name: string,
    _id?: string | Schema.Types.ObjectId
}