// Import files
import chatModel from "../../../db/model/chat.model.js";
import userModel from "../../../db/model/User.model.js";
import { authenticationSocket } from "../../../middleware/auth.socket.middleware.js";
import * as dbService from '../../../db/db.service.js';
import { socketConnections } from "../../../db/socket.connection.js";

// Handles real-time message sending between users
export const sendMessage = (socket) => {
    return socket.on("sendMessage", async (messageData) => {
        // Authenticate socket connection
        const { data } = await authenticationSocket(socket);

        // Handle authentication errors
        if (data) {
            return socket.emit("socketErrorResponse", data)
        }

        // Extract sender/receiver info
        const senderId = data.user._id
        const { receiverId, message } = messageData;

        // Check for existing chat between users
        const existingChat = await dbService.findOne({
            model: chatModel,
            filter: {
                $or: [
                    { senderId, receiverId },
                    { senderId: receiverId, receiverId: senderId }
                ]
            }
        })

        // Create new chat if none exists
        if (!existingChat) {
            // Validate sender permissions
            const sender = await userModel.findById(senderId);
            if (!sender || !['companyOwner', 'companyHR'].includes(sender.role)) {
                return socket.emit("socketErrorResponse", { message: "Only HR or the company owner can start the conversation." });
            }

            // Create new chat record
            existingChat = await dbService.create({
                model: chatModel,
                data: {
                    $push: {
                        senderId,
                        receiverId,
                        messages: [{ senderId, message }]
                    }
                }
            });
        } else {
            // Add message to existing chat
            await dbService.findOneAndUpdate({
                model: chatModel,
                filter: {
                    _id: existingChat._id
                },
                data: {
                    $push: {
                        messages: { senderId, message }
                    }
                }
            });
        }

        // Send message to receiver's socket
        socket.to(socketConnections.get(receiverId)).emit("receiveMessage", { message });

        // Confirm delivery to sender
        return socket.emit("successMessage", { message });
    })
}
