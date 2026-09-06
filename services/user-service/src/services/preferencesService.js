const preferencesRepository = require("../repositories/preferencesRepository");

const updatePreferences = async (userId, preferences) => {
  return preferencesRepository.updatePreferences(
    userId,
    preferences
  );
};

const getPreferences = async (userId) => {
  return preferencesRepository.getPreferences(userId);
};

module.exports = {
  updatePreferences,
  getPreferences,
};
