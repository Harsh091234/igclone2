import { Schema, model } from "mongoose";
const messageSchema = new Schema({
    senderId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    text: {
        type: String,
        trim: true,
        maxlength: 1000,
    },
    media: [
        {
            url: { type: String, required: true },
            type: {
                type: String,
                enum: ["image", "video", "audio", "gif", "pdf", "doc", "xls"],
            },
        },
    ],
    seenBy: [
        {
            userId: { type: Schema.Types.ObjectId, ref: "User" },
            seenAt: { type: Date, default: Date.now },
        },
    ]
}, { timestamps: true });
const Message = model("Message", messageSchema);
export default Message;
