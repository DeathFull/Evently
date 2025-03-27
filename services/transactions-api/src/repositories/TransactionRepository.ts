import TransactionModel from "../models/TransactionModel";
import type { Transaction } from "../types";

class TransactionRepository {
	async createTransaction({
		payload,
	}: {
		payload: Omit<Transaction, "id" | "reference">;
	}): Promise<Transaction | null> {
		try {
			const reference = Math.random().toString(36).substring(7);
			return (await TransactionModel.create({
				...payload,
				reference,
			})) as Transaction;
		} catch (err) {
			console.error(err);
			throw new Error("Transaction not created");
		}
	}

	async getTransactionById({
		id,
	}: {
		id: string;
	}): Promise<Transaction | null> {
		try {
			return (await TransactionModel.findOne({ _id: id })) as Transaction;
		} catch (err) {
			console.error(err);
			throw new Error("Transaction not found");
		}
	}
}

export default new TransactionRepository();
