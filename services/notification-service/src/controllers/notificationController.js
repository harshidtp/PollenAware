const notificationService = require(
  "../services/notificationService"
);

const getNotificationsByUser = async (req, res) => {
  try {
    const notifications =
      await notificationService.getNotificationsByUser(
        req.params.userId
      );

    res.status(200).json(notifications);
  } catch (error) {
    console.error(
      "Get notifications failed:",
      error.message
    );

    res.status(500).json({
      message: "Failed to retrieve notifications",
    });
  }
};

const markNotificationAsRead = async (req, res) => {
  try {
    const notification =
      await notificationService.markNotificationAsRead(
        req.params.notificationId
      );

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    res.status(200).json(notification);
  } catch (error) {
    console.error(
      "Mark notification as read failed:",
      error.message
    );

    res.status(500).json({
      message: "Failed to update notification",
    });
  }
};

module.exports = {
  getNotificationsByUser,
  markNotificationAsRead,
};
