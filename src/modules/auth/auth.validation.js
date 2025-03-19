// Import files
import Joi from "joi"; 
import { generalFields } from "../../middleware/validation.middleware.js";

// Registration Validation Schema
export const signup = Joi.object().keys({
    firstName: generalFields.firstName.required(),
    lastName: generalFields.lastName.required(),
    email: generalFields.email.required(),
    password: generalFields.password.required(),
    confirmPassword: generalFields.confirmPassword.valid(Joi.ref('password')).required(),
    phone: generalFields.phone.required(),
    DOB: generalFields.DOB.required(),
    gender: generalFields.gender.required()
}).required();

// Email Confirmation Schema
export const confirmEmail = Joi.object().keys({
    email: generalFields.email.required(),
    otp: generalFields.otp.required()
}).required();

// Login Validation Schema
export const login = Joi.object().keys({
    email: generalFields.email.required(),
    password: generalFields.password.required()
}).required();

// OTP Resend Schema
export const resendOTP = Joi.object().keys({
    email: generalFields.email.required()
}).required();

// Password Reset Schema
export const forgetPassword = Joi.object().keys({
    email: generalFields.email.required()
}).required();

// Password Reset Schema
export const resetPassword = Joi.object().keys({
    email: generalFields.email.required(),
    otp: generalFields.otp.required(),
    password: generalFields.password.required(),
    confirmPassword: generalFields.confirmPassword.valid(Joi.ref('password')).required(),
}).required();