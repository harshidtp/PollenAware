const allergyService = require("../services/allergyService");
const { publishEvent } = require("../config/rabbitmq");

const updateAllergyProfile = async (req, res) => {
  try {
    const { allergies } = req.body;

    if (!Array.isArray(allergies)) {
      return res.status(400).json({
        message: "Allergies must be an array",
      });
    }

    const allergyProfile =
      await allergyService.updateAllergyProfile(
        req.params.id,
        allergies
      );

    await publishEvent(
      "allergy.profile.updated",
      {
        event: "AllergyProfileUpdated",
        userId: req.params.id,
        allergies,
        updatedAt: allergyProfile.updated_at,
      }
    );

    res.status(200).json(allergyProfile);
  } catch (error) {
    console.error(
      "Update allergy profile failed:",
      error.message
    );

    res.status(500).json({
      message: "Failed to update allergy profile",
    });
  }
};

const getAllergyProfile = async (req, res) => {
  try {
    const allergyProfile =
      await allergyService.getAllergyProfile(
        req.params.id
      );

    if (!allergyProfile) {
      return res.status(404).json({
        message: "Allergy profile not found",
      });
    }

    res.status(200).json(allergyProfile);
  } catch (error) {
    console.error(
      "Get allergy profile failed:",
      error.message
    );

    res.status(500).json({
      message: "Failed to retrieve allergy profile",
    });
  }
};

module.exports = {
  updateAllergyProfile,
  getAllergyProfile,
};
