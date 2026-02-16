import mongoose, { Schema, Document, Types } from "mongoose";

export interface IStory extends Document {
  user: Types.ObjectId;
  media: {
    type: "image" | "video";
    url: string;
    publicId: string;
  };
  text: string;
  viewers: Types.ObjectId[];
  likes: Types.ObjectId[];
  createdAt: Date;
  expiresAt: Date;
}

const storySchema = new Schema<IStory>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: String,
    media: {
      type: {
        type: String,
        enum: ["image", "video"],
        required: true,
      },
      publicId: { type: String, required: true },
      url: {
        type: String,
        required: true,
      },
    },
    viewers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
    },
  },
  { timestamps: true },
);

// Auto-delete after 24h
storySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<IStory>("Story", storySchema);
