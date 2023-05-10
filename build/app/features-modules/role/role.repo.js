"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const role_schema_1 = require("./role.schema");
const create = (role) => role_schema_1.RoleModel.create(role);
const findById = (id) => role_schema_1.RoleModel.findById(id);
const findOne = (role) => role_schema_1.RoleModel.findOne(role);
exports.default = {
    create, findById, findOne
};
