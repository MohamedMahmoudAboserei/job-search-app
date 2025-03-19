// Import files
import { Router } from "express";
import * as adminService from './service/admin.service.js';
import { authentication } from "../../middleware/auth.middleware.js";

// Create Express router instance
const router = Router();

// Toggle user ban status
router.patch('/user/ban/:userId',
    authentication(),
    adminService.toggleUserBan
);

// Toggle company ban status
router.patch('/company/ban/:companyId',
    adminService.toggleCompanyBan
);

// Approve company
router.patch('/company/approve',
    adminService.approveCompany
);

// Export router
export default router;