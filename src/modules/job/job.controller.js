// Import files
import { Router } from "express";
import * as jobService from './service/job.service.js';
import * as searchService from './service/search.service.js';
import * as applyService from './service/apply.service.js';
import { authentication, authorization } from "../../middleware/auth.middleware.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as validators from './job.validation.js';

// Create Express router instance
const router = Router();

// Create job with validation
router.post('/add-job',
    validation(validators.addJob),
    authentication(),
    authorization(['companyOwner', 'companyHR']),
    jobService.addJob
);
// Update job with validation
router.patch('/update-job/:jobId',
    validation(validators.updateJob),
    authentication(),
    authorization(['companyOwner']),
    jobService.updateJob
);
// Delete job with validation
router.delete('/update-job/:jobId',
    validation(validators.deleteJob),
    authentication(),
    authorization(['companyOwner']),
    jobService.deleteJob
);
// Get job with validation
router.get('/get-job/',
    authentication(),
    searchService.getJobs
);
// Filtered job with validation
router.get('/filtered-job/',
    authentication(),
    searchService.filteredJob
);
// Application job with validation
router.get('/applications/:jobId',
    authentication(),
    authorization(['companyOwner', 'companyHR']),
    searchService.applications
);

// Apply job with validation
router.post('/apply-job/:jobId',
    authentication(),
    authorization(['user']),
    applyService.applyJob
);
// Application status with validation
router.post('/application-status/:applicationId',
    authentication(),
    authorization(['companyHR']),
    applyService.applicationStatus
);

// Export router
export default router;