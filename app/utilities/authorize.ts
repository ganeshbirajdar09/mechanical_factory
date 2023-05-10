import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { publicKeyGenerator } from "./keys.generate";
import { Payload } from "../features-modules/auth/auth.types";


export const authorize = (excludedPaths: ExcludedPaths) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {

            if (excludedPaths.find(e => e.path === req.url && e.method === req.method)) {
                return next()
            }

            const token = req.headers.authorization?.split(' ')[1];
            if (!token) return next({ message: 'UNAUTHORIZED', statusCode: 401 });

            const publicKey = publicKeyGenerator()
            const decode = verify(token, publicKey) as Payload;

            if (decode) res.locals.user = decode as Payload;

            next();
        } catch (e) {
            next({ message: 'UNAUTHORIZED', statusCode: 401 });
        }

    }
}

export const permit = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { user } = res.locals;
        if (roles.includes(user.role)) return next();
        next({ statusCode: 403, message: "FORBIDDEN" })
    }
}

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

export class ExcludedPath {
    constructor(
        public path: string,
        public method: Method,
        // public param: string = ""
    ) { }
}

export type ExcludedPaths = ExcludedPath[];