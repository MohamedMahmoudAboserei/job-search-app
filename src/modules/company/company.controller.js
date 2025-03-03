import { Router } from "express";
import * as companyService from './service/company.service.js';
import * as uploadService from './service/upload.service.js';
import { validation } from "../../middleware/validation.middleware.js";
import * as validators from './company.validation.js';
import { authentication } from "../../middleware/auth.middleware.js";
import { uploadCloudFile } from "../../utils/multer/cloud.multer.js";
import { fileValidationTypes } from "../../utils/types/uploadImg.js";

const router = Router();

router.post('/add-company',
    validation(validators.addCompany),
    authentication(),
    companyService.addCompany
);
router.patch('/update-company/:companyId',
    validation(validators.updateCompany),
    authentication(),
    companyService.updateCompany
);
router.delete('/delete-company/:companyId',
    authentication(),
    companyService.softDeleteCompany
);
router.get('/jobs/:companyId',
    authentication(),
    companyService.getCompanyWithJobs
);
router.get('/search',
    authentication(),
    companyService.searchCompany
);

router.patch('/upload/logo-pic/:companyId',
    authentication(),
    uploadCloudFile(fileValidationTypes.image).single('image'),
    uploadService.logoPic
);
router.patch('/upload/cover-pic/:companyId',
    authentication(),
    uploadCloudFile(fileValidationTypes.image).single('image'),
    uploadService.coverPic
);
router.delete('/delete/logo-pic/:companyId',
    authentication(),
    uploadService.deleteLogoPic
);
router.delete('/delete/cover-pic/:companyId',
    authentication(),
    uploadService.deleteCoverPic
);

export default router;