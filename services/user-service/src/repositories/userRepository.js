const pool = require("../config/database");

const createUser = async ({ name, email, location }) => {
  const query = `
    INSERT INTO users (name, email, location)
    VALUES ($1, $2, $3)
    RETURNING id, name, email, location, created_at
  `;

  const values = [name, email, location];

  const result = await pool.query(query, values);

  return result.rows[0];
};


const getUserById = async (id) => {
  const query = `
    SELECT id, name, email, location, created_at
    FROM users
    WHERE id = $1
  `;

  const result = await pool.query(query, [id]);

  return result.rows[0];
};
module.exports = {
  createUser,
  getUserById,
};