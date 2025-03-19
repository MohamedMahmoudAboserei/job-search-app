// Import files
import userModel from "../../../db/model/User.model.js";
import companyModel from "../../../db/model/company.model.js";
import * as dbService from '../../../db/db.service.js';
import { asyncHandler } from "../../../utils/response/error.response.js";
import { successResponse } from "../../../utils/response/success.response.js";

// Toggle User Ban Status
export const toggleUserBan = (asyncHandler(async (req, res, next) => {
    // Update user's ban status using service layer
    const user = await dbService.findByIdAndUpdate({
        model: userModel,
        id: req.user._id,
        data: {
            deletedAt: Date.now(),
        },
        options: { new: true }
    })

    // Toggle ban status and save
    user.bannedAt = user.bannedAt ? null : Date.now();
    await user.save();

    // Return standardized response with status message
    return successResponse({
        res,
        message: `User ${user.bannedAt ? "banned" : "unbanned"} successfully`,
        data: { user }
    });
}));

// Toggle Company Ban Status
export const toggleCompanyBan = asyncHandler(async (req, res) => {
    // Update company's ban status using service layer
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

    // Toggle ban status and save
    company.bannedAt = company.bannedAt ? null : Date.now();
    await company.save();

    // Return standardized response with status message
    return successResponse({
        res, message: `Company ${company.bannedAt ? "banned" : "unbanned"} successfully`,
        data: { company }
    });
});

// Approve Company
export const approveCompany = asyncHandler(async (req, res) => {
    // Update company approval status
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

    return successResponse({
        res,
        message: "Company approved successfully",
        data: { company }
    });
});