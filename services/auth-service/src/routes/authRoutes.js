const express = require("express");
const authController = require("../controllers/authController");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);

router.get("/me", authenticateToken, (req, res) => {
  res.status(200).json({
    message: "Authenticated user",
    user: req.user,
  });
});
module.exports = router;