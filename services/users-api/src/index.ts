import { app } from "./app";
import amqp from "amqplib";

const PORT = process.env.PORT || 3001;

let channel: amqp.Channel;
let connection: amqp.ChannelModel;
const requestQueue = "user.request";
const responseQueue = "user.response";

const users = {
  testuser: {
    username: "testuser",
    password: "1234",
    email: "test@example.com",
  },
};

async function connectRabbitMQ() {
  connection = await amqp.connect("amqp://localhost");
  channel = await connection.createChannel();
  await channel.assertQueue(requestQueue);
  await channel.assertQueue(responseQueue);
}

async function consumeRequests() {
  channel.consume(
    requestQueue,
    async (msg) => {
      const requestData = JSON.parse(msg.content.toString());
      const user = users[requestData.username] || null;

      channel.sendToQueue(
        msg?.properties.replyTo,
        Buffer.from(JSON.stringify(user)),
        {
          correlationId: msg?.properties.correlationId,
        },
      );
    },
    { noAck: true },
  );
}
app.listen(PORT, async () => {
  await connectRabbitMQ();
  await consumeRequests();
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
