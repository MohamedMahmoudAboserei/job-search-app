export const asyncHandler = (fn) => {
    return async (req, res, next) => {
        return fn(req, res, next).catch(error => {
            error.status = 500;
            return next(error);
        })
    }
};

export const globalErrorHandling = (error, req, res, next) => {
    if (process.env.MOOD == "DEV") {
        return res.status(error.cause || 400).json({ message: error.message, stack: error.stack });
    }
    return res.status(error.cause || 400).json({ message: error.message })
};