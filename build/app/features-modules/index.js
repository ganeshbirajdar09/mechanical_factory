"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_routes_1 = __importDefault(require("./user/user.routes"));
const auth_routes_1 = __importDefault(require("./auth/auth.routes"));
const shop_routes_1 = __importDefault(require("./shop/shop.routes"));
const product_routes_1 = __importDefault(require("./product/product.routes"));
const reward_routes_1 = __importDefault(require("./reward/reward.routes"));
const order_routes_1 = __importDefault(require("./order/order.routes"));
const transaction_routes_1 = __importDefault(require("./transaction/transaction.routes"));
const role_routes_1 = __importDefault(require("./role/role.routes"));
exports.default = {
    UserRouter: user_routes_1.default,
    AuthRouter: auth_routes_1.default,
    ShopRouter: shop_routes_1.default,
    ProductRouter: product_routes_1.default,
    RewardRouter: reward_routes_1.default,
    OrderRouter: order_routes_1.default,
    TransactionRouter: transaction_routes_1.default,
    RoleRouter: role_routes_1.default
};
