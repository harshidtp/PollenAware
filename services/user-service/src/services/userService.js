const userRepository = require("../repositories/userRepository");

const createUser = async (userData) => {
  return userRepository.createUser(userData);
};
const getUserById = async (id) => {
  return userRepository.getUserById(id);
};
const updateUser = async (id, userData) => {
  return userRepository.updateUser(id, userData);
};

module.exports = {
  createUser,
  getUserById,
    updateUser,
};