import userModel from '../db/model/User.model.js';
import * as dbService from '../db/db.service.js';
import { tokenTypes } from '../utils/types/tokenTypes.js';
import { verifyToken } from '../utils/security/token.security.js';

export const authenticationSocket = async ({
    socket = {},
    tokenType = tokenTypes.access
} = {}) => {
    const [bearer, token] = socket.handshake?.auth?.authorization?.split(' ');

    if (!bearer || !token) {
        return { data: { message: "Invalid token", status: 400 } };
    }

    let accessSignature, refreshSignature;

    switch (bearer) {
        case 'system':
            accessSignature = process.env.SYSTEM_ACCESS_TOKEN
            refreshSignature = process.env.SYSTEM_REFRESH_TOKEN
            break;
        case 'Bearer':
            accessSignature = process.env.USER_ACCESS_TOKEN
            refreshSignature = process.env.USER_REFRESH_TOKEN
            break;
        case 'companyOwner':
            accessSignature = process.env.companyOwner_ACCESS_TOKEN
            refreshSignature = process.env.companyOwner_REFRESH_TOKEN
            break;
        case 'companyHR':
            accessSignature = process.env.companyHR_ACCESS_TOKEN
            refreshSignature = process.env.companyHR_REFRESH_TOKEN
            break;
        default:
            break;
    };

    const decoded = verifyToken({
        token, signature: tokenType == tokenTypes.access ? accessSignature : refreshSignature
    });

    if (!decoded?.id) {
        return { data: { message: "Invalid token payload", status: 401 }};
    };

    const user = await dbService.findOne({
        model: userModel,
        filter: { _id: decoded.id }
    })

    if (!user) {
        return { data: { message: "User not found or deactivated", status: 400 }};
    }
    if (user.changeCredentialTime?.getTime() >= decoded.iat * 1000) {
        return { data: { message: "Token expired due to credential change", status: 400 }};
    }
    
    return { data: { user, valid: true }};
}