import amqp from "amqplib";
import { app } from "./app";

const PORT = process.env.PORT || 3000;

export let channel: amqp.Channel;
export let connection: amqp.ChannelModel;
export const requestQueue = "user.request";
export const responseQueue = "user.response";
export const responseMap = new Map();

async function connectRabbitMQ() {
	try {
		connection = await amqp.connect("amqp://localhost");
		channel = await connection.createChannel();
		await channel.assertQueue(requestQueue);
		await channel.assertQueue(responseQueue);
		console.log("✅ Connected to RabbitMQ");
	} catch (error) {
		console.error("❌ Failed to connect to RabbitMQ:", error);
		process.exit(1);
	}
}

async function consumeResponses() {
	channel.consume(
		responseQueue,
		(msg) => {
			if (!msg) return;

			const correlationId = msg.properties.correlationId;
			console.log(`Received response with correlationId: ${correlationId}`);

			if (responseMap.has(correlationId)) {
				const resolve = responseMap.get(correlationId);
				resolve(JSON.parse(msg.content.toString()));
				responseMap.delete(correlationId);
			}
		},
		{ noAck: true },
	);
	console.log(`Listening for responses on queue: ${responseQueue}`);
}
app.listen(PORT, async () => {
	await connectRabbitMQ();
	await consumeResponses();
	console.log(`🔒 Server running at http://localhost:${PORT}`);
});
