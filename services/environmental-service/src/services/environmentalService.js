const environmentalRepository = require("../repositories/environmentalRepository");

const createEnvironmentalData = async (data) => {
  const {
    location,
    pollenType,
    pollenLevel,
    temperature,
    humidity,
  } = data;

  if (!location) {
    throw new Error("Location is required");
  }

  if (pollenLevel !== undefined && pollenLevel < 0) {
    throw new Error("Pollen level cannot be negative");
  }

  return environmentalRepository.createEnvironmentalData(
    location,
    pollenType,
    pollenLevel,
    temperature,
    humidity
  );
};

const getEnvironmentalData = async () => {
  return environmentalRepository.getEnvironmentalData();
};

const getEnvironmentalDataByLocation = async (
  latitude,
  longitude
) => {
  return environmentalRepository.getEnvironmentalDataByLocation(
    latitude,
    longitude
  );
};

module.exports = {
  createEnvironmentalData,
  getEnvironmentalData,
  getEnvironmentalDataByLocation,
};