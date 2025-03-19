// Import files
import { socketConnections } from "../../../db/socket.connection.js";
import { authenticationSocket } from "../../../middleware/auth.socket.middleware.js";

// Function to register a socket connection
export const registerSocket = async (socket) => {
    // Authenticate the socket connection
    const { data } = await authenticationSocket({ socket });

    // If authentication fails, emit an error response and return
    if (!data.valid) {
        return socket.emit("socketErrorResponse", data)
    }

    // Store the authenticated user's socket ID in the socketConnections map
    socketConnections.set(data.user._id.toString(), socket.id);

    // Return success message
    return 'Done';
}

// Function to handle socket disconnection (logout)
export const logoutSocket = async (socket) => {
    return socket.on("disconnect", async () => {
        // Authenticate the socket before processing the disconnection
        const { data } = await authenticationSocket({ socket });
        
        // If authentication fails, emit an error response and return
        if (!data.valid) {
            return socket.emit("socketErrorResponse", data)
        }

        // Remove the user's socket ID from the socketConnections map
        socketConnections.delete(data.user._id.toString(), socket.id);

        // Return success message
        return 'Done';
    })
}