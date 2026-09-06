const amqp = require("amqplib");

let connection;
let channel;

const EXCHANGE_NAME = "pollenaware.events";

const connectRabbitMQ = async () => {
  connection = await amqp.connect(
    process.env.RABBITMQ_URL || "amqp://localhost:5672",
    {
      heartbeat: 60,
    }
  );

  connection.on("error", (error) => {
    console.error(
      "RabbitMQ connection error:",
      error.message
    );
  });

  connection.on("close", () => {
    console.error("RabbitMQ connection closed");
  });

  channel = await connection.createChannel();

  await channel.assertExchange(
    EXCHANGE_NAME,
    "topic",
    {
      durable: true,
    }
  );

  console.log("Connected to RabbitMQ");
  console.log(`Exchange ready: ${EXCHANGE_NAME}`);

  return channel;
};

const getChannel = () => {
  if (!channel) {
    throw new Error(
      "RabbitMQ channel is not initialized"
    );
  }

  return channel;
};

module.exports = {
  connectRabbitMQ,
  getChannel,
  EXCHANGE_NAME,
};
