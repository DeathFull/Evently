import mongoose from "mongoose";

const MONGODB_URI = "mongodb://localhost:27018/eventApi";

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
