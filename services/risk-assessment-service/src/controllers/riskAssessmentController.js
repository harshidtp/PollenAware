const riskAssessmentService = require("../services/riskAssessmentService");

const createRiskAssessment = async (req, res) => {
  try {
    const { userId } = req.params;
    const { latitude, longitude } = req.query;

    const lat = Number(latitude);
    const lon = Number(longitude);

    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lon)
    ) {
      return res.status(400).json({
        message:
          "Valid latitude and longitude are required",
      });
    }

    if (lat < -90 || lat > 90) {
      return res.status(400).json({
        message:
          "Latitude must be between -90 and 90",
      });
    }

    if (lon < -180 || lon > 180) {
      return res.status(400).json({
        message:
          "Longitude must be between -180 and 180",
      });
    }

    const assessment =
      await riskAssessmentService.createRiskAssessment({
        userId,
        latitude: lat,
        longitude: lon,
      });

    res.status(201).json(assessment);
  } catch (error) {
    console.error(
      "Risk assessment failed:",
      error.response?.data || error.message
    );

    res.status(500).json({
      message: "Failed to create risk assessment",
    });
  }
};

const getRiskAssessmentsByUser = async (
  req,
  res
) => {
  try {
    const assessments =
      await riskAssessmentService.getRiskAssessmentsByUser(
        req.params.userId
      );

    res.status(200).json(assessments);
  } catch (error) {
    console.error(
      "Get risk assessments failed:",
      error.message
    );

    res.status(500).json({
      message: "Failed to retrieve risk assessments",
    });
  }
};

module.exports = {
  createRiskAssessment,
  getRiskAssessmentsByUser,
};
