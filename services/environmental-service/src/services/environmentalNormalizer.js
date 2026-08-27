const getPollenType = (pollenTypes, code) => {
  const pollen = pollenTypes.find(
    (item) => item.code === code
  );

  if (!pollen || !pollen.indexInfo) {
    return {
      value: null,
      category: null,
      inSeason: pollen?.inSeason ?? false,
      healthRecommendation: null,
    };
  }

  return {
    value: pollen.indexInfo.value,
    category: pollen.indexInfo.category,
    inSeason: pollen.inSeason ?? false,
    healthRecommendation:
      pollen.healthRecommendations?.[0] || null,
  };
};

const normalizeEnvironmentalData = (
  latitude,
  longitude,
  pollenData,
  weatherData
) => {
  const dailyInfo = pollenData.dailyInfo?.[0];

  const pollenTypes =
    dailyInfo?.pollenTypeInfo || [];

  const weather = weatherData;

  return {
    location: {
      latitude: Number(latitude),
      longitude: Number(longitude),
    },

    pollen: {
      regionCode: pollenData.regionCode,

      grass: getPollenType(
        pollenTypes,
        "GRASS"
      ),

      tree: getPollenType(
        pollenTypes,
        "TREE"
      ),

      weed: getPollenType(
        pollenTypes,
        "WEED"
      ),
    },

    weather: {
      condition:
        weather.weatherCondition?.description?.text || null,

      temperature:
        weather.temperature?.degrees ?? null,

      feelsLikeTemperature:
        weather.feelsLikeTemperature?.degrees ?? null,

      humidity:
        weather.relativeHumidity ?? null,

      precipitationProbability:
        weather.precipitation?.probability?.percent ?? null,

      windSpeed:
        weather.wind?.speed?.value ?? null,

      uvIndex:
        weather.uvIndex ?? null,

      currentTime:
        weather.currentTime ?? null,
    },
  };
};

module.exports = {
  normalizeEnvironmentalData,
};