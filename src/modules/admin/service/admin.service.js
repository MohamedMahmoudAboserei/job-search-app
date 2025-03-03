import userModel from "../../../db/model/User.model.js";
import companyModel from "../../../db/model/company.model.js";
import * as dbService from '../../../db/db.service.js';
import { asyncHandler } from "../../../utils/response/error.response.js";
import { successResponse } from "../../../utils/response/success.response.js";

export const toggleUserBan = (asyncHandler(async (req, res, next) => {
    const user = await dbService.findByIdAndUpdate({
        model: userModel,
        id: req.user._id,
        data: {
            deletedAt: Date.now(),
        },
        options: { new: true }
    })

    user.bannedAt = user.bannedAt ? null : Date.now();
    await user.save();

    return successResponse({ res, message: `User ${user.bannedAt ? "banned" : "unbanned"} successfully`, data: { user } });
}));

export const toggleCompanyBan = asyncHandler(async (req, res) => {
    const company = await dbService.findByIdAndUpdate({
        model: companyModel,
        id: req.user._id,
        data: {
            deletedAt: company.bannedAt ? null : Date.now(),
        },
        options: { new: true }
    })

    if (!company) {
        return next(new Error(`Company not found`, { cause: 404 }));
    }

    // company.bannedAt = company.bannedAt ? null : Date.now();
    // await company.save();

    return successResponse({ res, message: `Company ${company.bannedAt ? "banned" : "unbanned"} successfully`, data: { company } });
});

export const approveCompany = asyncHandler(async (req, res) => {
    const company = await dbService.findByIdAndUpdate({
        model: companyModel,
        id: req.user._id,
        data: {
            approvedByAdmin: true,
        },
        options: { new: true }
    })

    if (!company) {
        return next(new Error(`Company not found`, { cause: 404 }));
    }

    return successResponse({ res, message: "Company approved successfully", data: { company } });
});