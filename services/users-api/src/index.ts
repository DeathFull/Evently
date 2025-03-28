import amqp from "amqplib";
import { app } from "./app";
import connectDB from "./dbConnection.js";
import UserRepository from "./repositories/UserRepository";
import { seedUsers } from "./utils/seeder";

const PORT = process.env.PORT || 3001;

let channel: amqp.Channel;
let connection: amqp.ChannelModel;
const requestQueue = "user.request";
const responseQueue = "user.response";

async function connectRabbitMQ() {
	const rabbitMQUrl = process.env.RABBITMQ_URL || "amqp://localhost";
	connection = await amqp.connect(rabbitMQUrl);
	channel = await connection.createChannel();
	await channel.assertQueue(requestQueue);
	await channel.assertQueue(responseQueue);
}

async function consumeRequests() {
	channel.consume(
		requestQueue,
		async (msg) => {
			if (!msg) return;

			const requestData = JSON.parse(msg.content.toString());
			console.log("Received user request:", requestData);

			try {
				let user = null;

				if (requestData.email) {
					user = await UserRepository.getUserByEmail({
						email: requestData.email,
					});
				} else if (requestData.id) {
					user = await UserRepository.getUserById({ id: requestData.id });
				}

				console.log("Found user:", user ? "yes" : "no");

				channel.sendToQueue(
					msg.properties.replyTo,
					Buffer.from(JSON.stringify(user)),
					{
						correlationId: msg.properties.correlationId,
					},
				);
			} catch (error) {
				console.error("Error processing user request:", error);
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
	console.log(`Listening for user requests on queue: ${requestQueue}`);
}
console.log("Starting server initialization...");
setTimeout(() => {
	connectDB()
		.then(() => {
			app.listen(PORT, async () => {
				await connectRabbitMQ();
				await consumeRequests();

				if (process.env.SEED_USERS === "true") {
					await seedUsers();
				}

				console.log(`👨 Server running at http://localhost:${PORT}`);
			});
		})
		.catch((err) => {
			console.error("Failed to start server:", err);
		});
}, 1000);
