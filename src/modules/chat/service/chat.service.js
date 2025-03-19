// Import files
import { asyncHandler } from "../../../utils/response/error.response.js";
import { successResponse } from "../../../utils/response/success.response.js";
import * as dbService from '../../../db/db.service.js';
import chatModel, { messageSchema } from "../../../db/model/chat.model.js";

// Get Chat History
export const getChat = (asyncHandler(async (req, res, next) => {
    // Target user ID from URL parameters
    const { userId } = req.params;
    // Authenticated user ID from JWT
    const currentUserId = req.user._id;

    // Find existing chat session between users
    const chat = await dbService.findOne({
        model: chatModel,
        filter: { 
            $or: [
                { senderId: currentUserId, receiverId: userId },
                { senderId: userId, receiverId: currentUserId }
            ]
        },
        // Populate user details for both sides of conversation
        populate: [
            { path: "senderId" },
            { path: "receiverId" },
            { path: "messages.receiverId" }
        ]
    });

    // Handle case where no chat history exists
    if (!chat) {
        return successResponse({ res, message: "No chat history found" });
    }

    // Retrieve all messages for the found chat session
    const messages = await dbService.findOne({
        model: messageSchema,
        filter: { chatId: chat._id }
    });

    return successResponse({ res, message: "Chat history retrieved", data: { messages } });
}));
