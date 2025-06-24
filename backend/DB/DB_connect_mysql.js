const mysql=require("mysql2/promise");
require('dotenv').config({ path: 'config/.env' });  // Load environment variables

const mysql_pool=mysql.createPool({
    host:process.env.DB_HOST, //  ip adress
    user:process.env.DB_USER, 
    password:process.env.DB_PASS,
    database:process.env.DB_NAME,
    waitForConnections:true, // If too many requests,  wait or fail (true : wait)
    connectionLimit:10, //Max number of connections at once
    queueLimit:0
})

console.log("connection established")
async function cleanExpiredTokens() {
    try {
      const [results] = await mysql_pool.execute(`
        DELETE FROM reset_tokens WHERE expires_at < UNIX_TIMESTAMP(); `);
  
      console.log(`${results.affectedRows} expired reset token(s) deleted.`);
    } catch (error) {
      console.error("Error cleaning expired tokens:", error.message);
    }
  }
  
  // Set up a job to clean expired tokens every hour (or adjust the interval)
  setInterval(cleanExpiredTokens, 60 * 60 * 1000); // Every hour (in milliseconds)
  
  console.log("Started clean-up reset tokens. It will run every hour.");
module.exports=mysql_pool;