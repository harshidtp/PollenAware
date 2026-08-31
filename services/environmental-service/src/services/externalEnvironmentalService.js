const {
  getPollenData,
  getWeatherData,
} = require("../clients/googleEnvironmentalApi");

const {
  normalizeEnvironmentalData,
} = require("./environmentalNormalizer");

const environmentalRepository = require(
  "../repositories/environmentalRepository"
);

const {
  publishEvent,
} = require("../messaging/eventPublisher");

const getExternalEnvironmentalData = async (
  latitude,
  longitude
) => {
  console.log("1. Getting pollen data...");

  const pollen = await getPollenData(
    latitude,
    longitude
  );

  console.log("2. Pollen data received");

  const weather = await getWeatherData(
    latitude,
    longitude
  );

  console.log("3. Weather data received");

  const normalizedData = normalizeEnvironmentalData(
    latitude,
    longitude,
    pollen,
    weather
  );

  console.log("4. Environmental data normalized");

  const savedData =
    await environmentalRepository.saveEnvironmentalData(
      normalizedData
    );

  console.log("5. Environmental data saved");

  publishEvent(
    "EnvironmentalDataUpdated",
    savedData
  );

  console.log("6. Environmental event published");

  return savedData;
};

module.exports = {
  getExternalEnvironmentalData,
};