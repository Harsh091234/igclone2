import mongoose, { Schema, Document, model } from "mongoose";

export interface ISession extends Document {
  userId: mongoose.Types.ObjectId;
  email: string;
  refreshToken: string;

  ip: string;
  userAgent: string; // device/browser info

  expiresAt: Date;

  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new Schema<ISession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    refreshToken: {
      type: String,
      required: true,
    },

    ip: {
      type: String,
    },

    userAgent: {
      type: String,
    },

    expiresAt: {
      type: Date,
      required: true,
      expires: 0, // TTL index → auto delete after expiry
    },
  },
  { timestamps: true }
);

const Session = model<ISession>("Session", sessionSchema);
export default Session;