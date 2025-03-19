import Joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";

// Update user Validation Schema
export const updateUser = Joi.object().keys({
    firstName: generalFields.firstName,
    lastName: generalFields.lastName,
    phone: generalFields.phone,
    DOB: generalFields.DOB,
    gender: generalFields.gender
}).required();

// Update password Validation Schema
export const updatePassword = Joi.object().keys({
    oldPassword: generalFields.password.required(),
    newPassword: generalFields.password.not(Joi.ref('oldPassword')).required(),
    confirmPassword: generalFields.confirmPassword.valid(Joi.ref('newPassword')).required()
}).required();
