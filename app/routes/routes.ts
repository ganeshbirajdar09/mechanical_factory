import { Application, json, NextFunction, Request, Response, urlencoded } from "express";
import { authorize } from "../utilities/authorize";
import { ResponseHandler } from "../utilities/response-handler";
import { excludedPaths, routes } from "./routes.data";
import helmet from "helmet";

export const registerRoutes = (app: Application) => {
    app.use(helmet());
    app.use(json());
    app.use(urlencoded({ extended: true }))
    app.use(authorize(excludedPaths));

    for (let route of routes) {
        app.use(route.path, route.router);
    }

    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
        res
            .status(err.statusCode || 500)
            .send(new ResponseHandler(null, err));
    })

}