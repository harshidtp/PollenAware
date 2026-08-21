const express = require("express");
const preferencesController = require("../controllers/preferencesController");

const router = express.Router();

router.put("/:id/preferences", preferencesController.updatePreferences);

module.exports = router;