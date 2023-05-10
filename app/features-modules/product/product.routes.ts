import { NextFunction, Request, Response, Router } from "express";
import { ResponseHandler } from "../../utilities/response-handler";
import { ADD_PRODUCT_VALIDATIONS, PRODUCT_UPDATE_VALIDATIONS } from "./product.validations";
import productService from "./product.service";
import { permit } from "../../utilities/authorize";
import { ROLES } from "../../utilities/constants";
import { PAGINATION_VALIDATIONS } from "../../utilities/database.utilities";

const router = Router();

router.get("/", permit([ROLES.ADMIN, ROLES.OWNER]), PAGINATION_VALIDATIONS,async (req: Request, res: Response, next: NextFunction) => {
    try {
        const queryData = req.query;
        const result = await productService.find(queryData);
        res.send(new ResponseHandler(result))
    } catch (error) {
        next(error)
    }
})

//highest selling
router.get("/sales", permit([ROLES.ADMIN]), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const queryData = req.query;
        const result = await productService.productWiseHighestSellers(queryData);
        res.send(new ResponseHandler(result))
    } catch (error) {
        next(error)
    }
})

router.post("/create", permit([ROLES.ADMIN]), ADD_PRODUCT_VALIDATIONS, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = req.body;
        const result = await productService.create(product);
        res.send(new ResponseHandler(result))

    } catch (error) {
        next(error)
    }
})
router.patch("/update", permit([ROLES.ADMIN]), PRODUCT_UPDATE_VALIDATIONS, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { _id, ...data } = req.body;
        const result = await productService.updateProduct(_id, data);
        res.send(new ResponseHandler(result))

    } catch (error) {
        next(error)
    }
})
router.delete("/:id", permit([ROLES.ADMIN]), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params
        const result = await productService.removeProduct(id);
        res.send(new ResponseHandler(result))

    } catch (error) {
        next(error)
    }
})


export default router