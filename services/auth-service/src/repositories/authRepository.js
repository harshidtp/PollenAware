const pool = require("../config/database");

const findByEmail = async (email) => {
  const result = await pool.query(
    `
    SELECT id, user_id, email, password_hash, created_at
    FROM auth_users
    WHERE email = $1
    `,
    [email]
  );

  return result.rows[0];
};

const createAuthUser = async (userId, email, passwordHash) => {
  const result = await pool.query(
    `
    INSERT INTO auth_users (user_id, email, password_hash)
    VALUES ($1, $2, $3)
    RETURNING id, user_id, email, created_at
    `,
    [userId, email, passwordHash]
  );

  return result.rows[0];
};

module.exports = {
  findByEmail,
  createAuthUser,
};