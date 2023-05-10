import { NextFunction, Request, Response, Router } from "express";
import { permit } from "../../utilities/authorize";
import { ResponseHandler } from "../../utilities/response-handler";
import { ROLES } from "../../utilities/constants";
import userService from "./user.service";


const router = Router();

router.get("/", permit([ROLES.ADMIN]), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const queryData = req.query
        const result = await userService.find(queryData);
        res.send(new ResponseHandler(result))
    } catch (error) {
        next(error)
    }
})
router.get("/:id", permit([ROLES.ADMIN]), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await userService.findOne({ _id: req.params.id });
        res.send(new ResponseHandler(result))
    } catch (error) {
        next(error)
    }
})

export default router
