import { Schema, model } from "mongoose";
const postSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    caption: {
        type: String,
        default: "",
        maxlength: [300, "Caption cannot exceed 300 characters"],
    },
    media: [
        {
            url: { type: String, required: true },
            publicId: { type: String, required: true },
            type: {
                type: String,
                enum: ["image", "video"],
                required: true,
            },
        },
    ],
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    comments: [{
            type: Schema.Types.ObjectId,
            ref: "Comment"
        }]
}, { timestamps: true });
const Post = model("Post", postSchema);
export default Post;
