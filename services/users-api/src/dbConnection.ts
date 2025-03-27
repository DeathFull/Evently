import mongoose from "mongoose";

const connectDB = async () => {
	try {
		const client = await mongoose.connect("mongodb://localhost:27017/userApi");
		console.log("MongoDB connected successfully");
		return client;
	} catch (error) {
		console.error("MongoDB connection error:", error);
		process.exit(1);
	}
};

export default connectDB;
