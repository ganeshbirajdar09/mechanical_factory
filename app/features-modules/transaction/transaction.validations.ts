import { body ,query} from "express-validator";
import { validate } from "../../utilities/validate";

export const SALES_TRANSACTION_APPROVE_VALIDATIONS = [
    body("status").isMongoId().withMessage("status is required"),
    body("salesId").isMongoId().withMessage("salesId is required"),
    validate
]

