export const errorResponse = (res, message = 'Error', statusCode = 500) => {
    return res.status(statusCode).json({
        success: false,
        message,
    });
};
