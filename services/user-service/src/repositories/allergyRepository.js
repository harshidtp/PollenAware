const pool = require("../config/database");

const updateAllergyProfile = async (userId, allergies) => {
  const query = `
    INSERT INTO allergy_profiles (user_id, allergies, updated_at)
    VALUES ($1, $2, CURRENT_TIMESTAMP)
    ON CONFLICT (user_id)
    DO UPDATE SET
      allergies = EXCLUDED.allergies,
      updated_at = CURRENT_TIMESTAMP
    RETURNING id, user_id, allergies, updated_at
  `;

  const result = await pool.query(query, [userId, allergies]);

  return result.rows[0];
};

module.exports = {
  updateAllergyProfile,
};