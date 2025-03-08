import userModel from "../../../db/model/User.model.js";
import { asyncHandler } from "../../../utils/response/error.response.js";
import { successResponse } from "../../../utils/response/success.response.js";
import * as dbService from '../../../db/db.service.js';
import { compareHash, generateHash } from "../../../utils/security/hash.security.js";
import cloudinary from "../../../utils/multer/cloudinary.js";
import { decodeEncryption, generateEncryption } from "../../../utils/security/encryption.js";

export const profile = (asyncHandler(async (req, res, next) => {
    const user = await dbService.findOne({
        model: userModel,
        filter: { _id: req.user._id },
        select: "firstName lastName email gender DOB role isConfirmed phone",
    });

    const decryptedPhone = decodeEncryption({ cipherText: user.phone });

    const userProfile = {
        ...user.toObject(),
        phone: decryptedPhone
    };
    return successResponse({ res, message: "Profile page", data: { userProfile } });
}));

export const updateUser = (asyncHandler(async (req, res, next) => {
    if (req.body.phone) {
        req.body.phone = generateEncryption({ plainText: req.body.phone }).toString();
    }
    
    const updatedUser = await dbService.findByIdAndUpdate({
        model: userModel,
        id: req.user._id,
        data: req.body,
        options: { new: true }
    });

    const decryptedPhone = updatedUser.phone ? decodeEncryption({ cipherText: updatedUser.phone }) : null;

    const userProfile = {
        ...updatedUser.toObject(),
        phone: decryptedPhone,
    };

    return successResponse({ res, message: "Profile updated successfully", data: { userProfile } });
}));

export const getUserProfile = asyncHandler(async (req, res) => {
    const user = await dbService.findOne({
        model: userModel,
        filter: { _id: req.params.id },
        select: "firstName lastName phone profilePic coverPic ",
    })

    const decryptedPhone = decodeEncryption({ cipherText: user.phone });

    const userProfile = {
        ...user.toObject(),
        phone: decryptedPhone
    };

    res.status(200).json({
        success: true,
        data: { userProfile }
    });
});

export const updatePassword = (asyncHandler(async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;

    if (!compareHash({ plainText: oldPassword, hashValue: req.user.password })) {
        return next(new Error('In-valid old password', { cause: 400 }))
    }

    const user = await dbService.findByIdAndUpdate({
        model: userModel,
        id: req.user._id,
        data: {
            password: generateHash({ plainText: newPassword }),
            changeCredentialsTime: Date.now()
        },
        options: { new: true }
    })

    return successResponse({ res, message: "Password updated successfully" });
}));

export const profilePic = (asyncHandler(async (req, res, next) => {
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `user/${req.user._id}` });

    const user = await dbService.findByIdAndUpdate({
        model: userModel,
        id: req.user._id,
        data: {
            profilePic: { secure_url, public_id }
        },
        options: { new: false }
    })

    if (user.profilePic?.public_id) {
        await cloudinary.uploader.destroy(user.profilePic.public_id);
    }

    return successResponse({ res, message: 'Profile picture uploaded successfully', data: { user } });
}));

export const coverPic = (asyncHandler(async (req, res, next) => {
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `user/${req.user._id}` });

    const user = await dbService.findByIdAndUpdate({
        model: userModel,
        id: req.user._id,
        data: {
            coverPic: { secure_url, public_id }
        },
        options: { new: false }
    })

    if (user.coverPic?.public_id) {
        await cloudinary.uploader.destroy(user.coverPic.public_id);
    }

    return successResponse({ res, message: 'Cover picture uploaded successfully', data: { user } });
}));

export const deleteProfilePic = (asyncHandler(async (req, res, next) => {
    const user = await dbService.findOne({
        model: userModel,
        filter: { _id: req.user._id },
    });

    if (!user.profilePic?.public_id) {
        return next(new Error('No profile picture found to delete'));
    }

    await cloudinary.uploader.destroy(user.profilePic.public_id);

    await dbService.findByIdAndUpdate({
        model: userModel,
        id: req.user._id,
        data: { profilePic: null },
        options: { new: true }
    });

    return successResponse({ res, message: 'Profile picture deleted successfully' });
}));

export const deleteCoverPic = (asyncHandler(async (req, res, next) => {
    const user = await dbService.findOne({
        model: userModel,
        filter: { _id: req.user._id },
    });

    if (!user.coverPic?.public_id) {
        return next(new Error('No profile picture found to delete'));
    }

    await cloudinary.uploader.destroy(user.coverPic.public_id);

    await dbService.findByIdAndUpdate({
        model: userModel,
        id: req.user._id,
        data: { coverPic: null },
        options: { new: true }
    });

    return successResponse({ res, message: 'Profile picture deleted successfully' });
}));

export const softDeleteAccount = (asyncHandler(async (req, res, next) => {
    await dbService.findByIdAndUpdate({
        model: userModel,
        id: req.user._id,
        data: {
            deletedAt: Date.now()
        },
        options: { new: true }
    })

    return successResponse({ res, message: "Account deleted successfully" });
}));
