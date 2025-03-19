// Import files
import companyModel from "../../../db/model/company.model.js";
import { asyncHandler } from "../../../utils/response/error.response.js";
import { successResponse } from "../../../utils/response/success.response.js";
import * as dbService from '../../../db/db.service.js';

// Add Company
export const addCompany = asyncHandler(async (req, res, next) => {
    const { companyName, companyEmail, description, industry, address, numberOfEmployees } = req.body;

    // Check for existing company with same name or email
    const existingCompany = await dbService.findOne({
        model: companyModel,
        filter: { $or: [{ companyName }, { companyEmail }] }
    });

    if (existingCompany) {
        return next(new Error("Company name or email already exists"));
    }

    // Create new company record
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

// Update Company
export const updateCompany = (asyncHandler(async (req, res, next) => {
    const { companyId } = req.params;

    // Verify company existence and ownership
    const company = await dbService.findOne({
        model: companyModel,
        filter: { _id: companyId },
    });

    if (!company || company.createdBy.toString() !== req.user._id.toString()) {
        return next(new Error("You are not authorized to update this company"));
    }

    // Prevent legal document modification
    if (req.body.legalAttachment) {
        return next(new Error("You cannot update the legal attachment"));
    }

    // Perform update operation
    const updatedCompany = await dbService.findByIdAndUpdate({
        model: companyModel,
        id: companyId,
        data: req.body,
        options: { new: true }
    });

    return successResponse({
        res,
        message: "Company updated successfully",
        data: { updatedCompany }
    });
}));

// Soft Delete Company
export const softDeleteCompany = (asyncHandler(async (req, res, next) => {
    const { companyId } = req.params;

    // Validate company existence
    const company = await dbService.findOne({
        model: companyModel,
        filter: { _id: companyId },
    });

    if (!company) {
        return next(new Error("Company not found"));
    }

    // Authorization check (admin or owner)
    if (req.user.role !== "admin" && company.createdBy.toString() !== req.user._id.toString()) {
        return next(new Error("You are not authorized to delete this company"));
    }

    // Set deletion timestamp
    company.deletedAt = Date.now();
    await company.save();

    return successResponse({ res, message: "Company deleted successfully" });
}));

// Get Company Details
export const getCompanyWithJobs = asyncHandler(async (req, res, next) => {
    const { companyId } = req.params;

    // Fetch company with populated jobs
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

// Company Search
export const searchCompany = asyncHandler(async (req, res, next) => {
    const { name } = req.query;

    // Case-insensitive regex search
    const companies = await dbService.findAll({
        model: companyModel,
        filter: { companyName: { $regex: name, $options: "i" } }
    });

    return successResponse({ res, message: "Search results", data: { companies } });
});
