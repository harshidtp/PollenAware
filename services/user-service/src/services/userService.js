const userRepository = require("../repositories/userRepository");

const createUser = async (userData) => {
  return userRepository.createUser(userData);
};

module.exports = {
  createUser,
};