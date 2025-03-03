import { Router } from "express";
import * as authService from './service/auth.service.js';
import * as loginService from './service/login.service.js';
import * as forgetPasswordService from './service/forgetPassword.service.js';
import { validation } from "../../middleware/validation.middleware.js";
import * as validators from './auth.validation.js';

const router = Router();

router.post('/signup', validation(validators.signup), authService.signup);
router.patch('/confirm-email', validation(validators.confirmEmail), authService.confirmEmail);
router.post('/resend-otp', validation(validators.resendOTP), authService.resendOTP);
router.get('/refresh-token', authService.refreshToken);

router.post('/login', validation(validators.login), loginService.login);
router.post('/loginWithGmail', loginService.loginWithGmail);

router.patch('/forget-password', validation(validators.forgetPassword), forgetPasswordService.forgetPassword);
router.patch('/reset-password', validation(validators.resetPassword), forgetPasswordService.resetPassword);

export default router;