const axios = require("axios");

const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

const getPollenData = async (latitude, longitude) => {
  const response = await axios.get(
    "https://pollen.googleapis.com/v1/forecast:lookup",
    {
      params: {
        key: API_KEY,
        "location.latitude": latitude,
        "location.longitude": longitude,
        days: 1,
      },
    }
  );

  return response.data;
};

const getWeatherData = async (latitude, longitude) => {
  const response = await axios.get(
    "https://weather.googleapis.com/v1/currentConditions:lookup",
    {
      params: {
        key: API_KEY,
        "location.latitude": latitude,
        "location.longitude": longitude,
      },
    }
  );

  return response.data;
};

module.exports = {
  getPollenData,
  getWeatherData,
};