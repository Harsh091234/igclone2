import mongoose, { Schema, Document, model } from "mongoose";

export interface IPost extends Document {
    author: mongoose.Types.ObjectId;
  caption: string;
  media: {
    url: string;
    type: "image" | "video";
    publicId: string;
  }[];
  likes: mongoose.Types.ObjectId[];
  comments: mongoose.Types.ObjectId[];
    
  createdAt: Date;
  updatedAt: Date;
}


const postSchema = new Schema<IPost>(
  {
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
  },
  { timestamps: true }
);

const Post = model<IPost>("Post", postSchema);
export default Post;
