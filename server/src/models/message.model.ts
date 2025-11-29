import mongoose, { Schema, Document, model } from "mongoose";

export interface IMessage extends Document {
  senderId: mongoose.Types.ObjectId;          
  receiverId: mongoose.Types.ObjectId;    
  text: string;
//   media?: string[];                         
  seenBy: mongoose.Types.ObjectId[];        
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
  },

  { timestamps: true }
);

const Message = model<IMessage>("Message", messageSchema);

export default Message;