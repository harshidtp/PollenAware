const environmentalService = require("../services/environmentalService");
const externalEnvironmentalService = require("../services/externalEnvironmentalService");

const createEnvironmentalData = async (req, res) => {
  try {
    const data = await environmentalService.createEnvironmentalData(
      req.body
    );

    res.status(201).json(data);
  } catch (error) {
    console.error("Environmental data error:", error.message);

    if (
      error.message === "Location is required" ||
      error.message === "Pollen level cannot be negative"
    ) {
      return res.status(400).json({
        message: error.message,
      });
    }

    res.status(500).json({
      message: "Failed to create environmental data",
    });
  }
};
const getEnvironmentalData = async (req, res) => {
  try {
    const data = await environmentalService.getEnvironmentalData();

    res.status(200).json(data);
  } catch (error) {
    console.error("Environmental data error:", error.message);

    res.status(500).json({
      message: "Failed to retrieve environmental data",
    });
  }
};
const getEnvironmentalDataByLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.params;

    const lat = Number(latitude);
    const lon = Number(longitude);

    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lon)
    ) {
      return res.status(400).json({
        message: "Valid latitude and longitude are required",
      });
    }

    if (lat < -90 || lat > 90) {
      return res.status(400).json({
        message: "Latitude must be between -90 and 90",
      });
    }

    if (lon < -180 || lon > 180) {
      return res.status(400).json({
        message: "Longitude must be between -180 and 180",
      });
    }

    const data =
      await environmentalService.getEnvironmentalDataByLocation(
        lat,
        lon
      );

    res.status(200).json(data);
  } catch (error) {
    console.error(
      "Environmental data error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to retrieve environmental data",
    });
  }
};
const getExternalEnvironmentalData = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    const lat = Number(latitude);
    const lon = Number(longitude);

    if (
      latitude === undefined ||
      longitude === undefined ||
      !Number.isFinite(lat) ||
      !Number.isFinite(lon)
    ) {
      return res.status(400).json({
        message: "Valid latitude and longitude are required",
      });
    }

    if (lat < -90 || lat > 90) {
      return res.status(400).json({
        message: "Latitude must be between -90 and 90",
      });
    }

    if (lon < -180 || lon > 180) {
      return res.status(400).json({
        message: "Longitude must be between -180 and 180",
      });
    }

    const data =
      await externalEnvironmentalService.getExternalEnvironmentalData(
        lat,
        lon
      );

    res.status(200).json(data);
  } catch (error) {
    console.error(
  "External environmental API error:",
  error
);

    res.status(500).json({
      message: "Failed to retrieve external environmental data",
    });
  }
};

module.exports = {
  createEnvironmentalData,
  getEnvironmentalData,
  getEnvironmentalDataByLocation,
  getExternalEnvironmentalData,
};