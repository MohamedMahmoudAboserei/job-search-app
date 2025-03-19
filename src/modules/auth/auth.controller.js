// Import files
import { Router } from "express";
import * as authService from './service/auth.service.js';
import * as loginService from './service/login.service.js';
import * as forgetPasswordService from './service/forgetPassword.service.js';
import { validation } from "../../middleware/validation.middleware.js";
import * as validators from './auth.validation.js';

// Create Express router instance
const router = Router();

// Signup with validation
router.post('/signup',
    validation(validators.signup),
    authService.signup
);
// Confirm email with validation
router.patch('/confirm-email',
    validation(validators.confirmEmail),
    authService.confirmEmail
);
// Resend OTP for email verification
router.post('/resend-otp',
    validation(validators.resendOTP),
    authService.resendOTP
);
// Refresh authentication token
router.get('/refresh-token',
    authService.refreshToken
);

// Login with validation
router.post('/login',
    validation(validators.login),
    loginService.login
);
// Login using Gmail without validation
router.post('/loginWithGmail',
    loginService.loginWithGmail
);

// Request password reset with validation
router.patch('/forget-password',
    validation(validators.forgetPassword),
    forgetPasswordService.forgetPassword
);
// Reset password with validation
router.patch('/reset-password',
    validation(validators.resetPassword),
    forgetPasswordService.resetPassword
);

// Export router
export default router;