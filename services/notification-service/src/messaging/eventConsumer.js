const {
  getChannel,
  EXCHANGE_NAME,
} = require("./rabbitmq");

const {
  createRiskNotification,
} = require("../services/notificationService");

const QUEUE_NAME = "notification-service.events";

const startEventConsumer = async () => {
  const channel = getChannel();

  await channel.assertQueue(QUEUE_NAME, {
    durable: true,
  });

  await channel.bindQueue(
    QUEUE_NAME,
    EXCHANGE_NAME,
    "RiskAssessmentCreated"
  );

  await channel.consume(
    QUEUE_NAME,
    async (message) => {
      if (!message) {
        return;
      }

      try {
        const event = JSON.parse(
          message.content.toString()
        );

        console.log(
          "Notification Service received event:",
          event
        );

        if (
          event.eventType ===
          "RiskAssessmentCreated"
        ) {
          await createRiskNotification(event);
        }

        channel.ack(message);
      } catch (error) {
        console.error(
          "Failed to process notification event:",
          error.message
        );

        channel.nack(message, false, false);
      }
    }
  );

  console.log(
    `Notification Service listening on ${QUEUE_NAME}`
  );
};

module.exports = {
  startEventConsumer,
};
