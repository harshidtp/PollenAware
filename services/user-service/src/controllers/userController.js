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

module.exports = {
  createUser,
};