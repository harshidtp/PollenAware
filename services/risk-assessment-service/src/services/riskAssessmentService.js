const axios = require("axios");

const riskAssessmentRepository = require(
  "../repositories/riskAssessmentRepository"
);

const { calculateRisk } = require(
  "../utils/riskCalculator"
);

const USER_SERVICE_URL =
  process.env.USER_SERVICE_URL ||
  "http://localhost:3001";

const ENVIRONMENTAL_SERVICE_URL =
  process.env.ENVIRONMENTAL_SERVICE_URL ||
  "http://localhost:3003";

const createRiskAssessment = async ({
  userId,
  latitude,
  longitude,
}) => {
  const allergyResponse = await axios.get(
    `${USER_SERVICE_URL}/users/${userId}/allergies`
  );

  const environmentalResponse =
    await axios.get(
      `${ENVIRONMENTAL_SERVICE_URL}/environmental-data/external`,
      {
        params: {
          latitude,
          longitude,
        },
      }
    );

  const allergies =
    allergyResponse.data.allergies || [];

  const environmentalData =
    environmentalResponse.data;

  const { riskScore, riskLevel } =
    calculateRisk(
      allergies,
      environmentalData
    );

  return riskAssessmentRepository.createRiskAssessment({
    userId,
    latitude,
    longitude,
    riskLevel,
    riskScore,
    grassPollenLevel:
      environmentalData.grass_pollen_level,
    treePollenLevel:
      environmentalData.tree_pollen_level,
    weedPollenLevel:
      environmentalData.weed_pollen_level,
  });
};

const getRiskAssessmentsByUser = async (userId) => {
  return riskAssessmentRepository.getRiskAssessmentsByUser(
    userId
  );
};

module.exports = {
  createRiskAssessment,
  getRiskAssessmentsByUser,
};
