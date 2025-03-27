import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/transactionApi";

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("📊 Connected to MongoDB");
    return mongoose.connection;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
}

export default connectDB;
