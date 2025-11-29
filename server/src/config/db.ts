import mongoose from "mongoose";

const connectDB = async (mongoURI: string): Promise<void> => {
  try {
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected ✅");
  } catch (error) {
    console.error("MongoDB connection failed ❌:", error);
    process.exit(1); // Exit process if DB connection fails
  }
};

export default connectDB;