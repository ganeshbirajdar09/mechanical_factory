export const SHOP_RESPONSE = {
    NOT_FOUND: {
        statusCode: 404,
        message: 'shop not found'
    },
    UPDATE_SUCCESS: {
        statusCode: 201,
        message: 'shop updated successfully'
    },
    UPDATE_FAILURE: {
        statusCode: 403,
        message: 'could not update the shop'
    },
    DELETE_SUCCESS: {
        statusCode: 200,
        message: 'shop deleted successfully'
    },
    DELETE_FAILURE: {
        statusCode: 403,
        message: 'could not delete the shop'
    },
    SOMETHING_WENT_WRONG: {
        statusCode: 500,
        message: 'something went wrong'
    },
    ALREADY_EXISTS: {
        statusCode: 409,
        message: 'shop already exists'
    },
    NOT_APPROVED: {
        statusCode: 406,
        message: 'shop is not yet been approved'
    },
    SUCCESSFULL_SALES_REGISTRATION: {
        statusCode: 200,
        message: "sales registered successfully "
    },
    SHOP_RATING_SUCCESS: {
        statusCode: 200,
        message: "thankyou for rating the shop"
    },
    INSUFFICIENT_QUANTITY: {
        statusCode: 400,
        message: "insufficient product quantity"
    },

}