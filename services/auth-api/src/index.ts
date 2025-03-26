import { app } from "./app";
import amqp from "amqplib";

const PORT = process.env.PORT || 3000;

let channel: amqp.Channel;
let connection: amqp.ChannelModel;
const requestQueue = "user.request";
const responseQueue = "user.response";

async function connectRabbitMQ() {
  connection = await amqp.connect("amqp://localhost");
  channel = await connection.createChannel();
  await channel.assertQueue(requestQueue);
  await channel.assertQueue(responseQueue);
}

const responseMap = new Map();

async function consumeResponses() {
  channel.consume(
    responseQueue,
    (msg) => {
      const correlationId = msg?.properties.correlationId;
      if (responseMap.has(correlationId)) {
        const resolve = responseMap.get(correlationId);
        resolve(JSON.parse(msg.content.toString()));
        responseMap.delete(correlationId);
      }
    },
    { noAck: true },
  );
}
app.listen(PORT, async () => {
  await connectRabbitMQ();
  await consumeResponses();
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
