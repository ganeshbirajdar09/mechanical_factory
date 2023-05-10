import { body , query} from "express-validator";
import { validate } from "../../utilities/validate";

export const ADD_REWARD_VALIDATIONS = [
    body("name").exists().withMessage("name is required").isString().isLength({ min: 3 }).withMessage("name length should be atleast 3"),
    body("points").exists().withMessage("points is required").isInt({ min: 1 }).withMessage("points value must be a numeric value and atleast 1"),
    validate
]
export const REDEEM_REWARD_VALIDATIONS = [
    body("rewardId").exists().withMessage("rewardId is required").isMongoId().withMessage("rewardId is required"),
    validate
]
export const UDPATE_REWARD_VALIDATIONS = [
    body("_id").exists().withMessage("_id is required").isMongoId().withMessage("should be a valid mongodbId format"),
    validate
]
export const DELETE_REDEEM_REQUEST_VALIDATIONS = [
    body("requestId").exists().withMessage("requestId is required").isMongoId().withMessage("should be a valid mongodbId format"),
    validate
]
