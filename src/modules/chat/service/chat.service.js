import { asyncHandler } from "../../../utils/response/error.response.js";
import { successResponse } from "../../../utils/response/success.response.js";
import * as dbService from '../../../db/db.service.js';
import chatModel, { messageSchema } from "../../../db/model/chat.model.js";


export const getChat = (asyncHandler(async (req, res, next) => {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    const chat = await dbService.findOne({
        model: chatModel,
        filter: { 
            $or: [
                { senderId: currentUserId, receiverId: userId },
                { senderId: userId, receiverId: currentUserId }
            ]
        },
        populate: [
            { path: "senderId" },
            { path: "receiverId" },
            { path: "messages.receiverId" }
        ]
    });
    if (!chat) {
        return successResponse({ res, message: "No chat history found" });
    }

    const messages = await dbService.findOne({
        model: messageSchema,
        filter: { chatId: chat._id }
    });

    return successResponse({ res, message: "Chat history retrieved", data: { messages } });
}));
