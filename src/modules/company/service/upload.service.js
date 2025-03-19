// Import files
import companyModel from "../../../db/model/company.model.js";
import { asyncHandler } from "../../../utils/response/error.response.js";
import { successResponse } from "../../../utils/response/success.response.js";
import * as dbService from '../../../db/db.service.js';
import cloudinary from "../../../utils/multer/cloudinary.js";

// Upload Company Logo
export const logoPic = (asyncHandler(async (req, res, next) => {
    const { companyId } = req.params;

    // Upload new logo to Cloudinary with organization
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `company/${req.user._id}` });

    // Update company record with new logo (return previous version)
    const company = await dbService.findByIdAndUpdate({
        model: companyModel,
        id: companyId,
        data: {
            logo: { secure_url, public_id }
        },
        options: { new: false }
    })

    // Update company record with new logo (return previous version)
    if (company.logo?.public_id) {
        await cloudinary.uploader.destroy(company.logo.public_id);
    }

    return successResponse({ res, message: 'Logo uploaded successfully', data: { company } });
}));

// Upload Company Cover Photo
export const coverPic = (asyncHandler(async (req, res, next) => {
    const { companyId } = req.params;

    // Verify company existence
    const company = await dbService.findOne({
        model: companyModel,
        filter: { _id: companyId },
    });

    if (!company) {
        return next(new Error("Company not found"));
    }

    // Upload new cover photo to Cloudinary
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `company/${req.user._id}` });

    // Remove existing cover photo
    if (company.coverPic?.public_id) {
        await cloudinary.uploader.destroy(company.coverPic.public_id);
    }

    // Update company with new cover photo
    const updatedCompany = await dbService.findByIdAndUpdate({
        model: companyModel,
        id: companyId,
        data: {
            coverPic: { secure_url, public_id }
        },
        options: { new: true }
    });

    return successResponse({ res, message: 'Cover photo uploaded successfully', data: { updatedCompany } });
}));

// Delete Company Logo
export const deleteLogoPic = (asyncHandler(async (req, res, next) => {
    const { companyId } = req.params;

    // Find company and check for existing logo
    const company = await dbService.findOne({
        model: companyModel,
        filter: { _id: companyId },
    });

    if (!company.logo?.public_id) {
        return next(new Error('No profile picture found to delete'));
    }

    // Remove from Cloudinary storage
    await cloudinary.uploader.destroy(company.logo.public_id);

    // Clear logo reference in database
    await dbService.findByIdAndUpdate({
        model: companyModel,
        id: companyId,
        data: { logo: null },
        options: { new: true }
    });

    return successResponse({ res, message: 'Logo deleted successfully' });
}));

// Delete Company Cover Photo
export const deleteCoverPic = (asyncHandler(async (req, res, next) => {
    const { companyId } = req.params;

    // Verify company and existing cover photo
    const user = await dbService.findOne({
        model: companyModel,
        filter: { _id: companyId },
    });

    if (!user.coverPic?.public_id) {
        return next(new Error('No profile picture found to delete'));
    }

    // Remove from Cloudinary
    await cloudinary.uploader.destroy(user.coverPic.public_id);

    // Update database record
    await dbService.findByIdAndUpdate({
        model: companyModel,
        id: companyId,
        data: { coverPic: null },
        options: { new: true }
    });

    return successResponse({ res, message: 'Cover photo deleted successfully' });
}));
