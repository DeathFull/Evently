import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
	userId: { type: String },
	eventId: { type: String },
	reference: { type: String },
});

const TransactionModel = mongoose.model("transaction", TransactionSchema);
export default TransactionModel;
