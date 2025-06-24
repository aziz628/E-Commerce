const db = require('../config/db');
const bcrypt = require('bcrypt');
const rounds = 10;

async function addUser(user) {
  const hashed_password = await bcrypt.hash(user.password, rounds);
  const [result] = await db.execute(
    `INSERT INTO users (email, password) VALUES (?, ?)`,
    [user.email, hashed_password]
  );
  return result.insertId;
}

async function Search(user, emailOnly = false) {
  const query =`SELECT * FROM users WHERE email = ?`;

  const [rows] = await db.execute(query, [user.email]);

  if (!rows.length) return false;

  if (emailOnly) return rows[0];

  const match = await bcrypt.compare(user.password, rows[0].password);
  return match ? rows[0]: "Incorrect password";
}

async function update_user(user_id, newData) {
  const [user] = await db.execute(`SELECT password FROM users WHERE id = ?`, [user_id]);
  const match = await bcrypt.compare(newData.password, user[0]?.password);
  if (match) throw new Error("same credentials");

  const hashed_password = await bcrypt.hash(newData.password, rounds);
  const [result] = await db.execute(
    `UPDATE users SET email = ?, password = ? WHERE id = ?`,
    [newData.email, hashed_password, user_id]
  );
  return result.affectedRows;
}

async function delete_user_account(id) {
  const [result] = await db.execute(`DELETE FROM users WHERE id = ?`, [id]);
  return result.affectedRows;
}

async function reset_password(id, password) {
  const hashed_password = await bcrypt.hash(password, rounds);
  const [result] = await db.execute(
    `UPDATE users SET password = ? WHERE id = ?`,
    [hashed_password, id]
  );
  return result.affectedRows;
}
async function get_users(){
  const [rows] = await db.execute(`SELECT * FROM users`);
  return rows
}
module.exports = {
  get_users,
  Search,
  addUser,
  update_user,
  delete_user_account,
  reset_password
};
