"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRODUCT_RESPONSES = void 0;
exports.PRODUCT_RESPONSES = {
    NOT_FOUND: {
        statusCode: 404,
        message: 'product not found'
    },
    UPDATE_SUCCESS: {
        statusCode: 201,
        message: 'product updated successfully'
    },
    UPDATE_FAILURE: {
        statusCode: 403,
        message: 'could not update the product'
    },
    DELETE_SUCCESS: {
        statusCode: 200,
        message: 'product deleted successfully'
    },
    DELETE_FAILURE: {
        statusCode: 403,
        message: 'could not delete the product'
    },
    SOMETHING_WENT_WRONG: {
        statusCode: 500,
        message: 'something went wrong'
    },
    ALREADY_EXISTS: {
        statusCode: 409,
        message: 'product already exists'
    },
};
