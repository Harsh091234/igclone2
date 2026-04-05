import mongoose, { Schema, Document, model } from "mongoose";
import bcrypt from "bcryptjs";
import { generateHashedToken } from "../../config/generateToken.js";

export interface IUser extends Document {
  // clerkId: string;

  fullName: string;
  userName?: string;
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

  role: "user" | "admin";
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationTokenExpiresAt?: Date;
  passwordResetToken?: string;
  passwordResetTokenExpiresAt?: Date;
  refreshToken?: string;
  tokenVersion: number;
  

  createdAt: Date;
  updatedAt: Date;
}

interface IUserMethods {
  getEmailVerificationToken(): string;
  comparePassword(password: string): Promise<boolean>;
  getForgotPasswordToken(): string;
}

type UserModel = mongoose.Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    // clerkId: {
    //   type: String,
    //   unique: false,
    //   default: "",
    // },

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
      select: false,
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

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    emailVerificationToken: String,
    emailVerificationTokenExpiresAt: Date,

    passwordResetToken: String,

    passwordResetTokenExpiresAt: Date,

    refreshToken: String,
    tokenVersion: {
    type: Number,
   default: 0,
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

userSchema.methods.getEmailVerificationToken = function () {
  const tokenObj = generateHashedToken();

  this.emailVerificationToken = tokenObj.hashedToken;
  this.emailVerificationTokenExpiresAt = tokenObj.expiresAt;
  return tokenObj.rawToken;
};

userSchema.methods.comparePassword = async function (password: string) {
  const isPasswordMatched = await bcrypt.compare(password, this.password);
  return isPasswordMatched;
};

userSchema.methods.getForgotPasswordToken = function () {
  const tokenObj = generateHashedToken();

  this.passwordResetToken = tokenObj.hashedToken;
  this.passwordResetTokenExpiresAt = tokenObj.expiresAt;
  return tokenObj.rawToken;
};
const User = model<IUser, UserModel>("User", userSchema);
export default User;
