"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExcludedPath = exports.permit = exports.authorize = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const keys_generate_1 = require("./keys.generate");
const authorize = (excludedPaths) => {
    return (req, res, next) => {
        var _a;
        try {
            if (excludedPaths.find(e => e.path === req.url && e.method === req.method)) {
                return next();
            }
            const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
            if (!token)
                return next({ message: 'UNAUTHORIZED', statusCode: 401 });
            const publicKey = (0, keys_generate_1.publicKeyGenerator)();
            const decode = (0, jsonwebtoken_1.verify)(token, publicKey);
            if (decode)
                res.locals.user = decode;
            next();
        }
        catch (e) {
            next({ message: 'UNAUTHORIZED', statusCode: 401 });
        }
    };
};
exports.authorize = authorize;
const permit = (roles) => {
    return (req, res, next) => {
        const { user } = res.locals;
        if (roles.includes(user.role))
            return next();
        next({ statusCode: 403, message: "FORBIDDEN" });
    };
};
exports.permit = permit;
class ExcludedPath {
    constructor(path, method) {
        this.path = path;
        this.method = method;
    }
}
exports.ExcludedPath = ExcludedPath;
