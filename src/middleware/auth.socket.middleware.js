// Import files
import userModel from '../db/model/User.model.js';
import * as dbService from '../db/db.service.js';
import { tokenTypes } from '../utils/types/tokenTypes.js';
import { verifyToken } from '../utils/security/token.security.js';

// WebSocket Authentication Middleware
export const authenticationSocket = async ({
    socket = {},
    tokenType = tokenTypes.access
} = {}) => {
    // Extract authorization header
    const [bearer, token] = socket.handshake?.auth?.authorization?.split(' ');

    if (!bearer || !token) {
        return { data: { message: "Invalid token", status: 400 } };
    }

    // Initialize token verification signatures
    let accessSignature, refreshSignature;

    // Determine authentication strategy based on bearer type
    switch (bearer) {
        case 'system': // Internal system authentication
            accessSignature = process.env.SYSTEM_ACCESS_TOKEN
            refreshSignature = process.env.SYSTEM_REFRESH_TOKEN
            break;
        case 'Bearer': // Standard user authentication
            accessSignature = process.env.USER_ACCESS_TOKEN
            refreshSignature = process.env.USER_REFRESH_TOKEN
            break;
        case 'companyOwner': // Company owner authentication
            accessSignature = process.env.companyOwner_ACCESS_TOKEN
            refreshSignature = process.env.companyOwner_REFRESH_TOKEN
            break;
        case 'companyHR': // Company HR authentication
            accessSignature = process.env.companyHR_ACCESS_TOKEN
            refreshSignature = process.env.companyHR_REFRESH_TOKEN
            break;
        default:
            break;
    };

    // Verify token validity using appropriate signature
    const decoded = verifyToken({
        token, signature: tokenType == tokenTypes.access ? accessSignature : refreshSignature
    });

    // Validate token payload structure
    if (!decoded?.id) {
        return { data: { message: "Invalid token payload", status: 401 }};
    };

    // Fetch user from database using decoded ID
    const user = await dbService.findOne({
        model: userModel,
        filter: { _id: decoded.id }
    })

    if (!user) {
        return { data: { message: "User not found or deactivated", status: 400 }};
    }
    // Check if credentials changed after token issuance
    if (user.changeCredentialTime?.getTime() >= decoded.iat * 1000) {
        return { data: { message: "Token expired due to credential change", status: 400 }};
    }
    // Return successful authentication with user data
    return { data: { user, valid: true }};
}