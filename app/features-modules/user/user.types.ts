import { Schema } from "mongoose";
import { IReward } from "../reward/reward.types";

export interface IUser {
    name: string,
    email: string,
    password: string,
    points?: number,
    rewards?: IReward[],
    role?: string,
    _id?: string | Schema.Types.ObjectId,
}

