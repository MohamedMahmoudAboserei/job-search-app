import { Router } from "express";
import * as chatService from './service/chat.service.js';
import { authentication } from "../../middleware/auth.middleware.js";

const router = Router();

router.get('/history-chat/:userId',
    authentication(),
    chatService.getChat
);

export default router;