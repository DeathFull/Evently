import mongoose from "mongoose";

const connectDB = async () => {
	const dbUrl = process.env.MONGO_URI || "mongodb://localhost:27017/userApi";
	try {
		const client = await mongoose.connect(dbUrl);
		console.log("MongoDB connected successfully");
		return client;
	} catch (error) {
		console.error("MongoDB connection error:", error);
		process.exit(1);
	}
};

export default connectDB;
