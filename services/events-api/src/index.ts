import amqp from "amqplib";
import app from "./app";
import connectDB from "./dbConnection";
import EventRepository from "./repositories/EventRepository";
import { seedEvents } from "./utils/seeder";

const PORT = 3003;

let channel: amqp.Channel;
let connection: amqp.ChannelModel;
const requestQueue = "event.request";

async function connectRabbitMQ() {
	const rabbitMQUrl = process.env.RABBITMQ_URL || "amqp://localhost";
	try {
		connection = await amqp.connect(rabbitMQUrl);
		channel = await connection.createChannel();
		await channel.assertQueue(requestQueue);
		console.log("✅ Connected to RabbitMQ");
	} catch (error) {
		console.error("❌ Failed to connect to RabbitMQ:", error);
		process.exit(1);
	}
}

async function consumeRequests() {
	channel.consume(
		requestQueue,
		async (msg) => {
			if (!msg) return;

			const requestData = JSON.parse(msg.content.toString());
			console.log("Received event request:", requestData);

			try {
				const event = requestData.id
					? await EventRepository.getEventById({ id: requestData.id })
					: null;

				console.log("Found event:", event ? "yes" : "no");

				channel.sendToQueue(
					msg.properties.replyTo,
					Buffer.from(JSON.stringify(event)),
					{
						correlationId: msg.properties.correlationId,
					},
				);
			} catch (error) {
				console.error("Error processing event request:", error);
				channel.sendToQueue(
					msg.properties.replyTo,
					Buffer.from(JSON.stringify(null)),
					{
						correlationId: msg.properties.correlationId,
					},
				);
			}
		},
		{ noAck: true },
	);
	console.log(`Listening for event requests on queue: ${requestQueue}`);
}

console.log("Starting events-api initialization...");
setTimeout(() => {
	connectDB()
		.then(() => {
			app.listen(PORT, async () => {
				await connectRabbitMQ();
				await consumeRequests();

				if (process.env.SEED_EVENTS === "true") {
					await seedEvents();
				}

				console.log(`🎭 Events API running at http://localhost:${PORT}`);
			});
		})
		.catch((err) => {
			console.error("Failed to start server:", err);
		});
}, 1000);
