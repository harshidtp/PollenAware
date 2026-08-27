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
  const pollen = await getPollenData(
    latitude,
    longitude
  );

  const weather = await getWeatherData(
    latitude,
    longitude
  );

  const normalizedData = normalizeEnvironmentalData(
    latitude,
    longitude,
    pollen,
    weather
  );

  const savedData =
    await environmentalRepository.saveEnvironmentalData(
      normalizedData
    );

  publishEvent(
    "EnvironmentalDataUpdated",
    savedData
  );

  return savedData;
};

module.exports = {
  getExternalEnvironmentalData,
};