import userModel from '../../db/model/User.model.js';
import jwt from 'jsonwebtoken';
import * as dbService from '../../db/db.service.js';
import { tokenTypes } from '../types/tokenTypes.js';
import { decodeEncryption } from './encryption.js';

export const generateToken = ({
    payload = {},
    signature = process.env.USER_ACCESS_TOKEN,
    expireIn = parseInt(process.env.EXPIRE_IN)
} = {}) => {
    const token = jwt.sign(payload, signature, { expiresIn: expireIn });
    return token;
};

export const verifyToken = ({
    token = '',
    signature = process.env.USER_ACCESS_TOKEN,
} = {}) => {
    const decoded = jwt.verify(token, signature);
    return decoded;
};

export const decodeToken = async ({
    authorization = '',
    tokenType = tokenTypes.access
} = {}) => {
    const [bearer, token] = authorization.split(' ');

    if (!bearer || !token) {
        return next(new Error(`Invalid token`, { cause: 400 }));
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
        return next(new Error(`Invalid token payload`, { cause: 401 }));
    };

    const user = await dbService.findOne({
        model: userModel,
        filter: { _id: decoded.id }
    })

    if (!user) {
        return next(new Error(`User not found or deactivated`, { cause: 404 }));
    }
    if (user.changeCredentialTime?.getTime() >= decoded.iat * 1000) {
        return next(new Error(`Token expired due to credential change`, { cause: 400 }));
    }
    user.phone = decodeEncryption({ cipherText: user.phone })
    return user;
}