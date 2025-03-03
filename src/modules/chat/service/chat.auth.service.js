import { socketConnections } from "../../../db/socket.connection.js";
import { authenticationSocket } from "../../../middleware/auth.socket.middleware.js";

export const registerSocket = async (socket) => {
    const { data } = await authenticationSocket({ socket });
    if (!data.valid) {
        return socket.emit("socketErrorResponse", data)
    }
    socketConnections.set(data.user._id.toString(), socket.id)
    return 'Done'
}

export const logoutSocket = async (socket) => {
    return socket.on("disconnect", async () => {
        const { data } = await authenticationSocket({ socket });
        if (!data.valid) {
            return socket.emit("socketErrorResponse", data)
        }
        socketConnections.delete(data.user._id.toString(), socket.id)
        return 'Done'
    })
}