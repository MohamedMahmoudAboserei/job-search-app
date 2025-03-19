// Import files
import Joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";

// Add job Validation Schema
export const addJob = Joi.object().keys({
    jobTitle: generalFields.jobTitle.required(),
    jobLocation: generalFields.jobLocation.required(),
    workingTime: generalFields.workingTime.required(),
    seniorityLevel: generalFields.seniorityLevel.required(),
    jobDescription: generalFields.description.required(),
    technicalSkills: generalFields.technicalSkills.required(),
    softSkills: generalFields.softSkills.required(),
    companyId: generalFields.id.required()
}).required();

// Update job Validation Schema
export const updateJob = Joi.object().keys({
    jobTitle: generalFields.jobTitle,
    jobLocation: generalFields.jobLocation,
    workingTime: generalFields.workingTime,
    seniorityLevel: generalFields.seniorityLevel,
    jobDescription: generalFields.description,
    technicalSkills: generalFields.technicalSkills,
    softSkills: generalFields.softSkills,
    jobId: generalFields.id.required()
}).required();

// Delete job Validation Schema
export const deleteJob = Joi.object().keys({
    jobId: generalFields.id.required()
}).required();
