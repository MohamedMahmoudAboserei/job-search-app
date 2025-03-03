import chatModel from "../../../db/model/chat.model.js";
import userModel from "../../../db/model/User.model.js";
import { authenticationSocket } from "../../../middleware/auth.socket.middleware.js";
import * as dbService from '../../../db/db.service.js';
import { socketConnections } from "../../../db/socket.connection.js";

export const sendMessage = (socket) => {
    return socket.on("sendMessage", async (messageData) => {
        const { data } = await authenticationSocket(socket);

        if (data) {
            return socket.emit("socketErrorResponse", data)
        }

        const senderId = data.user._id
        const { receiverId, message } = messageData;

        const existingChat = await dbService.findOne({
            model: chatModel,
            filter: {
                $or: [
                    { senderId, receiverId },
                    { senderId: receiverId, receiverId: senderId }
                ]
            }
        })

        if (!existingChat) {
            const sender = await userModel.findById(senderId);
            if (!sender || !['companyOwner', 'companyHR'].includes(sender.role)) {
                return socket.emit("socketErrorResponse", { message: "Only HR or the company owner can start the conversation." });
            }

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

        socket.to(socketConnections.get(receiverId)).emit("receiveMessage", { message })
        return socket.emit("successMessage", { message });
    })
}
