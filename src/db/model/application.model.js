import mongoose from "mongoose";
import { statusTypes } from "../../utils/types/status.js";

const applicationSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    userCV: {
        secure_url: { type: String, required: true },
        public_id: { type: String, required: true }
    },
    status: {
        type: String,
        enum: Object.values(statusTypes),
        default: statusTypes.pending,
    },
}, {
    timestamps: true
});

const applicationModel = mongoose.models.Application || mongoose.model('Application', applicationSchema);

export default applicationModel;
