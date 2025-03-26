import amqp from "amqplib";
import AuthRepository from "../repositories/AuthRepository";

export default async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    await channel.assertQueue("user.created", { durable: true });

    channel.consume("user.created", async (msg) => {
      if (msg !== null) {
        const userData = JSON.parse(msg.content.toString());
        console.log("[Auth Service] New user received:", userData);
        await AuthRepository.saveUser({ user: userData });
        channel.ack(msg);
      }
    });

    console.log("[Auth Service] Listening for user.created events...");
  } catch (error) {
    console.error("[Auth Service] RabbitMQ Connection Error:", error);
  }
}
