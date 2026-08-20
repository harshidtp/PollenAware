const userRepository = require("../repositories/userRepository");

const createUser = async (userData) => {
  return userRepository.createUser(userData);
};
const getUserById = async (id) => {
  return userRepository.getUserById(id);
};

module.exports = {
  createUser,
  getUserById,
};