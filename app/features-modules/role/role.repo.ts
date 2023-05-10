import { FilterQuery } from "mongoose";
import { RoleModel } from "./role.schema";
import { IRole } from "./role.types";

const create = (role: IRole) => RoleModel.create(role)

const findById = (id: string) => RoleModel.findById(id)

const findOne = (role: FilterQuery<IRole>) => RoleModel.findOne(role)

export default {
    create, findById, findOne
}