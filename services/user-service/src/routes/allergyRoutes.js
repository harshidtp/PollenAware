const express = require("express");
const allergyController = require("../controllers/allergyController");

const router = express.Router();

router.put("/:id/allergies", allergyController.updateAllergyProfile);

module.exports = router;