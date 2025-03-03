import jobModel from "../../../db/model/job.model.js";
import companyModel from "../../../db/model/company.model.js";
import applicationModel from "../../../db/model/application.model.js";
import { asyncHandler } from "../../../utils/response/error.response.js";
import { successResponse } from "../../../utils/response/success.response.js";
import * as dbService from '../../../db/db.service.js';

export const getJobs = (asyncHandler(async (req, res, next) => {
    const {
        companyId,
        companyName,
        jobId,
        page = 1,
        limit = 10,
        sort = 'createdAt'
    } = req.query;

    const company = dbService.findOne({
        model: companyModel,
        query: { _id: companyId, companyName: companyName }
    });
    if (!company) {
        return next(new Error(`We don't find that company`, { cause: 404 }));
    }

    const filter = {};
    if (companyId) filter.companyId = companyId;
    if (companyId) filter.companyName = companyName;
    if (jobId) filter._id = jobId;

    const job = await dbService.findAll({
        model: jobModel,
        filter,
        limit: Number(limit),
        sort
    });
    const totalCount = await dbService.count({ model: jobModel, filter });

    return successResponse({ res, message: 'Job retrieved successfully', data: { job, totalCount } });
}));

export const filteredJob = (asyncHandler(async (req, res, next) => {
    const {
        workingTime,
        jobLocation,
        seniorityLevel,
        jobTitle,
        technicalSkills,
        skip = 0,
        limit = 10,
        sort = 'createdAt'
    } = req.query;

    const filter = {};

    if (workingTime) filter.workingTime = workingTime;
    if (jobLocation) filter.jobLocation = jobLocation;
    if (seniorityLevel) filter.seniorityLevel = seniorityLevel;
    if (jobTitle) filter.jobTitle = jobTitle;
    if (technicalSkills) filter.technicalSkills = { $in: technicalSkills.split(',') };

    const job = await dbService.findAll({
        model: jobModel,
        filter,
        skip: Number(skip),
        limit: Number(limit),
        sort
    });
    const totalCount = await dbService.count({ model: jobModel, filter });

    return successResponse({ res, message: 'Filtered jobs retrieved successfully', data: { job, totalCount } });
}));

export const applications = (asyncHandler(async (req, res, next) => {
    const application = await dbService.findAll({
        model: applicationModel,
        filter: { jobId: req.params.jobId },
        populate: [[{ path: 'userId', select: 'name email' }]]
    });

    return successResponse({ res, message: 'Applications retrieved successfully', data: { application } });
}));
