import { NextFunction, Request, Response, Router } from "express";
import { ResponseHandler } from "../../utilities/response-handler";
import orderService from "./order.service";
import { CHANGE_ORDER_STATUS_VALIDATIONS, CREATE_ORDER_VALIDATIONS, DELETE_ORDER_VALIDATIONS, ORDER_BY_ID_VALIDATIONS, UPDATE_ORDER_VALIDATIONS } from "./order.validations";
import { permit } from "../../utilities/authorize";
import { ROLES } from "../../utilities/constants";
import { IGenericPipleline, PAGINATION_VALIDATIONS } from "../../utilities/database.utilities";

const router = Router();


//owners orders
router.get("/", permit([ROLES.OWNER]), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = res.locals.user;
        const result = await orderService.findOrdersByShop(id);
        res.send(new ResponseHandler(result))
    } catch (error) {
        next(error)
    }
})
router.post("/create", permit([ROLES.OWNER]), CREATE_ORDER_VALIDATIONS, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const order = req.body;
        const { id } = res.locals.user;
        const result = await orderService.create(order, id);
        res.send(new ResponseHandler(result))

    } catch (error) {
        next(error)
    }
})
router.patch("/edit", permit([ROLES.OWNER]), UPDATE_ORDER_VALIDATIONS, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orderData = req.body;
        const { id: ownerId } = res.locals.user;
        const result = await orderService.onwerEditOrder(ownerId, orderData);
        res.send(new ResponseHandler(result))

    } catch (error) {
        next(error)
    }
})
router.delete("/remove", permit([ROLES.OWNER]), DELETE_ORDER_VALIDATIONS, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {orderId} = req.body;
        const { id: ownerId } = res.locals.user;
        const result = await orderService.removeOrder(ownerId, orderId);
        res.send(new ResponseHandler(result))

    } catch (error) {
        next(error)
    }
})
router.get("/all", permit([ROLES.ADMIN]), PAGINATION_VALIDATIONS,async (req: Request, res: Response, next: NextFunction) => {
    try {
        const queryData: IGenericPipleline = req.query
        const result = await orderService.findAll(queryData);
        res.send(new ResponseHandler(result))
    } catch (error) {
        next(error)
    }
})
//approve
router.patch("/status", permit([ROLES.ADMIN]), CHANGE_ORDER_STATUS_VALIDATIONS, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { _id, productId } = req.body;
        const result = await orderService.approveOrder(_id, productId);
        res.send(new ResponseHandler(result))

    } catch (error) {
        next(error)
    }
})

router.get("/:id", permit([ROLES.ADMIN,ROLES.OWNER]), ORDER_BY_ID_VALIDATIONS, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await orderService.findOne(req.params.id);
        res.send(new ResponseHandler(result))
    } catch (error) {
        next(error)
    }
})



export default router