const {
  getChannel,
  EXCHANGE_NAME,
} = require("./rabbitmq");

const publishEvent = (
  eventType,
  data
) => {
  const channel = getChannel();

  const message = {
    eventType,
    occurredAt: new Date().toISOString(),
    data,
  };

  channel.publish(
    EXCHANGE_NAME,
    eventType,
    Buffer.from(JSON.stringify(message)),
    {
      persistent: true,
      contentType: "application/json",
    }
  );

  console.log(
    `Event published: ${eventType}`
  );
};

module.exports = {
  publishEvent,
};