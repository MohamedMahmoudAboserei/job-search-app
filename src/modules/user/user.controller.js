import { Router } from "express";
import * as userService from './service/user.service.js';
import { authentication } from "../../middleware/auth.middleware.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as validators from './user.validation.js';
import { fileValidationTypes } from "../../utils/types/uploadImg.js";
import { uploadCloudFile } from "../../utils/multer/cloud.multer.js";

const router = Router();

router.get('/profile',
    authentication(),
    userService.profile
);
router.patch('/profile/update-profile',
    validation(validators.updateUser),
    authentication(),
    userService.updateUser
);
router.get('/profile/users/:id',
    authentication(),
    userService.getUserProfile
);
router.patch('/profile/update-password',
    validation(validators.updatePassword),
    authentication(),
    userService.updatePassword
);
router.patch('/profile/upload/profile-pic',
    authentication(),
    uploadCloudFile(fileValidationTypes.image).single('image'),
    userService.profilePic
);
router.patch('/profile/upload/cover-pic',
    authentication(),
    uploadCloudFile(fileValidationTypes.image).single('image'),
    userService.coverPic
);
router.delete('/profile/upload/delete-profile-pic',
    authentication(),
    userService.deleteProfilePic
);
router.delete('/profile/upload/delete-cover-pic',
    authentication(),
    userService.deleteCoverPic
);
router.delete('/profile/delete-account',
    authentication(),
    userService.softDeleteAccount
);

export default router; 