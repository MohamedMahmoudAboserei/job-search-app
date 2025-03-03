import mongoose, { model } from "mongoose";

export const messageSchema = new mongoose.Schema({
    message: { type: String, required: true },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    timestamp: { type: Date, default: Date.now }
});

const chatSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    messages: [messageSchema],
}, {
    timestamps: true,
})

const chatModel = mongoose.models.Chat || mongoose.model('Chat', chatSchema);

export default chatModel;