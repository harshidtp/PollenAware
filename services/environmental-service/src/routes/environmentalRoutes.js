const express = require("express");

const environmentalController = require("../controllers/environmentalController");

const router = express.Router();

router.post(
  "/",
  environmentalController.createEnvironmentalData
);

router.get(
  "/",
  environmentalController.getEnvironmentalData
);

router.get(
  "/external",
  environmentalController.getExternalEnvironmentalData
);

router.get(
  "/location/:latitude/:longitude",
  environmentalController.getEnvironmentalDataByLocation
);

module.exports = router;