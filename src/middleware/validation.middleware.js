// Import files
import Joi from "joi";
import { Types } from "mongoose";
import { genderTypes } from "../utils/types/gender.js";
import { roleTypes } from "../utils/types/roles.js";
import { workingTimeTypes } from "../utils/types/workingTime.js";
import { jobLocationTypes } from "../utils/types/jobLocation.js";
import { seniorityLevelTypes } from "../utils/types/seniorityLevel.js";

// Custom validator for MongoDB ObjectId
const checkObjectId = (value, helper) => {
    return Types.ObjectId.isValid(value)
        ? true
        : helper.error('In-valid objectId');
}

// Validation schema definitions
export const generalFields = {
    firstName: Joi.string().min(2).max(25).trim(),
    lastName: Joi.string().min(2).max(25).trim(),
    email: Joi.string().email({ tlds: { allow: ['com', 'net'] }, minDomainSegments: 2, maxDomainSegments: 3 }),
    password: Joi.string().min(6).pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)),
    confirmPassword: Joi.string(),
    DOB: Joi.date().max(new Date(new Date().setFullYear(new Date().getFullYear() - 18))),
    gender: Joi.string().valid(...Object.values(genderTypes)),
    role: Joi.string().valid(roleTypes).default(roleTypes.user),
    phone: Joi.string().pattern(new RegExp(/^(002|\+2)?01[0125][0-9]{8}$/)),
    otp: Joi.string().pattern(new RegExp(/^\d{4}$/)),
    id: Joi.string().custom(checkObjectId),
    address: Joi.string(),
    profilePic: Joi.object({
        secure_url: Joi.string(),
        public_id: Joi.string(),
    }),
    coverPic: Joi.object({
        secure_url: Joi.string(),
        public_id: Joi.string(),
    }),
    companyName: Joi.string().min(2).max(25).trim(),
    companyEmail: Joi.string().email({ tlds: { allow: ['com', 'net'] }, minDomainSegments: 2, maxDomainSegments: 3 }),
    description: Joi.string().min(2).max(1000).trim(),
    industry: Joi.string().min(2).max(50).trim(),
    numberOfEmployees: Joi.string().min(2),
    jobTitle: Joi.string().min(2).trim(),
    jobLocation: Joi.string().valid(...Object.values(jobLocationTypes)),
    workingTime: Joi.string().valid(...Object.values(workingTimeTypes)),
    seniorityLevel: Joi.string().valid(...Object.values(seniorityLevelTypes)),
    technicalSkills: Joi.string().min(2).trim(),
    softSkills: Joi.string().min(2).trim(),
};

// Validation middleware generator
export const validation = (schema) => {
    return (req, res, next) => {
        // Combine data from body, params, and query
        const inputDate = { ...req.body, ...req.params, ...req.query };

        // Validate all fields (not aborting early)
        const validationResult = schema.validate(inputDate, { aboutEarly: false });
        if (validationResult.error) {
            // Return structured validation errors
            return res.status(400).json({
                message: "Validation error",
                details: validationResult.error.details
            });
        }
        // Proceed to next middleware if validation passes
        return next();
    }
}