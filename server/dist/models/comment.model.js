import { Schema, model } from "mongoose";
const commentSchema = new Schema({
    post: {
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    text: {
        type: String,
        required: true,
        trim: true,
        maxlength: [500, "Comment cannot exceed 500 characters"],
    },
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    ],
}, { timestamps: true });
const Comment = model("Comment", commentSchema);
export default Comment;
