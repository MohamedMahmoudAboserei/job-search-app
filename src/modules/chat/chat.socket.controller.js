// Import files
import { Server } from 'socket.io';
import { logoutSocket, registerSocket } from './service/chat.auth.service.js';
import { sendMessage } from './service/message.service.js';

// Socket.IO server instance placeholder
let io = undefined;

// Initialize Socket.IO Server
export const runIo = async (httpServer) => {
    // Create Socket.IO server with CORS configuration
    io = new Server(httpServer, {
        cors: '*'
    });

    // Handle new client connections
    return io.on("connection", async (socket) => {
        // Contains auth credentials
        console.log(socket.handshake.auth);
        // Handle user registration/auth
        await registerSocket(socket);
        // Configure message sending
        await sendMessage(socket);
        // Handle disconnection cleanup
        await logoutSocket(socket);
    })
}

// Get Socket.IO Server Instance
export const getIo = (io) => {
    return io;
}