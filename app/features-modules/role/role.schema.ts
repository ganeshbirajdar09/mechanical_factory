import { Schema, model } from "mongoose";
import { BaseSchema } from "../../utilities/base-schema";
import { IRole } from "./role.types";


const RoleSchema = new BaseSchema({
    name: {
        type: String,
        required: true
    },
    _id: {
        type: Schema.Types.ObjectId,
    }
})
type RoleDocument = Document & IRole;


export const RoleModel = model<RoleDocument>("role", RoleSchema)

