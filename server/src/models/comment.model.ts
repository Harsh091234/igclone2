import mongoose, { Schema, Document, model } from "mongoose"

export interface IComment extends Document {
    post: mongoose.Types.ObjectId;         // Post on which comment is written
  author: mongoose.Types.ObjectId;       // User who wrote the comment
  text: string;
  likes: mongoose.Types.ObjectId[];      // Users who liked the comment
//   replies: {
//     author: mongoose.Types.ObjectId;
//     text: string;
//     createdAt: Date;
//   }[];
  createdAt: Date;
  updatedAt: Date;

}


const commentSchema = new Schema<IComment>(
  {
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
  },
  { timestamps: true }
);

const Comment = model<IComment>("Comment", commentSchema);

export default Comment;