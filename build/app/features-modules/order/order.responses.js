"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ORDER_RESPONSES = void 0;
exports.ORDER_RESPONSES = {
    NOT_FOUND: {
        statusCode: 404,
        message: 'order not found'
    },
    UPDATE_SUCCESS: {
        statusCode: 201,
        message: 'order updated successfully'
    },
    UPDATE_FAILURE: {
        statusCode: 403,
        message: 'could not update the order'
    },
    DELETE_SUCCESS: {
        statusCode: 200,
        message: 'order deleted successfully'
    },
    DELETE_FAILURE: {
        statusCode: 403,
        message: 'could not delete the order'
    },
    SOMETHING_WENT_WRONG: {
        statusCode: 500,
        message: 'something went wrong'
    },
    ALREADY_EXISTS: {
        statusCode: 409,
        message: 'order already exists'
    },
    ALREADY_APPROVED: {
        statusCode: 500,
        message: 'order is already approved'
    },
};
