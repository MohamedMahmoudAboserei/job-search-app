import jobModel from "../../../db/model/job.model.js";
import { emailEvent } from "../../../utils/events/email.event.js";
import { asyncHandler } from "../../../utils/response/error.response.js";
import { successResponse } from "../../../utils/response/success.response.js";
import * as dbService from '../../../db/db.service.js';
import applicationModel from "../../../db/model/application.model.js";
import userModel from "../../../db/model/User.model.js";
import { socketConnections } from "../../../db/socket.connection.js";
import companyModel from "../../../db/model/company.model.js";
import { roleTypes } from "../../../utils/types/roles.js";
import { getIo } from "../../chat/chat.socket.controller.js";


export const applyJob = (asyncHandler(async (req, res, next) => {
    const { jobId } = req.params;
    const { userCV } = req.body;

    const job = await dbService.findOne({
        model: jobModel,
        filter: { _id: jobId }
    });
    if (!job) {
        return next(new Error(`Job not found`, { cause: 404 }));
    }

    const existingApplication = await dbService.findOne({
        model: applicationModel,
        filter: { jobId, userId: req.user._id }
    });
    if (existingApplication) {
        return next(new Error(`You have already applied for this job`, { cause: 400 }));
    }

    const application = await dbService.create({
        model: applicationModel,
        data: {
            jobId,
            userId: req.user._id,
            userCV
        }
    });

    const company = await dbService.findOne({
        model: companyModel,
        filter: { _id: job.companyId }
    });

    if (company) {
        const hrUsers = await dbService.findAll({
            model: userModel,
            filter: { companyId: company._id, role: roleTypes.companyHR }
        });

        hrUsers.forEach(hr => {
            const socketId = socketConnections.get(hrUsers._id.toString());
            if (socketId) {
                getIo().to(socketId).emit("newJobApplication", {
                    message: `New job application submitted for ${job.title}`,
                    jobId,
                    applicantId: req.user._id
                });
            }
        });
    }

    return successResponse({ res, message: 'Application submitted successfully', data: { application } });
}));

export const applicationStatus = (asyncHandler(async (req, res, next) => {
    const { applicationId } = req.params;
    const { status } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
        return next(new Error(`Invalid status. Allowed values: accepted, rejected`, { cause: 400 }));
    }

    const application = await dbService.findOne({
        model: applicationModel,
        filter: { _id: applicationId }
    });
    if (!application) {
        return next(new Error(`Application not found`, { cause: 404 }));
    }

    application.status = status;
    await application.save();

    const user = await dbService.findOne({
        model: userModel,
        filter: { _id: application.userId }
    });
    const job = await dbService.findOne({
        model: jobModel,
        filter: { _id: application.jobId }
    });

    emailEvent.emit("sendApplicationStatus", {
            email: user.email,
            applicationStatus: status,
            jobTitle: job.jobTitle
        });

    return successResponse({ res, message: 'Filtered jobs retrieved successfully', data: { job, totalCount } });
}));
