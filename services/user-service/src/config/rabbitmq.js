const amqp = require("amqplib");

let channel;

const connectRabbitMQ = async () => {
  const connection = await amqp.connect(
    process.env.RABBITMQ_URL ||
      "amqp://pollenaware:pollenaware@localhost:5672"
  );

  channel = await connection.createChannel();

  await channel.assertExchange(
    "pollenaware.events",
    "topic",
    { durable: true }
  );

  console.log("RabbitMQ connected");
};

const publishEvent = async (routingKey, event) => {
  if (!channel) {
    throw new Error("RabbitMQ channel is not initialized");
  }

  channel.publish(
    "pollenaware.events",
    routingKey,
    Buffer.from(JSON.stringify(event)),
    {
      persistent: true,
      contentType: "application/json",
    }
  );
};

module.exports = {
  connectRabbitMQ,
  publishEvent,
};