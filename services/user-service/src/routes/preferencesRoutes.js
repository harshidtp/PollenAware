const express = require("express");

const preferencesController = require(
  "../controllers/preferencesController"
);

const router = express.Router();

router.put(
  "/:id/preferences",
  preferencesController.updatePreferences
);

router.get(
  "/:id/preferences",
  preferencesController.getPreferences
);

module.exports = router;
