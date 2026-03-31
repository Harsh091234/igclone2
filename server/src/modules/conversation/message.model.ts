import mongoose, { Schema, Document, model } from "mongoose";

export type MediaType =
  | "image"
  | "video"
  | "audio"
  | "gif"
  | "pdf"
  | "doc"
  | "xls";

interface Media {
  url: string;
  type: MediaType;
}
interface SeenBy {
  userId: mongoose.Types.ObjectId;
  seenAt: Date;
}

export interface IMessage extends Document {
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  text: string;
  media: Media[];
  seenBy: SeenBy[];
  createdAt: Date;
  updatedAt: Date;
}



const messageSchema = new Schema<IMessage>(
  {
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
    ],
  },

  { timestamps: true },
);

const Message = model<IMessage>("Message", messageSchema);

export default Message;
