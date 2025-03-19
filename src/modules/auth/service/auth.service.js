// Import files
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

// Registration
export const signup = asyncHandler(
    async (req, res, next) => {
        const { firstName, lastName, email, password, phone, DOB, gender } = req.body;

        // Check for existing email in database
        if (await dbService.findOne({ model: userModel, filter: { email } })) {
            return next(new Error(`Email exist`, { cause: 409 }));
        }

        // Encrypt sensitive phone number data
        const encryptPhone = generateEncryption({
            plainText: phone,
        });

        // Hash user password for secure storage
        const hashPassword = generateHash({
            plainText: password,
        });

        // Create new user record
        const user = await dbService.create({
            model: userModel,
            data: { firstName, lastName, email, password: hashPassword, phone: encryptPhone, DOB, gender }
        })

        // Trigger email verification process
        emailEvent.emit('sendEmail', { id: user._id, email })

        return successResponse({ res, message: `Done`, status: 201 })
    }
);

// Email Confirmation
export const confirmEmail = asyncHandler(
    async (req, res, next) => {
        const { email, otp } = req.body;
        // Find user by email
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

        // Get latest OTP from user's OTP array
        const latestOTP = user.OTP[user.OTP.length - 1];

        // Validate OTP expiration and type
        if (!latestOTP || latestOTP.expiresIn < Date.now()) {
            return next(new Error(`OTP has expired`, { cause: 400 }));
        };

        if (latestOTP.type !== "confirm-email") {
            return next(new Error(`Invalid OTP type`, { cause: 400 }));
        };

        // Verify OTP hash match
        if (!compareHash({ plainText: `${otp}`, hashValue: latestOTP.code })) {
            return next(new Error(`In-valid OTP`, { cause: 400 }));
        }

        // Update user confirmation status and remove used OTP
        await dbService.updateOne({
            model: userModel,
            filter: { email },
            data: { isConfirmed: true, $pull: { OTP: { code: latestOTP.code } } }
        })
        return successResponse({ res, message: `Done`, status: 200, data: { user } });
    }
);

// OTP Resend 
export const resendOTP = asyncHandler(async (req, res, next) => {
    const { email } = req.body;

    // Find user and validate status
    const user = await dbService.findOne({
        model: userModel,
        filter: { email }
    });

    if (!user) return next(new Error(`User not found`, { cause: 404 }));
    if (user.isConfirmed) return next(new Error(`Email already confirmed`, { cause: 409 }));

    // Clear existing OTP
    await dbService.updateOne({
        model: userModel,
        filter: { _id: user._id },
        data: { $unset: { emailOTP: 1 } }
    });

    // Trigger new OTP email
    emailEvent.emit('sendEmail', { id: user._id, email })

    return successResponse({ res, message: `OTP resent successfully. Please check your email.` });
});

// Token Refresh
export const refreshToken = asyncHandler(async (req, res, next) => {
    // Decode and verify refresh token
    const user = await decodeToken({
        authorization: req.headers.authorization,
        tokenType: tokenTypes.refresh
    })

    // Generate new access token with role-based signature
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

    // Generate new refresh token with extended expiration
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
