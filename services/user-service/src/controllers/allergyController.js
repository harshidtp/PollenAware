const allergyService = require("../services/allergyService");

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

    res.status(200).json(allergyProfile);
  } catch (error) {
    console.error("Update allergy profile failed:", error.message);

    res.status(500).json({
      message: "Failed to update allergy profile",
    });
  }
};

module.exports = {
  updateAllergyProfile,
};