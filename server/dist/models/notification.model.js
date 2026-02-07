import mongoose, { Schema } from "mongoose";
const notificationSchema = new Schema({
    receiver: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    type: {
        type: String,
        enum: ["like", "comment", "follow"],
        required: true,
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: "Post",
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment",
    },
    message: {
        type: String,
        required: true,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
