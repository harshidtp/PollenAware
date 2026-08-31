const {
  getChannel,
  EXCHANGE_NAME,
} = require("./rabbitmq");

const QUEUE_NAME = "risk-assessment.events";

const allergyProfiles = new Map();

const startEventConsumer = async () => {
  const channel = getChannel();

  await channel.assertQueue(QUEUE_NAME, {
    durable: true,
  });

  // Environmental events
  await channel.bindQueue(
    QUEUE_NAME,
    EXCHANGE_NAME,
    "EnvironmentalDataUpdated"
  );

  // Allergy profile events
  await channel.bindQueue(
    QUEUE_NAME,
    EXCHANGE_NAME,
    "allergy.profile.updated"
  );

  console.log(
    `Queue ready: ${QUEUE_NAME}`
  );

  channel.consume(QUEUE_NAME, (message) => {
    if (!message) {
      return;
    }

    try {
      const event = JSON.parse(
        message.content.toString()
      );

      console.log(
        "Received event:",
        event.eventType || event.event
      );

      // Environmental event
      if (
        event.eventType ===
        "EnvironmentalDataUpdated"
      ) {
        console.log(
          "Environmental data:",
          event.data
        );

        // Risk calculation will be added here later.
      }

      // Allergy profile event
      if (
        event.event ===
        "AllergyProfileUpdated"
      ) {
        allergyProfiles.set(
          event.userId,
          event.allergies
        );

        console.log(
          "Updated allergy profile:",
          event.userId,
          event.allergies
        );
      }

      channel.ack(message);
    } catch (error) {
      console.error(
        "Failed to process event:",
        error.message
      );

      channel.nack(
        message,
        false,
        false
      );
    }
  });

  console.log(
    "EnvironmentalDataUpdated and AllergyProfileUpdated consumers started"
  );
};

const getAllergyProfile = (userId) => {
  return allergyProfiles.get(userId) || [];
};

module.exports = {
  startEventConsumer,
  getAllergyProfile,
};