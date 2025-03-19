// Import files
import userModel from "../../../db/model/User.model.js";
import { emailEvent } from "../../../utils/events/email.event.js";
import { asyncHandler } from "../../../utils/response/error.response.js";
import { successResponse } from "../../../utils/response/success.response.js";
import { compareHash, generateHash } from "../../../utils/security/hash.security.js";
import * as dbService from '../../../db/db.service.js';
import { subjectTypes } from "../../../utils/email/send.email.js";

// Password Recovery
export const forgetPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body;

    // Find user by email
    const user = await dbService.findOne({
        model: userModel,
        filter: { email }
    });

    if (!user) {
        return next(new Error(`User not found`, { cause: 404 }));
    }
    if (!user.isConfirmed) {
        return next(new Error(`Please verify your email first`, { cause: 404 }));
    }

    // Trigger password reset email with OTP
    emailEvent.emit('sendForgetPassword', { id:user._id, email });

    return successResponse({
        res,
        message: `OTP sent successfully. Please check your email.`
    });
})

// Password Reset
export const resetPassword = asyncHandler(async (req, res, next) => {
    const { email, otp, password } = req.body;

    // Find user and validate account status
    const user = await dbService.findOne({
        model: userModel,
        filter: { email }
    });

    if (!user) return next(new Error(`User not found`, { cause: 404 }));
    if (!user.isConfirmed) return next(new Error(`Please verify your email first`, { cause: 404 }));

    // Extract latest password reset OTP
    const latestOTP = user.OTP
        .filter(otpItem => otpItem.type === subjectTypes.resetPassword)
        .sort((a, b) => b.expiresIn - a.expiresIn)[0]; 

    // Validate OTP existence and expiration
    if (!latestOTP || latestOTP.expiresIn < Date.now()) {
        return next(new Error('Reset code has expired', { cause: 400 }));
    }

    // Verify OTP matches stored hash
    if (!compareHash({ plainText: otp, hashValue: latestOTP.code })) {
        return next(new Error('Invalid reset code', { cause: 400 }));
    }

    // Generate secure password hash
    const hashPassword = generateHash({ plainText: password });

    // Update user credentials and clear used OTP
    await dbService.updateOne({
        model: userModel,
        filter: { email },
        data: {
            password: hashPassword,
            isConfirmed: true,
            changeCredentialTime: Date.now(),
            $pull: { OTP: { code: latestOTP.code } }
        }
    });

    return successResponse({
        res, message: `Password has been reset successfully`
    });
})