import mongoose from "mongoose";
import { jobLocationTypes } from "../../utils/types/jobLocation.js";
import { workingTimeTypes } from "../../utils/types/workingTime.js";
import { seniorityLevelTypes } from "../../utils/types/seniorityLevel.js";

const jobSchema = new mongoose.Schema({
    jobTitle: {
        type: String,
        required: true
    },
    jobLocation: {
        type: String,
        enum: Object.values(jobLocationTypes),
        required: true,
    },
    workingTime: {
        type: String,
        enum: Object.values(workingTimeTypes),
        required: true,
    },
    seniorityLevel: {
        type: String,
        enum: Object.values(seniorityLevelTypes),
        required: true,
    },
    jobDescription: {
        type: String,
        required: true,
        maxlength: 5000,
    },
    technicalSkills: {
        type: [String],
        required: true,
    },
    softSkills: {
        type: [String],
        required: true,
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    closed: {
        type: Boolean,
        default: false,
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true,
    },
}, {
    timestamps: true,
})

const jobModel = mongoose.model('Job', jobSchema);

export default jobModel;
