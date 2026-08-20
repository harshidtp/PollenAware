const allergyRepository = require("../repositories/allergyRepository");

const updateAllergyProfile = async (userId, allergies) => {
  return allergyRepository.updateAllergyProfile(userId, allergies);
};

module.exports = {
  updateAllergyProfile,
};