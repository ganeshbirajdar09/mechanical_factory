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
const jsonwebtoken_1 = require("jsonwebtoken");
const auth_responses_1 = require("./auth.responses");
const bcryptjs_1 = require("bcryptjs");
const user_service_1 = __importDefault(require("../user/user.service"));
const constants_1 = require("../../utilities/constants");
const keys_generate_1 = require("../../utilities/keys.generate");
const encryptPassword = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const salt = yield (0, bcryptjs_1.genSalt)(10);
    const encryptedPassword = yield (0, bcryptjs_1.hash)(user.password, salt);
    user.password = encryptedPassword;
    return user;
});
const register = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const oldUser = yield user_service_1.default.findOne({ email: user.email });
    if (oldUser)
        throw auth_responses_1.AUTH_RESPONSES.ALREADY_EXISTS;
    yield encryptPassword(user);
    return yield user_service_1.default.create(user);
});
const createAdmin = (admin) => __awaiter(void 0, void 0, void 0, function* () {
    admin.role = constants_1.ROLES.ADMIN;
    return register(admin);
});
const createOwner = (user) => __awaiter(void 0, void 0, void 0, function* () {
    user.role = constants_1.ROLES.OWNER;
    return register(user);
});
const login = (credential) => __awaiter(void 0, void 0, void 0, function* () {
    const { ACCESS_TOKEN_EXPIRATION_TIME, REFRESH_TOKEN_EXPIRATION_TIME } = process.env;
    const user = yield user_service_1.default.findOne({ email: credential.email });
    if (!user)
        throw auth_responses_1.AUTH_RESPONSES.INVALID_CREDENTIALS;
    const isPasswordValid = yield (0, bcryptjs_1.compare)(credential.password, user.password);
    if (!isPasswordValid)
        throw auth_responses_1.AUTH_RESPONSES.INVALID_CREDENTIALS;
    const privateKey = (0, keys_generate_1.privateKeyGenerator)();
    const accessToken = (0, jsonwebtoken_1.sign)({ id: user._id, role: user.role }, privateKey, { algorithm: "RS256", expiresIn: ACCESS_TOKEN_EXPIRATION_TIME });
    const refreshToken = (0, jsonwebtoken_1.sign)({ id: user._id, role: user.role }, privateKey, { algorithm: "RS256", expiresIn: REFRESH_TOKEN_EXPIRATION_TIME });
    const { _id, role } = user;
    return {
        accessToken,
        refreshToken,
        user: { _id, role }
    };
});
const generateAccessToken = (token) => {
    const { REFRESH_TOKEN_EXPIRATION_TIME } = process.env;
    const publicKey = (0, keys_generate_1.publicKeyGenerator)();
    const privateKey = (0, keys_generate_1.privateKeyGenerator)();
    const decode = (0, jsonwebtoken_1.verify)(token, publicKey);
    if (!decode)
        throw auth_responses_1.AUTH_RESPONSES.INVALID_TOKEN;
    const { id, role } = decode;
    const accessToken = (0, jsonwebtoken_1.sign)({ id: id, role: role }, privateKey, { algorithm: "RS256", expiresIn: REFRESH_TOKEN_EXPIRATION_TIME });
    return accessToken;
};
exports.default = {
    register,
    login,
    createAdmin,
    createOwner,
    generateAccessToken
};
