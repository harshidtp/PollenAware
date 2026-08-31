const pool = require("../config/database");

const createRiskAssessment = async (data) => {
  const query = `
    INSERT INTO risk_assessments (
      user_id,
      latitude,
      longitude,
      risk_level,
      risk_score,
      grass_pollen_level,
      tree_pollen_level,
      weed_pollen_level
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
  `;

  const values = [
    data.userId,
    data.latitude,
    data.longitude,
    data.riskLevel,
    data.riskScore,
    data.grassPollenLevel,
    data.treePollenLevel,
    data.weedPollenLevel,
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
};

const getRiskAssessmentsByUser = async (userId) => {
  const query = `
    SELECT *
    FROM risk_assessments
    WHERE user_id = $1
    ORDER BY calculated_at DESC;
  `;

  const result = await pool.query(query, [userId]);

  return result.rows;
};

module.exports = {
  createRiskAssessment,
  getRiskAssessmentsByUser,
};
