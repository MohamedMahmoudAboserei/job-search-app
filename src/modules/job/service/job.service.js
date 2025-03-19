// Import files
import jobModel from "../../../db/model/job.model.js";
import companyModel from "../../../db/model/company.model.js";
import { asyncHandler } from "../../../utils/response/error.response.js";
import { successResponse } from "../../../utils/response/success.response.js";
import * as dbService from '../../../db/db.service.js';

// Create job
export const addJob = (asyncHandler(async (req, res, next) => {
    // Destructure job details from request body
    const {
        jobTitle,
        jobLocation,
        workingTime,
        seniorityLevel,
        jobDescription,
        technicalSkills,
        softSkills,
        companyId
    } = req.body;

    // Verify company existence
    const company = dbService.findOne({
        model: companyModel,
        filter: { _id: companyId }
    });
    if (!company) {
        return next(new Error(`User must create a company before posting jobs`, { cause: 404 }));
    }

    // Create new job record
    const job = await dbService.create({
        model: jobModel,
        data: {
            jobTitle,
            jobLocation,
            workingTime,
            seniorityLevel,
            jobDescription,
            technicalSkills,
            softSkills,
            addedBy: req.user._id,
            companyId
        }
    });

    return successResponse({
        res,
        message: 'Job created successfully',
        data: { job }
    });
}));

// Update Job
export const updateJob = (asyncHandler(async (req, res, next) => {
    // Extract update fields from request body
    const {
        jobTitle,
        jobLocation,
        workingTime,
        seniorityLevel,
        jobDescription,
        technicalSkills,
        softSkills
    } = req.body;

    // Update job document
    const job = await dbService.findByIdAndUpdate({
        model: jobModel,
        id: req.params.jobId,
        data: {
            jobTitle,
            jobLocation,
            workingTime,
            seniorityLevel,
            jobDescription,
            technicalSkills,
            softSkills
        },
        options: { new: true }
    })

    return successResponse({
        res,
        message: 'Job updated successfully',
        data: { job }
    });
}));

// Delete Job
export const deleteJob = (asyncHandler(async (req, res, next) => {
    // Hard delete job document
    await dbService.findByIdAndDelete({
        model: jobModel,
        id: req.params.jobId,
        options: { new: true }
    })

    return successResponse({
        res,
        message: 'Job deleted successfully'
    });
}));
