import mongoose, { model } from "mongoose";

const companySchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        maxlength: 1000,
    },
    industry: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    numberOfEmployees: {
        type: String,
        required: true,
    },
    companyEmail: {
        type: String,
        required: true,
        unique: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    logo: {
        secure_url: String,
        public_id: String,
    },
    coverPic: {
        secure_url: String,
        public_id: String,
    },
    HRs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    bannedAt: {
        type: Date,
        default: null,
    },
    deletedAt: {
        type: Date,
        default: null,
    },
    legalAttachment: {
        secure_url: String,
        public_id: String,
    },
    approvedByAdmin: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true })

const companyModel = model('Company', companySchema);

export default companyModel;