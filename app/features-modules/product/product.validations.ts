import { body ,query} from "express-validator";
import { validate } from "../../utilities/validate";

export const ADD_PRODUCT_VALIDATIONS = [
    body("name").exists().withMessage("name is required").isString().isLength({ min: 3 }).withMessage("name length should be atleast 3"),
    body("price").exists().withMessage("price is required").isInt({ min: 1 }).withMessage("price value must be a numeric value"),
    body("points").exists().withMessage("points is required").isInt({ min: 0 }).withMessage("points value must be a numeric value"),
    body("threshold").exists().withMessage("threshold is required").isInt({ min: 1 }).withMessage("threshold value must be a numeric value and should be atleast 1"),
    validate
]
export const PRODUCT_UPDATE_VALIDATIONS = [
    body("_id").exists().withMessage("name is required").isMongoId().withMessage("should be a valid mongodbId format"),
    body("name").optional().isString().isLength({ min: 3 }).withMessage("name length should be atleast 3"),
    body("price").optional().isInt({ min: 1 }).withMessage("price value must be a numeric value"),
    body("points").optional().isInt({ min: 0 }).withMessage("points value must be a numeric value"),
    body("threshold").optional().isInt({ min: 1 }).withMessage("threshold value must be a numeric value and should be atleast 1"),
    validate
]