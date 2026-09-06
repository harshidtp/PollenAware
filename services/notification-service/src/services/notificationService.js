const axios = require("axios");

const notificationRepository = require(
  "../repositories/notificationRepository"
);

const USER_SERVICE_URL =
  process.env.USER_SERVICE_URL ||
  "http://localhost:3001";

const createRiskNotification = async (event) => {
  const {
    userId,
    riskLevel,
    riskScore,
  } = event;

  // Only HIGH risk assessments generate notifications.
  if (riskLevel !== "HIGH") {
    return null;
  }

  const response = await axios.get(
    `${USER_SERVICE_URL}/users/${userId}/preferences`
  );

  const preferences = response.data;

  if (!preferences.notifications_enabled) {
    return null;
  }

  return notificationRepository.createNotification({
    userId,
    notificationType: "HIGH_RISK",
    title: "High Allergy Risk Detected",
    message:
      "A high allergy risk has been detected for your location.",
    riskLevel,
    riskScore,
  });
};

const getNotificationsByUser = async (userId) => {
  return notificationRepository.getNotificationsByUser(
    userId
  );
};

const markNotificationAsRead = async (notificationId) => {
  return notificationRepository.markNotificationAsRead(
    notificationId
  );
};

module.exports = {
  createRiskNotification,
  getNotificationsByUser,
  markNotificationAsRead,
};
