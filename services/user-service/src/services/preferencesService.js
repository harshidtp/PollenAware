const preferencesRepository = require("../repositories/preferencesRepository");

const updatePreferences = async (userId, preferences) => {
  return preferencesRepository.updatePreferences(userId, preferences);
};

module.exports = {
  updatePreferences,
};