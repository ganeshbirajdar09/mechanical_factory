import { NextFunction, Request, Response, Router, query } from "express";
import { permit } from "../../utilities/authorize";
import { ResponseHandler } from "../../utilities/response-handler";
import { ROLES } from "../../utilities/constants";
import rewardService from "./reward.service";
import { ADD_REWARD_VALIDATIONS, DELETE_REDEEM_REQUEST_VALIDATIONS, REDEEM_REWARD_VALIDATIONS, UDPATE_REWARD_VALIDATIONS } from "./reward.validations";
import { PAGINATION_VALIDATIONS } from "../../utilities/database.utilities";


const router = Router();


router.get("/all", permit([ROLES.ADMIN, ROLES.OWNER]), PAGINATION_VALIDATIONS, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const queryData = req.query
        const result = await rewardService.allRewards(queryData)
        res.send(new ResponseHandler(result))

    } catch (error) {
        next(error)
    }
})
router.get("/leaderboard/owners", permit([ROLES.ADMIN, ROLES.OWNER]), PAGINATION_VALIDATIONS, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const queryData = req.query
        const result = await rewardService.ownerLeaderboard(queryData)
        res.send(new ResponseHandler(result))

    } catch (error) {
        next(error)
    }
})
router.get("/leaderboard/shops", permit([ROLES.ADMIN, ROLES.OWNER]), PAGINATION_VALIDATIONS, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const queryData = req.query
        const result = await rewardService.shopLeaderboard(queryData)
        res.send(new ResponseHandler(result))
    } catch (error) {
        next(error)
    }
})
//eligible rewards for owner
router.get("/", permit([ROLES.OWNER]), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const queryData = req.query;
        const { id } = res.locals.user;
        const result = await rewardService.getOwnerRewardInfo(queryData, id)
        res.send(new ResponseHandler(result))
    } catch (error) {
        next(error)
    }
})

router.post("/redeem", permit([ROLES.OWNER]), REDEEM_REWARD_VALIDATIONS, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { rewardId } = req.body
        const { id } = res.locals.user
        const result = await rewardService.redeemReward(id, rewardId);
        res.send(new ResponseHandler(result))
    } catch (error) {
        next(error)
    }
})
router.delete("/redeem", permit([ROLES.OWNER]), DELETE_REDEEM_REQUEST_VALIDATIONS, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { requestId } = req.body
        const { id } = res.locals.user
        const result = await rewardService.deleteRedeemRequest(id, requestId);
        res.send(new ResponseHandler(result))
    } catch (error) {
        next(error)
    }
})
router.post("/create", permit([ROLES.ADMIN]), ADD_REWARD_VALIDATIONS, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reward = req.body
        const result = await rewardService.create(reward);
        res.send(new ResponseHandler(result))

    } catch (error) {
        next(error)
    }
})

router.patch("/update", permit([ROLES.ADMIN]), UDPATE_REWARD_VALIDATIONS, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { _id, ...data } = req.body;
        const result = await rewardService.updateReward(_id, data);
        res.send(new ResponseHandler(result))

    } catch (error) {
        next(error)
    }
})

router.get("/requests", permit([ROLES.ADMIN, ROLES.OWNER]), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = res.locals.user
        const result = await rewardService.rewardRequests(id);
        res.send(new ResponseHandler(result))

    } catch (error) {
        next(error)
    }
})
router.get("/:id", permit([ROLES.ADMIN, ROLES.OWNER]), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params
        const result = await rewardService.findOne(id);
        res.send(new ResponseHandler(result))

    } catch (error) {
        next(error)
    }
})
router.delete("/:id", permit([ROLES.ADMIN]), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params
        const result = await rewardService.removeReward(id);
        res.send(new ResponseHandler(result))

    } catch (error) {
        next(error)
    }
})


export default router;