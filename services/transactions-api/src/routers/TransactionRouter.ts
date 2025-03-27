import express from "express";
import type { Request, Response } from "express";
import { processRequestBody } from "zod-express-middleware";
import {
	channel,
	eventRequestQueue,
	eventResponseQueue,
	responseMap,
	userRequestQueue,
	userResponseQueue,
} from "../index";
import TransactionRepository from "../repositories/TransactionRepository";
import { TransactionSchemaPayload } from "../schemas";
import sendEmail from "../utils/sendEmail";

const router = express.Router();

async function checkUserExists(userId: string): Promise<{
	exists: boolean;
	data: { email: string; firstName: string; lastName: string } | null;
}> {
	const correlationId = `user_${Math.random().toString()}_${Date.now().toString()}`;

	const userDataPromise = new Promise((resolve) => {
		responseMap.set(correlationId, resolve);
	});

	channel.sendToQueue(
		userRequestQueue,
		Buffer.from(JSON.stringify({ id: userId })),
		{
			correlationId,
			replyTo: userResponseQueue,
		},
	);

	const userData = (await userDataPromise) as {
		email: string;
		firstName: string;
		lastName: string;
	};
	return { exists: Boolean(userData), data: userData };
}

async function checkEventExists(eventId: string): Promise<{
	exists: boolean;
	data: {
		name: string;
		location: string;
		date: Date;
		type: "CONCERT" | "SPECTACLE" | "FESTIVAL";
	} | null;
}> {
	const correlationId = `event_${Math.random().toString()}_${Date.now().toString()}`;

	const eventDataPromise = new Promise((resolve) => {
		responseMap.set(correlationId, resolve);
	});

	channel.sendToQueue(
		eventRequestQueue,
		Buffer.from(JSON.stringify({ id: eventId })),
		{
			correlationId,
			replyTo: eventResponseQueue,
		},
	);

	const eventData = (await eventDataPromise) as {
		name: string;
		location: string;
		date: Date;
		type: "CONCERT" | "SPECTACLE" | "FESTIVAL";
	};
	return { exists: Boolean(eventData), data: eventData };
}

router.post(
	"/",
	processRequestBody(TransactionSchemaPayload),
	async (req: Request, res: Response) => {
		try {
			const { userId, eventId } = req.body;

			const user = await checkUserExists(userId);
			if (!user.exists) {
				res.status(404).json({
					message: "User not found",
					status: 404,
					data: null,
				});
			}

			const event = await checkEventExists(eventId);
			if (!event.exists) {
				res.status(404).json({
					message: "Event not found",
					status: 404,
					data: null,
				});
			}

			const transaction = await TransactionRepository.createTransaction({
				payload: req.body,
			});

			if (transaction) {
				if (user.data && event.data) {
					sendEmail({ user: user.data, event: event.data });
				}
				res
					.status(200)
					.json({ message: "Success", status: 200, data: transaction });
			} else {
				res
					.status(500)
					.json({ message: "Internal server error", status: 500, data: null });
			}
		} catch (error) {
			console.error("Transaction creation error:", error);
			res
				.status(500)
				.json({ message: "Internal server error", status: 500, data: null });
		}
	},
);

export default router;
