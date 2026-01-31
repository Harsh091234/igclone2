import mongoose, { Schema, Document, model, Mongoose } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  clerkId: string;

  fullName: string;
  userName: string;
  email: string;
  password: string;

  gender: string;
  bio: string;

  profilePic: string;
  profilePicPublicId: string;

  followers: mongoose.Types.ObjectId[];
  following: mongoose.Types.ObjectId[];

  bookmarks: mongoose.Types.ObjectId[];
  posts: mongoose.Types.ObjectId[];

  isProfileComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
  publicKey: Buffer;
}

const userSchema = new Schema<IUser>(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },

    fullName: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 50,
      match: [/^[A-Za-z\s]+$/, "Full name must contain letters only"],
    },

    userName: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      match: [
        /^[a-zA-Z0-9._]+$/,
        "Username can only contain letters, numbers, dots, or underscores",
      ],
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      default: "",
    },

    gender: {
      trim: true,
      type: String,
      lowercase: true,
      default: "prefer not to say",
    },

    bio: {
      type: String,
      default: "",
      maxlength: [200, "Bio cannot exceed 200 characters"], // 🔥 message added
    },

    profilePic: {
      type: String,
      default:
        "https://res.cloudinary.com/djt8dpogs/image/upload/v1764092240/instagram_clone_uploads/uwoxn6lq0lyrrlkw2tlo.png",
    },
    profilePicPublicId: {
      type: String,
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    bookmarks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],

    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    isProfileComplete: {
      type: Boolean,
      default: false,
    },
    publicKey: {
      type: Buffer, // or String (base64)
      default: null,
    },
  },
  { timestamps: true },
);

userSchema.pre<IUser>("save", async function (this: IUser) {
  // Only hash if password is modified OR new
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
  return;
});

const User = model<IUser>("User", userSchema);
export default User;
