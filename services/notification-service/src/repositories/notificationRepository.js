const pool = require("../config/database");

const createNotification = async (data) => {
  const query = `
    INSERT INTO notifications (
      user_id,
      notification_type,
      title,
      message,
      risk_level,
      risk_score
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;

  const values = [
    data.userId,
    data.notificationType,
    data.title,
    data.message,
    data.riskLevel,
    data.riskScore,
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
};

const getNotificationsByUser = async (userId) => {
  const query = `
    SELECT *
    FROM notifications
    WHERE user_id = $1
    ORDER BY created_at DESC;
  `;

  const result = await pool.query(query, [userId]);

  return result.rows;
};

const markNotificationAsRead = async (notificationId) => {
  const query = `
    UPDATE notifications
    SET read = TRUE
    WHERE id = $1
    RETURNING *;
  `;

  const result = await pool.query(query, [notificationId]);

  return result.rows[0];
};

module.exports = {
  createNotification,
  getNotificationsByUser,
  markNotificationAsRead,
};
