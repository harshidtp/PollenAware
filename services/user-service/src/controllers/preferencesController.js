const preferencesService = require("../services/preferencesService");

const updatePreferences = async (req, res) => {
  try {
    const {
      notificationsEnabled,
      preferredLocation,
    } = req.body;

    if (typeof notificationsEnabled !== "boolean") {
      return res.status(400).json({
        message: "notificationsEnabled must be a boolean",
      });
    }

    const preferences = await preferencesService.updatePreferences(
      req.params.id,
      {
        notificationsEnabled,
        preferredLocation,
      }
    );

    res.status(200).json(preferences);
  } catch (error) {
    console.error("Update preferences failed:", error.message);

    res.status(500).json({
      message: "Failed to update preferences",
    });
  }
};

module.exports = {
  updatePreferences,
};