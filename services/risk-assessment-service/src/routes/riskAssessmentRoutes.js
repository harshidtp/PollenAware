const express = require("express");
const riskAssessmentController = require("../controllers/riskAssessmentController");

const router = express.Router();

router.post(
  "/:userId",
  riskAssessmentController.createRiskAssessment
);

router.get(
  "/:userId",
  riskAssessmentController.getRiskAssessmentsByUser
);

module.exports = router;
