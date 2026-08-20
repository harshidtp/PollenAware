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
const updateUser = async (id, { name, email, location }) => {
  const query = `
    UPDATE users
    SET name = $1,
        email = $2,
        location = $3
    WHERE id = $4
    RETURNING id, name, email, location, created_at
  `;

  const values = [name, email, location, id];

  const result = await pool.query(query, values);

  return result.rows[0];
};
module.exports = {
  createUser,
  getUserById,
  updateUser,
};