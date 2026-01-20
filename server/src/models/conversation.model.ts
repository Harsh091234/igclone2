import mongoose, { Schema, Document, model } from "mongoose";

export interface IConversation extends Document {
  participants: mongoose.Types.ObjectId[];   
  messages: mongoose.Types.ObjectId[];       
  lastMessage?: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: "Message",
      },
    ],

    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
  },

  { timestamps: true },
);

const Conversation = model<IConversation>(
  "Conversation",
  conversationSchema
);

export default Conversation;