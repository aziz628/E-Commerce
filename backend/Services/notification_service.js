const db = require("../config/db");

async function updateLastSeen(userId, lastSeenId) {
  await db.execute(
    `UPDATE users SET last_seen_notif_id = ? WHERE id = ?`,
    [lastSeenId, userId]
  );
}

async function getLastSeen(userId) {
  const [rows] = await db.execute(
    `SELECT last_seen_notif_id FROM users WHERE id = ?`,
    [userId]
  );
  console.log("last seen",rows[0]?.last_seen_notif_id,"user_id",userId)
  return rows[0]?.last_seen_notif_id || null;
}

async function get_user_notifications(userId) {
  const [rows] = await db.execute(
    `SELECT * FROM notifications WHERE id IN (
      SELECT notif_id FROM user_notifications WHERE user_id = ?
    ) ORDER BY id DESC LIMIT 30`,
    [userId]
  );
  return rows;
}
async function create_notif(message)  {
  const [result] = await db.execute(
    `INSERT INTO notifications (message) VALUES (?)`, [message]
  );
  const [rows] = await db.execute(
    `SELECT * FROM notifications WHERE id = ?`, [result.insertId]
  );
  return rows[0]; 
};

async  function link_To_All_Users(notification_id,user_id){
  const [users] = await db.execute(`SELECT id FROM users where id != ?`,[user_id]);
  const values = users.map(user => [user.id, notification_id]);
  await db.query(
    `INSERT INTO user_notifications (user_id, notif_id) VALUES ?`,
    [values]
  );
};
async function link_notif_user(user_Id,notification_id){
  [result] =await db.query(
    `INSERT INTO user_notifications (user_id, notif_id) VALUES (?,?)`,
    [user_Id, notification_id]
  );
  console.log("saving user notif changes",result)
  // might make function to use on all db operations to show results and act on it for errors
}

module.exports = { updateLastSeen, getLastSeen, get_user_notifications,create_notif,link_To_All_Users,link_notif_user };
