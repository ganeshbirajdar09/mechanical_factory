export const AUTH_RESPONSES = {
    INVALID_CREDENTIALS: {
        statusCode: 400,
        message: "Invalid Credentials"
    },
    ALREADY_EXISTS: {
        statusCode: 409,
        message: "user already exists"
    },
    INVALID_TOKEN: {
        statusCode: 401,
        message: "Unauthorized"
    }
}