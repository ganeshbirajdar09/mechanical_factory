import { sign, verify } from "jsonwebtoken";
import { AUTH_RESPONSES } from "./auth.responses";
import { compare, genSalt, hash } from "bcryptjs";
import { ICredentials, Payload } from "./auth.types";
import { IUser } from "../user/user.types";
import userService from "../user/user.service";
import { ROLES } from "../../utilities/constants";
import { privateKeyGenerator, publicKeyGenerator } from "../../utilities/keys.generate";


const encryptPassword = async (user: IUser) => {
    const salt = await genSalt(10);
    const encryptedPassword = await hash(user.password, salt);
    user.password = encryptedPassword;
    return user
}

const register = async (user: IUser) => {
    const oldUser = await userService.findOne({ email: user.email });
    if (oldUser) throw AUTH_RESPONSES.ALREADY_EXISTS;
    await encryptPassword(user)
    return await userService.create(user);
}

const createAdmin = async (admin: IUser) => {
    admin.role = ROLES.ADMIN
    return register(admin)
}
const createOwner = async (user: IUser) => {
    user.role = ROLES.OWNER
    return register(user)

}

const login = async (credential: ICredentials) => {
    const { ACCESS_TOKEN_EXPIRATION_TIME, REFRESH_TOKEN_EXPIRATION_TIME } = process.env

    const user = await userService.findOne({ email: credential.email });
    if (!user) throw AUTH_RESPONSES.INVALID_CREDENTIALS;
    const isPasswordValid = await compare(credential.password, user.password);
    if (!isPasswordValid) throw AUTH_RESPONSES.INVALID_CREDENTIALS;

    const privateKey = privateKeyGenerator();
    const accessToken = sign({ id: user._id, role: user.role }, privateKey, { algorithm: "RS256", expiresIn: ACCESS_TOKEN_EXPIRATION_TIME })
    const refreshToken = sign({ id: user._id, role: user.role }, privateKey, { algorithm: "RS256", expiresIn: REFRESH_TOKEN_EXPIRATION_TIME })

    const { _id, role } = user;
    return {
        accessToken,
        refreshToken,
        user: { _id, role }
    }
}
const generateAccessToken = (token: string) => {
    const { REFRESH_TOKEN_EXPIRATION_TIME } = process.env
    const publicKey = publicKeyGenerator();
    const privateKey = privateKeyGenerator();
    const decode = verify(token, publicKey) as Payload;
    if (!decode) throw AUTH_RESPONSES.INVALID_TOKEN
    const { id, role } = decode
    const accessToken = sign({ id: id, role: role }, privateKey, { algorithm: "RS256", expiresIn: REFRESH_TOKEN_EXPIRATION_TIME })
    return accessToken
}

export default {
    register,
    login,
    createAdmin,
    createOwner,
    generateAccessToken
}