import { ExcludedPath, ExcludedPaths } from "../utilities/authorize";
import { Route, Routes } from "./routes.types";
import Routers from "../features-modules/index"


export const routes: Routes = [
    new Route("/user", Routers.UserRouter),
    new Route("/auth", Routers.AuthRouter),
    new Route("/shop", Routers.ShopRouter),
    new Route("/product", Routers.ProductRouter),
    new Route("/reward", Routers.RewardRouter),
    new Route("/order", Routers.OrderRouter),
    new Route("/transaction", Routers.TransactionRouter),
];


export const excludedPaths: ExcludedPaths = [
    new ExcludedPath("/auth/login", "POST"),
    new ExcludedPath("/auth/refreshtoken", "POST"),
    new ExcludedPath("/shop/review", "POST"),
    new ExcludedPath("/shop/all", "GET"),
];