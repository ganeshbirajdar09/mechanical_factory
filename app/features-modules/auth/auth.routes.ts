import { Router, Request, Response, NextFunction } from "express";
import authService from "./auth.service";
import { ResponseHandler } from "../../utilities/response-handler";
import { ADMIN_REGISTRATION_VALIDATOR, LOGIN_VALIDATOR, REFRESH_TOKEN_VALIDATIONS } from "./auth.validations";
import { permit } from "../../utilities/authorize";
import { ROLES } from "../../utilities/constants";

const router = Router();

//create a new admin
router.post("/admin", permit([ROLES.ADMIN]), ADMIN_REGISTRATION_VALIDATOR, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const admin = req.body;
        const result = await authService.createAdmin(admin)
        res.send(new ResponseHandler(result))
    } catch (error) {
        next(error)
    }
})

router.post("/refreshtoken", REFRESH_TOKEN_VALIDATIONS, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { refreshToken } = req.body;
        const result = await authService.generateAccessToken(refreshToken)
        res.send(new ResponseHandler(result))
    } catch (error) {
        next(error)
    }
})
router.post("/login", LOGIN_VALIDATOR, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const credentials = req.body;
        const result = await authService.login(credentials);
        res.send(new ResponseHandler(result))
    } catch (error) {
        next(error)
    }
})


export default router;