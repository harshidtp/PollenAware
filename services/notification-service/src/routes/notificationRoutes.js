const express = require("express");

const notificationController = require(
  "../controllers/notificationController"
);

const router = express.Router();

router.get(
  "/:userId",
  notificationController.getNotificationsByUser
);

router.put(
  "/:notificationId/read",
  notificationController.markNotificationAsRead
);

module.exports = router;
