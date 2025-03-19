// Import files
import { asyncHandler } from "../utils/response/error.response.js";
import { decodeToken } from "../utils/security/token.security.js";

// Authentication Middleware
export const authentication = () => {
    return asyncHandler(async (req, res, next) => {
        // Extract and verify JWT from Authorization header
        req.user = await decodeToken({ authorization: req.headers.authorization });
        // Proceed to next middleware/controller
        return next();
    })
}

// Authorization Middleware
export const authorization = (accessRoles = []) => {
    return asyncHandler(async (req, res, next) => {
        // Verify user has required role
        if (!accessRoles.includes(req.user.role)) {
            return next(new Error('Not authorization account', { cause: 403 }));
        }
        // Proceed if authorization succeeds
        return next();
    })
}