import { NextFunction, Request, Response, Router } from "express";
import { permit } from "../../utilities/authorize";
import { ResponseHandler } from "../../utilities/response-handler";
import shopService from "./shop.service";
import { ROLES } from "../../utilities/constants";
import { CREATE_SHOP_VALIDATIONS, DELETE_SALES_VALIDATIONS, DELETE_SHOP_VALIDATIONS, EDIT_SALES_VALIDATIONS, GENERATE_SALES_VALIDATIONS, REVIEW_VALIDATIONS, UPDATE_SHOP_VALIDATIONS } from "./shop.validations";
import { PAGINATION_VALIDATIONS } from "../../utilities/database.utilities";

const router = Router();

router.get("/all", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await shopService.allShops();
        res.send(new ResponseHandler(result))
    } catch (error) {
        next(error)
    }
})

//get all admin
router.get("/", permit([ROLES.ADMIN]), PAGINATION_VALIDATIONS, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const queryData = req.query;
        const result = await shopService.find(queryData);
        res.send(new ResponseHandler(result))
    } catch (error) {
        next(error)
    }
})

//shops running low
router.get("/status", permit([ROLES.ADMIN]), PAGINATION_VALIDATIONS, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const queryData = req.query;
        const result = await shopService.shopsRunningLow(queryData);
        res.send(new ResponseHandler(result))

    } catch (error) {
        next(error)
    }
})

router.post("/create", permit([ROLES.ADMIN]), CREATE_SHOP_VALIDATIONS, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password, ...shop } = req.body
        const result = await shopService.create({ name, email, password }, shop);
        res.send(new ResponseHandler(result))

    } catch (error) {
        next(error)
    }
})

//sales
router.get("/sales", permit([ROLES.OWNER]), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id: ownerId } = res.locals.user
        const result = await shopService.salesRequests(ownerId);
        res.send(new ResponseHandler(result))

    } catch (error) {
        next(error)
    }
})
router.post("/sales", permit([ROLES.OWNER]), GENERATE_SALES_VALIDATIONS, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { salesData } = req.body
        const { id: ownerId } = res.locals.user
        const result = await shopService.salesEntry(ownerId, salesData);
        res.send(new ResponseHandler(result))

    } catch (error) {
        next(error)
    }
})
router.patch("/sales", permit([ROLES.OWNER]), EDIT_SALES_VALIDATIONS, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const salesData = req.body
        const { id: ownerId } = res.locals.user
        const result = await shopService.editSales(ownerId, salesData);
        res.send(new ResponseHandler(result))

    } catch (error) {
        next(error)
    }
})
router.delete("/sales", permit([ROLES.OWNER]), DELETE_SALES_VALIDATIONS, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { salesId } = req.body
        const { id: ownerId } = res.locals.user
        const result = await shopService.deleteSales(ownerId, salesId);
        res.send(new ResponseHandler(result))

    } catch (error) {
        next(error)
    }
})

// update shop
router.patch("/:id", permit([ROLES.ADMIN]), UPDATE_SHOP_VALIDATIONS, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { location } = req.body
        const result = await shopService.updateShopDetails(req.params.id, location);
        res.send(new ResponseHandler(result))
    } catch (error) {
        next(error)
    }
})
router.delete("/:id", permit([ROLES.ADMIN]), DELETE_SHOP_VALIDATIONS, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await shopService.removeShopWithOwner(req.params.id);
        res.send(new ResponseHandler(result))
    } catch (error) {
        next(error)
    }
})
router.get("/:id/inventory", permit([ROLES.ADMIN, ROLES.OWNER]), PAGINATION_VALIDATIONS, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const queryData = req.query
        const result = await shopService.getInventory(req.params.id, queryData);
        res.send(new ResponseHandler(result))

    } catch (error) {
        next(error)
    }
})

router.get("/:id", permit([ROLES.ADMIN, ROLES.OWNER]), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await shopService.findShop(req.params.id);
        res.send(new ResponseHandler(result))
    } catch (error) {
        next(error)
    }
})

router.post("/review", REVIEW_VALIDATIONS, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reviewData = req.body
        const result = await shopService.rateShop(reviewData);
        res.send(new ResponseHandler(result))
    } catch (error) {
        next(error)
    }
})


export default router;