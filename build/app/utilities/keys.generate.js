"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.privateKeyGenerator = exports.publicKeyGenerator = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const publicKeyGenerator = () => {
    try {
        const publicKey = fs_1.default.readFileSync(path_1.default.resolve(__dirname, "keys", "public.pem"), { encoding: "utf8" });
        return publicKey;
    }
    catch (error) {
        throw { msg: "problem with public.pem ", error: error };
    }
};
exports.publicKeyGenerator = publicKeyGenerator;
const privateKeyGenerator = () => {
    try {
        const privateKey = fs_1.default.readFileSync(path_1.default.resolve(__dirname, "keys", "private.pem"), { encoding: "utf8" });
        return privateKey;
    }
    catch (error) {
        throw { msg: "problem with private.pem ", error: error };
    }
};
exports.privateKeyGenerator = privateKeyGenerator;
