const userService = require("../services/userService");

const createUser = async (req, res) => {
  try {
    const { name, email, location } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required",
      });
    }

    const user = await userService.createUser({
      name,
      email,
      location,
    });

    res.status(201).json(user);
  } catch (error) {
    console.error("Create user failed:", error.message);

    res.status(500).json({
      message: "Failed to create user",
    });
  }
};
const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Get user failed:", error.message);

    res.status(500).json({
      message: "Failed to retrieve user",
    });
  }
};
const updateUser = async (req, res) => {
  try {
    const { name, email, location } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required",
      });
    }

    const user = await userService.updateUser(req.params.id, {
      name,
      email,
      location,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Update user failed:", error.message);

    res.status(500).json({
      message: "Failed to update user",
    });
  }
};

module.exports = {
  createUser,
  getUserById,
   updateUser,
};