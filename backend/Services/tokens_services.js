const db = require('../config/db');
const jwt=require('jsonwebtoken')
let JWT_SECRET=process.env.JWT_SECRET
let JWT_REFRESH_SECRET=process.env.JWT_REFRESH_SECRET
const access_token_age=120;
const refresh_token_age=604800;

async function save_token(user_id, token, type ) {
  console.log('userid',user_id,"token",token)
  const expiresAt = Date.now()  + 1000*(type === 'reset_tokens' ? 15 * 60 : 7 * 24 * 3600);
  const [result] = await db.execute(
    `INSERT INTO ${type} (user_id, token, expires_at) VALUES (?, ?,  ?)`,
    [user_id, token, expiresAt]
  );
  return result.insertId;
}

async function get_token(token, type) {
  console.log("token",token,"type",type)
  const [rows] = await db.execute(
    `SELECT * FROM ${type} WHERE token = ? `,
    [token]
  );
  return rows[0];
}

async function delete_token(user_id, type) {
  const [result] = await db.execute(
    `DELETE FROM ${type} WHERE user_id = ? `,
    [user_id]
  );
  return result.affectedRows;
}

//token generating
function generate_reset_token() {
  return crypto.randomBytes(20).toString('hex');
}
function generate_access_token(user_id){
  return jwt.sign({id:user_id},JWT_SECRET,{expiresIn:'2m'});
  }
function generate_refresh_tokken(user_id){
      return jwt.sign({id:user_id},JWT_REFRESH_SECRET,{expiresIn:'7d'});
  }
// tokens setting
function set_tokens(res, token, refresh_token=null) {
  res.cookie('token', token,{
      httpOnly: true,
      sameSite: 'Lax',
      maxAge: access_token_age * 1000,  // Convert to milliseconds
      path: '/'
  })
  if (refresh_token) res.cookie('refresh_token', refresh_token, {
          httpOnly: true,
          sameSite: 'Lax',
          maxAge: refresh_token_age * 1000,  // Convert to milliseconds
          path: '/'
      })
      console.log("set tokens");
  }
function clear_tokens(res){
  res.clearCookie('token', { path: '/' });
  res.clearCookie('refresh_token', { path: '/' });
  console.log(" tokens cleared");
}

module.exports = {
  save_token,delete_token,get_token,generate_access_token,clear_tokens,generate_reset_token,generate_refresh_tokken,set_tokens
};
