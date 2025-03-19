// Import files
import { Router } from "express";
import * as chatService from './service/chat.service.js';
import { authentication } from "../../middleware/auth.middleware.js";

// Create Express router instance
const router = Router();

// Chat History
router.get('/history-chat/:userId',
    authentication(),
    chatService.getChat
);

// Export router
export default router;