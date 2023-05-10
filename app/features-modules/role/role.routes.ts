import { NextFunction, Request, Response, Router } from "express";
import { permit } from "../../utilities/authorize";
import { ResponseHandler } from "../../utilities/response-handler";
import { ROLES } from "../../utilities/constants";
import roleService from "./role.service";


const router = Router();

router.post("/create", permit([ROLES.ADMIN]), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { role } = req.body
        const result = await roleService.create(role);
        res.send(new ResponseHandler(result))
    } catch (error) {
        next(error)
    }
})

export default router
