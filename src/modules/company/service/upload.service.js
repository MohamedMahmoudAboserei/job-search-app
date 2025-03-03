import companyModel from "../../../db/model/company.model.js";
import { asyncHandler } from "../../../utils/response/error.response.js";
import { successResponse } from "../../../utils/response/success.response.js";
import * as dbService from '../../../db/db.service.js';
import { compareHash, generateHash } from "../../../utils/security/hash.security.js";
import cloudinary from "../../../utils/multer/cloudinary.js";

export const logoPic = (asyncHandler(async (req, res, next) => {
    const { companyId } = req.params;
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `company/${req.user._id}` });

    const company = await dbService.findByIdAndUpdate({
        model: companyModel,
        id: companyId,
        data: {
            logo: { secure_url, public_id }
        },
        options: { new: false }
    })

    if (company.logo?.public_id) {
        await cloudinary.uploader.destroy(company.logo.public_id);
    }

    return successResponse({ res, message: 'Profile picture uploaded successfully', data: { company } });
}));

export const coverPic = (asyncHandler(async (req, res, next) => {
    const { companyId } = req.params;

    const company = await dbService.findOne({
        model: companyModel,
        filter: { _id: companyId },
    });

    if (!company) {
        return next(new Error("Company not found"));
    }

    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `company/${req.user._id}` });

    if (company.coverPic?.public_id) {
        await cloudinary.uploader.destroy(company.coverPic.public_id);
    }

    const updatedCompany = await dbService.findByIdAndUpdate({
        model: companyModel,
        id: companyId,
        data: {
            coverPic: { secure_url, public_id }
        },
        options: { new: true }
    });

    return successResponse({ res, message: 'Profile picture uploaded successfully', data: { updatedCompany } });
}));

export const deleteLogoPic = (asyncHandler(async (req, res, next) => {
    const { companyId } = req.params;
    const company = await dbService.findOne({
        model: companyModel,
        filter: { _id: companyId },
    });

    if (!company.logo?.public_id) {
        return next(new Error('No profile picture found to delete'));
    }

    await cloudinary.uploader.destroy(company.logo.public_id);

    await dbService.findByIdAndUpdate({
        model: companyModel,
        id: companyId,
        data: { logo: null },
        options: { new: true }
    });

    return successResponse({ res, message: 'Profile picture deleted successfully' });
}));

export const deleteCoverPic = (asyncHandler(async (req, res, next) => {
    const { companyId } = req.params;

    const user = await dbService.findOne({
        model: companyModel,
        filter: { _id: companyId },
    });

    if (!user.coverPic?.public_id) {
        return next(new Error('No profile picture found to delete'));
    }

    await cloudinary.uploader.destroy(user.coverPic.public_id);

    await dbService.findByIdAndUpdate({
        model: companyModel,
        id: companyId,
        data: { coverPic: null },
        options: { new: true }
    });

    return successResponse({ res, message: 'Profile picture deleted successfully' });
}));
