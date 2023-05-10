import { Schema, model } from "mongoose";
import { BaseSchema } from "../../utilities/base-schema";
import { IUser } from "./user.types";

const UserSchema = new BaseSchema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: Schema.Types.ObjectId,
        required: false
    },
    points: {
        type: Number,
        default: 0
    },
    rewards: {
        type: [Schema.Types.ObjectId],
        ref: "reward",
        default: []
    }
})

type UserDocument = Document & IUser;


export const UserModel = model<UserDocument>("user", UserSchema)