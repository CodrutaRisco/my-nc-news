const db = require("../db/connection");

const selectUsers = async () => {
  const { rows } = await db.query(`SELECT * FROM users`);
  return rows;
};

module.exports = { selectUsers };
