import { Router } from "express";
import * as adminService from './service/admin.service.js';
import { authentication } from "../../middleware/auth.middleware.js";

const router = Router();

router.patch('/user/ban/:userId',
    authentication(),
    adminService.toggleUserBan
);
router.patch('/company/ban/:companyId',
    adminService.toggleCompanyBan
);
router.patch('/company/approve',
    adminService.approveCompany
);

export default router;