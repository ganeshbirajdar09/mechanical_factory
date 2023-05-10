import { NextFunction, Request, Response, Router } from "express";
import { permit } from "../../utilities/authorize";
import { ResponseHandler } from "../../utilities/response-handler";
import { ROLES } from "../../utilities/constants";
import transactionService from "./transaction.service";
import { SALES_TRANSACTION_APPROVE_VALIDATIONS } from "./transaction.validations";
import { PAGINATION_VALIDATIONS } from "../../utilities/database.utilities";

const router = Router();

router.patch("/approve/redeem/:redeemId", permit([ROLES.ADMIN]), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await transactionService.approveRedeemTransaction(req.params.redeemId);
        res.send(new ResponseHandler(result))
    } catch (error) {
        next(error)
    }
})

//all sales
router.get("/sales", permit([ROLES.ADMIN]), PAGINATION_VALIDATIONS, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const queryData = req.query
        const result = await transactionService.getAllTransactions(queryData);
        res.send(new ResponseHandler(result))
    } catch (error) {
        next(error)
    }
})


router.get("/sales/revenue", permit([ROLES.ADMIN]), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const queryData = req.query
        const result = await transactionService.getRevenueByMonth(queryData);
        res.send(new ResponseHandler(result))
    } catch (error) {
        next(error)
    }
})
router.patch("/sales/status", permit([ROLES.ADMIN]), SALES_TRANSACTION_APPROVE_VALIDATIONS, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const status = req.body
        const result = await transactionService.setSalesTransactionStatus(status);
        res.send(new ResponseHandler(result))
    } catch (error) {
        next(error)
    }
})



export default router;