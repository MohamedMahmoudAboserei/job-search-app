import Joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";

export const addCompany = Joi.object().keys({
    companyName: generalFields.companyName.required(),
    companyEmail: generalFields.companyEmail.required(),
    description: generalFields.description.required(),
    industry: generalFields.industry.required(),
    address: generalFields.address.required(),
    numberOfEmployees: generalFields.numberOfEmployees.required()
}).required();

export const updateCompany = Joi.object().keys({
    companyId: Joi.string(),
    companyName: generalFields.companyName,
    companyEmail: generalFields.companyEmail,
    description: generalFields.description,
    industry: generalFields.industry,
    address: generalFields.address,
    numberOfEmployees: generalFields.numberOfEmployees
}).required();