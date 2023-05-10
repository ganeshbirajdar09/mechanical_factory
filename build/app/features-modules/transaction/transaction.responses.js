"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TRANSACTION_RESPONSES = void 0;
exports.TRANSACTION_RESPONSES = {
    NOT_FOUND: {
        statusCode: 404,
        message: 'transaction not found'
    },
    UPDATE_SUCCESS: {
        statusCode: 201,
        message: 'transaction data updated successfully'
    },
    UPDATE_FAILURE: {
        statusCode: 403,
        message: 'could not update the transaction data'
    },
    DELETE_SUCCESS: {
        statusCode: 200,
        message: 'transaction data deleted successfully'
    },
    DELETE_FAILURE: {
        statusCode: 403,
        message: 'could not delete the transaction data'
    },
    SOMETHING_WENT_WRONG: {
        statusCode: 500,
        message: 'something went wrong'
    },
    ALREADY_EXISTS: {
        statusCode: 409,
        message: 'transaction already exists'
    },
    REDEEM_REQUEST_APPROVED: {
        statusCode: 200,
        message: "redeem requested approved"
    },
    SALES_TRANSACTION_APPROVED: {
        statusCode: 200,
        message: "sales transaction approved"
    },
    SALES_TRANSACTION_REJECTED: {
        statusCode: 200,
        message: "sales transaction rejected"
    },
    SALES_ALREADY_REJECTED: {
        statusCode: 400,
        message: "sales transaction is already rejected"
    },
    SALES_ALREADY_APPROVED: {
        statusCode: 400,
        message: "sales transaction is already approved"
    },
    SALES_EDIT_SUCCESS: {
        statusCode: 200,
        message: "sales transaction edited successfully"
    },
    SALES_EDIT_FAILURE: {
        statusCode: 400,
        message: "sales transaction is already approved"
    },
    REDEEM_ALREADY_APPROVED: {
        statusCode: 400,
        message: "redeem request is already approved"
    },
};
