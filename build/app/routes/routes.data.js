"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.excludedPaths = exports.routes = void 0;
const authorize_1 = require("../utilities/authorize");
const routes_types_1 = require("./routes.types");
const index_1 = __importDefault(require("../features-modules/index"));
exports.routes = [
    new routes_types_1.Route("/user", index_1.default.UserRouter),
    new routes_types_1.Route("/auth", index_1.default.AuthRouter),
    new routes_types_1.Route("/shop", index_1.default.ShopRouter),
    new routes_types_1.Route("/product", index_1.default.ProductRouter),
    new routes_types_1.Route("/reward", index_1.default.RewardRouter),
    new routes_types_1.Route("/order", index_1.default.OrderRouter),
    new routes_types_1.Route("/transaction", index_1.default.TransactionRouter),
];
exports.excludedPaths = [
    new authorize_1.ExcludedPath("/auth/login", "POST"),
    new authorize_1.ExcludedPath("/auth/refreshtoken", "POST"),
    new authorize_1.ExcludedPath("/shop/review", "POST"),
    new authorize_1.ExcludedPath("/shop/all", "GET"),
];
