import companyModel from "../../../db/model/company.model.js";
import { asyncHandler } from "../../../utils/response/error.response.js";
import { successResponse } from "../../../utils/response/success.response.js";
import * as dbService from '../../../db/db.service.js';

export const addCompany = asyncHandler(async (req, res, next) => {
    const { companyName, companyEmail, description, industry, address, numberOfEmployees } = req.body;

    const existingCompany = await dbService.findOne({
        model: companyModel,
        filter: { $or: [{ companyName }, { companyEmail }] }
    });

    if (existingCompany) {
        return next(new Error("Company name or email already exists"));
    }

    const company = await dbService.create({
        model: companyModel,
        data: {
            companyName,
            companyEmail,
            description,
            industry,
            address,
            numberOfEmployees,
            createdBy: req.user._id
        }
    });

    return successResponse({ res, message: "Company added successfully", data: { company } });
});

export const updateCompany = (asyncHandler(async (req, res, next) => {
    const { companyId } = req.params;

    const company = await dbService.findOne({
        model: companyModel,
        filter: { _id: companyId },
    });

    if (!company || company.createdBy.toString() !== req.user._id.toString()) {
        return next(new Error("You are not authorized to update this company"));
    }

    if (req.body.legalAttachment) {
        return next(new Error("You cannot update the legal attachment"));
    }

    const updatedCompany = await dbService.findByIdAndUpdate({
        model: companyModel,
        id: companyId,
        data: req.body,
        options: { new: true }
    });

    return successResponse({ res, message: "Company updated successfully", data: { updatedCompany } });
}));

export const softDeleteCompany = (asyncHandler(async (req, res, next) => {
    const { companyId } = req.params;

    const company = await dbService.findOne({
        model: companyModel,
        filter: { _id: companyId },
    });

    if (!company) {
        return next(new Error("Company not found"));
    }

    if (req.user.role !== "admin" && company.createdBy.toString() !== req.user._id.toString()) {
        return next(new Error("You are not authorized to delete this company"));
    }

    company.deletedAt = Date.now();
    await company.save();

    return successResponse({ res, message: "Company deleted successfully" });
}));

export const getCompanyWithJobs = asyncHandler(async (req, res, next) => {
    const { companyId } = req.params;

    const company = await dbService.findOne({
        model: companyModel,
        filter: { _id: companyId },
        populate: { path: "jobs" }
    });

    if (!company) {
        return next(new Error("Company not found"));
    }

    return successResponse({ res, message: "Company retrieved successfully", data: { company } });
});

export const searchCompany = asyncHandler(async (req, res, next) => {
    const { name } = req.query;

    const companies = await dbService.findAll({
        model: companyModel,
        filter: { companyName: { $regex: name, $options: "i" } }
    });

    return successResponse({ res, message: "Search results", data: { companies } });
});
