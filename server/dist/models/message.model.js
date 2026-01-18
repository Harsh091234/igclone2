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
    },
    // media: [
    //   {
    //     type: String, // URL of uploaded image/video/file
    //   },
    // ],
    seenBy: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    ],
}, { timestamps: true });
const Message = model("Message", messageSchema);
export default Message;
