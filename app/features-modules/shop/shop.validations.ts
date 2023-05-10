import { body, param, query } from "express-validator";
import { validate } from "../../utilities/validate";

export const CREATE_SHOP_VALIDATIONS = [
    body("name").exists().withMessage("name is required").isString().withMessage("name should be a string"),
    body("email").exists().withMessage("email is required").isEmail().withMessage("email should in a valid email format"),
    body("password").exists().withMessage("password is required").isLength({ min: 3 }).withMessage("password is required"),
    body("location").exists().withMessage("location is required").isString().isLength({ min: 1 }),
    validate
]
export const GENERATE_SALES_VALIDATIONS = [
    body("salesData").exists().withMessage("salesData is required").isArray().isLength({ min: 1 }).withMessage("salesData must contain atleast one entry"),
    body("salesData.*.productId").exists().withMessage("productId is required").isMongoId().withMessage("productId must be a in a valid mongoId format"),
    body("salesData.*.quantity").exists().withMessage("quantity is required").isInt({ min: 1 }).withMessage("quantity must be atleast 1"),
    validate
]
export const REVIEW_VALIDATIONS = [
    body("shopId").exists().withMessage("shopId is required").isMongoId().withMessage("must be a in a valid mongoId format"),
    body("rating").exists().withMessage("rating is required").isInt({ min: 1, max: 5 }).withMessage("rating must be numeric and between 1 and 5"),
    validate
]
export const EDIT_SALES_VALIDATIONS = [
    body("salesId").exists().withMessage("salesId is required").isMongoId().withMessage("salesId must be a in a valid mongoId format"),
    body("products").exists().withMessage("products are required").isArray().isLength({ min: 1 }).withMessage("there must be atleast 1 product"),
    body("products.*.productId").exists().withMessage("productId is required").isMongoId().withMessage("productId must be a in a valid mongoId format"),
    body("products.*.quantity").exists().withMessage("quantity is required").isInt({ min: 1 }).withMessage("quantity must be atleast 1"),
    body("products.*.price").exists().withMessage("price is required").isInt({ min: 1 }).withMessage("price must be atleast 1"),

    validate
]
export const DELETE_SALES_VALIDATIONS = [
    body("salesId").exists().withMessage("salesId is required").isMongoId().withMessage("must be a in a valid mongoId format"),
    validate
]
export const UPDATE_SHOP_VALIDATIONS = [
    body("location").exists().withMessage("location is required").isString().isLength({ min: 1 }),
    param("id").exists().withMessage("id(shopId) is requrired").isMongoId().withMessage("must be a in a valid mongoId format"),
    validate
]
export const DELETE_SHOP_VALIDATIONS = [
    param("id").exists().withMessage("id(shopId) is requrired").isMongoId().withMessage("must be a in a valid mongoId format"),
    validate
]

