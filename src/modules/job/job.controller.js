import { Router } from "express";
import * as jobService from './service/job.service.js';
import * as searchService from './service/search.service.js';
import * as applyService from './service/apply.service.js';
import { authentication, authorization } from "../../middleware/auth.middleware.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as validators from './job.validation.js';

const router = Router();

router.post('/add-job',
    validation(validators.addJob),
    authentication(),
    authorization(['companyOwner', 'companyHR']),
    jobService.addJob
);
router.patch('/update-job/:jobId',
    validation(validators.updateJob),
    authentication(),
    authorization(['companyOwner']),
    jobService.updateJob
);
router.delete('/update-job/:jobId',
    validation(validators.deleteJob),
    authentication(),
    authorization(['companyOwner']),
    jobService.deleteJob
);

router.get('/get-job/',
    authentication(),
    searchService.getJobs
);
router.get('/filtered-job/',
    authentication(),
    searchService.filteredJob
);
router.get('/applications/:jobId',
    authentication(),
    authorization(['companyOwner', 'companyHR']),
    searchService.applications
);

router.post('/apply-job/:jobId',
    authentication(),
    authorization(['user']),
    applyService.applyJob
);
router.post('/application-status/:applicationId',
    authentication(),
    authorization(['companyHR']),
    applyService.applicationStatus
);

export default router;