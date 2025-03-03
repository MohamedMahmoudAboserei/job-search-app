import userModel from "../../../db/model/User.model.js";
import { emailEvent } from "../../../utils/events/email.event.js";
import { asyncHandler } from "../../../utils/response/error.response.js";
import { successResponse } from "../../../utils/response/success.response.js";
import { generateEncryption } from "../../../utils/security/encryption.js";
import { compareHash, generateHash } from "../../../utils/security/hash.security.js";
import * as dbService from '../../../db/db.service.js';
import { decodeToken, generateToken } from "../../../utils/security/token.security.js";
import { roleTypes } from "../../../utils/types/roles.js";
import { tokenTypes } from "../../../utils/types/tokenTypes.js";

export const signup = asyncHandler(
    async (req, res, next) => {
        const { firstName, lastName, email, password, phone, DOB, gender } = req.body;

        if (await dbService.findOne({ model: userModel, filter: { email } })) {
            return next(new Error(`Email exist`, { cause: 409 }));
        }

        const encryptPhone = generateEncryption({
            plainText: phone,
        });

        const hashPassword = generateHash({
            plainText: password,
        });

        const user = await dbService.create({
            model: userModel,
            data: { firstName, lastName, email, password: hashPassword, phone: encryptPhone, DOB, gender }
        })

        emailEvent.emit('sendEmail', { id: user._id, email })

        return successResponse({ res, message: `Done`, status: 201 })
    }
);

export const confirmEmail = asyncHandler(
    async (req, res, next) => {
        const { email, otp } = req.body;
        const user = await dbService.findOne({
            model: userModel,
            filter: { email }
        });

        if (!user) {
            return next(new Error(`User not found`, { cause: 404 }));
        };

        if (user.confirmEmail) {
            return next(new Error(`Already confirmed`, { cause: 409 }));
        };

        const latestOTP = user.OTP[user.OTP.length - 1];

        if (!latestOTP || latestOTP.expiresIn < Date.now()) {
            return next(new Error(`OTP has expired`, { cause: 400 }));
        };

        if (latestOTP.type !== "confirm-email") {
            return next(new Error(`Invalid OTP type`, { cause: 400 }));
        };

        if (!compareHash({ plainText: `${otp}`, hashValue: latestOTP.code })) {
            return next(new Error(`In-valid OTP`, { cause: 400 }));
        }
        await dbService.updateOne({
            model: userModel,
            filter: { email },
            data: { isConfirmed: true, $pull: { OTP: { code: latestOTP.code } } }
        })
        return successResponse({ res, message: `Done`, status: 200, data: { user } });
    }
);

export const resendOTP = asyncHandler(async (req, res, next) => {
    const { email } = req.body;

    const user = await dbService.findOne({
        model: userModel,
        filter: { email }
    });

    if (!user) {
        return next(new Error(`User not found`, { cause: 404 }));
    }

    if (user.isConfirmed) {
        return next(new Error(`Email already confirmed`, { cause: 409 }));
    }

    await dbService.updateOne({
        model: userModel,
        filter: { _id: user._id },
        data: { $unset: { emailOTP: 1 } }
    });

    emailEvent.emit('sendEmail', { id: user._id, email })

    return successResponse({ res, message: `OTP resent successfully. Please check your email.` });
});

export const refreshToken = asyncHandler(async (req, res, next) => {
    const user = await decodeToken({ authorization: req.headers.authorization, tokenType: tokenTypes.refresh })

    const accessToken = generateToken({
        payload: {
            id: user._id, isLoggedIn: true
        },
        signature: user.role == roleTypes.user
            ?
            process.env.USER_ACCESS_TOKEN
            :
            process.env.SYSTEM_ACCESS_TOKEN,
    });
    const refreshToken = generateToken({
        payload: {
            id: user._id, isLoggedIn: true
        },
        signature: user.role == roleTypes.user
            ?
            process.env.SYSTEM_REFRESH_TOKEN
            :
            process.env.USER_REFRESH_TOKEN,
        expiresIn: "7d"
    });

    return successResponse({
        res, message: `Token refreshed successfully`, status: 200, data:
        {
            token: {
                accessToken,
                refreshToken
            }
        }
    });
})

