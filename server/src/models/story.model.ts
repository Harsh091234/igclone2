import mongoose, { Schema, Document, Types } from "mongoose";

interface TextLayer {
  _id: string;
  text: string;
  x: number;
  y: number;
  color: string;
}

export interface IStory extends Document {
  user: Types.ObjectId;
  media: {
    type: "image" | "video";
    url: string;
    publicId: string;
  };
  textLayers: TextLayer[];
  views: [
    {
      user: Types.ObjectId;
      viewedAt: Date;
    },
  ];

  likes: {
    user: Types.ObjectId;
    likedAt: Date;
  }[];

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
    textLayers: [
      {
        text: {
          type: String,
          required: true,
        },
        x: {
          type: Number,
          required: true,
        },
        y: {
          type: Number,
          required: true,
        },
        color: {
          type: String,
          required: true,
        },
      },
    ],

    media: {
      type: {
        type: String,
        enum: ["image", "video"],
        required: true,
      },
      publicId: { type: String },
      url: {
        type: String,
        required: true,
      },
    },
    views: [
      {
        user: { type: Types.ObjectId, ref: "User" },
        viewedAt: { type: Date, default: Date.now },
      },
    ],
    likes: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        likedAt: {
          type: Date,
          default: Date.now,
        },
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
