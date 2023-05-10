import roleRepo from "./role.repo"
import { IRole } from "./role.types";

const create = async (role: IRole) => await roleRepo.create(role);

const getById = async (id: string) => await roleRepo.findById(id);

const getRoleId = async (role: string) => await roleRepo.findOne({ name: role })

export default {
    create, getById, getRoleId
}