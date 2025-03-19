// Import files
import { Router } from "express";
import * as companyService from './service/company.service.js';
import * as uploadService from './service/upload.service.js';
import { validation } from "../../middleware/validation.middleware.js";
import * as validators from './company.validation.js';
import { authentication } from "../../middleware/auth.middleware.js";
import { uploadCloudFile } from "../../utils/multer/cloud.multer.js";
import { fileValidationTypes } from "../../utils/types/uploadImg.js";

// Create Express router instance
const router = Router();

// Add company with validation
router.post('/add-company',
    validation(validators.addCompany),
    authentication(),
    companyService.addCompany
);
// Update company with validation
router.patch('/update-company/:companyId',
    validation(validators.updateCompany),
    authentication(),
    companyService.updateCompany
);
// Delete company with validation
router.delete('/delete-company/:companyId',
    authentication(),
    companyService.softDeleteCompany
);
// COMPANY DATA RETRIEVAL
router.get('/jobs/:companyId',
    authentication(),
    companyService.getCompanyWithJobs
);
// Search for company
router.get('/search',
    authentication(),
    companyService.searchCompany
);

// Upload company logo
router.patch('/upload/logo-pic/:companyId',
    authentication(),
    uploadCloudFile(fileValidationTypes.image).single('image'),
    uploadService.logoPic
);
// Upload company cover
router.patch('/upload/cover-pic/:companyId',
    authentication(),
    uploadCloudFile(fileValidationTypes.image).single('image'),
    uploadService.coverPic
);
// Delete company logo
router.delete('/delete/logo-pic/:companyId',
    authentication(),
    uploadService.deleteLogoPic
);
// Delete company cover
router.delete('/delete/cover-pic/:companyId',
    authentication(),
    uploadService.deleteCoverPic
);

// Export router
export default router;