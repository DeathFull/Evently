import amqp from "amqplib";
import app from "./app";
import connectDB from "./dbConnection";

const PORT = 3002;

export let channel: amqp.Channel;
export let connection: amqp.ChannelModel;
export const userRequestQueue = "user.request";
export const userResponseQueue = "transaction.user.response";
export const eventRequestQueue = "event.request";
export const eventResponseQueue = "transaction.event.response";
export const responseMap = new Map();

async function connectRabbitMQ() {
	const rabbitMQUrl = process.env.RABBITMQ_URL || "amqp://localhost";

	try {
		connection = await amqp.connect(rabbitMQUrl);
		channel = await connection.createChannel();

		await channel.assertQueue(userRequestQueue);
		await channel.assertQueue(userResponseQueue);

		await channel.assertQueue(eventRequestQueue);
		await channel.assertQueue(eventResponseQueue);

		console.log("✅ Connected to RabbitMQ");
	} catch (error) {
		console.error("❌ Failed to connect to RabbitMQ:", error);
		process.exit(1);
	}
}

async function consumeResponses() {
	channel.consume(
		userResponseQueue,
		(msg) => {
			if (!msg) return;

			const correlationId = msg.properties.correlationId;
			console.log(
				`Received user response with correlationId: ${correlationId}`,
			);

			if (responseMap.has(correlationId)) {
				const resolve = responseMap.get(correlationId);
				resolve(JSON.parse(msg.content.toString()));
				responseMap.delete(correlationId);
			}
		},
		{ noAck: true },
	);

	channel.consume(
		eventResponseQueue,
		(msg) => {
			if (!msg) return;

			const correlationId = msg.properties.correlationId;
			console.log(
				`Received event response with correlationId: ${correlationId}`,
			);

			if (responseMap.has(correlationId)) {
				const resolve = responseMap.get(correlationId);
				resolve(JSON.parse(msg.content.toString()));
				responseMap.delete(correlationId);
			}
		},
		{ noAck: true },
	);

	console.log(
		`Listening for responses on queues: ${userResponseQueue}, ${eventResponseQueue}`,
	);
}

console.log("Starting transactions-api initialization...");
setTimeout(() => {
	connectDB()
		.then(() => {
			app.listen(PORT, async () => {
				await connectRabbitMQ();
				await consumeResponses();
				console.log(`💴 Transactions API running at http://localhost:${PORT}`);
			});
		})
		.catch((err) => {
			console.error("Failed to start server:", err);
		});
}, 1000);
