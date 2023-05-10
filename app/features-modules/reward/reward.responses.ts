export const REWARD_RESPONSES = {
    NOT_FOUND: {
        statusCode: 404,
        message: 'reward not found'
    },
    UPDATE_SUCCESS: {
        statusCode: 201,
        message: 'data updated successfully'
    },
    UPDATE_FAILURE: {
        statusCode: 403,
        message: 'could not update the data'
    },
    DELETE_SUCCESS: {
        statusCode: 200,
        message: 'data deleted successfully'
    },
    DELETE_FAILURE: {
        statusCode: 403,
        message: 'could not delete the data'
    },
    SOMETHING_WENT_WRONG: {
        statusCode: 500,
        message: 'something went wrong'
    },
    ALREADY_EXISTS: {
        statusCode: 409,
        message: 'reward already exists'
    },
    INSUFFICIENT_POINTS: {
        statusCode: 400,
        message: "insufficient points"
    },
    REDEEM_SUCCESSFULL: {
        statusCode: 200,
        message: "reward redeemed successfully"
    },
    SUCCESSFULL_REDEEM_REQUESTED: {
        statusCode: 200,
        message: "redeeem request received"
    },
    REDEEM_REQUEST_DELETE_SUCCESS: {
        statusCode: 200,
        message: 'redeem request deleted successfully'
    },

}