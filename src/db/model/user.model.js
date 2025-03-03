import mongoose, { model, Schema } from "mongoose";
import { providerTypes } from "../../utils/types/provider.js";
import { genderTypes } from "../../utils/types/gender.js";
import { roleTypes } from "../../utils/types/roles.js";
import { subjectTypes } from "../../utils/email/send.email.js";

const OTPSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: [subjectTypes.confirmEmail, subjectTypes.resetPassword],
        required: true,
    },
    expiresIn: {
        type: Date,
        required: true,
    },
})

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 25
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 25
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: { type: String },
    provider: {
        type: String,
        enum: Object.values(providerTypes),
        default: providerTypes.system,
    },
    gender: {
        type: String,
        enum: Object.values(genderTypes),
        default: genderTypes.male
    },
    DOB: { type: Date, required: true },
    phone: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: Object.values(roleTypes),
        default: roleTypes.user
    },
    isConfirmed: {
        type: Boolean,
        default: false,
    },
    deletedAt: {
        type: Date,
        default: null,
    },
    bannedAt: {
        type: Date,
        default: null,
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    changeCredentialTime: {
        type: Date,
        default: Date.now,
    },
    profilePic: {
        secure_url: String,
        public_id: String,
    },
    coverPic: {
        secure_url: String,
        public_id: String,
    },
    OTP: [OTPSchema],
}, { timestamps: true })

const userModel = mongoose.model.User || model('User', userSchema);

export default userModel