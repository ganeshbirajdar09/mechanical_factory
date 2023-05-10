import { body, param } from "express-validator";
import { validate } from "../../utilities/validate";

export const CREATE_ORDER_VALIDATIONS = [
    body("products").exists().withMessage("products are required").isArray().isLength({ min: 1 }).withMessage("products must include atleast 1 product"),
    body("products.*.productId").exists().withMessage("productId is required").isMongoId().withMessage("productId must be a in a valid mongoId format"),
    body("products.*.quantity").exists().withMessage("quantity is required").isInt({ min: 1 }).withMessage("quantity must be atleast 1"),
    validate
]
export const UPDATE_ORDER_VALIDATIONS = [
    body("orderId").exists().withMessage("orderId is required").isMongoId().withMessage("should be a valid mongoId format"),
    body("products").exists().withMessage("products are required").isArray().isLength({ min: 1 }).withMessage("products must include atleast 1 product"),
    body("products.*.productId").exists().withMessage("productId is required").isMongoId().withMessage("productId must be a in a valid mongoId format"),
    body("products.*.quantity").exists().withMessage("quantity is required").isInt({ min: 1 }).withMessage("quantity must be atleast 1"),
]
export const CHANGE_ORDER_STATUS_VALIDATIONS = [
    body("_id").exists().withMessage("_id is required").isMongoId().withMessage("_id is required"),
    body("productId").optional().isMongoId().withMessage("productId should be a valid mongoId "),
    validate
]
export const ORDER_BY_ID_VALIDATIONS = [
    param("id").exists().withMessage("id is required").isMongoId().withMessage("should be a valid mongoId"),
    validate
]
export const DELETE_ORDER_VALIDATIONS = [
    body("orderId").exists().withMessage("orderId is required").isMongoId().withMessage("should be a valid mongoId"),
    validate
]
