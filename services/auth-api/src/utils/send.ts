import { connect } from "amqplib";

export async function send(queue: string, message: string) {
  try {
    const connection = await connect("amqp://localhost");
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, { durable: true });

    channel.sendToQueue(queue, Buffer.from(message));
    console.log(`[x] Sent: ${message}`);

    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (error) {
    console.error("[x] Error:", error);
  }
}

export async function receive(queue: string) {
  try {
    const connection = await connect("amqp://localhost");
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, { durable: true });

    console.log("[*] Waiting for messages. To exit, press CTRL+C");

    channel.consume(queue, (msg) => {
      if (msg) {
        console.log(`[x] Received: ${msg.content.toString()}`);
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error("[x] Error:", error);
  }
}
