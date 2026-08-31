const allergyRepository = require("../repositories/allergyRepository");

const updateAllergyProfile = async (userId, allergies) => {
  return allergyRepository.updateAllergyProfile(
    userId,
    allergies
  );
};

const getAllergyProfile = async (userId) => {
  return allergyRepository.getAllergyProfile(userId);
};

module.exports = {
  updateAllergyProfile,
  getAllergyProfile,
};
