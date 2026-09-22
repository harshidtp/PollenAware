const pool = require("../config/database");

const updatePreferences = async (
  userId,
  { notificationsEnabled, preferredLocation }
) => {
  const query = `
    INSERT INTO user_preferences (
      user_id,
      notifications_enabled,
      preferred_location,
      updated_at
    )
    VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
    ON CONFLICT (user_id)
    DO UPDATE SET
      notifications_enabled = EXCLUDED.notifications_enabled,
      preferred_location = EXCLUDED.preferred_location,
      updated_at = CURRENT_TIMESTAMP
    RETURNING
      id,
      user_id,
      notifications_enabled,
      preferred_location,
      updated_at
  `;

  const values = [
    userId,
    notificationsEnabled,
    preferredLocation
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
};

const getPreferences = async (userId) => {
  const query = `
    SELECT
      id,
      user_id,
      notifications_enabled,
      preferred_location,
      updated_at
    FROM user_preferences
    WHERE user_id = $1;
  `;

  const result = await pool.query(query, [userId]);

  return result.rows[0];
};

module.exports = {
  updatePreferences,
  getPreferences,
};
