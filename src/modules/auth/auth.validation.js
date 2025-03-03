import Joi from "joi"; 
import { generalFields } from "../../middleware/validation.middleware.js";

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

export const confirmEmail = Joi.object().keys({
    email: generalFields.email.required(),
    otp: generalFields.otp.required()
}).required();

export const login = Joi.object().keys({
    email: generalFields.email.required(),
    password: generalFields.password.required()
}).required();

export const resendOTP = Joi.object().keys({
    email: generalFields.email.required()
}).required();

export const forgetPassword = Joi.object().keys({
    email: generalFields.email.required()
}).required();

export const resetPassword = Joi.object().keys({
    email: generalFields.email.required(),
    otp: generalFields.otp.required(),
    password: generalFields.password.required(),
    confirmPassword: generalFields.confirmPassword.valid(Joi.ref('password')).required(),
}).required();