const pool = require("../config/database");

const saveEnvironmentalData = async (data) => {
  const result = await pool.query(
    `
    INSERT INTO environmental_data (
      latitude,
      longitude,
      grass_pollen_level,
      grass_pollen_category,
      tree_pollen_level,
      tree_pollen_category,
      weed_pollen_level,
      weed_pollen_category,
      temperature,
      feels_like_temperature,
      humidity,
      precipitation_probability,
      wind_speed,
      uv_index,
      weather_condition
    )
    VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8,
      $9, $10, $11, $12, $13, $14, $15
    )
    RETURNING *;
    `,
    [
      data.location.latitude,
      data.location.longitude,

      data.pollen.grass.value,
      data.pollen.grass.category,

      data.pollen.tree.value,
      data.pollen.tree.category,

      data.pollen.weed.value,
      data.pollen.weed.category,

      data.weather.temperature,
      data.weather.feelsLikeTemperature,
      data.weather.humidity,
      data.weather.precipitationProbability,
      data.weather.windSpeed,
      data.weather.uvIndex,
      data.weather.condition,
    ]
  );

  return result.rows[0];
};

const getEnvironmentalData = async () => {
  const result = await pool.query(
    `
    SELECT *
    FROM environmental_data
    ORDER BY recorded_at DESC;
    `
  );

  return result.rows;
};

const getEnvironmentalDataByLocation = async (
  latitude,
  longitude
) => {

  const result = await pool.query(
    `
    SELECT *
    FROM environmental_data
    WHERE latitude = $1
      AND longitude = $2
    ORDER BY recorded_at DESC;
    `,
    [latitude, longitude]
  );

  return result.rows;
};


module.exports = {
  saveEnvironmentalData,
  getEnvironmentalData,
  getEnvironmentalDataByLocation,
};