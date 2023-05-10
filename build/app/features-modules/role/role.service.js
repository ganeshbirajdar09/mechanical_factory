"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const role_repo_1 = __importDefault(require("./role.repo"));
const create = (role) => __awaiter(void 0, void 0, void 0, function* () { return yield role_repo_1.default.create(role); });
const getById = (id) => __awaiter(void 0, void 0, void 0, function* () { return yield role_repo_1.default.findById(id); });
const getRoleId = (role) => __awaiter(void 0, void 0, void 0, function* () { return yield role_repo_1.default.findOne({ name: role }); });
exports.default = {
    create, getById, getRoleId
};
