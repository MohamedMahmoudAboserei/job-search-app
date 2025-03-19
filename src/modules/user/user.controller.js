// Import files
import { Router } from "express";
import * as userService from './service/user.service.js';
import { authentication } from "../../middleware/auth.middleware.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as validators from './user.validation.js';
import { fileValidationTypes } from "../../utils/types/uploadImg.js";
import { uploadCloudFile } from "../../utils/multer/cloud.multer.js";

// Create Express router instance
const router = Router();

// Get Profile
router.get('/profile',
    authentication(),
    userService.profile
);
// Update profile with validation
router.patch('/profile/update-profile',
    validation(validators.updateUser),
    authentication(),
    userService.updateUser
);
// Get user using ID
router.get('/profile/users/:id',
    authentication(),
    userService.getUserProfile
);
// Update password with validation
router.patch('/profile/update-password',
    validation(validators.updatePassword),
    authentication(),
    userService.updatePassword
);
// Upload profile image
router.patch('/profile/upload/profile-pic',
    authentication(),
    uploadCloudFile(fileValidationTypes.image).single('image'),
    userService.profilePic
);
// Upload cover profile
router.patch('/profile/upload/cover-pic',
    authentication(),
    uploadCloudFile(fileValidationTypes.image).single('image'),
    userService.coverPic
);
// Delete profile image
router.delete('/profile/upload/delete-profile-pic',
    authentication(),
    userService.deleteProfilePic
);
// Delete cover profile
router.delete('/profile/upload/delete-cover-pic',
    authentication(),
    userService.deleteCoverPic
);
// Soft delete account
router.delete('/profile/delete-account',
    authentication(),
    userService.softDeleteAccount
);

// Export router
export default router; 