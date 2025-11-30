import mongoose, { Schema, Document, model, Mongoose } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
    clerkId: string;

    fullName: string;
    userName: string;
    email: string;
    password: string;

    gender: "male" | "female" | "other";
    bio: string;

    profilePic: string;
    profilePicPublicId: string;
    

    followers: mongoose.Types.ObjectId[];
    following: mongoose.Types.ObjectId[];

    bookmarks: mongoose.Types.ObjectId[];
    posts: mongoose.Types.ObjectId[];

    createdAt: Date;
    updatedAt: Date;
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
            default: "",
            trim: true,
            match: [/^[A-Za-z\s]+$/, "Full name must contain letters only"],
        },

        userName: {
            type: String,
            trim: true,
            lowercase: true,
            unique: true,
            default: "",
            match: [/^[a-zA-Z._]+$/, "Username can only contain letters, dots, or underscores"],
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
            type: String,
            enum: ["male", "female", "other"],
            default: "other",
        },

        bio: {
            type: String,
            default: "",
            maxlength: [200, "Bio cannot exceed 200 characters"],   // 🔥 message added
        },

        profilePic: {
            type: String,
            default: "",
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



       
    },
    { timestamps: true }
);


userSchema.pre<IUser>("save", async function (this: IUser) {
  // Only hash if password is modified OR new
  if (!this.isModified("password")) return;  
    this.password = await bcrypt.hash(this.password, 10);
    return;
  
});


const User = model<IUser>("User", userSchema);
export default User;
