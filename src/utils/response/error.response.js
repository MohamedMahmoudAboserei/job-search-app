// Higher-order function to handle asynchronous errors automatically
export const asyncHandler = (fn) => {
    return async (req, res, next) => {
        return fn(req, res, next).catch(error => {
            error.status = 500;
            return next(error);
        })
    }
};

// Global error handling middleware to manage application errors
export const globalErrorHandling = (error, req, res, next) => {
    // If in development mode, return detailed error message with stack trace
    if (process.env.MOOD == "DEV") {
        return res.status(error.cause || 400).json({ message: error.message, stack: error.stack });
    }
    // If in production mode, return only the error message
    return res.status(error.cause || 400).json({ message: error.message })
};